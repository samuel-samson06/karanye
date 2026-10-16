import { slugify } from "@/lib/admin/create-piece";

export { slugify };

export interface CollectionInput {
  name: string;
  slug: string;
  description: string;
  isVisible: boolean;
}

export type CollectionFieldErrors = Record<string, string>;

/** Shared product/collection slug rules live in create-piece.ts; validated here. */
export function validateCollection(input: CollectionInput): CollectionFieldErrors {
  const errors: CollectionFieldErrors = {};
  if (input.name.trim() === "") errors.name = "Name is required.";
  if (input.slug.trim() === "") {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug.trim())) {
    errors.slug = "Slug may only use lowercase letters, numbers, and hyphens.";
  }
  return errors;
}
