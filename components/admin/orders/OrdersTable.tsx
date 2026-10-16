"use client";

import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/money";
import {
  formatAdminDate,
  getOrderPayment,
  type MockOrder,
} from "@/lib/admin/data";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/orders/StatusBadges";

interface OrdersTableProps {
  orders: MockOrder[];
}

function itemCount(order: MockOrder): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

// Compact orders table. Payment status always comes from payment records,
// never inferred from the order row. Rows navigate to the order detail route.
export default function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();

  const openOrder = (reference: string): void => {
    router.push(`/admin/orders/${reference}`);
  };

  const handleRowClick = (
    event: React.MouseEvent<HTMLTableRowElement>,
    reference: string
  ): void => {
    // Never hijack nested controls, and never block text selection/copy.
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("a, button")
    )
      return;
    if (window.getSelection()?.toString() !== "") return;
    openOrder(reference);
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    reference: string
  ): void => {
    // Keyboard activation is Enter or Space only (Space must not scroll).
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openOrder(reference);
  };

  if (orders.length === 0) {
    return (
      <div className="border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No orders match</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Adjust the search or filters to view orders.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-platinum">
      <table className="w-full min-w-[960px] border-collapse bg-canvas text-left">
        <thead>
          <tr className="border-b border-platinum">
            {["Reference", "Customer", "Items", "Date", "Total", "Order", "Payment"].map(
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
            return (
              <tr
                key={order.reference}
                role="link"
                tabIndex={0}
                aria-label={`Open order ${order.reference}`}
                onClick={(event) => handleRowClick(event, order.reference)}
                onKeyDown={(event) => handleRowKeyDown(event, order.reference)}
                className="cursor-pointer transition-colors hover:bg-linen"
              >
                <td className="px-4 py-3 text-label-md text-ink">
                  {order.reference}
                </td>
                <td className="px-4 py-3">
                  <span className="block text-body-md text-ink">
                    {order.customerName}
                  </span>
                  <span className="block text-body-sm text-muted">
                    {order.email}
                  </span>
                </td>
                <td className="px-4 py-3 text-label-md text-ink">
                  {itemCount(order)} {itemCount(order) === 1 ? "item" : "items"}
                </td>
                <td className="px-4 py-3 text-body-sm text-muted">
                  {formatAdminDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-label-md text-ink">
                  {formatNaira(order.totalKobo)}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3">
                  {payment ? (
                    <PaymentStatusBadge status={payment.status} />
                  ) : (
                    <span className="text-label-md text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
