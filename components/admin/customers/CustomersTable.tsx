"use client";

import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/money";
import {
  formatAdminDate,
  type MockOrder,
} from "@/lib/admin/data";
import {
  getCustomerStats,
  type MockCustomer,
} from "@/lib/admin/customers";

interface CustomersTableProps {
  customers: MockCustomer[];
  latestOrders: Map<string, MockOrder | null>;
}

// Compact customer directory. Order count and total order value derive from
// mockOrders at render time via getCustomerStats — never stored. Rows
// navigate to the customer detail route.
export default function CustomersTable({
  customers,
  latestOrders,
}: CustomersTableProps) {
  const router = useRouter();

  const openCustomer = (customerId: string): void => {
    router.push(`/admin/customers/${customerId}`);
  };

  const handleRowClick = (
    event: React.MouseEvent<HTMLTableRowElement>,
    customerId: string
  ): void => {
    // Never hijack nested controls, and never block text selection/copy.
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("a, button")
    )
      return;
    if (window.getSelection()?.toString() !== "") return;
    openCustomer(customerId);
  };

  const handleRowKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    customerId: string
  ): void => {
    // Keyboard activation is Enter or Space only (Space must not scroll).
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openCustomer(customerId);
  };

  if (customers.length === 0) {
    return (
      <div className="border border-platinum bg-linen px-6 py-14 text-center">
        <h2 className="text-headline-sm text-ink">No customers match</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-muted">
          Adjust the search or filters to view customers.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-platinum">
      <table className="w-full min-w-[960px] border-collapse bg-canvas text-left">
        <thead>
          <tr className="border-b border-platinum">
            {["Customer", "Phone", "Orders", "Total order value", "Latest order", "First seen"].map(
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
          {customers.map((customer) => {
            const stats = getCustomerStats(customer.email);
            const latest = latestOrders.get(customer.email) ?? null;
            return (
              <tr
                key={customer.id}
                role="link"
                tabIndex={0}
                aria-label={`Open customer ${customer.name}`}
                onClick={(event) => handleRowClick(event, customer.id)}
                onKeyDown={(event) => handleRowKeyDown(event, customer.id)}
                className="cursor-pointer transition-colors hover:bg-linen"
              >
                <td className="px-4 py-3">
                  <span className="block text-body-md text-ink">
                    {customer.name}
                  </span>
                  <span className="block text-body-sm text-muted">
                    {customer.email}
                  </span>
                </td>
                <td className="px-4 py-3 text-body-sm text-muted">
                  {customer.phone ?? "—"}
                </td>
                <td className="px-4 py-3 text-label-md text-ink">
                  {stats.orderCount}{" "}
                  {stats.orderCount === 1 ? "order" : "orders"}
                </td>
                <td className="px-4 py-3 text-label-md text-ink">
                  {formatNaira(stats.totalOrderValueKobo)}
                </td>
                <td className="px-4 py-3 text-body-sm text-muted">
                  {latest ? (
                    <>
                      <span className="block text-label-md text-ink">
                        {latest.reference}
                      </span>
                      <span className="block">
                        {formatAdminDate(latest.createdAt)}
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-body-sm text-muted">
                  {stats.firstOrderAt
                    ? formatAdminDate(stats.firstOrderAt)
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
