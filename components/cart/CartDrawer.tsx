"use client";

import Image from "next/image";
import Drawer from "@/components/ui/Drawer";
import { formatNaira } from "@/lib/money";
import { describeSizing, useCart, type CartLineKey, type CartSizing } from "@/lib/cart";

// TODO(content): replace with approved empty-cart and unit-count copy.
const emptyTitle = "Your shop is empty";
const emptyBody = "Designs you choose will rest here until you check out.";
const emptyCTA = "View Designs";
const checkoutLabel = "Checkout";
const checkoutNotice = "Checkout is opening soon.";

function QuantityStepper({
  quantity,
  onAdjust,
  onRemove,
}: {
  quantity: number;
  onAdjust: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-stretch border border-platinum">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onAdjust(quantity - 1)}
          disabled={quantity <= 1}
          className="flex h-10 w-10 items-center justify-center border-r border-platinum text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:border-platinum disabled:text-hairline"
        >
          <span aria-hidden="true">−</span>
        </button>
        <span className="flex h-10 min-w-10 items-center justify-center px-2 text-body-sm text-ink">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onAdjust(quantity + 1)}
          className="flex h-10 w-10 items-center justify-center border-l border-platinum text-ink transition-colors hover:border-ink"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="editorial-link text-label-md text-muted hover:text-crimson-vibrant"
      >
        Remove
      </button>
    </div>
  );
}

function LineSummary({ line }: { line: { sizing: CartSizing } }) {
  if (line.sizing.type === "standard") {
    return <p className="text-body-sm text-muted">{describeSizing(line.sizing)}</p>;
  }
  return (
    <details className="text-body-sm text-muted">
      <summary className="cursor-pointer min-h-11 inline-flex items-center md:min-h-0">
        {describeSizing(line.sizing)} — view measurements
      </summary>
      <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-body-sm">
        {Object.entries(line.sizing.measurements).map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="capitalize">{key.replace(/_/g, " ")}</dt>
            <dd className="text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

// shop drawer (mini-cart): right-slide panel fed by the shared CartProvider.
export default function CartDrawer() {
  const { lines, count, subtotalKobo, isOpen, closeCart, setQuantity, removeItem, keyOf } =
    useCart();

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      variant="drawer"
      label="Your shop"
      className="flex flex-col"
    >
      <div className="flex items-center justify-between border-b border-platinum px-5 py-4 md:px-6">
        <h2 className="text-headline-sm text-ink">
          Your shop{count > 0 ? ` (${count})` : ""}
        </h2>
        <button
          type="button"
          onClick={closeCart}
          aria-label="Close cart"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-14 text-center">
          <h3 className="text-headline-sm text-ink">{emptyTitle}</h3>
          <p className="max-w-xs text-body-md text-muted">{emptyBody}</p>
          <a
            href="/shop"
            onClick={closeCart}
            className="mt-2 inline-flex h-13 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            {emptyCTA}
          </a>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto px-5 py-6 md:px-6">
            {lines.map((line) => {
              const key: CartLineKey = keyOf(line);
              return (
                <li
                  key={key}
                  className="flex gap-4 border-b border-hairline py-5 first:pt-0 last:border-b-0"
                >
                  <a
                    href={`/products/${line.productId}`}
                    onClick={closeCart}
                    className="relative h-28 w-20 shrink-0 border border-platinum"
                    aria-label={`View ${line.name}`}
                  >
                    <Image
                      src={line.imageSrc}
                      alt={line.imageAlt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </a>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <a
                        href={`/products/${line.productId}`}
                        onClick={closeCart}
                        className="text-headline-xs text-ink"
                      >
                        {line.name}
                      </a>
                      <p className="shrink-0 text-label-md text-ink">
                        {formatNaira(line.unitPriceKobo)}
                      </p>
                    </div>
                    <LineSummary line={line} />
                    <div className="mt-auto">
                      <QuantityStepper
                        quantity={line.quantity}
                        onAdjust={(quantity) => setQuantity(key, quantity)}
                        onRemove={() => removeItem(key)}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-platinum px-5 py-5 md:px-6">
            <div className="flex items-center justify-between">
              <p className="text-label-md text-muted">Subtotal</p>
              <p className="text-body-md text-ink">{formatNaira(subtotalKobo)}</p>
            </div>
            <button
              type="button"
              disabled
              aria-label={`${checkoutLabel} — ${checkoutNotice}`}
              className="mt-4 inline-flex h-[52px] w-full cursor-not-allowed items-center justify-center bg-crimson px-4 text-label-md text-canvas/70"
            >
              {checkoutLabel}
            </button>
            <p className="mt-2 text-center text-label-md text-muted">{checkoutNotice}</p>
          </div>
        </>
      )}
    </Drawer>
  );
}
