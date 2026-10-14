import Dashboard from "@/components/admin/dashboard/Dashboard";

// Lightweight route entry: the guard lives in the protected layout;
// composition lives in Dashboard.
export default function AdminDashboardPage() {
  return <Dashboard />;
}
