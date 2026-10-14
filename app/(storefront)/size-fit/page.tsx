import Link from "next/link";

// Placeholder — full Size & Fit guidance arrives with Phase 4 content pages.
// TODO(content): replace with approved size chart data and measuring guidance.
export default function SizeFitPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
      <p className="text-label-md text-muted">Fit</p>
      <h1 className="mt-3 text-display-lg text-ink">
        Size &amp; Fit
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        TODO(content): Size &amp; Fit page
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
