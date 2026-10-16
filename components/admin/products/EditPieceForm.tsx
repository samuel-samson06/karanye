"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImagePicker, {
  type InitialImage,
} from "@/components/admin/products/ImagePicker";
import VariantEditor from "@/components/admin/products/VariantEditor";
import { formatNaira } from "@/lib/money";
import {
  PRODUCT_STATUSES,
  parseNgnToKobo,
  validateProduct,
  validateVariants,
  type FieldErrors,
  type ProductStatusValue,
  type VariantInput,
} from "@/lib/admin/create-piece";
import {
  mockAdminCollections,
  mockAdminProducts,
  type MockAdminProduct,
} from "@/lib/admin/products";

const inputClass =
  "h-[52px] min-h-11 w-full border border-hairline bg-canvas px-4 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none disabled:opacity-60";
const labelClass = "text-label-md text-muted";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-body-sm text-crimson-vibrant">
      {message}
    </p>
  );
}

function toVariantInputs(product: MockAdminProduct): VariantInput[] {
  return product.variants.map((variant) => ({
    sizeLabel: variant.sizeLabel,
    colour: variant.colour,
    priceNgn: variant.priceKobo === null ? "" : String(variant.priceKobo / 100),
    fulfilment: variant.fulfilmentType,
    stock: variant.stockQuantity === null ? "" : String(variant.stockQuantity),
    sku: "",
    isActive: variant.isActive,
  }));
}

function toInitialImages(product: MockAdminProduct): InitialImage[] {
  return product.images.map((image, index) => ({
    id: `mock:${product.id}:${index}`,
    url: image.imageUrl,
    alt: image.alt,
    isPrimary: image.isPrimary,
  }));
}

