import { mockAdminCollections, type MockAdminProductStatus } from "@/lib/admin/products";

export interface ProductsFilter {
  query: string;
  status: MockAdminProductStatus | "all";
  collectionId: string;
}

interface ProductsToolbarProps {
  value: ProductsFilter;
  total: number;
  shown: number;
  onChange: (next: ProductsFilter) => void;
  onReset: () => void;
}

const statuses: (MockAdminProductStatus | "all")[] = [
  "all",
  "draft",
  "made_to_order",
  "limited",
  "sold_out",
  "archived",
];

function statusLabel(status: (typeof statuses)[number]): string {
  if (status === "all") return "All statuses";
  return status
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// Search + filters for the product set. Controlled: state lives in Products.
export default function ProductsToolbar({
  value,
  total,
  shown,
  onChange,
  onReset,
}: ProductsToolbarProps) {
  const set = (patch: Partial<ProductsFilter>): void =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="products-search" className="text-label-md text-muted">
            Search
          </label>
          <input
            id="products-search"
            type="search"
            value={value.query}
            onChange={(event) => set({ query: event.target.value })}
            placeholder="Name or slug…"
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="products-status" className="text-label-md text-muted">
            Status
          </label>
          <select
            id="products-status"
            value={value.status}
            onChange={(event) =>
              set({ status: event.target.value as ProductsFilter["status"] })
            }
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink focus:border-crimson focus:outline-none"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="products-collection"
            className="text-label-md text-muted"
          >
            Collection
          </label>
          <select
            id="products-collection"
            value={value.collectionId}
            onChange={(event) => set({ collectionId: event.target.value })}
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink focus:border-crimson focus:outline-none"
          >
            <option value="all">All collections</option>
            {mockAdminCollections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-label-md text-muted">
          Showing {shown} of {total} pieces
        </p>
        <button
          type="button"
          onClick={onReset}
          className="editorial-link min-h-11 text-label-md text-crimson"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}
