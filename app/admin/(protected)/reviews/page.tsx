// Provisional Reviews section — NO reviews table exists in the schema, and
// none is invented here. This page is a clearly labelled placeholder kept
// isolated in this file so it can be revised or removed in one delete.
// Reviews remain out of launch scope (spec §18) pending an explicit decision.
export default function AdminReviewsPage() {
  return (
    <main>
      <p className="text-label-md text-muted">Provisional</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Reviews
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Product reviews are not part of the launch scope. This section is
        reserved pending an explicit decision — no data model exists yet.
      </p>

      <div className="mt-6 border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">Not in scope</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          If reviews are approved later, this page will host the moderation
          queue. Until then, there is nothing to show and nothing stored.
        </p>
      </div>
    </main>
  );
}
