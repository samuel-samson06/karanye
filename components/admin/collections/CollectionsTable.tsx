"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getMockPieceCount,
  type MockCollection,
} from "@/lib/admin/collections-mock";

interface CollectionsTableProps {
  collections: MockCollection[];
}

// Compact admin table mirroring the Products table conventions: clickable
// rows with keyboard support, canonical badges, horizontal scroll below
// desktop widths. Rows navigate to the existing collection detail route
// (/admin/collections/[id] — currently a skeleton page).
export default function CollectionsTable({ collections }: CollectionsTableProps) {
  const router = useRouter();

  const openCollection = (collectionId: string): void => {
    router.push(`/admin/collections/${collectionId}`);
  };

  const handleRowClick = (
    event: React.MouseEvent<HTMLTableRowElement>,
    collectionId: string
  ): void => {
    // Never hijack nested controls, and never block text selection/copy.
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("a, button")
    )
      return;
    if (window.getSelection()?.toString() !== "") return;
    openCollection(collectionId);
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    collectionId: string
  ): void => {
    // Keyboard activation is Enter or Space only (Space must not scroll).
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openCollection(collectionId);
  };

  if (collections.length === 0) {
    return (
      <div className="border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No collections yet</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Create your first collection to start grouping pieces.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-platinum">
      <table className="w-full min-w-[640px] border-collapse bg-canvas text-left">
        <thead>
          <tr className="border-b border-platinum">
            {["Collection", "Description", "Pieces", "Visibility"].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-4 py-3 text-label-md text-muted"
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-platinum">
          {collections.map((collection) => (
            <tr
              key={collection.id}
              role="link"
              tabIndex={0}
              aria-label={`Open ${collection.name}`}
              onClick={(event) => handleRowClick(event, collection.id)}
              onKeyDown={(event) => handleRowKeyDown(event, collection.id)}
              className="cursor-pointer transition-colors hover:bg-linen"
            >
              <td className="px-4 py-3">
                <span className="flex items-center gap-3">
                  {collection.imagePath ? (
                    <span className="relative block h-14 w-11 shrink-0 overflow-hidden border border-platinum">
                      <Image
                        src={collection.imagePath}
                        alt={`${collection.name} cover`}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="block h-14 w-11 shrink-0 border border-platinum bg-linen"
                    />
                  )}
                  <span className="text-body-md text-ink">{collection.name}</span>
                </span>
              </td>
              <td className="max-w-xs px-4 py-3">
                {collection.description ? (
                  <span className="block truncate text-body-md text-muted">
                    {collection.description}
                  </span>
                ) : (
                  <span className="text-label-md text-muted">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-label-md text-ink">
                {getMockPieceCount(collection.id)}{" "}
                {getMockPieceCount(collection.id) === 1 ? "piece" : "pieces"}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    collection.isVisible
                      ? "border border-ink px-3 py-2 text-label-md text-ink"
                      : "border border-hairline px-3 py-2 text-label-md text-muted"
                  }
                >
                  {collection.isVisible ? "Visible" : "Hidden"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
