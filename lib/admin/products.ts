// Products-admin mock catalogue — clearly fictional demonstration records.
// Shape mirrors sql/01_core_schema.sql (products, product_images,
// product_variants, collections). Nothing here touches Supabase; Phase B
// replaces this module's source with server-fetched rows of the same shape.
// Names and prices intentionally match the dashboard mock and shop dummy
// data so the admin views stay consistent with each other.

export type MockAdminProductStatus =
  | "draft"
  | "made_to_order"
  | "limited"
  | "sold_out"
  | "archived";

export type MockAdminFulfilment = "ready_made" | "made_to_order";

export interface MockAdminCollection {
  id: string;
  slug: string;
  name: string;
}

export interface MockAdminImage {
  imageUrl: string;
  alt: string;
  isPrimary: boolean;
}

export interface MockAdminVariant {
  sizeLabel: string | null;
  colour: string | null;
  fulfilmentType: MockAdminFulfilment;
  /** NULL for made-to-order (never counted); non-negative for ready-made. */
  stockQuantity: number | null;
  isActive: boolean;
}

export interface MockAdminProduct {
  id: string;
  slug: string;
  name: string;
  collectionId: string;
  priceKobo: number;
  status: MockAdminProductStatus;
  mtmAvailable: boolean;
  images: MockAdminImage[];
  variants: MockAdminVariant[];
  updatedAt: string;
}

export const mockAdminCollections: MockAdminCollection[] = [
  { id: "col-gowns", slug: "gowns-dresses", name: "Gowns & Dresses" },
  { id: "col-separates", slug: "tailored-separates", name: "Tailored Separates" },
  { id: "col-outerwear", slug: "architectural-outerwear", name: "Architectural Outerwear" },
];

export const mockAdminProducts: MockAdminProduct[] = [
  {
    id: "prod-zaria",
    slug: "zaria-sculpted-gown",
    name: "The Zaria Sculpted Gown",
    collectionId: "col-gowns",
    priceKobo: 34500000,
    status: "made_to_order",
    mtmAvailable: true,
    images: [
      { imageUrl: "/images/style_01.jpeg", alt: "Crimson sculpted gown, front view", isPrimary: true },
    ],
    variants: [
      { sizeLabel: "M", colour: "Crimson", fulfilmentType: "ready_made", stockQuantity: 4, isActive: true },
      { sizeLabel: "L", colour: "Crimson", fulfilmentType: "ready_made", stockQuantity: 2, isActive: true },
      { sizeLabel: "S", colour: "Crimson", fulfilmentType: "made_to_order", stockQuantity: null, isActive: true },
    ],
    updatedAt: "2026-10-10T13:15:00Z",
  },
  {
    id: "prod-amina",
    slug: "amina-draped-silk-trench",
    name: "The Amina Draped Silk Trench",
    collectionId: "col-outerwear",
    priceKobo: 41000000,
    status: "made_to_order",
    mtmAvailable: true,
    images: [
      { imageUrl: "/images/style_05.jpeg", alt: "Bronze draped silk trench", isPrimary: true },
    ],
    variants: [
      { sizeLabel: "M", colour: "Bronze", fulfilmentType: "made_to_order", stockQuantity: null, isActive: true },
      { sizeLabel: "L", colour: "Bronze", fulfilmentType: "made_to_order", stockQuantity: null, isActive: true },
    ],
    updatedAt: "2026-10-08T11:22:00Z",
  },
  {
    id: "prod-moremi",
    slug: "moremi-cape-blazer",
    name: "The Moremi Cape Blazer",
    collectionId: "col-separates",
    priceKobo: 32000000,
    status: "limited",
    mtmAvailable: false,
    images: [
      { imageUrl: "/images/style_03.jpeg", alt: "Black split-sleeve cape blazer", isPrimary: true },
    ],
    variants: [
      { sizeLabel: "10", colour: "Noir", fulfilmentType: "ready_made", stockQuantity: 3, isActive: true },
      { sizeLabel: "12", colour: "Noir", fulfilmentType: "ready_made", stockQuantity: 0, isActive: true },
      { sizeLabel: "8", colour: "Noir", fulfilmentType: "ready_made", stockQuantity: 1, isActive: false },
    ],
    updatedAt: "2026-10-02T09:05:00Z",
  },
  {
    id: "prod-ogechi",
    slug: "ogechi-pleated-ensemble",
    name: "The Ogechi Pleated Ensemble",
    collectionId: "col-separates",
    priceKobo: 18500000,
    status: "made_to_order",
    mtmAvailable: true,
    images: [
      { imageUrl: "/images/style_07.jpeg", alt: "Ivory pleated two-piece ensemble", isPrimary: true },
    ],
    variants: [
      { sizeLabel: "8", colour: "Ivory", fulfilmentType: "ready_made", stockQuantity: 6, isActive: true },
      { sizeLabel: "10", colour: "Ivory", fulfilmentType: "made_to_order", stockQuantity: null, isActive: true },
    ],
    updatedAt: "2026-10-09T16:47:00Z",
  },
  {
    id: "prod-idia",
    slug: "idia-high-neck-peplum",
    name: "The Idia High-Neck Peplum",
    collectionId: "col-gowns",
    priceKobo: 31000000,
    status: "draft",
    mtmAvailable: false,
    images: [],
    variants: [],
    updatedAt: "2026-09-25T14:40:00Z",
  },
  {
    id: "prod-bamigbo",
    slug: "bamigbo-floor-kaftan",
    name: "The Bamigbo Floor Kaftan",
    collectionId: "col-gowns",
    priceKobo: 25000000,
    status: "archived",
    mtmAvailable: false,
    images: [
      { imageUrl: "/images/style_02.jpeg", alt: "Forest green floor-length kaftan", isPrimary: true },
    ],
    variants: [
      { sizeLabel: "M", colour: "Forest", fulfilmentType: "ready_made", stockQuantity: 2, isActive: true },
    ],
    updatedAt: "2026-08-14T10:00:00Z",
  },
];

