"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductsStats from "@/components/admin/products/ProductsStats";
import ProductsTable from "@/components/admin/products/ProductsTable";
import ProductsToolbar, {
  type ProductsFilter,
} from "@/components/admin/products/ProductsToolbar";
import { mockAdminProducts } from "@/lib/admin/products";

const PAGE_SIZE = 5;

const DEFAULT_FILTER: ProductsFilter = {
  query: "",
  status: "all",
  collectionId: "all",
};

// Products composition: header, Create Piece, stats, toolbar, table.
// Search/filter/pagination run client-side over mock records (clearly
// labelled prototype data) until Phase B connects live catalogue reads.
export default function Products() {
  const [filter, setFilter] = useState<ProductsFilter>(DEFAULT_FILTER);
  const [page, setPage] = useState(0);

  const applyFilter = (next: ProductsFilter): void => {
    setFilter(next);
    setPage(0);
  };

  const filtered = useMemo(() => {
    const query = filter.query.trim().toLowerCase();
    return mockAdminProducts.filter((product) => {
      if (filter.status !== "all" && product.status !== filter.status)
        return false;
      if (
        filter.collectionId !== "all" &&
        product.collectionId !== filter.collectionId
      )
        return false;
      if (
        query !== "" &&
        !`${product.name} ${product.slug}`.toLowerCase().includes(query)
      )
        return false;
      return true;
    });
  }, [filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <main>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label-md text-muted">Catalogue</p>
          <h1
            className="mt-3 text-display-lg text-ink"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            Products
          </h1>
          <p className="mt-4 max-w-xl text-body-md text-muted">
            Manage your pieces, catalogue details, pricing, and inventory.
          </p>
        </div>
        <Link
          href="/admin/products/new"
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
          Create Piece
        </Link>
      </div>

      <p className="mt-8 border border-platinum bg-linen px-4 py-3 text-label-md text-muted">
        Prototype — fictional demonstration data, not live inventory.
      </p>

      <div className="mt-6">
        <ProductsStats />
      </div>

      <div className="mt-8">
        <ProductsToolbar
          value={filter}
          total={mockAdminProducts.length}
          shown={filtered.length}
          onChange={applyFilter}
          onReset={() => applyFilter(DEFAULT_FILTER)}
        />
      </div>

      <div className="mt-6">
        <ProductsTable products={visible} />
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-label-md text-muted">
            Page {page + 1} of {pageCount}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((current) => current - 1)}
              className="inline-flex h-12 min-h-11 items-center border border-ink px-6 text-label-md text-ink disabled:opacity-60"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page + 1 >= pageCount}
              onClick={() => setPage((current) => current + 1)}
              className="inline-flex h-12 min-h-11 items-center border border-ink px-6 text-label-md text-ink disabled:opacity-60"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
