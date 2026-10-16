import Payments from "@/components/admin/payments/Payments";

// Lightweight route entry: the guard lives in the protected layout;
// composition lives in Payments.
export default function AdminPaymentsPage() {
  return <Payments />;
}
