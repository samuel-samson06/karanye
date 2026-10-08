import Image from "next/image";

// About hero: eyebrow, title, full-width atelier image, pull quote.
// Copy transcribed from the approved screenshot — TODO(content) throughout.
export default function AboutHero() {
  return (
    <section aria-label="The story of Karanyé" className="bg-canvas">
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 lg:px-16 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-label-md text-muted">The House of Karanyé</p>
          <p className="text-label-md text-muted">Lagos Atelier · Mayfair Suite</p>
        </div>
        <h1
          className="mt-4 max-w-3xl text-display-xl text-ink"
          style={{ fontFamily: "var(--font-bodoni)" }}
        >
          The Story of Karanyé
        </h1>

        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden border border-platinum">
          {/* TODO(content): replace with brand atelier photography */}
          <Image
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop"
            alt="Model in an ivory gown inside the Karanyé atelier"
            fill
            priority
            sizes="100vw"
            className="object-cover"
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
