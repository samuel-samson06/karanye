import type { MockOrderStatus, MockPaymentStatus } from "@/lib/admin/data";

function humanize(value: string): string {
  return value
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// Shared commerce badges (orders + payments). Crimson-bordered for attention
// states, hairline/muted otherwise — canonical §3.7 mapping.
export function OrderStatusBadge({ status }: { status: MockOrderStatus }) {
  const attention =
    status === "requires_attention" || status === "pending_payment";
  return (
    <span
      className={
        attention
          ? "border border-crimson px-3 py-2 text-label-md text-crimson"
          : "border border-hairline px-3 py-2 text-label-md text-muted"
      }
    >
      {humanize(status)}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: MockPaymentStatus }) {
  const failed = status === "failed";
  const ok = status === "success";
  return (
    <span
      className={
        failed
          ? "border border-crimson px-3 py-2 text-label-md text-crimson"
          : ok
            ? "border border-ink px-3 py-2 text-label-md text-ink"
            : "border border-hairline px-3 py-2 text-label-md text-muted"
      }
    >
      {humanize(status)}
    </span>
  );
}
