// Complaints list skeleton — customer issues with optional order links.
// Triage workflow arrives with the order-management milestone.
export default function AdminComplaintsPage() {
  return (
    <main>
      <p className="text-label-md text-muted">Client Care</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Complaints
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Issue reports from customers, optionally linked to their order.
      </p>

      <div className="mt-8 flex flex-col gap-3 border border-platinum bg-canvas p-4 sm:flex-row">
        <label htmlFor="complaints-search" className="sr-only">
          Search complaints
        </label>
        <input
          id="complaints-search"
          type="search"
          placeholder="Search name, email, or subject…"
          disabled
          className="h-12 min-h-11 flex-1 border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted disabled:opacity-60"
        />
        <label htmlFor="complaints-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="complaints-status"
          disabled
          defaultValue="all"
          className="h-12 min-h-11 border border-hairline bg-canvas px-3 text-body-sm text-ink disabled:opacity-60"
        >
          <option value="all">All statuses</option>
        </select>
      </div>

      <div className="mt-6 border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No complaints</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Reports will appear here with subject and triage status once the
          contact workflow is connected.
        </p>
      </div>
    </main>
  );
}
