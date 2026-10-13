import Link from "next/link";

// TODO(content): replace with approved sizing guidance copy.
const eyebrow = "Client services";
const title = "Need Guidance on Sizing or Custom Proportions?";
const body =
  "Our specialists are available via direct appointments or private sessions to capture your personal dimensions.";
const sizingCtaLabel = "Explore sizing guide";
const sizingCtaHref = "/size-fit";
const atelierCtaLabel = "Book atelier session";
const atelierCtaHref = "/contact";

// Sizing guidance band: entry points to the size guide and the atelier.
export default function SizingHelp() {
  return (
    <section aria-label="Sizing guidance" className="bg-canvas">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div className="max-w-2xl">
          <p className="text-label-md text-muted">{eyebrow}</p>
          <h2 className="mt-3 text-headline-md text-ink">{title}</h2>
          <p className="mt-3 text-body-md text-muted">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link
            href={sizingCtaHref}
            className="inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            {sizingCtaLabel}
          </Link>
          <Link
            href={atelierCtaHref}
            className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
          >
            {atelierCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
