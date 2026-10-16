import Link from "next/link";
import { formatNaira } from "@/lib/money";
import {
  formatAdminDate,
  mockOrders,
  type MockPayment,
} from "@/lib/admin/data";
import { PaymentStatusBadge } from "@/components/admin/orders/StatusBadges";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-1 py-1.5">
      <dt className="w-36 shrink-0 text-label-md text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 text-body-md text-ink">{value}</dd>
    </div>
  );
}

// Single transaction: identifiers, money, timing, and its order.
// Read-only; verification and refunds live outside this view.
export default function PaymentDetail({ payment }: { payment: MockPayment }) {
  const order = mockOrders.find(
    (candidate) => candidate.reference === payment.orderReference
  );

  return (
    <main>
      <Link
        href="/admin/payments"
        className="inline-flex min-h-11 items-center gap-3 text-label-md text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1" />
        </svg>
        Back
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-label-md text-muted">Payment</p>
          <h1
            className="mt-3 text-display-lg text-ink"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            {payment.paystackReference}
          </h1>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border border-platinum bg-canvas">
          <h2 className="border-b border-platinum px-6 py-5 text-headline-sm text-ink">
            Transaction
          </h2>
          <dl className="px-6 py-5">
            <Row label="Amount" value={formatNaira(payment.amountKobo)} />
            <Row label="Currency" value="NGN" />
            <Row
              label="Channel"
              value={
                payment.channel === "bank_transfer" ? "Bank Transfer" : "Card"
              }
            />
            <Row
              label="Paid at"
              value={payment.paidAt ? formatAdminDate(payment.paidAt) : "—"}
            />
            <Row label="Initiated" value={formatAdminDate(payment.createdAt)} />
          </dl>
        </section>
        <section className="border border-platinum bg-canvas">
          <h2 className="border-b border-platinum px-6 py-5 text-headline-sm text-ink">
            Order
          </h2>
          <div className="px-6 py-5">
            {order ? (
              <dl>
                <Row
                  label="Reference"
                  value={
                    <Link
                      href={`/admin/orders/${order.reference}`}
                      className="editorial-link text-label-md text-crimson"
                    >
                      {order.reference}
                    </Link>
                  }
                />
                <Row
                  label="Customer"
                  value={`${order.customerName} · ${order.email}`}
                />
                <Row label="Total" value={formatNaira(order.totalKobo)} />
                <Row
                  label="Amounts agree"
                  value={
                    order.totalKobo === payment.amountKobo ? "Yes" : "Mismatch"
                  }
                />
              </dl>
            ) : (
              <p className="text-body-md text-muted">
                The associated order is not in this dataset.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
