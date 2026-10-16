"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/lib/admin/create-piece";

export interface InitialImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface EditableImage {
  key: string;
  /** Database row id for existing images; null for newly picked files. */
  existingId: string | null;
  file: File | null;
  /** Existing image_url or a local object URL for new files. */
  src: string;
  alt: string;
  isPrimary: boolean;
}

interface ImagePickerProps {
  /** Existing rows (edit flow). Omit for create flow. */
  initial?: InitialImage[];
  /** Show up/down ordering controls (edit flow). */
  orderable?: boolean;
  onChange: (images: EditableImage[]) => void;
}

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function newKey(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Image manager: previews are existing URLs or local object URLs (new files
// are never uploaded until save). Reports the unified ordered list up;
// the parent derives new files, kept rows, and removed row ids from it.
export default function ImagePicker({
  initial = [],
  orderable = false,
  onChange,
}: ImagePickerProps) {
  const [images, setImages] = useState<EditableImage[]>(() =>
    initial.map((row) => ({
      key: `existing:${row.id}`,
      existingId: row.id,
      file: null,
      src: row.url,
      alt: row.alt,
      isPrimary: row.isPrimary,
    }))
  );
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestRef = useRef<EditableImage[]>([]);

  useEffect(() => {
    latestRef.current = images;
    onChange(images);
  }, [images, onChange]);

  useEffect(() => {
    // Revoke local previews on unmount so nothing leaks.
    return () => {
      latestRef.current.forEach((image) => {
        if (image.file) URL.revokeObjectURL(image.src);
      });
    };
  }, []);

  const addFiles = (files: FileList | null): void => {
    if (!files) return;
    setError(null);
    const accepted: EditableImage[] = [];
    for (const file of Array.from(files)) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError(`"${file.name}" is not a JPEG, PNG, or WebP file.`);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(
          `"${file.name}" is ${formatSize(file.size)} — the limit is ${formatSize(MAX_IMAGE_BYTES)}.`
        );
        continue;
      }
      accepted.push({
        key: newKey(),
        existingId: null,
        file,
        src: URL.createObjectURL(file),
        alt: "",
        isPrimary: false,
      });
    }
    if (accepted.length > 0) {
      setImages((current) => {
        const next = [...current, ...accepted];
        // First image in is primary until the admin chooses otherwise.
        if (!next.some((image) => image.isPrimary) && next.length > 0) {
          next[0] = { ...next[0], isPrimary: true };
        }
        return next;
      });
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const update = (key: string, patch: Partial<EditableImage>): void =>
    setImages((current) =>
      current.map((image) =>
        patch.isPrimary === true
          ? { ...image, isPrimary: image.key === key }
          : image.key === key
            ? { ...image, ...patch }
            : image
      )
    );

  const remove = (key: string): void =>
    setImages((current) => {
      const target = current.find((image) => image.key === key);
      if (target?.file) URL.revokeObjectURL(target.src);
      const next = current.filter((image) => image.key !== key);
      if (
        target?.isPrimary &&
        next.length > 0 &&
        !next.some((image) => image.isPrimary)
      ) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });

  const move = (key: string, direction: -1 | 1): void =>
    setImages((current) => {
      const from = current.findIndex((image) => image.key === key);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-12 min-h-11 items-center border border-ink px-6 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas"
        >
          Select Images
        </button>
        <p className="text-body-sm text-muted">
          JPEG, PNG, or WebP, up to {formatSize(MAX_IMAGE_BYTES)} each.
          {images.length === 0
            ? " Images are optional."
            : ` ${images.length} selected.`}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        aria-label="Select product images"
        onChange={(event) => addFiles(event.target.files)}
      />
      {error && (
        <p role="alert" className="mt-3 text-body-sm text-crimson-vibrant">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image, position) => (
            <li
              key={image.key}
              className="border border-platinum bg-canvas p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt.trim() === "" ? "Selected product image" : image.alt}
                className="aspect-[3/4] w-full object-cover"
              />
              <p className="mt-2 text-label-md text-muted">
                {position + 1} of {images.length}
              </p>
              <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 text-label-md text-ink">
                <input
                  type="radio"
                  name={`primary-image-${orderable ? "edit" : "new"}`}
                  checked={image.isPrimary}
                  onChange={() => update(image.key, { isPrimary: true })}
                  className="h-4 w-4 accent-crimson"
                />
                Primary
              </label>
              <label
                htmlFor={`alt-${image.key}`}
                className="mt-2 block text-label-md text-muted"
              >
                Alt text (optional)
              </label>
              <input
                id={`alt-${image.key}`}
                type="text"
                value={image.alt}
                onChange={(event) => update(image.key, { alt: event.target.value })}
                placeholder="Falls back to product name"
                className="mt-1 h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
              />
              <div className="mt-3 flex items-center gap-4">
                {orderable && (
                  <>
                    <button
                      type="button"
                      onClick={() => move(image.key, -1)}
                      disabled={position === 0}
                      aria-label={`Move image ${position + 1} earlier`}
                      className="flex min-h-11 min-w-11 items-center justify-center border border-platinum text-ink disabled:opacity-60"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M7 12V2M3.5 5.5L7 2l3.5 3.5" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => move(image.key, 1)}
                      disabled={position === images.length - 1}
                      aria-label={`Move image ${position + 1} later`}
                      className="flex min-h-11 min-w-11 items-center justify-center border border-platinum text-ink disabled:opacity-60"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M7 2v10M3.5 8.5L7 12l3.5-3.5" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => remove(image.key)}
                  aria-label={`Remove image ${position + 1}`}
                  className="editorial-link min-h-11 text-label-md text-crimson"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
