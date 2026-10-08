import Link from "next/link";

// Placeholder — full shop page arrives with Phase 5 (shop and checkout).
// TODO(content): replace with shop page UI reading localStorage.
export default function BagPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 md:px-8 lg:px-16 lg:py-24">
      <p className="text-label-md text-muted">Shopping Shop</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Shop
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        TODO(content): Shop page
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
