// Orders list skeleton — live reads, detail view, and fulfilment actions
// arrive with the order-management milestone. No sample rows: an empty
// table means no orders exist, not missing data.
export default function AdminOrdersPage() {
  return (
    <main>
      <p className="text-label-md text-muted">Commerce</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Orders
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Guest orders with purchase-time snapshots, from payment to delivery.
      </p>

      <div className="mt-8 flex flex-col gap-3 border border-platinum bg-canvas p-4 sm:flex-row">
        <label htmlFor="orders-search" className="sr-only">
          Search orders
        </label>
        <input
          id="orders-search"
          type="search"
          placeholder="Search reference or email…"
          disabled
          className="h-12 min-h-11 flex-1 border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted disabled:opacity-60"
        />
        <label htmlFor="orders-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="orders-status"
          disabled
          defaultValue="all"
          className="h-12 min-h-11 border border-hairline bg-canvas px-3 text-body-sm text-ink disabled:opacity-60"
        >
          <option value="all">All statuses</option>
        </select>
      </div>

      <div className="mt-6 border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No orders yet</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Orders will appear here with reference, customer, total, payment and
          fulfilment status once checkout is live.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-label-md text-muted">Showing 0 of 0 orders</p>
        <div className="flex gap-3">
          <button
            type="button"
            disabled
            className="inline-flex h-12 min-h-11 items-center border border-ink px-6 text-label-md text-ink disabled:opacity-60"
          >
            Previous
          </button>
          <button
            type="button"
            disabled
            className="inline-flex h-12 min-h-11 items-center border border-ink px-6 text-label-md text-ink disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
