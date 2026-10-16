"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";
import {
  parseNgnToKobo,
  validateProduct,
  validateVariants,
  type CollectionOption,
  type ImageMetaInput,
  type ProductInput,
  type ProductStatusValue,
  type VariantInput,
} from "@/lib/admin/create-piece";

const IMAGE_BUCKET = "product-images";

export interface StepReport {
  product: "created" | "reused" | "failed" | "skipped";
  imagesSucceeded: number;
  imagesFailed: number;
  variants: "created" | "skipped" | "failed" | "none_requested";
}

export interface CreatePieceResult {
  ok: boolean;
  productId: string | null;
  steps: StepReport | null;
  message: string;
  fieldErrors?: Record<string, string>;
  variantErrors?: Record<number, Record<string, string>>;
}

function sanitizeFileName(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return clean === "" ? "image" : clean;
}

/** Live collection options for the form dropdown (admin RLS session). */
export async function listCollections(): Promise<{
  ok: boolean;
  collections: CollectionOption[];
  error?: string;
}> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, name")
    .order("sort_order", { ascending: true });
  if (error) return { ok: false, collections: [], error: error.message };
  return { ok: true, collections: data ?? [] };
}

interface Payload {
  /** Present when retrying after a partial failure — skips product creation. */
  productId?: string;
  product: ProductInput;
  variants: VariantInput[];
  images: ImageMetaInput[];
}

/**
 * Create Piece save pipeline: validate → product row → storage uploads +
 * image rows → variant rows. Each step reports independently; a later
 * failure never rewrites or deletes earlier successes (no silent rollback).
 * The client disables resubmission while this runs (no double-submit).
 */
