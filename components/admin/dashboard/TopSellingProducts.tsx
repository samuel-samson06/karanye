import Image from "next/image";
import Link from "next/link";
import { getTopProducts } from "@/lib/admin/data";

// Ranked by units sold across paid, non-cancelled orders (ties by revenue).
// Images are existing repo assets, never invented URLs.
export default function TopSellingProducts() {
  const products = getTopProducts().slice(0, 5);

  return (
    <section
      aria-label="Top-selling products"
      className="flex flex-col border border-platinum bg-canvas"
    >
      <div className="flex items-center justify-between gap-4 border-b border-platinum px-6 py-5">
        <h2 className="text-headline-sm text-ink">Top Selling</h2>
        <Link
          href="/admin/products"
          className="editorial-link shrink-0 text-label-md text-crimson"
        >
          View Products
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="px-6 py-10 text-center text-body-md text-muted">
          No sales recorded yet.
        </p>
      ) : (
        <ol className="flex flex-col divide-y divide-platinum">
          {products.map((product, position) => (
            <li key={product.name} className="flex items-center gap-4 px-6 py-4">
              <span
                aria-hidden="true"
                className="w-6 shrink-0 text-label-md text-muted"
              >
                {String(position + 1).padStart(2, "0")}
              </span>
              {product.image !== "" && (
                <span className="relative block h-16 w-12 shrink-0 overflow-hidden border border-platinum">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-body-md text-ink">{product.name}</p>
                <p className="mt-1 text-label-md text-muted">
                  {product.unitsSold} {product.unitsSold === 1 ? "unit" : "units"} sold
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
