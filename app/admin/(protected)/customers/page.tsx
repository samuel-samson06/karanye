// Customers list skeleton — guest identities linked by email. Read-only
// directory; no customer mutations are planned.
export default function AdminCustomersPage() {
  return (
    <main>
      <p className="text-label-md text-muted">Commerce</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Customers
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Guest identities, one per email address, with their order history.
      </p>

      <div className="mt-8 flex flex-col gap-3 border border-platinum bg-canvas p-4 sm:flex-row">
        <label htmlFor="customers-search" className="sr-only">
          Search customers
        </label>
        <input
          id="customers-search"
          type="search"
          placeholder="Search email or name…"
          disabled
          className="h-12 min-h-11 flex-1 border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted disabled:opacity-60"
        />
      </div>

      <div className="mt-6 border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No customers yet</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Customer records are created automatically with their first order.
        </p>
      </div>
    </main>
  );
}
