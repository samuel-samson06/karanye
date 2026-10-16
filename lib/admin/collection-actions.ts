"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/admin/create-piece";
import {
  validateCollection,
  type CollectionInput,
} from "@/lib/admin/collections";

const IMAGE_BUCKET = "product-images";

export interface CreateCollectionResult {
  ok: boolean;
  /** Set whenever the row exists (full or partial success). */
  collectionId: string | null;
  imageStep: "skipped" | "saved" | "failed";
  message: string;
  fieldErrors?: Record<string, string>;
}

function sanitizeFileName(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return clean === "" ? "image" : clean;
}

/**
 * Collection creation: validate → slug-unique check → INSERT row → optional
 * cover upload + image_path update. The row is created before the upload so
 * a storage failure leaves a usable imageless collection (reported honestly),
 * never a missing collection. Unique violations return a field error —
 * including the concurrent-submission race, which the database rejects.
 */
export async function createCollectionAction(
  formData: FormData
): Promise<CreateCollectionResult> {
  await requireAdmin();
  const supabase = await createClient();

  let input: CollectionInput;
  try {
    input = JSON.parse(String(formData.get("payload") ?? "{}")) as CollectionInput;
  } catch {
    return {
      ok: false,
      collectionId: null,
      imageStep: "skipped",
      message: "The submission could not be read. Please try again.",
    };
  }

  const fieldErrors = validateCollection(input ?? ({} as CollectionInput));
  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      collectionId: null,
      imageStep: "skipped",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const slug = input.slug.trim();
  const { data: clash } = await supabase
    .from("collections")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (clash) {
    return {
      ok: false,
      collectionId: null,
      imageStep: "skipped",
      message: "That slug is already in use. Edit the slug and try again.",
      fieldErrors: { slug: "Slug already in use." },
    };
  }

  const { data: created, error: insertError } = await supabase
    .from("collections")
    .insert({
      name: input.name.trim(),
      slug,
      description: input.description.trim() === "" ? null : input.description.trim(),
      is_visible: input.isVisible,
    })
    .select("id")
    .single();
  if (insertError || !created) {
    // Covers the concurrent race: UNIQUE violation lands here as a field error.
    const taken =
      insertError?.code === "23505" ||
      insertError?.message?.toLowerCase().includes("already exists") ||
      insertError?.message?.toLowerCase().includes("duplicate");
    return {
      ok: false,
      collectionId: null,
      imageStep: "skipped",
      message: taken
        ? "That slug was just taken. Edit the slug and try again."
        : `The collection could not be created: ${insertError?.message ?? "unknown error"}. Nothing was saved.`,
      ...(taken ? { fieldErrors: { slug: "Slug already in use." } } : {}),
    };
  }
  const collectionId = created.id as string;

  const files = formData
    .getAll("file")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length === 0) {
    return {
      ok: true,
      collectionId,
      imageStep: "skipped",
      message: "Collection created successfully.",
    };
  }

  // Single cover image: server re-validates type and size (browser untrusted).
  const file = files[0];
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
    return {
      ok: true,
      collectionId,
      imageStep: "failed",
      message:
        "Collection created, but the cover image was rejected (JPEG, PNG, or WebP up to 5 MB). Add it later from collection editing.",
    };
  }
  const path = `collections/${slug}/cover-${sanitizeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (uploadError) {
    return {
      ok: true,
      collectionId,
      imageStep: "failed",
      message: `Collection created, but the cover upload failed (${uploadError.message}). Check the product-images Storage bucket, then add the image later from collection editing.`,
    };
  }
  const { data: urlData } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  const { error: pathError } = await supabase
    .from("collections")
    .update({ image_path: urlData.publicUrl, updated_at: new Date().toISOString() })
    .eq("id", collectionId);
  if (pathError) {
    // File is in Storage but the row does not reference it: say exactly that.
    return {
      ok: true,
      collectionId,
      imageStep: "failed",
      message: `Collection created and file uploaded, but saving the image reference failed: ${pathError.message}. The file remains in Storage.`,
    };
  }

  return {
    ok: true,
    collectionId,
    imageStep: "saved",
    message: "Collection created successfully.",
  };
}
