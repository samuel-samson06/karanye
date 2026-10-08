import Link from "next/link";
import { guaranteeCopy } from "@/lib/data/shop";

// Atelier commitment band: guarantee statement with a secondary entry point.
// Static placeholder — copy is TODO(content).
export default function Guarantee() {
  return (
    <section
      aria-label="Made to measure guarantee"
      className="border-y border-platinum bg-linen"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div className="max-w-2xl">
          <p className="text-label-md text-muted">{guaranteeCopy.eyebrow}</p>
          <h2 className="mt-3 text-headline-md text-ink">{guaranteeCopy.title}</h2>
          <p className="mt-3 text-body-md text-muted">{guaranteeCopy.body}</p>
        </div>
        <Link
          href={guaranteeCopy.ctaHref}
          className="inline-flex h-[52px] min-h-11 shrink-0 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
        >
          {guaranteeCopy.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
