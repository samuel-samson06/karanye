import Link from "next/link";
import {
  formatAdminDate,
  getFulfilmentQueue,
  type MockOrder,
} from "@/lib/admin/data";

function statusLabel(status: MockOrder["status"]): string {
  return status
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function itemCount(order: MockOrder): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

// Paid, undelivered, non-cancelled orders — attention orders first.
// Capped at five; fulfilment actions arrive in a later milestone.
export default function PaidOrdersToFulfil() {
  const queue = getFulfilmentQueue().slice(0, 5);

  return (
    <section
      aria-label="Paid orders awaiting fulfilment"
      className="flex flex-col border border-platinum bg-canvas"
    >
      <div className="flex items-center justify-between gap-4 border-b border-platinum px-6 py-5">
        <h2 className="text-headline-sm text-ink">Paid Orders to Fulfil</h2>
        <Link
          href="/admin/orders"
          className="editorial-link shrink-0 text-label-md text-crimson"
        >
          View All Orders
        </Link>
      </div>

      {queue.length === 0 ? (
        <p className="px-6 py-10 text-center text-body-md text-muted">
          Nothing awaiting fulfilment. Paid orders will queue here.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-platinum">
          {queue.map((order) => (
            <li
              key={order.reference}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4"
            >
              <div className="min-w-0">
                <p className="text-label-md text-ink">{order.reference}</p>
                <p className="mt-1 truncate text-body-sm text-muted">
                  {order.customerName} · {itemCount(order)}{" "}
                  {itemCount(order) === 1 ? "item" : "items"} ·{" "}
                  {formatAdminDate(order.createdAt)}
                </p>
              </div>
              <span
                className={
                  order.status === "requires_attention"
                    ? "ml-auto border border-crimson px-3 py-2 text-label-md text-crimson"
                    : "ml-auto border border-platinum bg-linen px-3 py-2 text-label-md text-ink"
                }
              >
                {statusLabel(order.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