export async function createPieceAction(
  formData: FormData
): Promise<CreatePieceResult> {
  await requireAdmin();
  const supabase = await createClient();

  let payload: Payload;
  try {
    payload = JSON.parse(String(formData.get("payload") ?? "{}")) as Payload;
  } catch {
    return {
      ok: false,
      productId: null,
      steps: null,
      message: "The submission could not be read. Please try again.",
    };
  }

  // Server-side revalidation: the browser is never trusted.
  const fieldErrors = validateProduct(payload.product ?? ({} as ProductInput));
  const { errors: variantErrors, valid: validVariants } = validateVariants(
    Array.isArray(payload.variants) ? payload.variants : []
  );
  if (Object.keys(fieldErrors).length > 0 || Object.keys(variantErrors).length > 0) {
    return {
      ok: false,
      productId: payload.productId ?? null,
      steps: null,
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
      variantErrors,
    };
  }

  const basePriceKobo = parseNgnToKobo(payload.product.priceNgn) as number;
  const slug = payload.product.slug.trim();
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
  const metas: ImageMetaInput[] = Array.isArray(payload.images) ? payload.images : [];

  // --- Step 1: product row (skipped on resume) ---
  let productId = payload.productId ?? null;
  let productStep: StepReport["product"] = "skipped";
  if (productId === null) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      return {
        ok: false,
        productId: null,
        steps: null,
        message: "That slug is already in use. Edit the slug and try again.",
        fieldErrors: { slug: "Slug already in use." },
      };
    }
    const { data: created, error: productError } = await supabase
      .from("products")
      .insert({
        collection_id: payload.product.collectionId,
        name: payload.product.name.trim(),
        slug,
        description:
          payload.product.description.trim() === ""
            ? null
            : payload.product.description.trim(),
        price_kobo: basePriceKobo,
        fabric_composition:
          payload.product.fabricComposition.trim() === ""
            ? null
            : payload.product.fabricComposition.trim(),
        care_instructions:
          payload.product.careInstructions.trim() === ""
            ? null
            : payload.product.careInstructions.trim(),
        status: payload.product.status,
        mtm_available: payload.product.mtmAvailable,
      })
      .select("id")
      .single();
    if (productError || !created) {
      return {
        ok: false,
        productId: null,
        steps: { product: "failed", imagesSucceeded: 0, imagesFailed: 0, variants: "skipped" },
        message: `The piece could not be created: ${productError?.message ?? "unknown error"}. Nothing was saved.`,
      };
    }
    productId = created.id as string;
    productStep = "created";
  } else {
    // Resume path: confirm the row is really ours to complete.
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .maybeSingle();
    if (!existing) {
      return {
        ok: false,
        productId: null,
        steps: null,
        message: "The saved piece could not be found. Please start again.",
      };
    }
    productStep = "reused";
  }

  // --- Step 2: uploads + image rows (only files not yet attempted) ---
  let imagesSucceeded = 0;
  let imagesFailed = 0;
  const imageRows: {
    product_id: string;
    image_url: string;
    alt: string | null;
    is_primary: boolean;
    sort_order: number;
  }[] = [];
  // Primary resolves to the first meta flagged primary; exactly one by UI rule.
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const meta = metas[i] ?? { alt: "", isPrimary: false };
    const path = `products/${productId}/${i}-${sanitizeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type || undefined, upsert: false });
    if (uploadError) {
      imagesFailed += 1;
      continue;
    }
    const { data: urlData } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    imageRows.push({
      product_id: productId,
      image_url: urlData.publicUrl,
      alt: meta.alt.trim() === "" ? null : meta.alt.trim(),
      is_primary: meta.isPrimary,
      sort_order: i,
    });
    imagesSucceeded += 1;
  }
  if (imageRows.length > 0) {
    const { error: imagesError } = await supabase.from("product_images").insert(imageRows);
    if (imagesError) {
      // Files are uploaded but their rows failed: report honestly. The files
      // stay in Storage (no silent cleanup); the rows can be re-added later.
      return {
        ok: false,
        productId,
        steps: {
          product: productStep,
          imagesSucceeded: 0,
          imagesFailed: files.length,
          variants: "skipped",
        },
        message: `The piece was saved, but image records failed: ${imagesError.message}. Uploaded files remain in Storage.`,
      };
    }
  }

  // --- Step 3: variant rows (none when the switch is off) ---
  let variantsStep: StepReport["variants"] =
    validVariants.length === 0 ? "none_requested" : "created";
  if (validVariants.length > 0) {
    const { error: variantsError } = await supabase.from("product_variants").insert(
      validVariants.map((variant) => ({
        product_id: productId,
        size_label: variant.sizeLabel,
        colour: variant.colour,
        sku: variant.sku,
        fulfilment_type: variant.fulfilment,
        price_kobo: variant.priceKobo,
        stock_quantity: variant.stockQuantity,
        is_active: variant.isActive,
      }))
    );
    if (variantsError) {
      variantsStep = "failed";
      return {
        ok: false,
        productId,
        steps: { product: productStep, imagesSucceeded, imagesFailed, variants: variantsStep },
        message: `The piece${imageRows.length > 0 ? " and images" : ""} were saved, but variants failed: ${variantsError.message}. Complete them from the product edit page once available.`,
      };
    }
  }

  const allOk = imagesFailed === 0;
  return {
    ok: allOk,
    productId,
    steps: { product: productStep, imagesSucceeded, imagesFailed, variants: variantsStep },
    message: allOk
      ? "Piece created successfully."
      : `The piece was saved, but ${imagesFailed} image${imagesFailed === 1 ? "" : "s"} failed to upload. Retry with the remaining files.`,
  };
}

// --- Edit flow ---------------------------------------------------------------

export interface EditImageRow {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface EditVariantRow {
  id: string;
  sizeLabel: string | null;
  colour: string | null;
  priceNgn: string;
  fulfilment: "ready_made" | "made_to_order";
  stock: string;
  sku: string;
  isActive: boolean;
}

export interface PieceForEdit {
  product: {
    name: string;
    slug: string;
    description: string;
    priceKobo: number;
    collectionId: string | null;
    status: ProductStatusValue;
    fabricComposition: string;
    careInstructions: string;
    mtmAvailable: boolean;
  };
  images: EditImageRow[];
  variants: EditVariantRow[];
}

function koboToNgn(kobo: number): string {
  return String(kobo / 100);
}

/** Load one product with images + variants for the edit form (null = missing). */
export async function getPieceForEdit(
  productId: string
): Promise<PieceForEdit | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "name, slug, description, price_kobo, collection_id, status, fabric_composition, care_instructions, mtm_available"
    )
    .eq("id", productId)
    .maybeSingle();
  if (!product) return null;

  const [{ data: images }, { data: variants }] = await Promise.all([
    supabase
      .from("product_images")
      .select("id, image_url, alt, is_primary")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_variants")
      .select("id, size_label, colour, price_kobo, fulfilment_type, stock_quantity, sku, is_active")
      .eq("product_id", productId)
      .order("created_at", { ascending: true }),
  ]);

  const row = product as {
    name: string;
    slug: string;
    description: string | null;
    price_kobo: number;
    collection_id: string | null;
    status: ProductStatusValue;
    fabric_composition: string | null;
    care_instructions: string | null;
    mtm_available: boolean;
  };
  return {
    product: {
      name: row.name,
      slug: row.slug,
      description: row.description ?? "",
      priceKobo: row.price_kobo,
      collectionId: row.collection_id,
      status: row.status,
      fabricComposition: row.fabric_composition ?? "",
      careInstructions: row.care_instructions ?? "",
      mtmAvailable: row.mtm_available,
    },
    images: (images ?? []).map((image) => ({
      id: image.id as string,
      url: image.image_url as string,
      alt: (image.alt as string | null) ?? "",
      isPrimary: image.is_primary as boolean,
    })),
    variants: (variants ?? []).map((variant) => {
      const typed = variant as {
        id: string;
        size_label: string | null;
        colour: string | null;
        price_kobo: number | null;
        fulfilment_type: "ready_made" | "made_to_order";
        stock_quantity: number | null;
        sku: string | null;
        is_active: boolean;
      };
      return {
        id: typed.id,
        sizeLabel: typed.size_label,
        colour: typed.colour,
        priceNgn: typed.price_kobo === null ? "" : koboToNgn(typed.price_kobo),
        fulfilment: typed.fulfilment_type,
        stock: typed.stock_quantity === null ? "" : String(typed.stock_quantity),
        sku: typed.sku ?? "",
        isActive: typed.is_active,
      };
    }),
  };
}

export interface UpdateImageEntry {
  /** Null for newly uploaded files (matched to FormData files by order). */
  existingId: string | null;
  alt: string;
  isPrimary: boolean;
}

export interface UpdateSteps {
  product: "updated" | "failed";
  imagesUpdated: number;
  imagesCreated: number;
  imagesDeleted: number;
  imagesFailed: number;
  variantsUpdated: number;
  variantsCreated: number;
  variantsDeleted: number;
  variantsBlocked: string[];
  variantsFailed: boolean;
}

export interface UpdatePieceResult {
  ok: boolean;
  steps: UpdateSteps | null;
  message: string;
  fieldErrors?: Record<string, string>;
  variantErrors?: Record<number, Record<string, string>>;
}

interface UpdatePayload {
  productId: string;
  product: ProductInput;
  variants: (VariantInput & { id?: string })[];
  removedVariantIds: string[];
  /** Full ordered image list; new entries carry existingId null. */
  images: UpdateImageEntry[];
  removedImageIds: string[];
}

/**
 * Edit save pipeline: validate → UPDATE product → image deletes (rows only,
 * Storage objects are NEVER touched) → uploads + inserts/updates with
 * recomputed sort order → variant updates/inserts/deletes. RESTRICT-blocked
 * variant deletes are reported per row and retained — never auto-deactivated.
 */
export async function updatePieceAction(
  formData: FormData
): Promise<UpdatePieceResult> {
  await requireAdmin();
  const supabase = await createClient();

  let payload: UpdatePayload;
  try {
    payload = JSON.parse(String(formData.get("payload") ?? "{}")) as UpdatePayload;
  } catch {
    return {
      ok: false,
      steps: null,
      message: "The submission could not be read. Please try again.",
    };
  }

  const productId = payload.productId;
  if (!productId) {
    return { ok: false, steps: null, message: "Missing product reference." };
  }

  // Server-side revalidation: the browser is never trusted.
  const fieldErrors = validateProduct(payload.product ?? ({} as ProductInput));
  const submittedVariants = Array.isArray(payload.variants) ? payload.variants : [];
  const { errors: variantErrors, valid: validVariants } =
    validateVariants(submittedVariants);
  if (Object.keys(fieldErrors).length > 0 || Object.keys(variantErrors).length > 0) {
    return {
      ok: false,
      steps: null,
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
      variantErrors,
    };
  }

  // Confirm the row exists and the slug is not taken by another product.
  const { data: current } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .maybeSingle();
  if (!current) {
    return { ok: false, steps: null, message: "This piece no longer exists." };
  }
  const slug = payload.product.slug.trim();
  const { data: slugClash } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .neq("id", productId)
    .maybeSingle();
  if (slugClash) {
    return {
      ok: false,
      steps: null,
      message: "That slug is already in use. Edit the slug and try again.",
      fieldErrors: { slug: "Slug already in use." },
    };
  }

  const basePriceKobo = parseNgnToKobo(payload.product.priceNgn) as number;
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
  const orderedImages = Array.isArray(payload.images) ? payload.images : [];
  const removedImageIds = Array.isArray(payload.removedImageIds)
    ? payload.removedImageIds
    : [];
  const removedVariantIds = Array.isArray(payload.removedVariantIds)
    ? payload.removedVariantIds
    : [];

  // --- Step 1: product row ---
  const { error: productError } = await supabase
    .from("products")
    .update({
      collection_id: payload.product.collectionId,
      name: payload.product.name.trim(),
      slug,
      description:
        payload.product.description.trim() === "" ? null : payload.product.description.trim(),
      price_kobo: basePriceKobo,
      fabric_composition:
        payload.product.fabricComposition.trim() === "" ? null : payload.product.fabricComposition.trim(),
      care_instructions:
        payload.product.careInstructions.trim() === "" ? null : payload.product.careInstructions.trim(),
      status: payload.product.status,
      mtm_available: payload.product.mtmAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);
  if (productError) {
    return {
      ok: false,
      steps: null,
      message: `The piece could not be saved: ${productError.message}. Nothing was changed.`,
    };
  }

  const steps: UpdateSteps = {
    product: "updated",
    imagesUpdated: 0,
    imagesCreated: 0,
    imagesDeleted: 0,
    imagesFailed: 0,
    variantsUpdated: 0,
    variantsCreated: 0,
    variantsDeleted: 0,
    variantsBlocked: [],
    variantsFailed: false,
  };
  const problems: string[] = [];

  // --- Step 2a: delete removed image rows (records only, never Storage files) ---
  const scopedRemovals = removedImageIds.filter((id) => id.trim() !== "");
  if (scopedRemovals.length > 0) {
    const { error: deleteError, count } = await supabase
      .from("product_images")
      .delete({ count: "exact" })
      .in("id", scopedRemovals)
      .eq("product_id", productId);
    if (deleteError) {
      problems.push(`image removal failed: ${deleteError.message}`);
    } else {
      steps.imagesDeleted = count ?? 0;
    }
  }

  // --- Step 2b: upload new files (matched to null-existingId entries by order) ---
  const uploadedUrls: (string | null)[] = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const path = `products/${productId}/edit-${Date.now()}-${i}-${sanitizeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { contentType: file.type || undefined, upsert: false });
    if (uploadError) {
      uploadedUrls.push(null);
      steps.imagesFailed += 1;
      continue;
    }
    const { data: urlData } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    uploadedUrls.push(urlData.publicUrl);
  }
  if (steps.imagesFailed > 0) {
    problems.push(
      `${steps.imagesFailed} new image${steps.imagesFailed === 1 ? "" : "s"} failed to upload. Storage setup may be incomplete.`
    );
  }

  // --- Step 2c: reconcile the ordered image list (single primary enforced) ---
  const flagged = orderedImages.findIndex((entry) => entry.isPrimary);
  const normalized = orderedImages.map((entry, position) => ({
    ...entry,
    isPrimary: flagged === -1 ? position === 0 : position === flagged,
  }));
  let newCursor = 0;
  for (let position = 0; position < normalized.length; position += 1) {
    const entry = normalized[position];
    if (entry.existingId !== null) {
      const { error: updateError } = await supabase
        .from("product_images")
        .update({
          alt: entry.alt.trim() === "" ? null : entry.alt.trim(),
          is_primary: entry.isPrimary,
          sort_order: position,
        })
        .eq("id", entry.existingId)
        .eq("product_id", productId);
      if (updateError) {
        problems.push(`image ${position + 1} could not be updated: ${updateError.message}`);
      } else {
        steps.imagesUpdated += 1;
      }
    } else {
      const url = uploadedUrls[newCursor];
      newCursor += 1;
      if (url === null || url === undefined) continue; // Upload already counted as failed.
      const { error: insertError } = await supabase.from("product_images").insert({
        product_id: productId,
        image_url: url,
        alt: entry.alt.trim() === "" ? null : entry.alt.trim(),
        is_primary: entry.isPrimary,
        sort_order: position,
      });
      if (insertError) {
        problems.push(`a new image record failed: ${insertError.message}. Its file remains in Storage.`);
        steps.imagesFailed += 1;
      } else {
        steps.imagesCreated += 1;
      }
    }
  }

  // --- Step 3: variants (updates scoped to this product; deletes guarded) ---
  for (let index = 0; index < submittedVariants.length; index += 1) {
    const row = submittedVariants[index];
    const valid = validVariants.find(
      (candidate) =>
        candidate.sizeLabel === (row.sizeLabel?.trim() === "" ? null : row.sizeLabel?.trim()) &&
        candidate.colour === (row.colour?.trim() === "" ? null : row.colour?.trim())
    );
    if (!valid) continue; // Unreachable: validated above; skip rather than guess.
    if (row.id) {
      const { error: updateError } = await supabase
        .from("product_variants")
        .update({
          size_label: valid.sizeLabel,
          colour: valid.colour,
          sku: valid.sku,
          fulfilment_type: valid.fulfilment,
          price_kobo: valid.priceKobo,
          stock_quantity: valid.stockQuantity,
          is_active: valid.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .eq("product_id", productId);
      if (updateError) {
        problems.push(`variant ${index + 1} could not be updated: ${updateError.message}`);
        steps.variantsFailed = true;
      } else {
        steps.variantsUpdated += 1;
      }
    } else {
      const { error: insertError } = await supabase.from("product_variants").insert({
        product_id: productId,
        size_label: valid.sizeLabel,
        colour: valid.colour,
        sku: valid.sku,
        fulfilment_type: valid.fulfilment,
        price_kobo: valid.priceKobo,
        stock_quantity: valid.stockQuantity,
        is_active: valid.isActive,
      });
      if (insertError) {
        problems.push(`a new variant could not be added: ${insertError.message}`);
        steps.variantsFailed = true;
      } else {
        steps.variantsCreated += 1;
      }
    }
  }
  for (const variantId of removedVariantIds.filter((id) => id.trim() !== "")) {
    const { error: deleteError } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", variantId)
      .eq("product_id", productId);
    if (deleteError) {
      // FK RESTRICT (code 23503): history references this variant. Retain it
      // and say so — never auto-deactivate.
      if (deleteError.code === "23503") {
        steps.variantsBlocked.push(variantId);
      } else {
        problems.push(`a variant could not be removed: ${deleteError.message}`);
        steps.variantsFailed = true;
      }
    } else {
      steps.variantsDeleted += 1;
    }
  }
  if (steps.variantsBlocked.length > 0) {
    problems.push(
      `${steps.variantsBlocked.length} variant${steps.variantsBlocked.length === 1 ? " is" : "s are"} referenced by order history and was retained — deactivate ${steps.variantsBlocked.length === 1 ? "it" : "them"} manually instead of deleting.`
    );
  }

  const ok = problems.length === 0;
  return {
    ok,
    steps,
    message: ok
      ? "Piece updated successfully."
      : `Saved with issues: ${problems.join(" ")}`,
  };
}
