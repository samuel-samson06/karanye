import Link from "next/link";
import { formatNaira } from "@/lib/money";
import { formatAdminDate, getOrderPayment } from "@/lib/admin/data";
import {
  getCustomerOrders,
  getCustomerStats,
  type MockCustomer,
} from "@/lib/admin/customers";
import { OrderStatusBadge } from "@/components/admin/orders/StatusBadges";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-platinum bg-canvas">
      <h2 className="border-b border-platinum px-6 py-5 text-headline-sm text-ink">
        {title}
      </h2>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-1 py-1.5">
      <dt className="w-36 shrink-0 text-label-md text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 text-body-md text-ink">{value}</dd>
    </div>
  );
}

// Single customer: contact snapshot, derived stats, and order history.
// Read-only; all figures derive from mockOrders at render time.
export default function CustomerDetail({
  customer,
}: {
  customer: MockCustomer;
}) {
  const stats = getCustomerStats(customer.email);
  const orders = getCustomerOrders(customer.email);

  return (
    <main>
      <Link
        href="/admin/customers"
        className="inline-flex min-h-11 items-center gap-3 text-label-md text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1" />
        </svg>
        Back
      </Link>

      <div className="mt-6">
        <p className="text-label-md text-muted">Customer</p>
        <h1
          className="mt-3 text-display-lg text-ink"
          style={{ fontFamily: "var(--font-bodoni)" }}
        >
          {customer.name}
        </h1>
        <p className="mt-2 text-body-md text-muted">{customer.email}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Contact">
          <dl>
            <Row label="Name" value={customer.name} />
            <Row label="Email" value={customer.email} />
            <Row label="Phone" value={customer.phone ?? "—"} />
          </dl>
        </Section>
        <Section title="Overview">
          <dl>
            <Row
              label="Orders"
              value={`${stats.orderCount} ${stats.orderCount === 1 ? "order" : "orders"}`}
            />
            <Row
              label="Total order value"
              value={formatNaira(stats.totalOrderValueKobo)}
            />
            <Row
              label="First seen"
              value={
                stats.firstOrderAt ? formatAdminDate(stats.firstOrderAt) : "—"
              }
            />
          </dl>
          <p className="mt-4 text-body-sm text-muted">
            Total order value is the sum of order totals, including delivery
            fees. It is not revenue received.
          </p>
        </Section>
      </div>

      <div className="mt-6">
        <Section title={`Order history (${orders.length})`}>
          {orders.length === 0 ? (
            <p className="text-body-md text-muted">
              No orders yet for this customer.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-platinum">
                    {["Reference", "Date", "Items", "Total", "Status"].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-4 py-3 text-label-md text-muted"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-platinum">
                  {orders.map((order) => {
                    const payment = getOrderPayment(order.reference);
                    const itemCount = order.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );
                    return (
                      <tr key={order.reference}>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/orders/${order.reference}`}
                            className="editorial-link text-label-md text-crimson"
                          >
                            {order.reference}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-body-sm text-muted">
                          {formatAdminDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-label-md text-ink">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </td>
                        <td className="px-4 py-3 text-label-md text-ink">
                          {formatNaira(order.totalKobo)}
                          {payment?.status !== "success" && (
                            <span className="block text-body-sm text-muted">
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
