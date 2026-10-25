"use client";

import { useRef, useState } from "react";
import Drawer from "@/components/ui/Drawer";import SizeChartSheet from "@/components/products/SizeChartSheet";
import MeasurementSheet, {
  type CustomMeasurements,
} from "@/components/products/MeasurementSheet";
import { formatNaira } from "@/lib/money";
import { sizeChartOrder } from "@/lib/data/size-chart";
import { useCart } from "@/lib/cart";

interface ProductPurchaseProps {
  slug: string;
  name: string;
  priceKobo: number;
  status: "made_to_order" | "limited" | "sold_out";
  imageSrc: string;
  imageAlt: string;
  mtmAvailable: boolean;
}

type SizingMethod = "none" | "standard" | "custom";

// TODO(content): replace selection prompts and notices with approved copy.
const notice = {
  chooseMethod: "Choose how this piece will be sized",
  standardLabel: "Standard Size",
  customLabel: "Custom Size",
  chartLink: "View size chart",
  sizePrompt: "Choose your size",
  mtmNote:
    "Cut to your own measurements. Values follow the Size & Fit chart, in inches.",
  editMeasurements: "View or edit measurements",
  addLabel: "Add to shop",
  soldOutLabel: "Sold out",
  soldOutNotice: "This piece is not available for purchase at the moment.",
  productionNotice: "Made to order — allow 5–7 days to process your orders.",
};

