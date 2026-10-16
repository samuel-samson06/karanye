"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/money";
import { formatAdminDate } from "@/lib/admin/data";
import {
  getCollectionName,
  getPrimaryImage,
  getStockSummary,
  type MockAdminProduct,
} from "@/lib/admin/products";

interface ProductsTableProps {
  products: MockAdminProduct[];
}

function statusBadge(status: MockAdminProduct["status"]): string {
  return status === "made_to_order" || status === "limited"
    ? "border border-crimson px-3 py-2 text-label-md text-crimson"
    : "border border-hairline px-3 py-2 text-label-md text-muted";
}

function statusLabel(status: MockAdminProduct["status"]): string {
  // Display-only abbreviation; the stored/filtered value stays made_to_order.
  if (status === "made_to_order") return "M.T.O";
  return status
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function stockCell(product: MockAdminProduct): React.ReactNode {
  const summary = getStockSummary(product);
  if (summary.kind === "units")
    return <span className="text-label-md text-ink">{summary.units} units</span>;
  if (summary.kind === "made_to_order")
    return <span className="text-label-md text-crimson">Made to Order</span>;
  return <span className="text-label-md text-muted">No variants</span>;
}

// Compact admin table. Horizontally scrollable below desktop widths;
// never shrinks columns into unreadability. Rows navigate to the existing
// product detail route (/admin/products/[id] — currently a skeleton page).
export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();

  const openProduct = (productId: string): void => {
    router.push(`/admin/products/${productId}`);
  };

  const handleRowClick = (
    event: React.MouseEvent<HTMLTableRowElement>,
    productId: string
  ): void => {
    // Never hijack nested controls, and never block text selection/copy.
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("a, button")
    )
      return;
    if (window.getSelection()?.toString() !== "") return;
    openProduct(productId);
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    productId: string
  ): void => {
    // Keyboard activation is Enter or Space only (Space must not scroll).
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openProduct(productId);
  };
  if (products.length === 0) {
    return (
      <div className="border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No pieces match</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Adjust the search or filters to view the catalogue.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-platinum">
      <table className="w-full min-w-[880px] border-collapse bg-canvas text-left">
        <thead>
          <tr className="border-b border-platinum">
            {["Piece", "Collection", "Price", "Stock", "Status", "MTM", "Updated"].map(
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
          {products.map((product) => {
            const image = getPrimaryImage(product);
            return (
              <tr
                key={product.id}
                role="link"
                tabIndex={0}
                aria-label={`Open ${product.name}`}
                onClick={(event) => handleRowClick(event, product.id)}
                onKeyDown={(event) => handleRowKeyDown(event, product.id)}
                className="cursor-pointer transition-colors hover:bg-linen"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    {image ? (
                      <span className="relative block h-14 w-11 shrink-0 overflow-hidden border border-platinum">
                        <Image
                          src={image.imageUrl}
                          alt={image.alt}
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
                    <span className="text-body-md text-ink">{product.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-body-md text-muted">
                  {getCollectionName(product.collectionId) ?? "—"}
                </td>
                <td className="px-4 py-3 text-label-md text-ink">
                  {formatNaira(product.priceKobo)}
                </td>
                <td className="px-4 py-3">{stockCell(product)}</td>
                <td className="px-4 py-3">
                  <span className={statusBadge(product.status)}>
                    {statusLabel(product.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-label-md text-ink">
                  {product.mtmAvailable ? "Yes" : "—"}
                </td>
                <td className="px-4 py-3 text-body-sm text-muted">
                  {formatAdminDate(product.updatedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
