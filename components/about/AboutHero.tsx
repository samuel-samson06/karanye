import Image from "next/image";
import { placeholderImage, placeholderImageAlt } from "@/lib/data/home";

// About hero: eyebrow, title, full-width atelier image, pull quote.
// Copy transcribed from the approved screenshot — TODO(content) throughout.
export default function AboutHero() {
  return (
    <section aria-label="The story of Karanyé" className="bg-canvas">
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <p className="text-label-md text-muted">The House of Karanyé</p>
          <p className="text-label-md text-muted">Lagos Atelier · Mayfair Suite</p>
        </div>
        <h1 className="mt-4 max-w-3xl text-display-xl text-ink">
          The Story of Karanyé
        </h1>

        {/* Portrait on phones, widening by breakpoint; a 16:9 band on mobile would be a sliver. */}
        <div className="relative mt-10 aspect-[4/5] w-full overflow-hidden border border-platinum md:aspect-[4/3] lg:aspect-[16/9]">
          {/* TODO(content): replace with brand atelier photography */}
          <Image
            src={placeholderImage}
            alt={placeholderImageAlt}
            fill
            priority
            sizes="(min-width: 1280px) 1152px, 100vw"
            className="object-cover object-[center_25%]"
          />
        </div>

        <blockquote className="mx-auto mt-10 max-w-2xl text-center text-headline-lg text-ink">
          &ldquo;An inquiry into form, memory, and the enduring poise of
          made-to-order Nigerian couture.&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
