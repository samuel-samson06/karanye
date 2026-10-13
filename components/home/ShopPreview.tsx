import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";

type HomeProductStatus = "made_to_order" | "limited" | "sold_out";

interface HomeProduct {
  slug: string;
  name: string;
  priceKobo: number;
  status: HomeProductStatus;
  image: string;
  alt: string;
}

// TODO(content): replace with real product names, prices, and imagery.
// Every slot uses the first brand photograph until art direction assigns the rest.
const placeholderImage = "/images/style_01.jpeg";
const placeholderImageAlt =
  "Model in a strapless yellow and blue geometric-print dress with a cobalt tulle hem";

const homeProducts: HomeProduct[] = [
  {
    slug: "zaria-sculpted-gown",
    name: "The Zaria Sculpted Gown",
    priceKobo: 28500000,
    status: "made_to_order",
    image: placeholderImage,
    alt: placeholderImageAlt,
  },
  {
    slug: "amani-draped-ensemble",
    name: "The Amani Draped Ensemble",
    priceKobo: 19800000,
    status: "made_to_order",
    image: placeholderImage,
    alt: placeholderImageAlt,
  },
  {
    slug: "opaque-pleated-trouser",
    name: "The Opaque Pleated Trouser Set",
    priceKobo: 16400000,
    status: "limited",
    image: placeholderImage,
    alt: placeholderImageAlt,
  },
  {
    slug: "nomad-architectural-blazer",
    name: "The Nomad Architectural Blazer",
    priceKobo: 21200000,
    status: "limited",
    image: placeholderImage,
    alt: placeholderImageAlt,
  },
];

const statusLabel: Record<string, string> = {
  made_to_order: "Made to Order",
  limited: "Limited",
  sold_out: "Sold Out",
};

// The Karanyé Edits: image-led editorial grid, never a dense marketplace.
// Data is static placeholder until the Phase 2 catalogue.
export default function ShopPreview() {
  return (
    <section aria-label="The Karanyé Edits" className="border-t border-platinum bg-linen">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
        <div className="flex flex-col gap-5 border-b border-platinum pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label-md text-muted">Latest designs</p>
            <h2 className="mt-3 text-display-lg text-ink">The Karanyé Edits</h2>
          </div>
          <Link
            href="/shop"
            className="editorial-link self-start text-label-md text-crimson md:self-auto"
          >
            View Complete Collection
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-2 lg:grid-cols-3 md:gap-x-10 md:gap-y-14 lg:gap-x-12 lg:gap-y-16">
          {homeProducts.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                className="group block"
                aria-label={`View ${product.name}`}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden border border-platinum">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span
                    className={
                      product.status === "sold_out"
                        ? "absolute top-4 left-4 border border-hairline bg-canvas px-3 py-2 text-label-md text-muted"
                        : "absolute top-4 left-4 border border-crimson bg-canvas px-3 py-2 text-label-md text-crimson"
                    }
                  >
                    {statusLabel[product.status]}
                  </span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4 border-t border-platinum pt-4">
                  <h3 className="text-headline-sm text-ink">{product.name}</h3>
                  <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                    <p className="text-label-md text-ink">
                      {formatNaira(product.priceKobo)}
                    </p>
                    <span className="editorial-link text-label-md text-crimson">
                      View Design
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
