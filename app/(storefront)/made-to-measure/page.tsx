import Link from "next/link";

// Placeholder — full Made to Measure explainer arrives with Phase 4 content pages.
// TODO(content): replace with approved four-step MTM copy.
export default function MadeToMeasurePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
      <p className="text-label-md text-muted">Atelier service</p>
      <h1 className="mt-3 text-display-lg text-ink">
        Made to Measure
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        TODO(content): Made to Measure page
      </p>
      <Link
        href="/"
        className="editorial-link mt-8 inline-block text-label-md text-crimson"
      >
        Back to Home
      </Link>
    </main>
  );
}
