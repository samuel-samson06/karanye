import ComplaintsOverview from "@/components/admin/dashboard/ComplaintsOverview";
import PaidOrdersToFulfil from "@/components/admin/dashboard/PaidOrdersToFulfil";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import TopSellingProducts from "@/components/admin/dashboard/TopSellingProducts";

// Dashboard composition: KPIs, then fulfilment (60%) beside best sellers
// (40%), then complaints. Panels stack on mobile without overflow.
export default function Dashboard() {
  return (
    <main>
      <p className="text-label-md text-muted">Atelier Admin</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Dashboard
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        The state of the house at a glance.
      </p>

      <p className="mt-8 border border-platinum bg-linen px-4 py-3 text-label-md text-muted">
        Prototype — fictional demonstration data, not live store metrics.
      </p>

      <div className="mt-6">
        <StatsCards />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PaidOrdersToFulfil />
        </div>
        <div className="lg:col-span-2">
          <TopSellingProducts />
        </div>
      </div>

      <div className="mt-6">
        <ComplaintsOverview />
      </div>
    </main>
  );
}
