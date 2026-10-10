// Shop dummy catalogue — presentational placeholders only.
// TODO(content): replace every name, price, image, and filter option with real
// Karanyé catalogue data. Postgres-backed search/filter/sort arrives in Phase 2;
// until then filtering is client-side over this list (§13 migration noted).

import { placeholderImage, placeholderImageAlt } from "@/lib/data/home";

export type ShopCategory = "gowns" | "outerwear" | "separates" | "corsetry";

export type ShopStatus = "made_to_order" | "limited" | "sold_out";

export interface ShopImage {
  src: string;
  alt: string;
}

export interface ShopProduct {
  slug: string;
  name: string;
  fabricLine: string;
  priceKobo: number;
  status: ShopStatus;
  category: ShopCategory;
  palette: string;
  sizes: string[];
  addedIndex: number;
  images: ShopImage[];
}

export const shopCategories: { value: ShopCategory | "all"; label: string }[] = [
  { value: "all", label: "All Silhouettes" },
  { value: "gowns", label: "Gowns & Dresses" },
  { value: "outerwear", label: "Architectural Outerwear" },
  { value: "separates", label: "Tailored Separates" },
  { value: "corsetry", label: "Corsetry & Bodices" },
];

export const shopSizes: string[] = ["6", "8", "10", "12", "14", "16", "18"];

export const shopPalettes: string[] = ["Crimson", "Noir", "Bronze", "Forest", "Ivory"];

export const shopStatuses: { value: ShopStatus | "all"; label: string }[] = [
  { value: "all", label: "All commission types" },
  { value: "made_to_order", label: "Made to Order" },
  { value: "limited", label: "Limited" },
];

export const shopValuations: { value: string; label: string }[] = [
  { value: "all", label: "All valuations" },
  { value: "under-200", label: "Under ₦200,000" },
  { value: "200-300", label: "₦200,000 – ₦300,000" },
  { value: "above-300", label: "Above ₦300,000" },
];

export const shopSorts: { value: string; label: string }[] = [
  { value: "featured", label: "Featured curation" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "availability", label: "Availability" },
];

// One brand photograph per product until real catalogue imagery exists.
// The array shape stays so multi-image products drop straight in later.
// TODO(content): replace with each product's own photography.
const placeholderImages: ShopImage[] = [
  { src: placeholderImage, alt: placeholderImageAlt },
];