// Mock-only edit form: works entirely against the MockAdminProduct passed in.
// Saving updates the local snapshot below — nothing persists, nothing leaves
// the browser, and everything resets on reload or navigation.
export default function EditPieceForm({
  initial,
}: {
  initial: MockAdminProduct;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [description, setDescription] = useState("");
  const [priceNgn, setPriceNgn] = useState(String(initial.priceKobo / 100));
  const [collectionId, setCollectionId] = useState<string | null>(
    initial.collectionId
  );
  const [status, setStatus] = useState<ProductStatusValue>(initial.status);
  const [fabric, setFabric] = useState("");
  const [care, setCare] = useState("");
  const [mtmAvailable, setMtmAvailable] = useState(initial.mtmAvailable);
  const [variants, setVariants] = useState<VariantInput[]>(() =>
    toVariantInputs(initial)
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [variantErrors, setVariantErrors] = useState<Record<number, FieldErrors>>({});
  const [saved, setSaved] = useState(false);

  const goBack = (): void => {
    if (window.history.length > 1) router.back();
    else router.push("/admin/products");
  };

  const reset = (): void => {
    setName(initial.name);
    setSlug(initial.slug);
    setDescription("");
    setPriceNgn(String(initial.priceKobo / 100));
    setCollectionId(initial.collectionId);
    setStatus(initial.status);
    setFabric("");
    setCare("");
    setMtmAvailable(initial.mtmAvailable);
    setVariants(toVariantInputs(initial));
    setFieldErrors({});
    setVariantErrors({});
    setSaved(false);
  };

  const basePriceKobo = parseNgnToKobo(priceNgn);
  const basePriceLabel =
    basePriceKobo === null ? "base price" : formatNaira(basePriceKobo);

  const save = (event: React.FormEvent): void => {
    event.preventDefault();
    const productErrors = validateProduct({
      name,
      slug: slug.trim(),
      description,
      priceNgn,
      collectionId,
      status,
      fabricComposition: fabric,
      careInstructions: care,
      mtmAvailable,
    });
    // Slug uniqueness is checked against the mock catalogue, excluding self.
    if (
      !productErrors.slug &&
      mockAdminProducts.some(
        (other) => other.id !== initial.id && other.slug === slug.trim()
      )
    ) {
      productErrors.slug = "Slug already in use.";
    }
    const { errors: rowErrors } = validateVariants(variants);
    setFieldErrors(productErrors);
    setVariantErrors(rowErrors);
    if (Object.keys(productErrors).length > 0 || Object.keys(rowErrors).length > 0) {
      setSaved(false);
      return;
    }
    // Snapshot lives in component state only: no store, no database, no reload survival.
    setSaved(true);
  };

  return (
    <main>
      <button
        type="button"
        onClick={goBack}
        className="inline-flex min-h-11 items-center gap-3 text-label-md text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1" />
        </svg>
        Back
      </button>

      <p className="mt-6 text-label-md text-muted">Catalogue</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Edit Piece
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Demonstration record — edits stay in this session and reset on reload.
        They do not persist and do not reach other pages.
      </p>

      <form onSubmit={save} className="mt-10 flex max-w-3xl flex-col gap-10">
        <fieldset className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Details</legend>
          <div className="flex flex-col gap-2">
            <label htmlFor="mock-name" className={labelClass}>Name *</label>
            <input id="mock-name" type="text" value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass} />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="mock-slug" className={labelClass}>Slug *</label>
            <input id="mock-slug" type="text" value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className={inputClass} />
            <FieldError message={fieldErrors.slug} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="mock-description" className={labelClass}>Description</label>
            <textarea id="mock-description" rows={4} value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 w-full border border-hairline bg-canvas px-4 py-3 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="mock-price" className={labelClass}>Base price (₦) *</label>
              <input id="mock-price" type="text" inputMode="decimal" value={priceNgn}
                onChange={(event) => setPriceNgn(event.target.value)}
                className={inputClass} />
              <FieldError message={fieldErrors.priceNgn} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="mock-status" className={labelClass}>Status *</label>
              <select id="mock-status" value={status}
                onChange={(event) => setStatus(event.target.value as ProductStatusValue)}
                className={inputClass}>
                {PRODUCT_STATUSES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="mock-fabric" className={labelClass}>Fabric composition</label>
              <input id="mock-fabric" type="text" value={fabric}
                onChange={(event) => setFabric(event.target.value)}
                className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="mock-care" className={labelClass}>Care instructions</label>
              <input id="mock-care" type="text" value={care}
                onChange={(event) => setCare(event.target.value)}
                className={inputClass} />
            </div>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Imagery</legend>
          <ImagePicker
            initial={toInitialImages(initial)}
            orderable
            onChange={() => undefined}
          />
          <p className="text-body-sm text-muted">
            New files preview locally for this session only — nothing uploads.
          </p>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Collection</legend>
          <div className="flex flex-col gap-2">
            <label htmlFor="mock-collection" className={labelClass}>
              Collection (optional — empty means standalone)
            </label>
            <select id="mock-collection"
              value={collectionId ?? ""}
              onChange={(event) =>
                setCollectionId(event.target.value === "" ? null : event.target.value)
              }
              className={inputClass}>
              <option value="">Standalone piece</option>
              {mockAdminCollections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Variants</legend>
          <VariantEditor
            variants={variants}
            errors={variantErrors}
            basePriceLabel={basePriceLabel}
            onChange={setVariants}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Made to Measure</legend>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-label-md text-ink">
            <input
              type="checkbox"
              checked={mtmAvailable}
              onChange={(event) => setMtmAvailable(event.target.checked)}
              className="h-4 w-4 accent-crimson"
            />
            Offer made to measure for this piece
          </label>
          <p className="text-body-sm text-muted">
            Made-to-measure orders use the product base price. There is no
            surcharge at this stage.
          </p>
        </fieldset>

        {saved && (
          <p role="status" className="border border-platinum bg-linen px-4 py-4 text-body-md text-ink">
            Saved for this session — resets on reload. Edits do not persist
            and do not reach other pages.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            Reset
          </button>
          <Link
            href="/admin/products"
            className="inline-flex h-[52px] min-h-11 items-center justify-center px-8 text-label-md text-crimson"
          >
            Back to Products
          </Link>
        </div>
      </form>
    </main>
  );
}
