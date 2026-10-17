export type CustomerOrderFilter = "all" | "repeat" | "single" | "none";

export interface CustomersFilter {
  query: string;
  orders: CustomerOrderFilter;
}

interface CustomersToolbarProps {
  value: CustomersFilter;
  total: number;
  shown: number;
  onChange: (next: CustomersFilter) => void;
  onReset: () => void;
}

const orderOptions: { value: CustomerOrderFilter; label: string }[] = [
  { value: "all", label: "All customers" },
  { value: "repeat", label: "Repeat (2+ orders)" },
  { value: "single", label: "Single order" },
  { value: "none", label: "No orders" },
];

// Search + order-count filter for the customer set. Controlled: state lives
// above, mirroring OrdersToolbar.
export default function CustomersToolbar({
  value,
  total,
  shown,
  onChange,
  onReset,
}: CustomersToolbarProps) {
  const set = (patch: Partial<CustomersFilter>): void =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="customers-search" className="text-label-md text-muted">
            Search
          </label>
          <input
            id="customers-search"
            type="search"
            value={value.query}
            onChange={(event) => set({ query: event.target.value })}
            placeholder="Name, email, or phone…"
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="customers-orders" className="text-label-md text-muted">
            Orders
          </label>
          <select
            id="customers-orders"
            value={value.orders}
            onChange={(event) =>
              set({ orders: event.target.value as CustomersFilter["orders"] })
            }
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink focus:border-crimson focus:outline-none"
          >
            {orderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-label-md text-muted">
          Showing {shown} of {total} customers
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
