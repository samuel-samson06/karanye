"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  shopCategories,
  shopPalettes,
  shopSizes,
  shopSorts,
  shopStatuses,
  shopValuations,
  shopCopy,
  type ShopCategory,
  type ShopStatus,
} from "@/lib/data/shop";

export interface ShopFilterState {
  category: ShopCategory | "all";
  size: string;
  palette: string;
  status: ShopStatus | "all";
  valuation: string;
  query: string;
  sort: string;
}

export const DEFAULT_FILTERS: ShopFilterState = {
  category: "all",
  size: "all",
  palette: "all",
  status: "all",
  valuation: "all",
  query: "",
  sort: "featured",
};

interface FilterProps {
  value: ShopFilterState;
  counts: Record<string, number>;
  total: number;
  onChange: (next: ShopFilterState) => void;
  onReset: () => void;
}

const selectClass =
  "h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink focus:border-crimson focus:outline-none";

// Category tabs, dropdowns, search, sort, and active chips. On mobile the
// controls live in a bottom drawer (§9); on desktop they render inline.
// Filter state itself lives in the page — this component only edits it.
export default function Filter({ value, counts, total, onChange, onReset }: FilterProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const panelId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const set = (patch: Partial<ShopFilterState>): void =>
    onChange({ ...value, ...patch });

  useEffect(() => {
    if (!drawerOpen) return;
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  const chips: { label: string; clear: () => void }[] = [];
  if (value.category !== "all")
    chips.push({
      label: shopCategories.find((c) => c.value === value.category)?.label ?? value.category,
      clear: () => set({ category: "all" }),
    });
  if (value.size !== "all")
    chips.push({ label: `Size ${value.size}`, clear: () => set({ size: "all" }) });
  if (value.palette !== "all")
    chips.push({ label: value.palette, clear: () => set({ palette: "all" }) });
  if (value.status !== "all")
    chips.push({
      label: shopStatuses.find((s) => s.value === value.status)?.label ?? value.status,
      clear: () => set({ status: "all" }),
    });
  if (value.valuation !== "all")
    chips.push({
      label: shopValuations.find((v) => v.value === value.valuation)?.label ?? value.valuation,
      clear: () => set({ valuation: "all" }),
    });
  if (value.query.trim() !== "")
    chips.push({ label: `“${value.query.trim()}”`, clear: () => set({ query: "" }) });

  const controls = (
    <div className="flex flex-col gap-6">
      <div role="group" aria-label="Categories" className="flex flex-wrap gap-2">
        {shopCategories.map((category) => {
          const selected = value.category === category.value;
          const count =
            category.value === "all" ? total : (counts[category.value] ?? 0);
          return (
            <button
              key={category.value}
              type="button"
              onClick={() => set({ category: category.value })}
              aria-pressed={selected}
              className={
                selected
                  ? "min-h-11 border border-ink bg-ink px-4 py-2 text-label-md text-canvas"
                  : "min-h-11 border border-platinum bg-canvas px-4 py-2 text-label-md text-ink transition-colors hover:border-ink"
              }
            >
              {category.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="filter-size" className="text-label-md text-muted">
            Size
          </label>
          <select
            id="filter-size"
            value={value.size}
            onChange={(event) => set({ size: event.target.value })}
            className={selectClass}
          >
            <option value="all">All sizes</option>
            {shopSizes.map((size) => (
              <option key={size} value={size}>
                Size {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filter-palette" className="text-label-md text-muted">
            Palette
          </label>
          <select
            id="filter-palette"
            value={value.palette}
            onChange={(event) => set({ palette: event.target.value })}
            className={selectClass}
          >
            <option value="all">Tone &amp; silk</option>
            {shopPalettes.map((palette) => (
              <option key={palette} value={palette}>
                {palette}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filter-status" className="text-label-md text-muted">
            Status
          </label>
          <select
            id="filter-status"
            value={value.status}
            onChange={(event) =>
              set({ status: event.target.value as ShopFilterState["status"] })
            }
            className={selectClass}
          >
            {shopStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filter-valuation" className="text-label-md text-muted">
            Valuation
          </label>
          <select
            id="filter-valuation"
            value={value.valuation}
            onChange={(event) => set({ valuation: event.target.value })}
            className={selectClass}
          >
            {shopValuations.map((valuation) => (
              <option key={valuation.value} value={valuation.value}>
                {valuation.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filter-search" className="text-label-md text-muted">
            Search
          </label>
          <input
            id="filter-search"
            type="search"
            value={value.query}
            onChange={(event) => set({ query: event.target.value })}
            placeholder={shopCopy.searchPlaceholder}
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="filter-sort" className="text-label-md text-muted">
            Sort
          </label>
          <select
            id="filter-sort"
            value={value.sort}
            onChange={(event) => set({ sort: event.target.value })}
            className={selectClass}
          >
            {shopSorts.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-label-md text-muted">Showing curated selection</p>
        <button
          type="button"
          onClick={onReset}
          className="editorial-link min-h-11 text-label-md text-crimson"
        >
          {shopCopy.resetLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="inline-flex h-13 w-full items-center justify-center border border-ink text-label-md text-ink lg:hidden"
      >
        Filters{chips.length > 0 ? ` (${chips.length})` : ""}
      </button>

      <div className="hidden lg:block">{controls}</div>

      {chips.length > 0 && (
        <ul aria-label="Active filters" className="mt-6 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip.label}>
              <button
                type="button"
                onClick={chip.clear}
                aria-label={`Remove filter ${chip.label}`}
                className="flex min-h-11 items-center gap-2 border border-platinum bg-linen px-3 py-2 text-label-md text-ink"
              >
                {chip.label}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[8px]"
          />
          <div
            id={panelId}
            className="absolute right-0 bottom-0 left-0 max-h-[90dvh] overflow-y-auto border-t border-platinum bg-canvas px-5 py-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-headline-sm text-ink">Filters</p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="flex min-h-11 min-w-11 items-center justify-center text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>
            </div>
            <div className="mt-6">{controls}</div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="mt-6 inline-flex h-13 w-full items-center justify-center bg-crimson text-label-md text-canvas"
            >
              View selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
