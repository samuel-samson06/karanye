import Link from "next/link";
import { sizingHelpCopy } from "@/lib/data/shop";

// Sizing guidance band: entry points to the size guide and the atelier.
// Static placeholder — copy is TODO(content).
export default function SizingHelp() {
  return (
    <section aria-label="Sizing guidance" className="bg-canvas">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:px-8 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div className="max-w-2xl">
          <p className="text-label-md text-muted">{sizingHelpCopy.eyebrow}</p>
          <h2 className="mt-3 text-headline-md text-ink">{sizingHelpCopy.title}</h2>
          <p className="mt-3 text-body-md text-muted">{sizingHelpCopy.body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link
            href={sizingHelpCopy.sizingCtaHref}
            className="inline-flex h-13 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            {sizingHelpCopy.sizingCtaLabel}
          </Link>
          <Link
            href={sizingHelpCopy.atelierCtaHref}
            className="inline-flex h-13 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
          >
            {sizingHelpCopy.atelierCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
