import Products from "@/components/admin/products/Products";

// Lightweight route entry: the guard lives in the protected layout;
// composition lives in Products.
export default function AdminProductsPage() {
  return <Products />;
}
