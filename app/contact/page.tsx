import Link from "next/link";
import FormSection from "@/components/contact/FormSection";
import InfoSection from "@/components/contact/InfoSection";

// Contact composition: header, Info/Form grid, and the guidance strip inline
// (Option A — links only, no logic, so it stays in the page).
// Details + copy are screenshot placeholders, TODO(content) throughout.
export default function ContactPage() {
  return (
    <main className="bg-canvas">
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 lg:px-16 lg:pt-20">
        <p className="text-label-md text-muted">Client Care &amp; Salon Liaison — Vol. 05</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end">
          <h1
            className="text-display-xl text-ink lg:col-span-6"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            Contact
          </h1>
          <p className="max-w-xl text-body-md text-muted lg:col-span-6">
            We welcome direct inquiries regarding our made-to-order silhouettes,
            commission timelines, bespoke sizing calibration, or private
            appointments in our Lagos atelier and Mayfair salon.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <InfoSection />
          </div>
          <div className="lg:col-span-7">
            <FormSection />
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-platinum bg-linen">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 lg:px-16">
          <p className="text-center text-label-md text-muted">Accelerated inquiries</p>
          <h2
            className="mx-auto mt-3 max-w-2xl text-center text-display-lg text-ink"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            Seeking Immediate Fitting or Measurement Direction?
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="border border-platinum bg-canvas p-8">
              <p className="text-label-md text-muted">Protocol &amp; Measurements</p>
              <h3 className="mt-3 text-headline-md text-ink">Size &amp; Fit Guide</h3>
              <p className="mt-3 text-body-md text-muted">
                Explore our standard anatomical grids, drape archetypes, and
                measuring instructions to determine your standard sizing profile
                across garments.
              </p>
              <Link
                href="/size-fit"
                className="editorial-link mt-6 inline-block text-label-md text-ink"
              >
                View Sizing Guide →
              </Link>
            </div>
            <div className="border border-platinum bg-canvas p-8">
              <p className="text-label-md text-muted">Haute Couture Commission</p>
              <h3 className="mt-3 text-headline-md text-ink">Made to Measure</h3>
              <p className="mt-3 text-body-md text-muted">
                Discover our bespoke sequence and submit your anatomical profile
                directly to our Lagos master patternmakers for an exact
                individual commission.
              </p>
              <Link
                href="/made-to-measure"
                className="editorial-link mt-6 inline-block text-label-md text-ink"
              >
                Explore Made to Measure →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
