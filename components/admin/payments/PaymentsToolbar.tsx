import type { MockPaymentStatus } from "@/lib/admin/data";

export interface PaymentsFilter {
  query: string;
  status: MockPaymentStatus | "all";
}

interface PaymentsToolbarProps {
  value: PaymentsFilter;
  total: number;
  shown: number;
  onChange: (next: PaymentsFilter) => void;
  onReset: () => void;
}

const statuses: (MockPaymentStatus | "all")[] = [
  "all",
  "pending",
  "success",
  "failed",
];

function statusLabel(status: (typeof statuses)[number]): string {
  if (status === "all") return "All statuses";
  return status[0].toUpperCase() + status.slice(1);
}

// Search + status filter for the payment set. Controlled: state lives above.
export default function PaymentsToolbar({
  value,
  total,
  shown,
  onChange,
  onReset,
}: PaymentsToolbarProps) {
  const set = (patch: Partial<PaymentsFilter>): void =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="payments-search" className="text-label-md text-muted">
            Search
          </label>
          <input
            id="payments-search"
            type="search"
            value={value.query}
            onChange={(event) => set({ query: event.target.value })}
            placeholder="Paystack reference or order…"
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="payments-status" className="text-label-md text-muted">
            Status
          </label>
          <select
            id="payments-status"
            value={value.status}
            onChange={(event) =>
              set({ status: event.target.value as PaymentsFilter["status"] })
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
          Showing {shown} of {total} payments
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
