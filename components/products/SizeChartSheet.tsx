"use client";

import { useState } from "react";
import {
  sizeChart,
  sizeChartNoteHeading,
  sizeChartNotes,
  sizeMeasurementKeys,
  sizeChartOrder,
  sizeChartUnit,
} from "@/lib/data/size-chart";

interface SizeChartSheetProps {
  open: boolean;
  onClose: () => void;
  /** Pre-selected size tile; defaults to the smallest chart size. */
  initialSize?: string | null;
}

// Quick size-chart access from the custom tile row: one drawer, a size tile
// choice, the nine chart rows for that size, and the "Please note" citation
// backing text that reads directly from lib/data/size-chart.ts.
export default function SizeChartSheet({
  open,
  onClose,
  initialSize,
}: SizeChartSheetProps) {
  const [selected, setSelected] = useState<number>(
    Number(initialSize ?? sizeChartOrder[0]),
  );

  if (open && !sizeChart[selected]) {
    setSelected(Number(sizeChartOrder[0]));
  }

  const row = sizeChart[selected] ?? sizeChart[sizeChartOrder[0]];

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-label-md text-muted">Size &amp; Fit</p>
          <h2 className="mt-1 text-headline-sm text-ink">Standard size chart</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close size chart"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>

      <p className="mt-4 text-body-sm text-muted">
        {`All chart values are body measurements in ${sizeChartUnit}.`}
      </p>

      <fieldset className="mt-5">
        <legend className="text-label-md uppercase text-muted">Choose a size</legend>
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {sizeChartOrder.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => setSelected(size)}
              aria-pressed={selected === size}
              className={
                selected === size
                  ? "flex min-h-11 items-center justify-center bg-ink text-label-md text-canvas"
                  : "flex min-h-11 items-center justify-center border border-hairline text-label-md text-ink transition-colors hover:border-ink"
              }
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <dl className="mt-6 border-t border-platinum">
        {sizeMeasurementKeys.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-baseline justify-between gap-4 border-b border-hairline py-3"
          >
            <dt className="text-body-md text-ink">{label}</dt>
            <dd className="text-right text-body-md text-ink">{row[key]}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <div aria-hidden="true" className="h-0.5 w-14 bg-crimson" />
        <p className="mt-4 text-label-md uppercase text-crimson">
          {sizeChartNoteHeading}
        </p>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-4">
          {sizeChartNotes.map((note) => (
            <li key={note} className="text-body-sm text-ink">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
