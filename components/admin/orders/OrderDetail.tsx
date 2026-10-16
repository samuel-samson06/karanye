import Link from "next/link";
import { formatNaira } from "@/lib/money";
import {
  formatAdminDate,
  getOrderEvents,
  getOrderPayment,
  type MockOrder,
} from "@/lib/admin/data";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/orders/StatusBadges";

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

// Full order record: snapshots, money, payments, and history. Read-only;
// fulfilment actions arrive with order management.
export default function OrderDetail({ order }: { order: MockOrder }) {
  const payment = getOrderPayment(order.reference);
  const events = getOrderEvents(order.reference);

  return (
    <main>
      <Link
        href="/admin/orders"
        className="inline-flex min-h-11 items-center gap-3 text-label-md text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1" />
        </svg>
        Back
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-label-md text-muted">Order</p>
          <h1
            className="mt-3 text-display-lg text-ink"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            {order.reference}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <OrderStatusBadge status={order.status} />
          {payment && <PaymentStatusBadge status={payment.status} />}
        </div>
      </div>
      <p className="mt-4 text-body-md text-muted">
        Placed {formatAdminDate(order.createdAt)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Customer">
          <dl>
            <Row label="Name" value={order.customerName} />
            <Row label="Email" value={order.email} />
            <Row label="Phone" value={order.phone} />
          </dl>
        </Section>
        <Section title="Delivery">
          <dl>
            <Row label="Address" value={order.deliveryAddress} />
            <Row label="City" value={order.deliveryCity} />
            <Row label="Country" value={order.deliveryCountry} />
          </dl>
        </Section>
      </div>

      <div className="mt-6">
        <Section title={`Items (${order.items.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-platinum">
                  {["Piece", "Size", "Colour", "Sizing", "Qty", "Unit Price", "Line Total"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-4 py-3 text-label-md text-muted first:pl-0 last:pr-0"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum">
                {order.items.map((item, index) => (
                  <tr key={`${item.productName}-${index}`}>
                    <td className="px-4 py-3 text-body-md text-ink first:pl-0">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 text-body-md text-muted">
                      {item.sizeLabel ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-body-md text-muted">
                      {item.colour ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="block text-label-md text-ink">
                        {item.sizingType === "made_to_measure"
                          ? "Made to Measure"
                          : "Standard"}
                      </span>
                      {item.measurements && (
                        <span className="mt-1 block text-body-sm text-muted">
                          {Object.entries(item.measurements)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" · ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-label-md text-ink">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-label-md text-ink">
                      {formatNaira(item.unitPriceKobo)}
                    </td>
                    <td className="px-4 py-3 text-label-md text-ink last:pr-0">
                      {formatNaira(item.unitPriceKobo * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Money">
          <dl>
            <Row label="Subtotal" value={formatNaira(order.subtotalKobo)} />
            <Row
              label="Discount"
              value={
                order.discountKobo > 0
                  ? `−${formatNaira(order.discountKobo)}`
                  : formatNaira(0)
              }
            />
            <Row label="Delivery" value={formatNaira(order.deliveryFeeKobo)} />
            <Row
              label="Total (NGN)"
              value={
                <strong className="font-medium">
                  {formatNaira(order.totalKobo)}
                </strong>
              }
            />
          </dl>
        </Section>
        <Section title="Payments">
          {payment ? (
            <dl>
              <Row label="Reference" value={payment.paystackReference} />
              <Row label="Amount" value={formatNaira(payment.amountKobo)} />
              <Row label="Channel" value={payment.channel} />
              <Row
                label="Paid at"
                value={payment.paidAt ? formatAdminDate(payment.paidAt) : "—"}
              />
              <Row
                label="Order"
                value={
                  <Link
                    href={`/admin/orders/${order.reference}`}
                    className="editorial-link text-label-md text-crimson"
                  >
                    {order.reference}
                  </Link>
                }
              />
            </dl>
          ) : (
            <p className="text-body-md text-muted">
              No payment record for this order.
            </p>
          )}
          <p className="mt-4 text-body-sm text-muted">
            Verification and refunds are handled outside this view.
          </p>
        </Section>
      </div>

      <div className="mt-6">
        <Section title={`History (${events.length})`}>
          {events.length === 0 ? (
            <p className="text-body-md text-muted">No recorded events.</p>
          ) : (
            <ol className="flex flex-col">
              {events.map((event) => (
                <li
                  key={`${event.status}-${event.createdAt}`}
                  className="flex flex-wrap gap-x-6 gap-y-1 border-b border-platinum py-3 last:border-b-0"
                >
                  <span className="w-40 shrink-0 text-body-sm text-muted">
                    {formatAdminDate(event.createdAt)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-label-md text-ink">
                      {event.status
                        .split("_")
                        .map((word) => word[0].toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                    {event.note && (
                      <span className="mt-1 block text-body-sm text-muted">
                        {event.note}
                        {event.changedBy === "admin" ? " — Atelier admin" : ""}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Section>
      </div>
    </main>
  );
}
