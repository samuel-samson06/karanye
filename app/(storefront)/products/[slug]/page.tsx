import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/products/ProductGallery";
import ProductPurchase from "@/components/products/ProductPurchase";
import {
  getProductBySlug,
  getRelatedProducts,
  shopProducts,
} from "@/lib/data/shop";
import { formatNaira } from "@/lib/money";
import { storefrontCollections } from "@/lib/data/collections";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Deliberately blocking: a fully-static detail page over mock data, so
// navigation should not stream an instant shell over it.
export const instant = false;

export function generateStaticParams(): { slug: string }[] {
  return shopProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: ProductDetailPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Design — Karanyé" };
  return { title: `${product.name} — Karanyé`, description: product.description };
}

// Design detail (§9): garment photography beside a narrative purchase column.
// Editorial, not conventional commerce: the piece is commissioned per order,
// so selections are Standard Size or Custom Size — never a variant matrix.
// Data is the shop mock until Phase 3.
export default async function ProductDetailPage(props: ProductDetailPageProps) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug);
  // Temporary collection mapping (mirrors lib/data/collections.ts) until
  // real product→collection links exist.
  const collections = {
    gowns: "gowns-dresses",
    corsetry: "gowns-dresses",
    separates: "tailored-separates",
    outerwear: "architectural-outerwear",
  } as const;
  const collection = storefrontCollections.find(
    (entry) => entry.slug === collections[product.category],
  );
  const firstImage = product.images[0];

  return (
    <main className="bg-canvas">
      <div className="mx-auto max-w-7xl px-5 pt-10 md:px-8 md:pt-14 lg:px-16">
        <nav aria-label="Breadcrumb">
          <Link href="/shop" className="editorial-link text-label-md text-crimson">
            Shop
          </Link>
          {collection && (
            <>
              <span aria-hidden="true" className="mx-3 text-label-md text-hairline">
                /
              </span>
              <Link
                href={`/collections/${collection.slug}`}
                className="editorial-link text-label-md text-crimson"
              >
                {collection.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-8 grid gap-10 pb-24 md:gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="lg:col-span-5">
            <p className="text-label-md text-muted">{product.fabricLine}</p>
            <h1 className="mt-3 text-display-lg text-ink">{product.name}</h1>
            <div className="mt-4 flex items-center gap-4">
              <p className="text-headline-sm text-ink">
                {formatNaira(product.priceKobo)}
              </p>
              <span
                className={
                  product.status === "sold_out"
                    ? "border border-hairline bg-canvas px-3 py-2 text-label-md text-muted"
                    : "border border-crimson bg-canvas px-3 py-2 text-label-md text-crimson"
                }
              >
                {product.status === "limited"
                  ? "Limited"
                  : product.status === "sold_out"
                    ? "Sold Out"
                    : "Made to Order"}
              </span>
            </div>

            <p className="mt-6 max-w-xl text-body-md text-muted">
              {product.description}
            </p>

            {/* Fabric & care: commas split on display per the schema note. */}
            <dl className="mt-8 border-t border-platinum pt-6">
              <div className="flex flex-col gap-1 border-b border-hairline pb-4">
                <dt className="text-label-md uppercase text-muted">Fabric</dt>
                <dd className="text-body-md text-ink">{product.fabricComposition}</dd>
              </div>
              <div className="flex flex-col gap-1 pt-4">
                <dt className="text-label-md uppercase text-muted">Care</dt>
                <dd className="text-body-md text-ink">
                  <ul className="flex list-disc flex-col gap-1 pl-4">
                    {product.careInstructions
                      .split(",")
                      .map((instruction) => instruction.trim())
                      .filter(Boolean)
                      .map((instruction) => (
                        <li key={instruction}>{instruction}</li>
                      ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <ProductPurchase
                slug={product.slug}
                name={product.name}
                priceKobo={product.priceKobo}
                status={product.status}
                imageSrc={firstImage?.src ?? ""}
                imageAlt={firstImage?.alt ?? product.name}
                mtmAvailable={product.mtmAvailable}
              />
            </div>
          </div>
        </div>

        {/* Related designs, same family, catalogue order */}
        {related.length > 0 && (
          <section
            aria-label="Related designs"
            className="border-t border-platinum py-14 md:py-16"
          >
            <h2 className="text-headline-md text-ink">From the same atelier</h2>
            <p className="mt-2 text-body-md text-muted">
              Other pieces in this commission family.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
              {related.map((entry) => {
                const entryImage = entry.images[0];
                return (
                  <li key={entry.slug}>
                    <Link
                      href={`/products/${entry.slug}`}
                      aria-label={`View ${entry.name}`}
                      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden border border-platinum">
                        {entryImage && (
                          <Image
                            src={entryImage.src}
                            alt={entryImage.alt}
                            fill
                            sizes="(min-width: 768px) 30vw, 50vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <h3 className="mt-3 border-t border-platinum pt-3 text-headline-xs text-ink">
                        {entry.name}
                      </h3>
                      <p className="text-label-md text-ink">
                        {formatNaira(entry.priceKobo)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
