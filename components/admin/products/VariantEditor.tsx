"use client";

import { useState } from "react";
import {
  variantKey,
  type FieldErrors,
  type FulfilmentValue,
  type VariantInput,
} from "@/lib/admin/create-piece";

interface VariantEditorProps {
  variants: VariantInput[];
  errors: Record<number, FieldErrors>;
  basePriceLabel: string;
  onChange: (variants: VariantInput[]) => void;
}

function splitOptions(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const value = part.trim();
    const key = value.toLowerCase();
    if (value !== "" && !seen.has(key)) {
      seen.add(key);
      out.push(value);
    }
  }
  return out;
}

function blankRow(size: string | null, colour: string | null): VariantInput {
  return {
    sizeLabel: size,
    colour,
    priceNgn: "",
    fulfilment: "ready_made",
    stock: "",
    sku: "",
    isActive: true,
  };
}

// Variant matrix editor: generates combinations from admin-provided size and
// colour lists, then leaves every row independently editable and removable.
// Generation only appends missing combinations — edited rows are never
// rewritten when the option lists change.
export default function VariantEditor({
  variants,
  errors,
  basePriceLabel,
  onChange,
}: VariantEditorProps) {
  const [sizes, setSizes] = useState("");
  const [colours, setColours] = useState("");

  const generate = (): void => {
    const sizeList = splitOptions(sizes);
    const colourList = splitOptions(colours);
    if (sizeList.length === 0 && colourList.length === 0) return;

    const wanted: { size: string | null; colour: string | null }[] = [];
    if (sizeList.length > 0 && colourList.length > 0) {
      for (const size of sizeList)
        for (const colour of colourList) wanted.push({ size, colour });
    } else if (sizeList.length > 0) {
      for (const size of sizeList) wanted.push({ size, colour: null });
    } else {
      for (const colour of colourList) wanted.push({ size: null, colour });
    }

    const existing = new Set(
      variants.map((row) => variantKey(row.sizeLabel, row.colour))
    );
    const fresh = wanted.filter(
      (combo) => !existing.has(variantKey(combo.size, combo.colour))
    );
    if (fresh.length === 0) return;
    onChange([
      ...variants,
      ...fresh.map((combo) => blankRow(combo.size, combo.colour)),
    ]);
  };

  const patch = (index: number, update: Partial<VariantInput>): void =>
    onChange(variants.map((row, i) => (i === index ? { ...row, ...update } : row)));

  const removeRow = (index: number): void =>
    onChange(variants.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <div className="flex flex-col gap-2">
          <label htmlFor="variant-sizes" className="text-label-md text-muted">
            Sizes (comma-separated)
          </label>
          <input
            id="variant-sizes"
            type="text"
            value={sizes}
            onChange={(event) => setSizes(event.target.value)}
            placeholder="S, M, L"
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="variant-colours" className="text-label-md text-muted">
            Colours (comma-separated)
          </label>
          <input
            id="variant-colours"
            type="text"
            value={colours}
            onChange={(event) => setColours(event.target.value)}
            placeholder="Burgundy, Black"
            className="h-12 min-h-11 w-full border border-hairline bg-canvas px-4 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-12 min-h-11 items-center border border-ink px-6 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            Generate
          </button>
        </div>
      </div>

      {variants.length === 0 ? (
        <p className="border border-platinum bg-linen px-4 py-5 text-body-md text-muted">
          No variants yet. Enter sizes and/or colours above, then Generate —
          or leave this piece variant-free.
        </p>
      ) : (
        <ul className="flex flex-col gap-4 ">
          {variants.map((row, index) => {
            const rowErrors = errors[index] ?? {};
            const effective =
              row.priceNgn.trim() === "" ? basePriceLabel : `₦${row.priceNgn.trim()}`;
            // Index keys: inputs are parent-controlled so values survive
            // reordering; keying by content would remount on every keystroke.
            return (
            <li key={index} className="border border-platinum bg-canvas p-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={`variant-size-${index}`}
                      className="text-label-md text-muted"
                    >
                      Size
                    </label>
                    <input
                      id={`variant-size-${index}`}
                      type="text"
                      value={row.sizeLabel ?? ""}
                      onChange={(event) =>
                        patch(index, {
                          sizeLabel:
                            event.target.value.trim() === ""
                              ? null
                              : event.target.value,
                        })
                      }
                      placeholder="One Size"
                      className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={`variant-colour-${index}`}
                      className="text-label-md text-muted"
                    >
                      Colour
                    </label>
                    <input
                      id={`variant-colour-${index}`}
                      type="text"
                      value={row.colour ?? ""}
                      onChange={(event) =>
                        patch(index, {
                          colour:
                            event.target.value.trim() === ""
                              ? null
                              : event.target.value,
                        })
                      }
                      className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <label
                      htmlFor={`variant-price-${index}`}
                      className="text-label-md text-muted"
                    >
                      Price (optional)
                    </label>
                    <input
                      id={`variant-price-${index}`}
                      type="text"
                      inputMode="decimal"
                      value={row.priceNgn}
                      onChange={(event) => patch(index, { priceNgn: event.target.value })}
                      placeholder={`Base ${basePriceLabel}`}
                      className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <label
                      htmlFor={`variant-sku-${index}`}
                      className="text-label-md text-muted"
                    >
                      SKU (optional)
                    </label>
                    <input
                      id={`variant-sku-${index}`}
                      type="text"
                      value={row.sku}
                      onChange={(event) => patch(index, { sku: event.target.value })}
                      className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-3 ">
                    <span id={`variant-fulfil-${index}`} className="text-label-md text-muted">
                      Fulfilment
                    </span>
                    <div
                      role="group"
                      aria-labelledby={`variant-fulfil-${index}`}
                      className="grid grid-cols-2 gap-3"
                    >
                      {(
                        [
                          ["ready_made", "Ready-made"],
                          ["made_to_order", "Made to Order"],
                        ] as [FulfilmentValue, string][]
                      ).map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => patch(index, { fulfilment: value })}
                            aria-pressed={row.fulfilment === value}
                            className={
                              row.fulfilment === value
                                ? "min-h-12 border border-crimson bg-crimson px-4 py-3 text-label-md text-canvas"
                                : "min-h-12 border border-platinum px-4 py-3 text-label-md text-ink transition-colors hover:border-ink"
                            }
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <p className="text-body-sm text-muted">
                        Ready-made tracks stock on hand. Made to Order produces
                        each piece after purchase.
                      </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={`variant-stock-${index}`}
                      className="text-label-md text-muted"
                    >
                      Stock {row.fulfilment === "made_to_order" ? "(n/a)" : ""}
                    </label>
                    <input
                      id={`variant-stock-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={row.stock}
                      disabled={row.fulfilment === "made_to_order"}
                      onChange={(event) => patch(index, { stock: event.target.value })}
                      placeholder={row.fulfilment === "made_to_order" ? "—" : "0"}
                      className="h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none disabled:opacity-60"
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-label-md text-ink">
                      <input
                        type="checkbox"
                        checked={row.isActive}
                        onChange={(event) =>
                          patch(index, { isActive: event.target.checked })
                        }
                        className="h-4 w-4 accent-crimson"
                      />
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      aria-label={`Remove variant ${index + 1}`}
                      className="editorial-link min-h-11 text-label-md text-crimson"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-label-md text-muted md:col-span-4">
                    Customer pays: {effective}
                  </p>
                </div>
                {(rowErrors.combination ?? rowErrors.priceNgn ?? rowErrors.stock) && (
                  <p role="alert" className="mt-3 text-body-sm text-crimson-vibrant">
                    {[rowErrors.combination, rowErrors.priceNgn, rowErrors.stock]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
