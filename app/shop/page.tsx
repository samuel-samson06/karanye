"use client";

import { useMemo, useState } from "react";
import Filter, { DEFAULT_FILTERS, type ShopFilterState } from "@/components/shop/Filter";
import Guarantee from "@/components/shop/Guarantee";
import ProductList from "@/components/shop/ProductList";
import SizingHelp from "@/components/shop/SizingHelp";
import { shopCopy, shopProducts } from "@/lib/data/shop";

const PAGE_SIZE = 6;

// Shop composition: header, filters, head grid, guarantee band, tail grid,
// pagination, sizing band. Filtering is client-side over dummy data until
// Phase 2 moves it to URL search params + Postgres (§13).
export default function ShopPage() {
  const [filters, setFilters] = useState<ShopFilterState>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const applyFilters = (next: ShopFilterState): void => {
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilters = (): void => {
    setFilters(DEFAULT_FILTERS);
    setVisibleCount(PAGE_SIZE);
  };

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const product of shopProducts) {
      result[product.category] = (result[product.category] ?? 0) + 1;
    }
    return result;
  }, []);

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const list = shopProducts.filter((product) => {
      if (filters.category !== "all" && product.category !== filters.category)
        return false;
      if (filters.size !== "all" && !product.sizes.includes(filters.size))
        return false;
      if (filters.palette !== "all" && product.palette !== filters.palette)
        return false;
      if (filters.status !== "all" && product.status !== filters.status)
        return false;
      if (filters.valuation === "under-200" && product.priceKobo >= 20000000)
        return false;
      if (
        filters.valuation === "200-300" &&
        (product.priceKobo < 20000000 || product.priceKobo > 30000000)
      )
        return false;
      if (filters.valuation === "above-300" && product.priceKobo <= 30000000)
        return false;
      if (
        query !== "" &&
        !`${product.name} ${product.fabricLine}`.toLowerCase().includes(query)
      )
        return false;
      return true;
    });

    const rank: Record<string, number> = { made_to_order: 0, limited: 1, sold_out: 2 };
    switch (filters.sort) {
      case "newest":
        return [...list].sort((a, b) => b.addedIndex - a.addedIndex);
      case "price-asc":
        return [...list].sort((a, b) => a.priceKobo - b.priceKobo);
      case "price-desc":
        return [...list].sort((a, b) => b.priceKobo - a.priceKobo);
      case "availability":
        return [...list].sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3));
      default:
        return [...list].sort((a, b) => b.addedIndex - a.addedIndex);
    }
  }, [filters]);

  const head = filtered.slice(0, PAGE_SIZE);
  const tail = filtered.slice(PAGE_SIZE, visibleCount);
  const shown = head.length + tail.length;

  return (
    <main className="bg-canvas">
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 lg:px-16 lg:pt-20">
        <p className="text-label-md text-muted">{shopCopy.eyebrow}</p>
        <h1
          className="mt-3 text-display-lg text-ink"
          style={{ fontFamily: "var(--font-bodoni)" }}
        >
          {shopCopy.title}
        </h1>
        <p className="mt-4 max-w-2xl text-body-md text-muted">{shopCopy.body}</p>

        <div className="mt-10">
          <Filter
            value={filters}
            counts={counts}
            total={shopProducts.length}
            onChange={applyFilters}
            onReset={resetFilters}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="border border-platinum bg-linen px-6 py-14 text-center">
            <h2 className="text-headline-sm text-ink">{shopCopy.emptyTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
              {shopCopy.emptyBody}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              {shopCopy.resetLabel}
            </button>
          </div>
        ) : (
          <div className="mt-10">
            <ProductList products={head} />
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <>
          <div className="mt-14">
            <Guarantee />
          </div>

          {tail.length > 0 && (
            <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 lg:px-16">
              <ProductList products={tail} />
            </div>
          )}

          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-14 md:px-8 lg:px-16">
            <p className="text-label-md text-muted">
              {shopCopy.showingOf(shown, filtered.length)}
            </p>
            {visibleCount < filtered.length && (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
              >
                {shopCopy.loadMoreLabel}
              </button>
            )}
          </div>

          <SizingHelp />
        </>
      )}
    </main>
  );
}
