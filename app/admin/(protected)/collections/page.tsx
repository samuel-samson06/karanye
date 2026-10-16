import Link from "next/link";
import CollectionsTable from "@/components/admin/collections/CollectionsTable";
import { getMockCollectionsSorted } from "@/lib/admin/collections-mock";

// Collections list: mock catalogue sorted by sort_order. Creation lives at
// /admin/collections/new; editing arrives with collection management.
export default function AdminCollectionsPage() {
  const collections = getMockCollectionsSorted();

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label-md text-muted">Catalogue</p>
          <h1
            className="mt-3 text-display-lg text-ink"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            Collections
          </h1>
          <p className="mt-4 max-w-xl text-body-md text-muted">
            Group pieces under merchandising collections with their own slugs
            and cover images.
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex h-[52px] min-h-11 items-center gap-3 bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1" />
          </svg>
          New Collection
        </Link>
      </div>

      <p className="mt-8 border border-platinum bg-linen px-4 py-3 text-label-md text-muted">
        Prototype — fictional demonstration data, not the live catalogue.
      </p>

      <div className="mt-6">
        <CollectionsTable collections={collections} />
      </div>
    </main>
  );
}
