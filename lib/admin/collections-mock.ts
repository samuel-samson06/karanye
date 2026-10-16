import { mockAdminProducts } from "@/lib/admin/products";

// Mock-only collection catalogue for the collections list page. Kept
// separate from lib/admin/products.ts by design; product data there is
// untouched. Field names mirror the database schema (image_path is imagePath
// in camelCase), so no mapping layer is needed. Nothing here touches
// Supabase; counts derive from the mock products.

export interface MockCollection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  /** Local preview file, or null when the collection has no cover. */
  imagePath: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export const mockCollections: MockCollection[] = [
  {
    id: "col-gowns",
    slug: "gowns-dresses",
    name: "Gowns & Dresses",
    description: "Sculpted evening silhouettes cut for ceremony and occasion.",
    imagePath: "/images/style_01.jpeg",
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "col-separates",
    slug: "tailored-separates",
    name: "Tailored Separates",
    description: "Sharp tailoring designed to mix, layer, and rewear.",
    imagePath: "/images/style_03.jpeg",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "col-outerwear",
    slug: "architectural-outerwear",
    name: "Architectural Outerwear",
    description: null,
    imagePath: "/images/style_05.jpeg",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "col-bridal",
    slug: "bridal-atelier",
    name: "Bridal Atelier",
    description: "Made-to-measure bridal commissions, by private appointment.",
    imagePath: null,
    sortOrder: 3,
    isVisible: false,
  },
  {
    id: "col-archive",
    slug: "archive-2025",
    name: "Archive 2025",
    description: null,
    imagePath: null,
    sortOrder: 4,
    isVisible: false,
  },
];

/** Piece count derived from mock product→collection links (never typed). */
export function getMockPieceCount(collectionId: string): number {
  return mockAdminProducts.filter(
    (product) => product.collectionId === collectionId
  ).length;
}

/** Display order follows sort_order, exactly as the storefront would. */
export function getMockCollectionsSorted(): MockCollection[] {
  return [...mockCollections].sort((a, b) => a.sortOrder - b.sortOrder);
}
