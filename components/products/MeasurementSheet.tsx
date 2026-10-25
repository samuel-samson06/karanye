"use client";

import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { sizeMeasurementKeys, sizeChartUnit } from "@/lib/data/size-chart";

// Custom Size entry uses the exact measurement vocabulary of the Size & Fit
// experience: the nine chart fields, in inches. Labels and order import
// sizeMeasurementKeys so they can never drift from the chart.
// TODO(content): confirm final validation ranges with the atelier.
const measurementRanges: Record<string, [number, number]> = {
  shoulder_width: [10, 25],
  neck_width: [1, 5],
  bust: [20, 70],
  waist: [18, 60],
  hips: [25, 75],
  shoulder_bust_point: [5, 15],
  shoulder_underbust: [5, 20],
  shoulder_waist_half_length: [10, 30],
  armhole: [8, 30],
};

export interface CustomMeasurements {
  [key: string]: string;
}

interface MeasurementSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (measurements: CustomMeasurements) => void;
  initial?: CustomMeasurements | null;
}

interface FieldErrors {
  [key: string]: string | undefined;
}

function validate(raw: Record<string, string>): FieldErrors {
  const errors: FieldErrors = {};
  for (const { key, label } of sizeMeasurementKeys) {
    const value = raw[key]?.trim() ?? "";
    if (value === "") {
      errors[key] = `${label} is required.`;
      continue;
    }
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
      errors[key] = `${label} must be a number in ${sizeChartUnit}.`;
      continue;
    }
    const [min, max] = measurementRanges[key] ?? [0, 100];
    if (parsed < min || parsed > max) {
      errors[key] = `${label} should read between ${min} and ${max} ${sizeChartUnit}.`;
    }
  }
  return errors;
}

const guidance =
  // TODO(content): replace with approved measuring guidance.
  `All measurements are in ${sizeChartUnit}. Measure your body with the tape held level, and follow the labels exactly as they appear on the Size & Fit chart.`;

// Garment specification drawer: sharp rectangle inputs, floating uppercase
// labels in muted, crimson focus borders, errors stated in words never by
// colour alone (§3.7).
export default function MeasurementSheet({
  open,
  onClose,
  onSave,
  initial,
}: MeasurementSheetProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [draftErrors, setDraftErrors] = useState<FieldErrors>({});
  // Re-seed from the last saved selection when an open cycle begins. Derived
  // state reset per the React docs: adjust during render from prior state,
  // so in-sheet edits are never clobbered mid-cycle.
  const [wasOpen, setWasOpen] = useState(false);
  if (open && !wasOpen) {
    setWasOpen(true);
    setValues({ ...(initial ?? {}) });
    setDraftErrors({});
  } else if (!open && wasOpen) {
    setWasOpen(false);
  }

  const attemptSave = (): void => {
    const errors = validate(values);
    setDraftErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSave({ ...values });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="sheet"
      label="Custom size measurements"
      className="flex flex-col"
    >
      <div className="flex flex-none items-center justify-between border-b border-platinum px-5 py-4 md:px-8">
        <div>
          <p className="text-label-md text-muted">Custom size</p>
          <h2 className="mt-1 text-headline-sm text-ink">Your measurements</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close measurements"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>

      <form
        className="flex flex-1 flex-col px-5 py-6 md:px-8"
        onSubmit={(event) => {
          event.preventDefault();
          attemptSave();
        }}
      >
        <p className="max-w-md text-body-sm text-muted">{guidance}</p>

        <div className="mt-6 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          {sizeMeasurementKeys.map(({ key, label }) => {
            const error = draftErrors[key];
            return (
              <div key={key} className="flex flex-col gap-1">
                <label
                  htmlFor={`measure-${key}`}
                  className="text-label-md uppercase text-muted"
                >
                  {label}
                </label>
                <input
                  id={`measure-${key}`}
                  name={key}
                  inputMode="decimal"
                  autoComplete="off"
                  value={values[key] ?? ""}
                  onChange={(event) => {
                    setValues((current) => ({ ...current, [key]: event.target.value }));
                    setDraftErrors((current) => ({ ...current, [key]: undefined }));
                  }}
                  aria-invalid={!!error}
                  aria-describedby={error ? `measure-error-${key}` : undefined}
                  className="h-11 border border-hairline bg-canvas px-3 text-body-md text-ink outline-none focus:border-crimson aria-[invalid=true]:border-crimson-vibrant"
                />
                {error && (
                  <p
                    id={`measure-error-${key}`}
                    className="text-body-sm text-crimson-vibrant"
                  >
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex-none border-t border-platinum pt-6">
          <button
            type="button"
            onClick={attemptSave}
            className="inline-flex h-[52px] w-full items-center justify-center bg-crimson px-4 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
          >
            Save measurements
          </button>
        </div>
      </form>
    </Drawer>
  );
}
