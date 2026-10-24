import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import { storefrontCollections } from "@/lib/data/collections";
import {
  quickPreviewProducts,
  type ShopProduct,
} from "@/lib/data/shop";

const quickStatusLabel: Record<ShopProduct["status"], string> = {
  made_to_order: "Made to Order",
  limited: "Limited",
  sold_out: "Sold Out",
};

// The Collections: three image-led collection cards with a name overlaid on
// the canonical obsidian wash, never a dense marketplace. Data is static
// placeholder until the Postgres catalogue (Phase 3).
export default function ShopPreview() {
  return (
    <section aria-label="The Collections and latest designs" className="border-t border-platinum bg-linen">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
        <div className="flex flex-col gap-5 border-b border-platinum pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label-md text-muted">Browse by groupings</p>
            <h2 className="mt-3 text-display-lg text-ink">The Collections</h2>
          </div>
          <Link
            href="/shop"
            className="editorial-link self-start text-label-md text-crimson md:self-auto"
          >
            View Complete Collection
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-10 lg:gap-x-12">
          {storefrontCollections.map((collection) => (
            <li key={collection.slug}>
              <Link
                href={`/collections/${collection.slug}`}
                aria-label={`View ${collection.name}`}
                className="group relative block aspect-[3/4] w-full overflow-hidden border border-platinum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
              >
                <Image
                  src={collection.imagePath}
                  alt={collection.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
                />
                {/* Canonical overlay wash; deepens slightly on hover. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-ink/45 transition-colors duration-300 group-hover:bg-ink/60"
                />
                <h3 className="absolute inset-0 flex items-center justify-center px-6 text-center text-headline-lg text-canvas">
                  {collection.name}
                </h3>
              </Link>
            </li>
          ))}
        </ul>

        {/* Quick products: six recent pieces leading to their design pages.
            Same grid as the shop page so the two read as one family. */}
        <div className="mt-14 border-t border-platinum pt-8 md:mt-20">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-label-md text-muted">Latest designs</p>
              <h3 className="mt-3 text-headline-md text-ink">The Latest Designs</h3>
            </div>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:gap-x-8 lg:gap-y-14">
            {quickPreviewProducts.map((product) => {
              const image = product.images[0];
              return (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden border border-platinum">
                      {image && (
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 768px) 30vw, 50vw"
                          className="object-cover"
                        />
                      )}
                      <span
                        className={
                          product.status === "sold_out"
                            ? "absolute top-3 left-3 bg-canvas px-3 py-2 text-label-md text-muted border border-hairline"
                            : "absolute top-3 left-3 bg-canvas px-3 py-2 text-label-md text-crimson border border-crimson"
                        }
                      >
                        {quickStatusLabel[product.status]}
                      </span>
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-4 border-t border-platinum pt-4">
                      <h4 className="text-headline-xs md:text-headline-sm text-ink">
                        {product.name}
                      </h4>
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
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
