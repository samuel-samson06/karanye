import type { Metadata } from "next";
import SizeChartCard from "@/components/size-fit/SizeChartCard";
import { sizeChartOrder } from "@/lib/data/size-chart";

export const metadata: Metadata = {
  title: "Size & Fit — Karanyé",
  // TODO(content): replace with approved page description.
  description: "Karanyé's standard size chart and fit guidance.",
};

// Size & Fit, starting with the standard size chart. The remaining guidance
// sections (fit descriptions, how to measure, between-sizes help) are
// Phase 4 content work.
export default function SizeFitPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20 lg:px-16 lg:py-24">
      <p className="text-label-md text-muted">Fit</p>
      <h1 className="mt-3 text-display-lg text-ink">Size &amp; Fit</h1>
      {/* TODO(content): replace with approved intro copy. */}
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Every Karanyé size reflects our own body measurement standards, in UK
        sizes, cut and confirmed in our atelier.
      </p>

      <section aria-label="The Karanyé size chart" className="mt-14 md:mt-20">
        {/* TODO(content): replace with approved chart intro copy. */}
        <h2 className="border-b border-platinum pb-6 text-headline-md text-ink">
          The Karanyé Size Chart
        </h2>
        {/* TODO(content): replace with approved measuring-instructions copy. */}
        <p className="mt-6 max-w-2xl text-body-md text-muted">
          Measure your body, then choose the size whose chart values your
          measurements sit within. If your measurements fall between two
          sizes, choose the larger size.
        </p>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-8 md:gap-10">
          {sizeChartOrder.map((size) => (
            <SizeChartCard key={size} size={size} />
          ))}
        </div>
      </section>
    </main>
  );
}
