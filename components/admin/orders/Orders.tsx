"use client";

import { useMemo, useState } from "react";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrdersToolbar, {
  type OrdersFilter,
} from "@/components/admin/orders/OrdersToolbar";
import { mockOrders } from "@/lib/admin/data";

const DEFAULT_FILTER: OrdersFilter = { query: "", status: "all" };

// Orders composition: header, toolbar, table. Search/filter run client-side
// over mock records (clearly labelled prototype data) until live reads land.
export default function Orders() {
  const [filter, setFilter] = useState<OrdersFilter>(DEFAULT_FILTER);

  const applyFilter = (next: OrdersFilter): void => setFilter(next);

  const filtered = useMemo(() => {
    const query = filter.query.trim().toLowerCase();
    return mockOrders.filter((order) => {
      if (filter.status !== "all" && order.status !== filter.status)
        return false;
      if (
        query !== "" &&
        !`${order.reference} ${order.customerName} ${order.email}`
          .toLowerCase()
          .includes(query)
      )
        return false;
      return true;
    });
  }, [filter]);

  return (
    <main>
      <p className="text-label-md text-muted">Commerce</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Orders
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Guest orders with purchase-time snapshots, from payment to delivery.
      </p>

      <p className="mt-8 border border-platinum bg-linen px-4 py-3 text-label-md text-muted">
        Prototype — fictional demonstration data, not live orders.
      </p>

      <div className="mt-6">
        <OrdersToolbar
          value={filter}
          total={mockOrders.length}
          shown={filtered.length}
          onChange={applyFilter}
          onReset={() => applyFilter(DEFAULT_FILTER)}
        />
      </div>

      <div className="mt-6">
        <OrdersTable orders={filtered} />
      </div>
    </main>
  );
}
