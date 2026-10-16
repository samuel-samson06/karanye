"use client";

import { useMemo, useState } from "react";
import PaymentsTable from "@/components/admin/payments/PaymentsTable";
import PaymentsToolbar, {
  type PaymentsFilter,
} from "@/components/admin/payments/PaymentsToolbar";
import { mockPayments } from "@/lib/admin/data";

const DEFAULT_FILTER: PaymentsFilter = { query: "", status: "all" };

// Payments composition: header, toolbar, table. Search/filter run
// client-side over mock records (clearly labelled prototype data).
export default function Payments() {
  const [filter, setFilter] = useState<PaymentsFilter>(DEFAULT_FILTER);

  const applyFilter = (next: PaymentsFilter): void => setFilter(next);

  const filtered = useMemo(() => {
    const query = filter.query.trim().toLowerCase();
    return mockPayments.filter((payment) => {
      if (filter.status !== "all" && payment.status !== filter.status)
        return false;
      if (
        query !== "" &&
        !`${payment.paystackReference} ${payment.orderReference}`
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
        Payments
      </h1>
      <p className="mt-4 max-w-xl text-body-md text-muted">
        Verified transaction outcomes, kept separate from order fulfilment.
      </p>

      <p className="mt-8 border border-platinum bg-linen px-4 py-3 text-label-md text-muted">
        Prototype — fictional demonstration data, not live transactions.
      </p>

      <div className="mt-6">
        <PaymentsToolbar
          value={filter}
          total={mockPayments.length}
          shown={filtered.length}
          onChange={applyFilter}
          onReset={() => applyFilter(DEFAULT_FILTER)}
        />
      </div>

      <div className="mt-6">
        <PaymentsTable payments={filtered} />
      </div>
    </main>
  );
}
