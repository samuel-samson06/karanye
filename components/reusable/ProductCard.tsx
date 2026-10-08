"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatNaira } from "@/lib/data/home";
import type { ShopProduct } from "@/lib/data/shop";

const statusLabel: Record<ShopProduct["status"], string> = {
  made_to_order: "Made to Order",
  limited: "Limited",
  sold_out: "Sold Out",
};

interface ProductCardProps {
  product: ShopProduct;
}

// Reusable editorial product card: image with badge + image controls,
// name, fabric line, price, and a dead Add to Bag button (toast only —
// real purchase flow arrives with Phase 5).
export default function ProductCard({ product }: ProductCardProps) {
  const [index, setIndex] = useState(0);
  const total = product.images.length;
  const current = product.images[index] ?? product.images[0];

  const showPrev = (): void => setIndex((i) => (i - 1 + total) % total);
  const showNext = (): void => setIndex((i) => (i + 1) % total);

  const notifyComingSoon = (): void => {
    // TODO(content): replace with real add-to-bag action in Phase 5
    toast.info("Ordering opens soon.", { toastId: `coming-soon-${product.slug}` });
  };

  return (
    <article className="flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden border border-platinum">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0"
        >
          {current && (
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="object-cover"
            />
          )}
        </Link>

        <span
          className={
            product.status === "sold_out"
              ? "absolute top-3 left-3 border border-hairline bg-canvas px-3 py-2 text-label-md text-muted"
              : "absolute top-3 left-3 border border-crimson bg-canvas px-3 py-2 text-label-md text-crimson"
          }
        >
          {statusLabel[product.status]}
        </span>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label={`Previous image of ${product.name}`}
              className="absolute top-1/2 left-3 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center border border-platinum bg-canvas text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={`Next image of ${product.name}`}
              className="absolute top-1/2 right-3 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center border border-platinum bg-canvas text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </>
        )}
      </div>

      <Link href={`/products/${product.slug}`} className="mt-4 block">
        <h3 className="text-headline-sm text-ink">{product.name}</h3>
      </Link>
      <p className="mt-1 text-body-sm text-muted">{product.fabricLine}</p>
      <p className="mt-2 text-label-md text-ink">{formatNaira(product.priceKobo)}</p>
      <button
        type="button"
        onClick={notifyComingSoon}
        className="mt-4 inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
      >
        Add to Bag
      </button>
    </article>
  );
}
