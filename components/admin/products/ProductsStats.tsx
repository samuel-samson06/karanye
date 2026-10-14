import { formatNaira } from "@/lib/money";
import { getProductStats } from "@/lib/admin/products";
import StatCard from "@/components/admin/dashboard/StatCard";

// Catalogue statistics row. StatCard is reused unchanged — its generic
// label/value/sub API needs nothing product-specific.
export default function ProductsStats() {
  const stats = getProductStats();

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
      <StatCard
        label="Total Products"
        value={String(stats.totalProducts)}
        sub="Non-archived pieces, drafts included"
      />
      <StatCard
        label="Low Stock"
        value={String(stats.lowStockVariants)}
        sub="Variants at or below 3 units"
      />
      <StatCard
        label="Inventory Value"
        value={formatNaira(stats.inventoryValueKobo)}
        sub="Retail value of physical stock"
      />
    </div>
  );
}
