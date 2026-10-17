import Customers from "@/components/admin/customers/Customers";

// Lightweight route entry: the guard lives in the protected layout;
// composition lives in Customers.
export default function AdminCustomersPage() {
  return <Customers />;
}

