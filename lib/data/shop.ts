// Shop dummy catalogue — products only. Filter facets and section copy live
// with their components (Filter, page, Guarantee, SizingHelp).
// TODO(content): replace every name, price, and image with real Karanyé
// catalogue data. Postgres-backed search/filter/sort arrives in Phase 2;
// until then filtering is client-side over this list (§13 migration noted).

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
  fabricLine: string;
  priceKobo: number;
  status: ShopStatus;
  category: ShopCategory;
  palette: string;
  sizes: string[];
  addedIndex: number;
  images: ShopImage[];
}

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
