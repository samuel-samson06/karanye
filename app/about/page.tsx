import Link from "next/link";

// Placeholder — full About storytelling arrives with Phase 4 content pages.
// TODO(content): replace with approved About copy and imagery.
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 md:px-8 lg:px-16 lg:py-24">
      <p className="text-label-md text-muted">House</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        About
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        TODO(content): About page
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
