// Subscribers skeleton — newsletter audience. Kept isolated in this file
// so the section is easy to revise or remove later.
export default function AdminSubscribersPage() {
  return (
    <main>
      <p className="text-label-md text-muted">Audience</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Subscribers
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Private List members who joined through the storefront newsletter.
      </p>

      <div className="mt-8 flex flex-col gap-3 border border-platinum bg-canvas p-4 sm:flex-row">
        <label htmlFor="subscribers-search" className="sr-only">
          Search subscribers
        </label>
        <input
          id="subscribers-search"
          type="search"
          placeholder="Search email or name…"
          disabled
          className="h-12 min-h-11 flex-1 border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted disabled:opacity-60"
        />
        <button
          type="button"
          disabled
          title="Available in a later milestone"
          className="inline-flex h-12 min-h-11 items-center justify-center border border-ink px-6 text-label-md text-ink disabled:opacity-60"
        >
          Export CSV
        </button>
      </div>

      <div className="mt-6 border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No subscribers yet</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Newsletter signups will appear here with name and email once the
          subscription handler is connected.
        </p>
      </div>
    </main>
  );
}
