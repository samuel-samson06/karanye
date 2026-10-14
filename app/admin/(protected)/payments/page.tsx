// Payments list skeleton — verified Paystack outcomes per order. Payment
// recording and reconciliation arrive with the Phase 5 milestone.
export default function AdminPaymentsPage() {
  return (
    <main>
      <p className="text-label-md text-muted">Commerce</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Payments
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Verified transaction outcomes, kept separate from order fulfilment.
      </p>

      <div className="mt-8 flex flex-col gap-3 border border-platinum bg-canvas p-4 sm:flex-row">
        <label htmlFor="payments-search" className="sr-only">
          Search payments
        </label>
        <input
          id="payments-search"
          type="search"
          placeholder="Search Paystack reference…"
          disabled
          className="h-12 min-h-11 flex-1 border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted disabled:opacity-60"
        />
        <label htmlFor="payments-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="payments-status"
          disabled
          defaultValue="all"
          className="h-12 min-h-11 border border-hairline bg-canvas px-3 text-body-sm text-ink disabled:opacity-60"
        >
          <option value="all">All statuses</option>
        </select>
      </div>

      <div className="mt-6 border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No payments yet</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Successful and failed charges will appear here with reference,
          amount, channel, and status once payments are live.
        </p>
      </div>
    </main>
  );
}