/**
 * Provisional low-stock threshold in units. No threshold exists in the
 * schema; this constant is reviewable and lives here (not in SQL) until a
 * business rule confirms it.
 */
export const LOW_STOCK_THRESHOLD = 3;

function isSellableProduct(product: MockAdminProduct): boolean {
  return product.status !== "archived";
}

/** Ready-made, active, non-archived, known non-negative stock. NULL never counts. */
function isCountedVariant(
  product: MockAdminProduct,
  variant: MockAdminVariant
): boolean {
  return (
    isSellableProduct(product) &&
    variant.isActive &&
    variant.fulfilmentType === "ready_made" &&
    variant.stockQuantity !== null
  );
}

export interface ProductStats {
  /** Non-archived products (drafts included): catalogue breadth, not units. */
  totalProducts: number;
  /** Eligible variants at or below threshold (zero counts — it is ≤ 3). */
  lowStockVariants: number;
  /** Retail value of sellable physical stock: product price × positive stock. */
  inventoryValueKobo: number;
}

export function getProductStats(): ProductStats {
  let lowStockVariants = 0;
  let inventoryValueKobo = 0;

  for (const product of mockAdminProducts) {
    for (const variant of product.variants) {
      if (!isCountedVariant(product, variant)) continue;
      const stock = variant.stockQuantity ?? 0;
      if (stock <= LOW_STOCK_THRESHOLD) lowStockVariants += 1;
      if (stock > 0) inventoryValueKobo += product.priceKobo * stock;
    }
  }

  return {
    totalProducts: mockAdminProducts.filter(isSellableProduct).length,
    lowStockVariants,
    inventoryValueKobo,
  };
}

export type StockSummary =
  | { kind: "units"; units: number }
  | { kind: "made_to_order" }
  | { kind: "none" };

/** Per-product stock cell: summed ready-made units, MTO label, or no variants. */
export function getStockSummary(product: MockAdminProduct): StockSummary {
  if (product.variants.length === 0) return { kind: "none" };
  const units = product.variants
    .filter((variant) => isCountedVariant(product, variant))
    .reduce((sum, variant) => sum + (variant.stockQuantity ?? 0), 0);
  const hasMadeToOrder = product.variants.some(
    (variant) => variant.fulfilmentType === "made_to_order" && variant.isActive
  );
  if (units > 0) return { kind: "units", units };
  if (hasMadeToOrder) return { kind: "made_to_order" };
  return { kind: "none" };
}

export function getPrimaryImage(product: MockAdminProduct): MockAdminImage | null {
  return (
    product.images.find((image) => image.isPrimary) ?? product.images[0] ?? null
  );
}

export function getCollectionName(collectionId: string): string | null {
  return (
    mockAdminCollections.find((collection) => collection.id === collectionId)
      ?.name ?? null
  );
}
