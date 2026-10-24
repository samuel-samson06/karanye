import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductList from "@/components/shop/ProductList";
import {
  getCollectionProducts,
  getStorefrontCollection,
  storefrontCollections,
} from "@/lib/data/collections";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

// Deliberately blocking: a tiny fully-static page, so navigation should not
// try to stream an instant shell over it.
export const instant = false;

// TODO(content): replace title/naming scheme with approved catalogue copy.
export function generateStaticParams(): { slug: string }[] {
  return storefrontCollections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata(
  props: CollectionPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const collection = getStorefrontCollection(slug);
  if (!collection) return { title: "Collection — Karanyé" };
  return { title: `${collection.name} — Karanyé`, description: collection.description };
}

// Collection detail: editorial header + the products grouped under it,
// rendered with the shared ProductCard. Dummy data until Phase 3.
export default async function CollectionPage(props: CollectionPageProps) {
  const { slug } = await props.params;
  const collection = getStorefrontCollection(slug);
  if (!collection) notFound();

  const products = getCollectionProducts(slug);

  return (
    <main className="bg-canvas">
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20 lg:px-16">
        <nav aria-label="Breadcrumb">
          <Link href="/shop" className="editorial-link text-label-md text-crimson">
            Shop
          </Link>
        </nav>
        <h1 className="mt-5 text-display-lg text-ink">{collection.name}</h1>
        {/* TODO(content): replace with approved copy. */}
        <p className="mt-4 max-w-2xl text-body-md text-muted">
          {collection.description}
        </p>

        <div className="mt-10 border-t border-platinum pt-10 pb-14 md:pt-14 md:pb-20">
          {products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <div className="border border-platinum bg-linen px-6 py-14 text-center">
              <h2 className="text-headline-sm text-ink">Coming soon</h2>
              {/* TODO(content): replace with approved empty-state copy. */}
              <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
                No designs in this collection yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
