import Image from "next/image";
import {
  sizeChart,
  sizeChartNoteHeading,
  sizeChartNotes,
  sizeChartTagline,
  sizeMeasurementKeys,
} from "@/lib/data/size-chart";

interface SizeChartCardProps {
  size: number;
}

// Standard-size chart card, following the supplied reference design: wordmark,
// size heading, hairline measurement rows, "Please note" rulings, tagline, and
// a full-height fabric image panel. Wordmark is typed in Bodoni until the
// real wordmark asset is delivered.
// TODO(content): replace the placeholder image with approved fabric photography.
const cardImage = {
  src: "/images/style_05.jpeg",
  alt: "Placeholder fabric photography for the Karanyé size chart",
};

export default function SizeChartCard({ size }: SizeChartCardProps) {
  const row = sizeChart[size];
  if (!row) return null;

  return (
    <article
      id={`size-${size}`}
      className="grid shrink-0 grid-cols-1 overflow-hidden border border-platinum bg-canvas md:grid-cols-2"
    >
      <div className="flex flex-col px-6 py-10 md:px-10 md:py-12">
        <h3 className="text-headline-lg uppercase text-crimson">Karanyé</h3>
        <p className="mt-2 text-label-sm uppercase text-crimson">
          {sizeChartTagline}
        </p>

        <div aria-hidden="true" className="mt-6 h-px w-full bg-crimson/60" />
        <h4 className="mt-6 text-display-lg text-crimson">Size {size}</h4>
        <span aria-hidden="true" className="mt-2 block h-0.5 w-14 bg-crimson" />

        <dl className="mt-8">
          {sizeMeasurementKeys.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-b-0"
            >
              <dt className="text-body-md text-ink">{label}</dt>
              <dd className="text-right text-body-md text-ink">{row[key]}</dd>
            </div>
          ))}
        </dl>

        <div aria-hidden="true" className="mt-8 h-0.5 w-14 bg-crimson" />
        <p className="mt-6 text-label-md uppercase text-crimson">
          {sizeChartNoteHeading}
        </p>
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-4 marker:text-ink">
          {sizeChartNotes.map((note) => (
            <li key={note} className="text-body-sm text-ink">
              {note}
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="mt-8 h-0.5 w-14 bg-crimson" />
        <p className="mt-4 text-label-md uppercase text-crimson">
          {sizeChartTagline}
        </p>
      </div>

      <div className="relative h-64 border-t border-hairline md:h-auto md:border-t-0 md:border-l md:border-hairline">
        <Image
          src={cardImage.src}
          alt={cardImage.alt}
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    </article>
  );
}
