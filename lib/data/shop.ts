// Shop dummy catalogue — products only. Filter facets and section copy live
// with their components (Filter, page, Guarantee, SizingHelp).
// TODO(content): replace every name, price, description, and image with real
// Karanyé catalogue data. Postgres-backed reads arrive in Phase 3; until then
// pages render from this list. Field names mirror the approved schema
// (sql/01_core_schema.sql): description, fabric_composition,
// care_instructions (plain comma-separated text), mtm_available. Per-product
// size lists are retired — every piece offers the full standard chart range
// (sizeChartOrder), so standard sizing lives in lib/data/size-chart.ts.

// TODO(content): assign final image per product once art direction is set.
const placeholderImage = "/images/style_01.jpeg";
const placeholderImageAlt =
  "Model in a strapless yellow and blue geometric-print dress with a cobalt tulle hem";

export type ShopCategory = "gowns" | "outerwear" | "separates" | "corsetry";

export type ShopStatus = "made_to_order" | "limited" | "sold_out";

export interface ShopImage {
  src: string;
  alt: string;
}

export interface ShopProduct {
  slug: string;
  name: string;
  description: string;
  fabricLine: string;
  fabricComposition: string;
  careInstructions: string;
  priceKobo: number;
  status: ShopStatus;
  category: ShopCategory;
  palette: string;
  mtmAvailable: boolean;
  addedIndex: number;
  images: ShopImage[];
}

// One brand photograph per product until real catalogue imagery exists.
// The array shape stays so multi-image products drop straight in later.
// TODO(content): replace with each product's own photography.
const placeholderImages: ShopImage[] = [
  { src: placeholderImage, alt: placeholderImageAlt },
];

