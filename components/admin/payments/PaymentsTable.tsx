"use client";

import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/money";
import {
  formatAdminDate,
  mockOrders,
  type MockPayment,
} from "@/lib/admin/data";
import { PaymentStatusBadge } from "@/components/admin/orders/StatusBadges";

interface PaymentsTableProps {
  payments: MockPayment[];
}

function customerFor(orderReference: string): string {
  const order = mockOrders.find((candidate) => candidate.reference === orderReference);
  return order ? `${order.customerName} · ${order.email}` : "—";
}

// Compact payments table. Rows navigate to the payment detail route.
export default function PaymentsTable({ payments }: PaymentsTableProps) {
  const router = useRouter();

  const openPayment = (paystackReference: string): void => {
    router.push(`/admin/payments/${paystackReference}`);
  };

  const handleRowClick = (
    event: React.MouseEvent<HTMLTableRowElement>,
    paystackReference: string
  ): void => {
    // Never hijack nested controls, and never block text selection/copy.
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("a, button")
    )
      return;
    if (window.getSelection()?.toString() !== "") return;
    openPayment(paystackReference);
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    paystackReference: string
  ): void => {
    // Keyboard activation is Enter or Space only (Space must not scroll).
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openPayment(paystackReference);
  };

  if (payments.length === 0) {
    return (
      <div className="border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No payments match</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Adjust the search or filters to view payments.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-platinum">
      <table className="w-full min-w-[960px] border-collapse bg-canvas text-left">
        <thead>
          <tr className="border-b border-platinum">
            {["Reference", "Order", "Customer", "Amount", "Channel", "Status", "Date"].map(
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
          {payments.map((payment) => (
            <tr
              key={payment.paystackReference}
              role="link"
              tabIndex={0}
              aria-label={`Open payment ${payment.paystackReference}`}
              onClick={(event) => handleRowClick(event, payment.paystackReference)}
              onKeyDown={(event) => handleRowKeyDown(event, payment.paystackReference)}
              className="cursor-pointer transition-colors hover:bg-linen"
            >
              <td className="px-4 py-3 text-label-md text-ink">
                {payment.paystackReference}
              </td>
              <td className="px-4 py-3 text-label-md text-ink">
                {payment.orderReference}
              </td>
              <td className="max-w-xs px-4 py-3">
                <span className="block truncate text-body-sm text-muted">
                  {customerFor(payment.orderReference)}
                </span>
              </td>
              <td className="px-4 py-3 text-label-md text-ink">
                {formatNaira(payment.amountKobo)}
              </td>
              <td className="px-4 py-3 text-body-md text-muted">
                {payment.channel === "bank_transfer" ? "Bank Transfer" : "Card"}
              </td>
              <td className="px-4 py-3">
                <PaymentStatusBadge status={payment.status} />
              </td>
              <td className="px-4 py-3 text-body-sm text-muted">
                {formatAdminDate(payment.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
