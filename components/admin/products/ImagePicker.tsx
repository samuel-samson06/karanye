"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/lib/admin/create-piece";

export interface PickedImage {
  id: string;
  file: File;
  preview: string;
  alt: string;
  isPrimary: boolean;
}

interface ImagePickerProps {
  onChange: (images: PickedImage[]) => void;
}

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Multi-image picker: previews are local object URLs (never uploaded until
// save). Owns file state; reports the list up for submission.
export default function ImagePicker({ onChange }: ImagePickerProps) {
  const [images, setImages] = useState<PickedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestRef = useRef<PickedImage[]>([]);

  useEffect(() => {
    latestRef.current = images;
    onChange(images);
  }, [images, onChange]);

  useEffect(() => {
    // Revoke previews on unmount so nothing leaks.
    return () => {
      latestRef.current.forEach((image) =>
        URL.revokeObjectURL(image.preview)
      );
    };
  }, []);

  const addFiles = (files: FileList | null): void => {
    if (!files) return;
    setError(null);
    const accepted: PickedImage[] = [];
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
        id:
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${file.name}`,
        file,
        preview: URL.createObjectURL(file),
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

  const update = (id: string, patch: Partial<PickedImage>): void =>
    setImages((current) =>
      current.map((image) =>
        patch.isPrimary === true
          ? { ...image, ...{ isPrimary: image.id === id } }
          : image.id === id
            ? { ...image, ...patch }
            : image
      )
    );

  const remove = (id: string): void =>
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      const next = current.filter((image) => image.id !== id);
      if (
        target?.isPrimary &&
        next.length > 0 &&
        !next.some((image) => image.isPrimary)
      ) {
        next[0] = { ...next[0], isPrimary: true };
      }
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
              key={image.id}
              className="border border-platinum bg-canvas p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.preview}
                alt={image.alt.trim() === "" ? "Selected product image" : image.alt}
                className="aspect-[3/4] w-full object-cover"
              />
              <p className="mt-2 text-label-md text-muted">
                {position + 1} of {images.length}
              </p>
              <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 text-label-md text-ink">
                <input
                  type="radio"
                  name="primary-image"
                  checked={image.isPrimary}
                  onChange={() => update(image.id, { isPrimary: true })}
                  className="h-4 w-4 accent-crimson"
                />
                Primary
              </label>
              <label
                htmlFor={`alt-${image.id}`}
                className="mt-2 block text-label-md text-muted"
              >
                Alt text (optional)
              </label>
              <input
                id={`alt-${image.id}`}
                type="text"
                value={image.alt}
                onChange={(event) => update(image.id, { alt: event.target.value })}
                placeholder="Falls back to product name"
                className="mt-1 h-12 min-h-11 w-full border border-hairline bg-canvas px-3 text-body-sm text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
              />
              <button
                type="button"
                onClick={() => remove(image.id)}
                aria-label={`Remove ${image.file.name}`}
                className="editorial-link mt-3 min-h-11 text-label-md text-crimson"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