// Purchase column: Standard Size vs Custom Size tiles (§3.7 radio-group
// tiles), the full chart size range, the measurement sheet, quantity and
// the add-to-shop action that lines up the shared cart. There are no
// variant matrices — pieces are commissioned per order.
export default function ProductPurchase({
  slug,
  name,
  priceKobo,
  status,
  imageSrc,
  imageAlt,
  mtmAvailable,
}: ProductPurchaseProps) {
  const { addItem, openCart } = useCart();
  const [method, setMethod] = useState<SizingMethod>("none");
  const [size, setSize] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<CustomMeasurements | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isSoldOut = status === "sold_out";

  const chooseMethod = (next: Exclude<SizingMethod, "none">): void => {
    setError(null);
    setMethod(next);
    if (next === "custom") {
      setSheetOpen(true);
    }
  };

  const attemptAdd = (): void => {
    if (isSoldOut) return;

    if (method === "none") {
      setError(notice.chooseMethod);
      panelRef.current?.scrollIntoView({ block: "start" });
      return;
    }
    if (method === "standard" && !size) {
      setError("Choose a size before adding to shop.");
      panelRef.current?.scrollIntoView({ block: "start" });
      return;
    }
    if (method === "custom" && !measurements) {
      setSheetOpen(true);
      return;
    }

    setError(null);
    addItem({
      productId: slug,
      name,
      imageSrc,
      imageAlt,
      unitPriceKobo: priceKobo,
      quantity,
      sizing:
        method === "standard"
          ? { type: "standard", size: size as string }
          : { type: "custom", measurements: measurements as CustomMeasurements },
    });
    openCart();
  };

  return (
    <div ref={panelRef} className="scroll-mt-24">
      {/* Sizing method tiles */}
      <fieldset>
        <legend className="text-label-md uppercase text-ink">
          Sizing
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => chooseMethod("standard")}
            aria-pressed={method === "standard"}
            className={
              method === "standard"
                ? "flex min-h-11 items-center justify-center bg-ink px-4 text-label-md text-canvas"
                : "flex min-h-11 items-center justify-center border border-hairline px-4 text-label-md text-ink transition-colors hover:border-ink"
            }
          >
            {notice.standardLabel}
          </button>
          <button
            type="button"
            onClick={() => (isSoldOut ? undefined : chooseMethod("custom"))}
            aria-pressed={method === "custom"}
            disabled={isSoldOut || !mtmAvailable}
            aria-disabled={isSoldOut || !mtmAvailable}
            className="group flex min-h-11 items-center justify-center border border-hairline px-4 text-label-md text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:border-hairline disabled:text-hairline aria-[pressed=true]:bg-ink aria-[pressed=true]:text-canvas"
          >
            {notice.customLabel}
          </button>
        </div>
        <p className="mt-2 text-body-sm text-muted">
          {!mtmAvailable && !isSoldOut
            ? "Custom sizing is not offered for this design — enquire via Contact."
            : notice.mtmNote}
        </p>
      </fieldset>

      {/* Standard size tiles: the full chart range, every piece */}
      {method === "standard" && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-label-md uppercase text-ink">{notice.sizePrompt}</p>
            <button
              type="button"
              onClick={() => setChartOpen(true)}
              className="editorial-link text-label-md text-crimson"
            >
              {notice.chartLink}
            </button>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {sizeChartOrder.map((chartSize) => {
              const selectedSize = size === String(chartSize);
              return (
                <button
                  type="button"
                  key={chartSize}
                  onClick={() => {
                    setSize(String(chartSize));
                    setError(null);
                  }}
                  aria-pressed={selectedSize}
                  className={
                    selectedSize
                      ? "flex min-h-11 items-center justify-center bg-ink text-label-md text-canvas"
                      : "flex min-h-11 items-center justify-center border border-hairline text-label-md text-ink transition-colors hover:border-ink"
                  }
                >
                  {chartSize}
                </button>
              );
            })}
          </div>
          {size && (
            <p className="mt-3 flex items-baseline gap-2 text-body-sm text-muted">
              <span>Size {size} selected.</span>
              <button
                type="button"
                onClick={() => setChartOpen(true)}
                className="editorial-link text-label-md text-crimson"
              >
                {notice.chartLink}
              </button>
            </p>
          )}
        </div>
      )}

      {/* Custom size: measurement summary + sheet trigger */}
      {method === "custom" && (
        <div className="mt-8 border border-platinum bg-linen px-4 py-4">
          {measurements ? (
            <>
              <p className="flex items-baseline justify-between gap-4">
                <span className="text-body-sm text-ink">Measurements saved.</span>
                <button
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  className="editorial-link text-label-md text-crimson"
                >
                  {notice.editMeasurements}
                </button>
              </p>
              <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-6 gap-y-1">
                {Object.entries(measurements).map(([key, value]) => (
                  <div key={key} className="contents text-body-sm">
                    <dt className="capitalize text-muted">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-right text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="editorial-link min-h-11 text-label-md text-crimson"
            >
              Enter your measurements
            </button>
          )}
        </div>
      )}

      {/* Quantity */}
      {!isSoldOut && method !== "none" && (
        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-label-md uppercase text-ink">Quantity</p>
          <div className="flex items-stretch border border-hairline">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center border-r border-hairline text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:text-hairline"
            >
              <span aria-hidden="true">−</span>
            </button>
            <span
              aria-live="polite"
              className="flex h-11 min-w-11 items-center justify-center px-2 text-body-md text-ink"
            >
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="flex h-11 w-11 items-center justify-center border-l border-hairline text-ink transition-colors hover:border-ink"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      )}

      {/* Validation */}
      {error && (
        <p role="alert" className="mt-4 text-body-sm text-crimson-vibrant">
          {error}
        </p>
      )}

      {/* Add to shop */}
      <div className="mt-8">
        {isSoldOut ? (
          <p className="text-body-md text-muted">{notice.soldOutNotice}</p>
        ) : (
          <button
            type="button"
            onClick={attemptAdd}
            className="inline-flex h-[52px] w-full items-center justify-center bg-crimson px-4 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
          >
            {notice.addLabel}
          </button>
        )}
        <p className="mt-3 text-body-sm text-muted">{notice.productionNotice}</p>
      </div>

      {/* Drawers: chart + measurement sheet */}
      <Drawer
        open={chartOpen}
        onClose={() => setChartOpen(false)}
        label="Size chart"
        className="p-6 md:p-8"
      >
        <SizeChartSheet
          open={chartOpen}
          onClose={() => setChartOpen(false)}
          initialSize={size}
        />
      </Drawer>

      <MeasurementSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initial={measurements}
        onSave={(saved) => {
          setMeasurements(saved);
          setSheetOpen(false);
          setError(null);
        }}
      />

      {/* Mobile sticky commerce bar (§3.7): price controls + the add action.
          Navigation stays in the header; desktop never sees this bar. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-platinum bg-canvas px-5 py-3 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <p className="shrink-0 text-label-md text-ink">{formatNaira(priceKobo)}</p>
          {isSoldOut ? (
            <p className="text-label-md text-muted">{notice.soldOutLabel}</p>
          ) : (
            <button
              type="button"
              onClick={attemptAdd}
              className="inline-flex h-13 min-h-11 flex-1 items-center justify-center bg-crimson px-4 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
            >
              {notice.addLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
