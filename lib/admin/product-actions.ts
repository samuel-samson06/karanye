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
