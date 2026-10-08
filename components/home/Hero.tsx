import Image from "next/image";
import Link from "next/link";
import { heroCopy } from "@/lib/data/home";

// Editorial hero: full-bleed image with narrative overlay.
// Primary CTA is "Discover Our Story", deliberately not "Shop Now" (§9).
// CTA styling follows the Stitch homepage (outlined, with arrow) per §3.7.
export default function Hero() {
  return (
    <section aria-label="Karanyé introduction" className="relative bg-ink">
      <div className="relative h-[82svh] min-h-[560px] w-full md:h-[72svh] lg:h-[86vh] lg:min-h-[600px]">
        <Image
          src={heroCopy.image}
          alt={heroCopy.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Flat ink wash for text contrast; no blur so the garment stays sharp. */}
        <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-end gap-8 px-5 pb-12 md:px-8 md:pb-16 lg:flex-row lg:items-end lg:justify-between lg:px-16 lg:pb-20">
          <div className="max-w-2xl">
            <p className="text-label-md text-canvas/80">{heroCopy.eyebrow}</p>
            <h1 className="mt-4 text-display-xl text-canvas">
              {heroCopy.titleA}
              <br />
              <em>{heroCopy.titleB}</em>
            </h1>
            <p className="mt-5 max-w-md text-body-md text-canvas/90">
              {heroCopy.body}
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href={heroCopy.ctaHref}
              className="inline-flex h-13 items-center gap-3 border border-canvas/70 px-8 text-label-md text-canvas transition-colors hover:bg-canvas hover:text-ink"
            >
              {heroCopy.ctaLabel}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
