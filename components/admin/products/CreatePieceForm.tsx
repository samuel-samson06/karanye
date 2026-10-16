"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImagePicker, { type EditableImage } from "@/components/admin/products/ImagePicker";
import VariantEditor from "@/components/admin/products/VariantEditor";
import { formatNaira } from "@/lib/money";
import {
  PRODUCT_STATUSES,
  parseNgnToKobo,
  slugify,
  validateProduct,
  validateVariants,
  type CollectionOption,
  type FieldErrors,
  type ProductStatusValue,
  type VariantInput,
} from "@/lib/admin/create-piece";
import {
  createPieceAction,
  type CreatePieceResult,
} from "@/lib/admin/product-actions";

interface CreatePieceFormProps {
  collections: CollectionOption[];
  collectionsError: string | null;
}

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

// Create Piece form: details, images, collection, variants switch + editor,
// MTM toggle, status. Submits through the save Server Action; the button
// stays disabled while saving (no double-submit). Product inputs lock once
// the row exists so a retry only completes the remaining steps.
export default function CreatePieceForm({
  collections,
  collectionsError,
}: CreatePieceFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [priceNgn, setPriceNgn] = useState("");
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProductStatusValue>("draft");
  const [fabric, setFabric] = useState("");
  const [care, setCare] = useState("");
  const [mtmAvailable, setMtmAvailable] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<VariantInput[]>([]);
  const [images, setImages] = useState<EditableImage[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [variantErrors, setVariantErrors] = useState<Record<number, FieldErrors>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreatePieceResult | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const goBack = (): void => {
    if (window.history.length > 1) router.back();
    else router.push("/admin/products");
  };

  const basePriceKobo = parseNgnToKobo(priceNgn);
  const basePriceLabel =
    basePriceKobo === null ? "base price" : formatNaira(basePriceKobo);
  const locked = createdId !== null;

  const submit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (submitting) return;

    const product = {
      name,
      slug: slug.trim(),
      description,
      priceNgn,
      collectionId,
      status,
      fabricComposition: fabric,
      careInstructions: care,
      mtmAvailable,
    };
    const productErrors = locked ? {} : validateProduct(product);
    const { errors: rowErrors } = validateVariants(hasVariants ? variants : []);
    setFieldErrors(productErrors);
    setVariantErrors(rowErrors);
    if (Object.keys(productErrors).length > 0 || Object.keys(rowErrors).length > 0) return;

    setSubmitting(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append(
        "payload",
        JSON.stringify({
          ...(createdId ? { productId: createdId } : {}),
          product,
          variants: hasVariants ? variants : [],
          images: images.map((image) => ({ alt: image.alt, isPrimary: image.isPrimary })),
        })
      );
      for (const image of images) {
        // Create flow only ever holds picked files; the guard keeps the
        // shared EditableImage type honest.
        if (image.file) formData.append("files", image.file);
      }
      const outcome = await createPieceAction(formData);
      setResult(outcome);
      if (outcome.productId && !outcome.ok) setCreatedId(outcome.productId);
      if (outcome.ok && outcome.productId) setCreatedId(outcome.productId);
    } catch {
      setResult({
        ok: false,
        productId: createdId,
        steps: null,
        message: "Something went wrong submitting the form. Nothing was confirmed saved.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.ok) {
    return (
      <main>
        <p className="text-label-md text-muted">Catalogue</p>
        <h1
          className="mt-3 text-display-lg text-ink"
          style={{ fontFamily: "var(--font-bodoni)" }}
        >
          Piece Created
        </h1>
        <div className="mt-8 border border-platinum bg-linen px-6 py-8">
          <p role="status" className="text-body-md text-ink">
            {result.message} Reference: {result.productId}
          </p>
          <p className="mt-3 text-body-sm text-muted">
            It will appear in the catalogue list once live reads are connected.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/products"
              className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
            >
              Back to Products
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              Create Another
            </button>
          </div>
        </div>
      </main>
    );
  }

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
        Create Piece
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Describe the piece, add imagery, assign it to a collection, and define
        its purchasable variants.
      </p>

      {locked && (
        <p className="mt-6 border border-crimson px-4 py-3 text-body-md text-crimson">
          This piece is saved — completing the remaining steps below. Product
          details are locked to prevent duplicates.
        </p>
      )}

      <form onSubmit={submit} className="mt-10 flex max-w-3xl flex-col gap-10">
        <fieldset disabled={locked || submitting} className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Details</legend>
          <div className="flex flex-col gap-2">
            <label htmlFor="piece-name" className={labelClass}>Name *</label>
            <input id="piece-name" type="text" value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              placeholder="The Zaria Sculpted Gown" className={inputClass} />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="piece-slug" className={labelClass}>Slug *</label>
            <input id="piece-slug" type="text" value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugTouched(true);
              }}
              placeholder="the-zaria-sculpted-gown" className={inputClass} />
            <FieldError message={fieldErrors.slug} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="piece-description" className={labelClass}>Description</label>
            <textarea id="piece-description" rows={4} value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 w-full border border-hairline bg-canvas px-4 py-3 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none disabled:opacity-60" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="piece-price" className={labelClass}>Base price (₦) *</label>
              <input id="piece-price" type="text" inputMode="decimal" value={priceNgn}
                onChange={(event) => setPriceNgn(event.target.value)}
                placeholder="45000" className={inputClass} />
              <FieldError message={fieldErrors.priceNgn} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="piece-status" className={labelClass}>Status *</label>
              <select id="piece-status" value={status}
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
              <label htmlFor="piece-fabric" className={labelClass}>Fabric composition</label>
              <input id="piece-fabric" type="text" value={fabric}
                onChange={(event) => setFabric(event.target.value)}
                placeholder="Silk, cotton" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="piece-care" className={labelClass}>Care instructions</label>
              <input id="piece-care" type="text" value={care}
                onChange={(event) => setCare(event.target.value)}
                placeholder="Dry clean only, cool iron" className={inputClass} />
            </div>
          </div>
        </fieldset>

        <fieldset disabled={submitting} className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Imagery</legend>
          <ImagePicker onChange={setImages} />
        </fieldset>

        <fieldset disabled={locked || submitting} className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Collection</legend>
          <div className="flex flex-col gap-2">
            <label htmlFor="piece-collection" className={labelClass}>
              Collection (optional — empty means standalone)
            </label>
            <select id="piece-collection"
              value={collectionId ?? ""}
              onChange={(event) =>
                setCollectionId(event.target.value === "" ? null : event.target.value)
              }
              className={inputClass}>
              <option value="">Standalone piece</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            {collectionsError && (
              <p role="alert" className="text-body-sm text-crimson-vibrant">
                Collections could not be loaded ({collectionsError}). You can
                still save as a standalone piece.
              </p>
            )}
          </div>
        </fieldset>

        <fieldset disabled={submitting} className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Variants</legend>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-label-md text-ink">
            <input
              type="checkbox"
              checked={hasVariants}
              onChange={(event) => setHasVariants(event.target.checked)}
              className="h-4 w-4 accent-crimson"
            />
            This piece has variants
          </label>
          {hasVariants && (
            <VariantEditor
              variants={variants}
              errors={variantErrors}
              basePriceLabel={basePriceLabel}
              onChange={setVariants}
            />
          )}
        </fieldset>

        <fieldset disabled={locked || submitting} className="flex flex-col gap-5">
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

        {result && !result.ok && (
          <div className="border border-crimson px-4 py-4" role="alert">
            <p className="text-body-md text-ink">{result.message}</p>
            {result.steps && (
              <ul className="mt-3 flex flex-col gap-1 text-body-sm text-muted">
                <li>Product: {result.steps.product}</li>
                <li>
                  Images: {result.steps.imagesSucceeded} saved
                  {result.steps.imagesFailed > 0 &&
                    `, ${result.steps.imagesFailed} failed`}
                </li>
                <li>Variants: {result.steps.variants.replace(/_/g, " ")}</li>
              </ul>
            )}
            {result.productId && (
              <p className="mt-3 text-body-sm text-muted">
                Saved piece reference: {result.productId}. Product details are
                now locked — submitting again only retries the failed steps.
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep disabled:opacity-60"
          >
            {submitting ? "Creating…" : createdId ? "Complete Piece" : "Create Piece"}
          </button>
          <Link
            href="/admin/products"
            className="inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
