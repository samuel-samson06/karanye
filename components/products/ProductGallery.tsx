"use client";

import Image from "next/image";
import { useState } from "react";
import type { ShopImage } from "@/lib/data/shop";

interface ProductGalleryProps {
  images: ShopImage[];
  productName: string;
}

// Detail-page gallery: portrait garment photography at the §3.3 ratio with
// the same prev/next arrow treatment as ProductCard, so the two controls
// read as one family. Multi-image products rotate arrows in; single-image
// products render a framed photograph.
export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const current = images[index] ?? images[0];

  if (!current) return null;

  const showPrev = (): void => setIndex((i) => (i - 1 + total) % total);
  const showNext = (): void => setIndex((i) => (i + 1) % total);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden border border-platinum">
      <Image
        src={current.src}
        alt={current.alt || `${productName}, full view`}
        fill
        priority
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover"
      />
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={showPrev}
            aria-label={`Previous image of ${productName}`}
            className="absolute top-1/2 left-3 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center border border-platinum bg-canvas text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label={`Next image of ${productName}`}
            className="absolute top-1/2 right-3 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center border border-platinum bg-canvas text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
