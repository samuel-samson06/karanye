import Link from "next/link";
import { pathwaysCopy } from "@/lib/data/home";

// Two Pathways to Your Silhouette: Standard Size vs Made to Measure.
// Introductory only — no forms here (§9).
export default function Services() {
  return (
    <section aria-label="Ways to buy" className="border-t border-platinum bg-canvas">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
        <p className="text-label-md text-muted">{pathwaysCopy.eyebrow}</p>
        <h2 className="mt-3 max-w-xl text-display-lg text-ink">
          {pathwaysCopy.title}
        </h2>
        <p className="mt-4 max-w-xl text-body-md text-muted">
          {pathwaysCopy.body}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
          <article className="flex flex-col border border-platinum bg-linen p-8 lg:p-10">
            <p className="text-label-md text-muted">01 — Standard</p>
            <h3 className="mt-3 text-headline-md text-ink">
              {pathwaysCopy.standard.title}
            </h3>
            <p className="mt-4 text-body-md text-muted">
              {pathwaysCopy.standard.body}
            </p>
            <ul className="mt-6 mb-8 flex flex-col gap-3">
              {pathwaysCopy.standard.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-body-sm text-ink">
                  <span aria-hidden="true" className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-crimson" />
                  {point}
                </li>
              ))}
            </ul>
            {/* mt-auto keeps both CTAs on one baseline when cards sit side by side. */}
            <Link
              href={pathwaysCopy.standard.ctaHref}
              className="mt-auto inline-flex h-13 items-center justify-center border border-ink text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              {pathwaysCopy.standard.ctaLabel}
            </Link>
          </article>

          <article className="flex flex-col bg-crimson p-8 lg:p-10">
            <p className="text-label-md text-canvas/70">02 — Atelier</p>
            <h3 className="mt-3 text-headline-md text-canvas">
              {pathwaysCopy.mtm.title}
            </h3>
            <p className="mt-4 text-body-md text-canvas/85">
              {pathwaysCopy.mtm.body}
            </p>
            <ul className="mt-6 mb-8 flex flex-col gap-3">
              {pathwaysCopy.mtm.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-body-sm text-canvas">
                  <span aria-hidden="true" className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-canvas" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={pathwaysCopy.mtm.ctaHref}
              className="mt-auto inline-flex h-13 items-center justify-center bg-canvas text-label-md text-crimson transition-colors hover:bg-linen"
            >
              {pathwaysCopy.mtm.ctaLabel}
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
