// Home Page dummy data — presentational placeholders only.
// TODO(content): replace every string, price, and remote image with real
// Karanyé copy, pricing, and brand photography once supplied.
// No Supabase wiring here (Phase 2 owns the catalogue).

export type HomeProductStatus = "made_to_order" | "limited" | "sold_out";

export interface HomeProduct {
  slug: string;
  name: string;
  priceKobo: number;
  status: HomeProductStatus;
  image: string;
  alt: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  // { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Size & Fit", href: "/size-fit" },
  { label: "Made to Measure", href: "/made-to-measure" },
  { label: "Contact", href: "/contact" },
];

export const announcementLines: string[] = [
  // TODO(content): confirm announcement bar copy
  "Made to order, thoughtfully crafted.",
  "Allow 5–7 days to process your orders.",
];

export const heroCopy = {
  // TODO(content): replace with approved hero copy
  eyebrow: "Karanyé — Editorial Haute Couture",
  titleA: "Thoughtfully Crafted.",
  titleB: "Made to Order.",
  body: "Sculptural silhouettes in deep crimson and ink — each piece constructed slowly, fitted personally, and made only when you order it.",
  ctaLabel: "Discover Our Story",
  ctaHref: "/about",
  // TODO(content): replace with brand photography
  image:
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
  imageAlt: "Model wearing a sculptural crimson Karanyé gown",
};

export const philosophyCopy = {
  // TODO(content): replace with approved brand statement
  quote:
    "We construct garments not as disposable inventory, but as wearable architecture — sculpted slowly, fitted personally.",
  body: "Every Karanyé piece is made to order in our atelier. No mass production, no warehouses of stock — only considered cutting, careful finishing, and fabric chosen to last.",
  detailImage:
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
  detailAlt: "Close-up of pleated crimson fabric detail",
  stats: [
    { value: "100%", label: "Made to order" },
    { value: "5–7 Days", label: "Processing time" },
    { value: "Lagos & London", label: "Atelier presence" },
  ],
};

export const homeProducts: HomeProduct[] = [
  {
    slug: "zaria-sculpted-gown",
    // TODO(content): replace with real product name, price, and image
    name: "The Zaria Sculpted Gown",
    priceKobo: 28500000,
    status: "made_to_order",
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop",
    alt: "Model wearing a sculptural crimson evening gown",
  },
  {
    slug: "amani-draped-ensemble",
    // TODO(content): replace with real product name, price, and image
    name: "The Amani Draped Ensemble",
    priceKobo: 19800000,
    status: "made_to_order",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=900&auto=format&fit=crop",
    alt: "Model wearing a draped brown two-piece ensemble",
  },
  {
    slug: "opaque-pleated-trouser",
    // TODO(content): replace with real product name, price, and image
    name: "The Opaque Pleated Trouser Set",
    priceKobo: 16400000,
    status: "limited",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop",
    alt: "Model wearing a dark pleated strapless set",
  },
  {
    slug: "nomad-architectural-blazer",
    // TODO(content): replace with real product name, price, and image
    name: "The Nomad Architectural Blazer",
    priceKobo: 21200000,
    status: "limited",
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=900&auto=format&fit=crop",
    alt: "Model wearing a structured crimson blazer with wide sleeves",
  },
];

export const pathwaysCopy = {
  // TODO(content): replace with approved Standard / MTM copy
  eyebrow: "Two ways to buy",
  title: "Two Pathways to Your Silhouette",
  body: "Choose the fit that suits you. Both are made to order — the difference is whose measurements we cut from.",
  standard: {
    title: "Standard Size",
    body: "Cut to Karanyé's body measurement chart. The fastest route to your piece.",
    points: ["Sizes 6–18", "Chart-guided fit", "5–7 day processing"],
    ctaLabel: "Discover the chart",
    ctaHref: "/size-fit",
  },
  mtm: {
    title: "Made to Measure",
    body: "Cut to your own measurements, submitted at purchase and kept with your order.",
    points: ["Your measurements", "Atelier review", "Personal fit"],
    ctaLabel: "How it works",
    ctaHref: "/made-to-measure",
  },
};

export const craftCopy = {
  // TODO(content): replace with approved craft copy
  eyebrow: "The atelier",
  title: "Seasoned with Integrity, Cut with Intent",
  body: "Inside the atelier, each commission passes through the same hands — from pattern draft to final press. Slow work, on purpose.",
  linkLabel: "Explore our story",
  linkHref: "/about",
  imageA:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
  imageAAlt: "Garments hanging inside the Karanyé atelier",
  imageB:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
  imageBAlt: "Atelier rail with carefully finished pieces",
};

export const privateListCopy = {
  // TODO(content): replace with approved private list copy
  title: "Join Our Private List",
  body: "New designs, atelier notes, and first access to limited pieces. One letter at a time.",
  nameLabel: "Name",
  emailLabel: "Email",
  submitLabel: "Join the Private List",
  note: "We write rarely and only when it matters. Unsubscribe anytime.",
};

// Temporary kobo → Naira display for dummy data.
// The canonical helper (src/lib/money.ts) arrives with checkout (Phase 5).
export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return `₦${naira.toLocaleString("en-NG")}`;
}