// All copy below is placeholder until the owner supplies approved catalogue
// content: TODO(content).
export const shopProducts: ShopProduct[] = [
  {
    slug: "zaria-sculpted-bodice-gown",
    name: "The Zaria Sculpted Bodice Gown",
    description:
      "A statement silhouette with a boned sculpted bodice over structured silk, finished with careful embellishment along the trim.",
    fabricLine: "Dual-Layer Structured Silk + Custom Boning",
    fabricComposition: "Structured silk, inner boning layers, decorative trim",
    careInstructions: "Dry clean only, do not wring, store flat in the provided dust bag",
    priceKobo: 34500000,
    status: "made_to_order",
    category: "gowns",
    palette: "Crimson",
    mtmAvailable: true,
    addedIndex: 9,
    images: placeholderImages,
  },
  {
    slug: "amina-draped-silk-trench",
    name: "The Amina Draped Silk Trench",
    description:
      "Fluid draping meets tailoring discipline: a trench-shaped outer layer in low-weight silk with an intentionally asymmetric fall.",
    fabricLine: "Fluid Outerwear + 100% Raw Mulberry",
    fabricComposition: "Raw mulberry silk, full lining",
    careInstructions: "Dry clean only, steam to reshape drape, hang on a broad hanger",
    priceKobo: 41000000,
    status: "made_to_order",
    category: "outerwear",
    palette: "Bronze",
    mtmAvailable: false,
    addedIndex: 8,
    images: placeholderImages,
  },
  {
    slug: "moremi-cape-blazer",
    name: "The Moremi Cape Blazer",
    description:
      "A double-breasted blazer extended into a split-sleeve cape, holding structure while it moves.",
    fabricLine: "Split Sleeve Cape + Double-Breasted Wool",
    fabricComposition: "Structured wool blend, satin lining",
    careInstructions: "Dry clean only, brush gently, hang on a broad hanger",
    priceKobo: 32000000,
    status: "limited",
    category: "separates",
    palette: "Noir",
    mtmAvailable: false,
    addedIndex: 7,
    images: placeholderImages,
  },
  {
    slug: "ogechi-pleated-ensemble",
    name: "The Ogechi Pleated Ensemble",
    description:
      "A two-piece study in movement: tailored knife pleats with a matching top, pressed to hold their line.",
    fabricLine: "Two-Piece Ensemble + Tailored Knife Pleats",
    fabricComposition: "Pleat-weight poly-blend, hidden fastenings",
    careInstructions: "Dry clean only, do not crease pleats, store hung inside the bag",
    priceKobo: 18500000,
    status: "made_to_order",
    category: "separates",
    palette: "Ivory",
    mtmAvailable: false,
    addedIndex: 6,
    images: placeholderImages,
  },
  {
    slug: "idia-high-neck-peplum",
    name: "The Idia High-Neck Peplum",
    description:
      "A high-neck peplum cut from textured brocade, corseted internally so the shape holds from the first wear to the last.",
    fabricLine: "Textured Brocade + Corseted Boning",
    fabricComposition: "Textured brocade, internal corsetry",
    careInstructions: "Dry clean only, reshape boning while damp-free, store flat",
    priceKobo: 31000000,
    status: "made_to_order",
    category: "corsetry",
    palette: "Crimson",
    mtmAvailable: true,
    addedIndex: 5,
    images: placeholderImages,
  },
  {
    slug: "bamigbo-floor-kaftan",
    name: "The Bamigbo Floor Kaftan",
    description:
      "A floor-length kaftan in hand-dyed silk crepe, weighted where the metal embellishments fall.",
    fabricLine: "Hand-Dyed Silk Crepe + Metal Embellishments",
    fabricComposition: "Hand-dyed silk crepe, metal embellishment",
    careInstructions: "Dry clean only, protect embellishments from friction, store rolled",
    priceKobo: 25000000,
    status: "limited",
    category: "gowns",
    palette: "Forest",
    mtmAvailable: false,
    addedIndex: 4,
    images: placeholderImages,
  },
  {
    slug: "kemi-column-gown",
    name: "The Kemi Column Gown",
    description:
      "Heavy silk satin cut on an architectural column, flaring into a soft train that stands without support.",
    fabricLine: "Heavy Silk Satin + Architectural Flared Train",
    fabricComposition: "Heavy silk satin, unlined column",
    careInstructions: "Dry clean only, steam vertically, hang by bodice",
    priceKobo: 29500000,
    status: "made_to_order",
    category: "gowns",
    palette: "Crimson",
    mtmAvailable: true,
    addedIndex: 3,
    images: placeholderImages,
  },
  {
    slug: "alafia-tailored-pant",
    name: "The Alafia Tailored Pant",
    description:
      "High-waisted virgin wool suiting with a waistband built to stay, full-length lines and clean pockets.",
    fabricLine: "Virgin Wool Blend + High-Waisted Tailoring",
    fabricComposition: "Virgin wool blend, full inner waistband",
    careInstructions: "Dry clean only, press seams lightly, hang folded at the knee",
    priceKobo: 14000000,
    status: "limited",
    category: "separates",
    palette: "Noir",
    mtmAvailable: false,
    addedIndex: 2,
    images: placeholderImages,
  },
  {
    slug: "sisi-structured-corset",
    name: "The Sisi Structured Corset",
    description:
      "A structured corset worn on its own or as the anchor of a look, built around a sculpted waistline.",
    fabricLine: "Sculpted Waistline + Custom Measurements",
    fabricComposition: "Structured corsetry layers, spiral boning",
    careInstructions: "Dry clean only, never fold the boning, store flat in the bag",
    priceKobo: 16500000,
    status: "made_to_order",
    category: "corsetry",
    palette: "Crimson",
    mtmAvailable: true,
    addedIndex: 1,
    images: placeholderImages,
  },
];

// Home preview grab: the first six pieces, in catalogue order, until the
// Postgres catalogue decides what "latest" means.
// TODO(content): replace with a real selection once Phase 3 lands.
export const quickPreviewProducts = shopProducts.slice(0, 6);

/** Detail-page lookup; unknown slugs return undefined so the route can 404. */
export function getProductBySlug(slug: string): ShopProduct | undefined {
  return shopProducts.find((product) => product.slug === slug);
}

/** Up to three other pieces from the same category, catalogue order. */
export function getRelatedProducts(slug: string): ShopProduct[] {
  const current = getProductBySlug(slug);
  if (!current) return [];
  return shopProducts
    .filter((product) => product.slug !== slug && product.category === current.category)
    .slice(0, 3);
}
