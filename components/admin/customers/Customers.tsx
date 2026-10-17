"use client";

import { useMemo, useState } from "react";
import CustomersTable from "@/components/admin/customers/CustomersTable";
import CustomersToolbar, {
  type CustomersFilter,
} from "@/components/admin/customers/CustomersToolbar";
import {
  getCustomerStats,
  getMockCustomers,
} from "@/lib/admin/customers";

const DEFAULT_FILTER: CustomersFilter = { query: "", orders: "all" };

// Customers composition: header, toolbar, table. Search/filter run
// client-side over derived mock records (clearly labelled prototype data)
// until live reads land.
export default function Customers() {
  const [filter, setFilter] = useState<CustomersFilter>(DEFAULT_FILTER);

  const applyFilter = (next: CustomersFilter): void => setFilter(next);

  const customers = useMemo(() => getMockCustomers(), []);

  const latestOrders = useMemo(() => {
    const map = new Map<string, import("@/lib/admin/data").MockOrder | null>();
    for (const customer of customers) {
      map.set(customer.email, getCustomerStats(customer.email).latestOrder);
    }
    return map;
  }, [customers]);

  const filtered = useMemo(() => {
    const query = filter.query.trim().toLowerCase();
    return customers.filter((customer) => {
      const stats = getCustomerStats(customer.email);
      if (filter.orders === "repeat" && stats.orderCount < 2) return false;
      if (filter.orders === "single" && stats.orderCount !== 1) return false;
      if (filter.orders === "none" && stats.orderCount !== 0) return false;
      if (
        query !== "" &&
        !`${customer.name} ${customer.email} ${customer.phone ?? ""}`
          .toLowerCase()
          .includes(query)
      )
        return false;
      return true;
    });
  }, [customers, filter]);

  return (
    <main>
      <p className="text-label-md text-muted">Commerce</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Customers
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Guest identities, one per email address, with their order history.
      </p>

      <p className="mt-8 border border-platinum bg-linen px-4 py-3 text-label-md text-muted">
        Prototype — fictional demonstration data, not live customers.
      </p>

      <div className="mt-6">
        <CustomersToolbar
          value={filter}
          total={customers.length}
          shown={filtered.length}
          onChange={applyFilter}
          onReset={() => applyFilter(DEFAULT_FILTER)}
        />
      </div>

      <div className="mt-6">
        <CustomersTable customers={filtered} latestOrders={latestOrders} />
      </div>
    </main>
  );
}
