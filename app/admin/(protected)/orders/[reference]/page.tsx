import { Suspense } from "react";
import { notFound } from "next/navigation";
import OrderDetail from "@/components/admin/orders/OrderDetail";
import { mockOrders } from "@/lib/admin/data";

interface OrderPageProps {
  params: Promise<{ reference: string }>;
}

// Mock-only detail route: resolves the order from the dummy catalogue.
// Unknown references use notFound(). Live reads replace this lookup.
export function generateStaticParams(): { reference: string }[] {
  return mockOrders.map((order) => ({ reference: order.reference }));
}

// Lightweight shell shown while the URL-dependent section resolves.
function OrderLoading() {
  return (
    <main aria-busy="true">
      <p className="text-label-md text-muted">Commerce</p>
      <div
        role="status"
        className="mt-3 border border-platinum bg-linen px-6 py-14 text-center"
      >
        <p className="text-body-md text-muted">Loading order…</p>
      </div>
    </main>
  );
}

// URL-dependent section: unwraps params (the instant-shell trigger) inside
// the Suspense boundary so navigations paint the shell first.
async function OrderLoader({ params }: OrderPageProps) {
  const { reference } = await params;
  const order = mockOrders.find((candidate) => candidate.reference === reference);

  if (!order) notFound();

  return <OrderDetail order={order} />;
}


export default function AdminOrderDetailPage({ params }: OrderPageProps) {
  return (
    <Suspense fallback={<OrderLoading />}>
      <OrderLoader params={params} />
    </Suspense>
  );
}
