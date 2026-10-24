// Storefront collection dummy catalogue, mirroring the admin mock
// collections (lib/admin/collections-mock.ts) so names and slugs stay
// consistent until both read from the same Postgres tables.
// TODO(content): replace covers, descriptions, and alt text with real
// art direction and catalogue data.
import { shopProducts, type ShopProduct } from "@/lib/data/shop";

export interface StorefrontCollection {
  slug: string;
  name: string;
  description: string;
  imagePath: string;
  alt: string;
}

export const storefrontCollections: StorefrontCollection[] = [
  {
    slug: "gowns-dresses",
    name: "Gowns & Dresses",
    description: "Sculpted evening silhouettes cut for ceremony and occasion.",
    imagePath: "/images/style_01.jpeg",
    alt: "Model in a strapless yellow and blue geometric-print dress with a cobalt tulle hem",
  },
  {
    slug: "tailored-separates",
    name: "Tailored Separates",
    description: "Sharp tailoring designed to mix, layer, and rewear.",
    imagePath: "/images/style_03.jpeg",
    alt: "Model in tailored separates photographed against a neutral backdrop",
  },
  {
    slug: "architectural-outerwear",
    name: "Architectural Outerwear",
    description: "Structured outer layers that hold their own silhouette.",
    imagePath: "/images/style_05.jpeg",
    alt: "Model in a structured outerwear piece photographed against a neutral backdrop",
  },
];

// Temporary mapping: products belong to collections only by category until
// real product→collection links exist in the database.
// TODO(content): replace with collection membership once Phase 3 lands.
const collectionCategories: Record<string, ShopProduct["category"][]> = {
  "gowns-dresses": ["gowns", "corsetry"],
  "tailored-separates": ["separates"],
  "architectural-outerwear": ["outerwear"],
};

export function getStorefrontCollection(
  slug: string,
): StorefrontCollection | undefined {
  return storefrontCollections.find((collection) => collection.slug === slug);
}

export function getCollectionProducts(slug: string): ShopProduct[] {
  const categories = collectionCategories[slug];
  if (!categories) return [];
  return shopProducts.filter((product) => categories.includes(product.category));
}
