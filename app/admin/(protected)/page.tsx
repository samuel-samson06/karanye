import Link from "next/link";

// Admin overview skeleton. Detailed widgets and counts arrive with the
// catalogue CRUD milestone; this page proves the guard admits admins.
export default function AdminDashboardPage() {
  return (
    <main>
      <p className="text-label-md text-muted">Atelier Admin</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Dashboard
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Catalogue management lives here. Start with collections, then products.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/products"
          className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
        >
          Products
        </Link>
        <Link
          href="/admin/collections"
          className="inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
        >
          Collections
        </Link>
      </div>
    </main>
  );
}
