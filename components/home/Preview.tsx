import Image from "next/image";
import { philosophyCopy } from "@/lib/data/home";

// Brand statement: fabric detail beside pull quote, with atelier stats.
// Stacks on mobile; 3/5 split on tablet; 5/7 split on desktop.
export default function Preview() {
  return (
    <section aria-label="Karanyé philosophy" className="bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-8 md:gap-6 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-8 lg:px-16 lg:py-24">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-platinum md:col-span-3 md:aspect-[3/4] lg:col-span-5">
          <Image
            src={philosophyCopy.detailImage}
            alt={philosophyCopy.detailAlt}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 36vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center md:col-span-5 md:pl-4 lg:col-span-7 lg:pl-8">
          <blockquote className="text-headline-lg text-ink">
            &ldquo;{philosophyCopy.quote}&rdquo;
          </blockquote>
          <p className="mt-6 max-w-xl text-body-md text-muted">
            {philosophyCopy.body}
          </p>
          <dl className="mt-10 grid grid-cols-3 border-t border-hairline pt-6">
            {philosophyCopy.stats.map((stat) => (
              // dt must precede dd in the DOM; flex-col-reverse puts the value on top.
              <div
                key={stat.label}
                className="flex flex-col-reverse justify-end border-l border-hairline pl-4 first:border-l-0 first:pl-0 md:pl-6"
              >
                <dt className="mt-2 text-label-md text-muted">{stat.label}</dt>
                <dd className="text-headline-sm text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