export const shopProducts: ShopProduct[] = [
  {
    slug: "zaria-sculpted-bodice-gown",
    // TODO(content): replace with real product data and imagery
    name: "The Zaria Sculpted Bodice Gown",
    fabricLine: "Dual-Layer Structured Silk + Custom Boning",
    priceKobo: 34500000,
    status: "made_to_order",
    category: "gowns",
    palette: "Crimson",
    sizes: ["6", "8", "10", "12", "14"],
    addedIndex: 9,
    images: placeholderImages,
  },
  {
    slug: "amina-draped-silk-trench",
    // TODO(content): replace with real product data and imagery
    name: "The Amina Draped Silk Trench",
    fabricLine: "Fluid Outerwear + 100% Raw Mulberry",
    priceKobo: 41000000,
    status: "made_to_order",
    category: "outerwear",
    palette: "Bronze",
    sizes: ["8", "10", "12", "14", "16"],
    addedIndex: 8,
    images: placeholderImages,
  },
  {
    slug: "moremi-cape-blazer",
    // TODO(content): replace with real product data and imagery
    name: "The Moremi Cape Blazer",
    fabricLine: "Split Sleeve Cape + Double-Breasted Wool",
    priceKobo: 32000000,
    status: "limited",
    category: "separates",
    palette: "Noir",
    sizes: ["8", "10", "12"],
    addedIndex: 7,
    images: placeholderImages,
  },
  {
    slug: "ogechi-pleated-ensemble",
    // TODO(content): replace with real product data and imagery
    name: "The Ogechi Pleated Ensemble",
    fabricLine: "Two-Piece Ensemble + Tailored Knife Pleats",
    priceKobo: 18500000,
    status: "made_to_order",
    category: "separates",
    palette: "Ivory",
    sizes: ["6", "8", "10", "12", "14", "16", "18"],
    addedIndex: 6,
    images: placeholderImages,
  },
  {
    slug: "idia-high-neck-peplum",
    // TODO(content): replace with real product data and imagery
    name: "The Idia High-Neck Peplum",
    fabricLine: "Textured Brocade + Corseted Boning",
    priceKobo: 31000000,
    status: "made_to_order",
    category: "corsetry",
    palette: "Crimson",
    sizes: ["6", "8", "10", "12"],
    addedIndex: 5,
    images: placeholderImages,
  },
  {
    slug: "bamigbo-floor-kaftan",
    // TODO(content): replace with real product data and imagery
    name: "The Bamigbo Floor Kaftan",
    fabricLine: "Hand-Dyed Silk Crepe + Metal Embellishments",
    priceKobo: 25000000,
    status: "limited",
    category: "gowns",
    palette: "Forest",
    sizes: ["10", "12", "14"],
    addedIndex: 4,
    images: placeholderImages,
  },
  {
    slug: "kemi-column-gown",
    // TODO(content): replace with real product data and imagery
    name: "The Kemi Column Gown",
    fabricLine: "Heavy Silk Satin + Architectural Flared Train",
    priceKobo: 29500000,
    status: "made_to_order",
    category: "gowns",
    palette: "Crimson",
    sizes: ["6", "8", "10", "12", "14"],
    addedIndex: 3,
    images: placeholderImages,
  },
  {
    slug: "alafia-tailored-pant",
    // TODO(content): replace with real product data and imagery
    name: "The Alafia Tailored Pant",
    fabricLine: "Virgin Wool Blend + High-Waisted Tailoring",
    priceKobo: 14000000,
    status: "limited",
    category: "separates",
    palette: "Noir",
    sizes: ["8", "10", "12", "14", "16"],
    addedIndex: 2,
    images: placeholderImages,
  },
  {
    slug: "sisi-structured-corset",
    // TODO(content): replace with real product data and imagery
    name: "The Sisi Structured Corset",
    fabricLine: "Sculpted Waistline + Custom Measurements",
    priceKobo: 16500000,
    status: "made_to_order",
    category: "corsetry",
    palette: "Crimson",
    sizes: ["6", "8", "10", "12"],
    addedIndex: 1,
    images: placeholderImages,
  },
];

export const shopCopy = {
  // TODO(content): replace with approved Shop copy
  eyebrow: "Archive & Current Releases",
  title: "The Collection",
  body: "Each silhouette is thoughtfully crafted upon commission. Explore made-to-order designs, bespoke tailoring, and limited architectural pieces.",
  searchPlaceholder: "Search silhouette",
  resetLabel: "Reset filters",
  showingOf: (shown: number, total: number): string =>
    `Showing ${shown} of ${total} silhouettes`,
  loadMoreLabel: "Load more creations",
  emptyTitle: "No silhouettes match your selection",
  emptyBody: "Adjust or reset your filters to view the collection.",
};

export const guaranteeCopy = {
  // TODO(content): replace with approved atelier commitment copy
  eyebrow: "The atelier commitment",
  title: "The Karanyé Made-to-Measure Guarantee",
  body: "Every garment is patterned specifically to your anatomical proportions or tailored to standard UK sizes with complimentary hem adjustment and artisanal fitting consultations.",
  ctaLabel: "Consult our atelier",
  ctaHref: "/made-to-measure",
};

export const sizingHelpCopy = {
  // TODO(content): replace with approved sizing guidance copy
  eyebrow: "Client services",
  title: "Need Guidance on Sizing or Custom Proportions?",
  body: "Our specialists are available via direct appointments or private sessions to capture your personal dimensions.",
  sizingCtaLabel: "Explore sizing guide",
  sizingCtaHref: "/size-fit",
  atelierCtaLabel: "Book atelier session",
  atelierCtaHref: "/contact",
};
