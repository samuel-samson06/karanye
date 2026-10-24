import Link from "next/link";

// TODO(content): replace with approved Standard / MTM copy.
const eyebrow = "Two ways to buy";
const title = "Two Pathways to Your Silhouette";
const body =
  "Choose the fit that suits you. Both are made to order — the difference is whose measurements we cut from.";

const standard = {
  title: "Standard Size",
  body: "Cut to Karanyé's body measurement chart. The fastest route to your piece.",
  points: ["Sizes 6–18", "Chart-guided fit", "5–7 day processing"],
  ctaLabel: "Discover the chart",
  ctaHref: "/size-fit",
};

const mtm = {
  title: "Made to Measure",
  body: "Cut to your own measurements, submitted at purchase and kept with your order.",
  points: ["Your measurements", "Atelier review", "Personal fit"],
};

// Two Pathways to Your Silhouette: Standard Size vs Made to Measure.
// Introductory only — no forms here (§9).
export default function Services() {
  return (
    <section aria-label="Ways to buy" className="border-t border-platinum bg-canvas">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
        <p className="text-label-md text-muted">{eyebrow}</p>
        <h2 className="mt-3 max-w-xl text-display-lg text-ink">
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-body-md text-muted">
          {body}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:gap-8">
          <article className="flex flex-col border border-platinum bg-linen p-8 lg:p-10">
            <p className="text-label-md text-muted">01 — Standard</p>
            <h3 className="mt-3 text-headline-md text-ink">
              {standard.title}
            </h3>
            <p className="mt-4 text-body-md text-muted">
              {standard.body}
            </p>
            <ul className="mt-6 mb-8 flex flex-col gap-3">
              {standard.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-body-sm text-ink">
                  <span aria-hidden="true" className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-crimson" />
                  {point}
                </li>
              ))}
            </ul>
            {/* mt-auto keeps both CTAs on one baseline when cards sit side by side. */}
            <Link
              href={standard.ctaHref}
              className="mt-auto inline-flex h-13 items-center justify-center border border-ink text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              {standard.ctaLabel}
            </Link>
          </article>

          <article className="flex flex-col bg-crimson p-8 lg:p-10">
            <p className="text-label-md text-canvas/70">02 — Atelier</p>
            <h3 className="mt-3 text-headline-md text-canvas">
              {mtm.title}
            </h3>
            <p className="mt-4 text-body-md text-canvas/85">
              {mtm.body}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {mtm.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-body-sm text-canvas">
                  <span aria-hidden="true" className="mt-2 inline-block h-1.5 w-1.5 shrink-0 bg-canvas" />
                  {point}
                </li>
              ))}
            </ul>
            {/* Informational card: MTM enquiries flow through Contact since
                the dedicated Made to Measure page was retired. */}
            <p className="editorial-link text-label-md text-canvas/85">
              Enquire via Contact —
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
