import Orders from "@/components/admin/orders/Orders";

// Lightweight route entry: the guard lives in the protected layout;
// composition lives in Orders.
export default function AdminOrdersPage() {
  return <Orders />;
}
