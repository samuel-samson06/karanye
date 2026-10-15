// Create Piece shared shapes + pure validation. No Supabase imports —
// safe for both the client form (pre-submit checks) and the Server Action
// (never trust the browser: every rule is re-checked server-side).

export type ProductStatusValue =
  | "draft"
  | "made_to_order"
  | "limited"
  | "sold_out"
  | "archived";

export type FulfilmentValue = "ready_made" | "made_to_order";

export interface CollectionOption {
  id: string;
  slug: string;
  name: string;
}

export interface VariantInput {
  sizeLabel: string | null;
  colour: string | null;
  /** NGN display string, "" = inherit base price. */
  priceNgn: string;
  fulfilment: FulfilmentValue;
  /** Raw input; "" = none. MTO rows must leave this empty. */
  stock: string;
  sku: string;
  isActive: boolean;
}

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  /** NGN display string; converted to kobo on submit. */
  priceNgn: string;
  collectionId: string | null;
  status: ProductStatusValue;
  fabricComposition: string;
  careInstructions: string;
  mtmAvailable: boolean;
}

export interface ImageMetaInput {
  alt: string;
  isPrimary: boolean;
}

export type FieldErrors = Record<string, string>;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** "Kente Gown!" → "kente-gown". Empty string when nothing usable remains. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * NGN display string → integer kobo. Returns null when invalid.
 * Never parse floats into stored prices: the regex caps decimals at two
 * places and Math.round absorbs binary-float residue.
 */
export function parseNgnToKobo(raw: string): number | null {
  const cleaned = raw.replace(/[₦,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const kobo = Math.round(parseFloat(cleaned) * 100);
  return Number.isSafeInteger(kobo) && kobo >= 0 ? kobo : null;
}

function parseStock(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const value = parseInt(trimmed, 10);
  return Number.isSafeInteger(value) ? value : null;
}

export function validateProduct(input: ProductInput): FieldErrors {
  const errors: FieldErrors = {};
  if (input.name.trim() === "") errors.name = "Name is required.";
  if (input.slug.trim() === "") {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug.trim())) {
    errors.slug = "Slug may only use lowercase letters, numbers, and hyphens.";
  }
  if (parseNgnToKobo(input.priceNgn) === null) {
    errors.priceNgn = "Enter a valid non-negative price, e.g. 45000 or 45000.50.";
  }
  return errors;
}

function normalizePart(value: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

export function variantKey(size: string | null, colour: string | null): string {
  return `${normalizePart(size)}|${normalizePart(colour)}`;
}

export interface ValidatedVariant {
  sizeLabel: string | null;
  colour: string | null;
  /** Null = inherit product base price. */
  priceKobo: number | null;
  fulfilment: FulfilmentValue;
  /** Null for made-to-order. */
  stockQuantity: number | null;
  sku: string | null;
  isActive: boolean;
}

export function validateVariants(rows: VariantInput[]): {
  errors: Record<number, FieldErrors>;
  valid: ValidatedVariant[];
} {
  const errors: Record<number, FieldErrors> = {};
  const valid: ValidatedVariant[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const rowErrors: FieldErrors = {};
    const size = row.sizeLabel?.trim() === "" ? null : (row.sizeLabel?.trim() ?? null);
    const colour = row.colour?.trim() === "" ? null : (row.colour?.trim() ?? null);

    if (size === null && colour === null) {
      rowErrors.combination = "Size, colour, or both are required.";
    } else {
      const key = variantKey(size, colour);
      if (seen.has(key)) rowErrors.combination = "Duplicate size–colour combination.";
      else seen.add(key);
    }

    let priceKobo: number | null = null;
    if (row.priceNgn.trim() !== "") {
      priceKobo = parseNgnToKobo(row.priceNgn);
      if (priceKobo === null) rowErrors.priceNgn = "Invalid override price.";
    }

    let stockQuantity: number | null = null;
    if (row.fulfilment === "ready_made") {
      if (row.stock.trim() === "") {
        // Blank is not a choice: ready-made needs an explicit count.
        rowErrors.stock = "Enter stock (0 is valid) or switch to made to order.";
      } else {
        stockQuantity = parseStock(row.stock);
        if (stockQuantity === null)
          rowErrors.stock = "Stock must be a whole number, 0 or more.";
      }
    }
    // made_to_order rows ignore any stock value entirely (forced NULL below).

    if (Object.keys(rowErrors).length > 0) {
      errors[index] = rowErrors;
      return;
    }
    valid.push({
      sizeLabel: size,
      colour,
      priceKobo,
      fulfilment: row.fulfilment,
      stockQuantity: row.fulfilment === "ready_made" ? stockQuantity : null,
      sku: row.sku.trim() === "" ? null : row.sku.trim(),
      isActive: row.isActive,
    });
  });

  return { errors, valid };
}

export const PRODUCT_STATUSES: { value: ProductStatusValue; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "made_to_order", label: "Made to Order" },
  { value: "limited", label: "Limited" },
  { value: "sold_out", label: "Sold Out" },
  { value: "archived", label: "Archived" },
];
