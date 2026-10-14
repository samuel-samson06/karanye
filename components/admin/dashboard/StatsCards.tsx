import { formatNaira } from "@/lib/money";
import { getKpis } from "@/lib/admin/data";
import StatCard from "@/components/admin/dashboard/StatCard";

// KPI row: delivered orders, customer records, product-value sales.
// Totals derive from the mock records (see lib/admin/data.ts), never typed twice.
export default function StatsCards() {
  const kpis = getKpis();

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
      <StatCard
        label="Total Completed Orders"
        value={String(kpis.completedOrders)}
        sub="Delivered, paid orders"
      />
      <StatCard
        label="Total Customers"
        value={String(kpis.customerRecords)}
        sub="Guest customer records"
      />
      <StatCard
        label="Total Sales"
        value={formatNaira(kpis.totalSalesKobo)}
        sub="Product value, delivered orders"
      />
    </div>
  );
}
