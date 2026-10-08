import ProductCard from "@/components/reusable/ProductCard";
import type { ShopProduct } from "@/lib/data/shop";

interface ProductListProps {
  products: ShopProduct[];
}

// Pure grid renderer — no state. Pagination and filtering live in the page;
// this keeps the grid usable from any composition (head slice, tail slice).
export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
