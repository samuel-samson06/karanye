import Link from "next/link";

// Placeholder — full design detail page arrives with the Phase 2 catalogue.
// TODO(content): replace with product imagery, details, and purchase options.
export default function ProductDetailPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
      <p className="text-label-md text-muted">Design detail</p>
      <h1 className="mt-3 text-display-lg text-ink">
        Design
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        TODO(content): product detail page
      </p>
      <Link
        href="/shop"
        className="editorial-link mt-8 inline-block text-label-md text-crimson"
      >
        Back to Shop
      </Link>
    </main>
  );
}
