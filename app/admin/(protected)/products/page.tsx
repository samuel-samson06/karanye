import Link from "next/link";

// Products list skeleton — full CRUD in the next milestone.
export default function AdminProductsPage() {
  return (
    <main>
      <p className="text-label-md text-muted">Catalogue</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Products
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        TODO(admin): product list, search, and filtering.
      </p>
      <Link
        href="/admin/products/new"
        className="mt-8 inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
      >
        New Product
      </Link>
    </main>
  );
}
