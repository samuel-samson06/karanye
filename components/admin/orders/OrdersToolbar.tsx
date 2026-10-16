import type { MockOrderStatus } from "@/lib/admin/data";

export interface OrdersFilter {
  query: string;
  status: MockOrderStatus | "all";
}

interface OrdersToolbarProps {
  value: OrdersFilter;
  total: number;
  shown: number;
  onChange: (next: OrdersFilter) => void;
  onReset: () => void;
}

const statuses: (MockOrderStatus | "all")[] = [
  "all",
  "pending_payment",
  "awaiting_fulfilment",
  "in_production",
  "ready",
  "shipped",
  "delivered",
  "requires_attention",
  "cancelled",
];

function statusLabel(status: (typeof statuses)[number]): string {
  if (status === "all") return "All statuses";
  return status
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// Search + status filter for the order set. Controlled: state lives above.
export default function OrdersToolbar({
  value,
  total,
  shown,
  onChange,
  onReset,
}: OrdersToolbarProps) {
  const set = (patch: Partial<OrdersFilter>): void =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="orders-search" className="text-label-md text-muted">
            Search
          </label>
          <input
            id="orders-search"
            type="search"
            value={value.query}
            onChange={(event) => set({ query: event.target.value })}
            placeholder="Reference, name, or email…"
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="orders-status" className="text-label-md text-muted">
            Status
          </label>
          <select
            id="orders-status"
            value={value.status}
            onChange={(event) =>
              set({ status: event.target.value as OrdersFilter["status"] })
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
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-label-md text-muted">
          Showing {shown} of {total} orders
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
