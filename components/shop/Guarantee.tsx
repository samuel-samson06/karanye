// TODO(content): replace with approved atelier commitment copy.
const eyebrow = "The atelier commitment";
const title = "The Karanyé Made-to-Measure Guarantee";
const body =
  "Every garment is patterned specifically to your anatomical proportions or tailored to standard UK sizes with complimentary hem adjustment and artisanal fitting consultations.";

// Atelier commitment band: guarantee statement with a secondary entry point.
export default function Guarantee() {
  return (
    <section
      aria-label="Made to measure guarantee"
      className="border-y border-platinum bg-linen"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div className="max-w-2xl">
          <p className="text-label-md text-muted">{eyebrow}</p>
          <h2 className="mt-3 text-headline-md text-ink">{title}</h2>
          <p className="mt-3 text-body-md text-muted">{body}</p>
        </div>
        {/* CTA retired with the Made to Measure page; atelier enquiries flow
            through Contact. */}
      </div>
    </section>
  );
}
