import Link from "next/link";

const patronCards = [
  {
    title: "12-Point Anatomical Proportion",
    body: "Twelve measurements map your posture and proportion before a single line is drafted — the foundation every commission shares.",
  },
  {
    title: "Muslin Toile Fitting",
    body: "A rough toile proves the architecture on your body first. What survives the toile earns its place in the final cloth.",
  },
  {
    title: "Archival Pattern Registry",
    body: "Your approved pattern is kept on record, so reorders and sister pieces begin where your last commission ended.",
  },
];

const studios = [
  {
    name: "Lagos Creative Studio & Archive",
    // TODO(content): replace with real studio details
    body: "TODO(content): Lagos studio details",
  },
  {
    name: "Mayfair Fitting Suite",
    // TODO(content): replace with real studio details
    body: "TODO(content): Mayfair suite details",
  },
];

// Engagement act: patron cards, studio cards, and the closing call to the
// collection. Copy is screenshot placeholder.
// TODO(content): replace with approved About copy and studio details.
export default function Visit() {
  return (
    <section aria-label="Engage the atelier" className="bg-linen">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
        <p className="text-label-md text-muted">Commissioning</p>
        <h2 className="mt-3 text-display-lg text-ink">
          The Patron &amp; The Atelier
        </h2>
        <ul className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {patronCards.map((card) => (
            <li key={card.title} className="border border-platinum bg-canvas p-6 lg:p-8">
              <h3 className="text-headline-sm text-ink">{card.title}</h3>
              <p className="mt-3 text-body-md text-muted">{card.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-label-md text-muted lg:mt-16">Studios</p>
        <h2 className="mt-3 text-display-lg text-ink">
          Two Cities, One Architectural Vision
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {studios.map((studio) => (
            <li key={studio.name} className="border border-platinum bg-canvas p-6 md:p-8 lg:p-10">
              <h3 className="text-headline-md text-ink">{studio.name}</h3>
              <p className="mt-3 text-body-md text-muted">{studio.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 border-t border-hairline pt-12 text-center lg:mt-16">
          <h2 className="mx-auto max-w-xl text-display-lg text-ink">
            Experience the Silhouettes Firsthand
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex h-13 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
            >
              Discover the Collection
            </Link>
            <Link
              href="/made-to-measure"
              className="inline-flex h-13 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              Discover Made to Measure
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
