"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/admin/create-piece";
import {
  slugify,
  validateCollection,
} from "@/lib/admin/collections";
import { createCollectionAction } from "@/lib/admin/collection-actions";

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

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Collection creation form: name, auto+editable slug, description, optional
// single cover image, visibility toggle. Submit is disabled while saving
// (no double-submit); success redirects to the collections list.
export default function CreateCollectionForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const goBack = (): void => {
    if (window.history.length > 1) router.back();
    else router.push("/admin/collections");
  };

  const pickFile = (files: FileList | null): void => {
    if (!files || files.length === 0) return;
    const candidate = files[0];
    if (!ACCEPTED_IMAGE_TYPES.includes(candidate.type)) {
      setFileError(`"${candidate.name}" is not a JPEG, PNG, or WebP file.`);
      return;
    }
    if (candidate.size > MAX_IMAGE_BYTES) {
      setFileError(
        `"${candidate.name}" is ${formatSize(candidate.size)} — the limit is ${formatSize(MAX_IMAGE_BYTES)}.`
      );
      return;
    }
    setFileError(null);
    if (preview) URL.revokeObjectURL(preview);
    setFile(candidate);
    setPreview(URL.createObjectURL(candidate));
  };

  const clearFile = (): void => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (submitting) return;

    const errors = validateCollection({
      name,
      slug: slug.trim(),
      description,
      isVisible,
    });
    setFieldErrors(errors);
    setSubmitError(null);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "payload",
        JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description,
          isVisible,
        })
      );
      if (file) formData.append("file", file);
      const outcome = await createCollectionAction(formData);
      if (outcome.fieldErrors) setFieldErrors(outcome.fieldErrors);
      // Full success (row saved, image saved or not requested) redirects.
      // Partial success (image step failed) stays here so the exact outcome
      // is read — redirecting would silently drop the warning.
      if (outcome.ok && outcome.imageStep !== "failed") {
        router.push("/admin/collections");
        router.refresh();
      } else {
        setSubmitError(outcome.message);
      }
    } catch {
      setSubmitError("Something went wrong submitting the form. Nothing was confirmed saved.");
    } finally {
      setSubmitting(false);
    }
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
        New Collection
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Group pieces under a merchandising collection with its own slug and
        cover image.
      </p>

      <form onSubmit={submit} className="mt-10 flex max-w-3xl flex-col gap-10">
        <fieldset disabled={submitting} className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Details</legend>
          <div className="flex flex-col gap-2">
            <label htmlFor="collection-name" className={labelClass}>Name *</label>
            <input id="collection-name" type="text" value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              placeholder="Evening Gowns" className={inputClass} />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="collection-slug" className={labelClass}>Slug *</label>
            <input id="collection-slug" type="text" value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugTouched(true);
              }}
              placeholder="evening-gowns" className={inputClass} />
            <FieldError message={fieldErrors.slug} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="collection-description" className={labelClass}>Description</label>
            <textarea id="collection-description" rows={4} value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 w-full border border-hairline bg-canvas px-4 py-3 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none disabled:opacity-60" />
          </div>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-label-md text-ink">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(event) => setIsVisible(event.target.checked)}
              className="h-4 w-4 accent-crimson"
            />
            Visible on the storefront
          </label>
        </fieldset>

        <fieldset disabled={submitting} className="flex flex-col gap-5">
          <legend className="text-headline-sm text-ink">Cover Image</legend>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-12 min-h-11 items-center border border-ink px-6 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              {preview ? "Replace Image" : "Select Image"}
            </button>
            <p className="text-body-sm text-muted">
              Optional. JPEG, PNG, or WebP, up to {formatSize(MAX_IMAGE_BYTES)}.
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="hidden"
            aria-label="Select collection cover image"
            onChange={(event) => pickFile(event.target.files)}
          />
          {fileError && (
            <p role="alert" className="text-body-sm text-crimson-vibrant">
              {fileError}
            </p>
          )}
          {preview && (
            <div className="border border-platinum bg-canvas p-3 sm:max-w-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={name.trim() === "" ? "Collection cover preview" : `${name.trim()} cover preview`}
                className="aspect-[4/3] w-full object-cover"
              />
              <button
                type="button"
                onClick={clearFile}
                className="editorial-link mt-3 min-h-11 text-label-md text-crimson"
              >
                Remove
              </button>
            </div>
          )}
        </fieldset>

        {submitError && (
          <p role="alert" className="border border-crimson px-4 py-4 text-body-md text-ink">
            {submitError}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create Collection"}
          </button>
          <Link
            href="/admin/collections"
            className="inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
