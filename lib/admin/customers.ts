// Mock-only customer directory derived from the dummy order catalogue.
// Guest-checkout model: one identity per email address, grouped from
// mockOrders — there is no live customer↔order join here. Counts and totals
// are computed from mockOrders at runtime, never hand-typed. Nothing here
// touches Supabase; stats stay consistent with the orders dashboard.
import { mockOrders, type MockOrder } from "@/lib/admin/data";

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface CustomerStats {
  orderCount: number;
  /** Sum of order totals (incl. delivery) — order value, not revenue. */
  totalOrderValueKobo: number;
  firstOrderAt: string | null;
  latestOrder: MockOrder | null;
}

// Identity mapping: email → mock id + display name/phone. Names and phones
// mirror the order snapshots so the directory agrees with order detail.
const identities: { email: string; id: string; phone: string | null }[] = [
  { email: "adaeze@example.com", id: "cus-adaeze", phone: "+234 801 234 5678" },
  { email: "funke@example.com", id: "cus-funke", phone: "+234 802 345 6789" },
  { email: "ngozi@example.com", id: "cus-ngozi", phone: "+234 803 456 7890" },
  { email: "chiamaka@example.com", id: "cus-chiamaka", phone: "+234 804 567 8901" },
  { email: "amina@example.com", id: "cus-amina", phone: "+234 805 678 9012" },
  { email: "yetunde@example.com", id: "cus-yetunde", phone: "+234 806 789 0123" },
  { email: "kemi@example.com", id: "cus-kemi", phone: null },
];

// Seeded no-order identity to exercise the empty-history state.
const noOrderIdentity: MockCustomer = {
  id: "cus-noorders",
  name: "No Orders Yet",
  email: "prospect@example.com",
  phone: null,
};

function displayName(email: string): string {
  const order = mockOrders.find((candidate) => candidate.email === email);
  return order?.customerName ?? email;
}

/** Full directory: order-backed identities plus the no-order seed. */
export function getMockCustomers(): MockCustomer[] {
  const backed: MockCustomer[] = identities.map((identity) => ({
    id: identity.id,
    name: displayName(identity.email),
    email: identity.email,
    phone: identity.phone,
  }));
  return [...backed, noOrderIdentity];
}

/** Orders for one customer email, newest first. */
export function getCustomerOrders(email: string): MockOrder[] {
  return mockOrders
    .filter((order) => order.email === email)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Derived stats from mockOrders — the single source of truth. */
export function getCustomerStats(email: string): CustomerStats {
  const orders = getCustomerOrders(email);
  if (orders.length === 0) {
    return {
      orderCount: 0,
      totalOrderValueKobo: 0,
      firstOrderAt: null,
      latestOrder: null,
    };
  }
  const oldest = [...orders].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  )[0];
  return {
    orderCount: orders.length,
    totalOrderValueKobo: orders.reduce(
      (sum, order) => sum + order.totalKobo,
      0
    ),
    firstOrderAt: oldest.createdAt,
    latestOrder: orders[0],
  };
}

/** Lookup by mock id for the detail route. */
export function getMockCustomerById(id: string): MockCustomer | undefined {
  return getMockCustomers().find((customer) => customer.id === id);
}
