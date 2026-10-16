"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  getMockPieceCount,
  type MockCollection,
} from "@/lib/admin/collections-mock";
import { validateCollection } from "@/lib/admin/collections";

const inputClass =
  "h-[52px] min-h-11 w-full border border-hairline bg-canvas px-4 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none";
const labelClass = "text-label-md text-muted";

// Mock-only detail + edit: session state only, resets on reload/navigation.
export default function CollectionDetail({
  collection,
}: {
  collection: MockCollection;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(collection.name);
  const [slug, setSlug] = useState(collection.slug);
  const [description, setDescription] = useState(collection.description ?? "");
  const [isVisible, setIsVisible] = useState(collection.isVisible);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const pieceCount = getMockPieceCount(collection.id);
  const shownName = editing || saved ? name : collection.name;
  const shownSlug = editing || saved ? slug : collection.slug;
  const shownDesc =
    editing || saved ? description : (collection.description ?? "");
  const shownVisible = editing || saved ? isVisible : collection.isVisible;

  const cancelEdit = (): void => {
    if (!saved) {
      setName(collection.name);
      setSlug(collection.slug);
      setDescription(collection.description ?? "");
      setIsVisible(collection.isVisible);
    }
    setErrors({});
    setEditing(false);
  };

  const saveEdit = (event: React.FormEvent): void => {
    event.preventDefault();
    const next = validateCollection({
      name,
      slug: slug.trim(),
      description,
      isVisible,
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSaved(true);
    setEditing(false);
  };

  return (
    <main>
      <Link
        href="/admin/collections"
        className="inline-flex min-h-11 items-center gap-3 text-label-md text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1" />
        </svg>
        Back to Collections
      </Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-label-md text-muted">Catalogue</p>
          <h1
            className="mt-3 text-display-lg text-ink"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            {shownName}
          </h1>
          <p className="mt-2 text-body-md text-muted">/{shownSlug}</p>
        </div>
        <span
          className={
            shownVisible
              ? "border border-ink px-3 py-2 text-label-md text-ink"
              : "border border-hairline px-3 py-2 text-label-md text-muted"
          }
        >
          {shownVisible ? "Visible" : "Hidden"}
        </span>
      </div>
      <p className="mt-8 border border-platinum bg-linen px-4 py-3 text-label-md text-muted">
        Prototype — fictional demonstration data. Edits stay in this session only.
      </p>

      {!editing ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="border border-platinum bg-canvas">
            <h2 className="border-b border-platinum px-6 py-5 text-headline-sm text-ink">
              Details
            </h2>
            <div className="px-6 py-5">
              <dl>
                <div className="flex flex-wrap gap-x-8 gap-y-1 py-1.5">
                  <dt className="w-36 shrink-0 text-label-md text-muted">Name</dt>
                  <dd className="min-w-0 flex-1 text-body-md text-ink">{shownName}</dd>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 py-1.5">
                  <dt className="w-36 shrink-0 text-label-md text-muted">Slug</dt>
                  <dd className="min-w-0 flex-1 text-body-md text-ink">{shownSlug}</dd>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 py-1.5">
                  <dt className="w-36 shrink-0 text-label-md text-muted">Description</dt>
                  <dd className="min-w-0 flex-1 text-body-md text-ink">
                    {shownDesc.trim() === "" ? (
                      <span className="text-muted">No description yet.</span>
                    ) : (
                      shownDesc
                    )}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 py-1.5">
                  <dt className="w-36 shrink-0 text-label-md text-muted">Pieces</dt>
                  <dd className="min-w-0 flex-1 text-body-md text-ink">
                    {pieceCount} {pieceCount === 1 ? "piece" : "pieces"}
                  </dd>
                </div>
              </dl>
              {saved && (
                <p role="status" className="mt-4 border border-platinum bg-linen px-4 py-3 text-body-md text-ink">
                  Saved for this session — resets on reload.
                </p>
              )}
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-6 inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep"
              >
                Edit Collection
              </button>
            </div>
          </section>
          <section className="border border-platinum bg-canvas">
            <h2 className="border-b border-platinum px-6 py-5 text-headline-sm text-ink">
              Cover Image
            </h2>
            <div className="px-6 py-5">
              {collection.imagePath ? (
                <span className="relative block aspect-[4/3] w-full max-w-sm overflow-hidden border border-platinum">
                  <Image
                    src={collection.imagePath}
                    alt={`${shownName} cover`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                  />
                </span>
              ) : (
                <span className="block aspect-[4/3] w-full max-w-sm border border-platinum bg-linen">
                  <span className="flex h-full items-center justify-center px-6 text-center text-label-md text-muted">
                    No cover image
                  </span>
                </span>
              )}
            </div>
          </section>
        </div>
      ) : (
        <form onSubmit={saveEdit} className="mt-6 flex flex-col gap-8 border border-platinum bg-canvas px-6 py-6">
          <fieldset className="flex flex-col gap-5">
            <legend className="text-headline-sm text-ink">Edit Collection</legend>
            <div className="flex flex-col gap-2">
              <label htmlFor="collection-name" className={labelClass}>Name *</label>
              <input id="collection-name" type="text" value={name}
                onChange={(event) => setName(event.target.value)} className={inputClass} />
              {errors.name && (
                <p role="alert" className="mt-1 text-body-sm text-crimson-vibrant">{errors.name}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="collection-slug" className={labelClass}>Slug *</label>
              <input id="collection-slug" type="text" value={slug}
                onChange={(event) => setSlug(event.target.value)} className={inputClass} />
              {errors.slug && (
                <p role="alert" className="mt-1 text-body-sm text-crimson-vibrant">{errors.slug}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="collection-description" className={labelClass}>Description</label>
              <textarea id="collection-description" value={description}
                onChange={(event) => setDescription(event.target.value)} rows={4}
                placeholder="No description yet."
                className="min-h-32 w-full border border-hairline bg-canvas px-4 py-3 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none" />
            </div>
            <p className="text-body-sm text-muted">
              Sort order: {collection.sortOrder} (display only).
            </p>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-label-md text-ink">
              <input type="checkbox" checked={isVisible}
                onChange={(event) => setIsVisible(event.target.checked)}
                className="h-4 w-4 accent-crimson" />
              Visible on the storefront
            </label>
          </fieldset>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit"
              className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson px-8 text-label-md text-canvas transition-colors hover:bg-crimson-deep">
              Save Changes
            </button>
            <button type="button" onClick={cancelEdit}
              className="inline-flex h-[52px] min-h-11 items-center justify-center border border-ink px-8 text-label-md text-ink transition-colors hover:bg-ink hover:text-canvas">
              Cancel
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
