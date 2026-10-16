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

export default async function AdminOrderDetailPage({ params }: OrderPageProps) {
  const { reference } = await params;
  const order = mockOrders.find((candidate) => candidate.reference === reference);

  if (!order) notFound();

  return <OrderDetail order={order} />;
}
