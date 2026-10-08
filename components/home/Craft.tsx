import Image from "next/image";
import Link from "next/link";
import { craftCopy } from "@/lib/data/home";

// Atelier craft editorial: asymmetric imagery with narrative beside it.
// Mobile stacks; tablet pairs the images above the text; desktop runs
// the large image down the left with detail image and text to its right.
export default function Craft() {
  return (
    <section aria-label="Inside the atelier" className="border-t border-platinum bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-8 md:gap-6 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-8 lg:px-16 lg:py-24">
        <div className="relative aspect-[4/5] w-full overflow-hidden border border-platinum md:col-span-5 lg:col-span-7 lg:row-span-2 lg:aspect-[3/4]">
          <Image
            src={craftCopy.imageA}
            alt={craftCopy.imageAAlt}
            fill
            sizes="(min-width: 1024px) 55vw, (min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-square w-full overflow-hidden border border-platinum md:col-span-3 md:self-end lg:col-span-5 lg:aspect-[4/3] lg:self-start">
          <Image
            src={craftCopy.imageB}
            alt={craftCopy.imageBAlt}
            fill
            sizes="(min-width: 1024px) 35vw, (min-width: 768px) 36vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="md:col-span-6 lg:col-span-5 lg:self-end">
          <p className="text-label-md text-muted">{craftCopy.eyebrow}</p>
          <h2 className="mt-3 text-headline-lg text-ink">{craftCopy.title}</h2>
          <p className="mt-4 max-w-xl text-body-md text-muted">{craftCopy.body}</p>
          <Link
            href={craftCopy.linkHref}
            className="editorial-link mt-6 inline-block text-label-md text-crimson"
          >
            {craftCopy.linkLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
