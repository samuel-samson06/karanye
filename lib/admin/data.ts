// Phase A dashboard mock data — clearly fictional demonstration records.
// Shape mirrors sql/01_core_schema.sql field names, statuses, and types.
// Nothing here touches Supabase. Phase B replaces this module's source with
// server-fetched rows of the same shape.
//
// Payment truth lives in mockPayments, never inferred from order status:
// an order counts as paid only with a 'success' payment row.

export type MockOrderStatus =
  | "pending_payment"
  | "awaiting_fulfilment"
  | "in_production"
  | "ready"
  | "shipped"
  | "delivered"
  | "requires_attention"
  | "cancelled";

export type MockPaymentStatus = "pending" | "success" | "failed";

export type MockComplaintStatus = "open" | "in_review" | "resolved" | "closed";

export interface MockOrderItem {
  productName: string;
  unitPriceKobo: number;
  quantity: number;
}

export interface MockOrder {
  reference: string;
  customerName: string;
  email: string;
  status: MockOrderStatus;
  items: MockOrderItem[];
  subtotalKobo: number;
  discountKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
  createdAt: string;
}

export interface MockPayment {
  orderReference: string;
  status: MockPaymentStatus;
  amountKobo: number;
  channel: string;
}

export interface MockCustomer {
  name: string;
  email: string;
}

export interface MockProduct {
  name: string;
  image: string;
}

export interface MockComplaint {
  subject: string;
  customerName: string;
  status: MockComplaintStatus;
  createdAt: string;
}

export const mockProducts: MockProduct[] = [
  { name: "The Zaria Sculpted Gown", image: "/images/style_01.jpeg" },
  { name: "The Amina Draped Silk Trench", image: "/images/style_05.jpeg" },
  { name: "The Moremi Cape Blazer", image: "/images/style_03.jpeg" },
  { name: "The Ogechi Pleated Ensemble", image: "/images/style_07.jpeg" },
  { name: "The Idia High-Neck Peplum", image: "/images/style_02.jpeg" },
];

export const mockCustomers: MockCustomer[] = [
  { name: "Adaeze Okonkwo", email: "adaeze@example.com" },
  { name: "Funke Adeleke", email: "funke@example.com" },
  { name: "Ngozi Eze", email: "ngozi@example.com" },
  { name: "Chiamaka Obi", email: "chiamaka@example.com" },
  { name: "Amina Bello", email: "amina@example.com" },
  { name: "Yetunde Alabi", email: "yetunde@example.com" },
  { name: "Kemi Adeyemi", email: "kemi@example.com" },
  { name: "Tolu Ajayi", email: "tolu@example.com" },
  { name: "Hauwa Sani", email: "hauwa@example.com" },
];

export const mockOrders: MockOrder[] = [
  {
    reference: "KRN-9F2K4A",
    customerName: "Adaeze Okonkwo",
    email: "adaeze@example.com",
    status: "delivered",
    items: [
      { productName: "The Zaria Sculpted Gown", unitPriceKobo: 34500000, quantity: 1 },
      { productName: "The Ogechi Pleated Ensemble", unitPriceKobo: 18500000, quantity: 1 },
    ],
    subtotalKobo: 53000000,
    discountKobo: 0,
    deliveryFeeKobo: 500000,
    totalKobo: 53500000,
    createdAt: "2026-09-18T10:12:00Z",
  },
  {
    reference: "KRN-7H1M9Q",
    customerName: "Funke Adeleke",
    email: "funke@example.com",
    status: "delivered",
    items: [
      { productName: "The Idia High-Neck Peplum", unitPriceKobo: 31000000, quantity: 1 },
    ],
    subtotalKobo: 31000000,
    discountKobo: 1000000,
    deliveryFeeKobo: 500000,
    totalKobo: 30500000,
    createdAt: "2026-09-25T14:40:00Z",
  },
  {
    reference: "KRN-3T8B2Z",
    customerName: "Ngozi Eze",
    email: "ngozi@example.com",
    status: "delivered",
    items: [
      { productName: "The Moremi Cape Blazer", unitPriceKobo: 32000000, quantity: 1 },
    ],
    subtotalKobo: 32000000,
    discountKobo: 0,
    deliveryFeeKobo: 750000,
    totalKobo: 32750000,
    createdAt: "2026-10-02T09:05:00Z",
  },
  {
    reference: "KRN-5R6N7P",
    customerName: "Chiamaka Obi",
    email: "chiamaka@example.com",
    status: "awaiting_fulfilment",
    items: [
      { productName: "The Amina Draped Silk Trench", unitPriceKobo: 41000000, quantity: 1 },
    ],
    subtotalKobo: 41000000,
    discountKobo: 0,
    deliveryFeeKobo: 500000,
    totalKobo: 41500000,
    createdAt: "2026-10-08T11:22:00Z",
  },
  {
    reference: "KRN-2W4X8C",
    customerName: "Amina Bello",
    email: "amina@example.com",
    status: "in_production",
    items: [
      { productName: "The Ogechi Pleated Ensemble", unitPriceKobo: 18500000, quantity: 2 },
    ],
    subtotalKobo: 37000000,
    discountKobo: 0,
    deliveryFeeKobo: 500000,
    totalKobo: 37500000,
    createdAt: "2026-10-09T16:47:00Z",
  },
  {
    reference: "KRN-8Q1V5D",
    customerName: "Yetunde Alabi",
    email: "yetunde@example.com",
    status: "ready",
    items: [
      { productName: "The Zaria Sculpted Gown", unitPriceKobo: 34500000, quantity: 1 },
    ],
    subtotalKobo: 34500000,
    discountKobo: 0,
    deliveryFeeKobo: 500000,
    totalKobo: 35000000,
    createdAt: "2026-10-10T13:15:00Z",
  },
  {
    reference: "KRN-6E3J9F",
    customerName: "Kemi Adeyemi",
    email: "kemi@example.com",
    status: "requires_attention",
    items: [
      { productName: "The Moremi Cape Blazer", unitPriceKobo: 32000000, quantity: 1 },
      { productName: "The Idia High-Neck Peplum", unitPriceKobo: 31000000, quantity: 1 },
    ],
    subtotalKobo: 63000000,
    discountKobo: 0,
    deliveryFeeKobo: 500000,
    totalKobo: 63500000,
    createdAt: "2026-10-11T09:58:00Z",
  },
  {
    reference: "KRN-4K7G1H",
    customerName: "Tolu Ajayi",
    email: "tolu@example.com",
    status: "pending_payment",
    items: [
      { productName: "The Ogechi Pleated Ensemble", unitPriceKobo: 18500000, quantity: 1 },
    ],
    subtotalKobo: 18500000,
    discountKobo: 0,
    deliveryFeeKobo: 500000,
    totalKobo: 19000000,
    createdAt: "2026-10-12T18:31:00Z",
  },
  {
    reference: "KRN-1Z5T3N",
    customerName: "Hauwa Sani",
    email: "hauwa@example.com",
    status: "cancelled",
    items: [
      { productName: "The Amina Draped Silk Trench", unitPriceKobo: 41000000, quantity: 1 },
    ],
    subtotalKobo: 41000000,
    discountKobo: 0,
    deliveryFeeKobo: 500000,
    totalKobo: 41500000,
    createdAt: "2026-10-06T12:00:00Z",
  },
];

export const mockPayments: MockPayment[] = [
  { orderReference: "KRN-9F2K4A", status: "success", amountKobo: 53500000, channel: "card" },
  { orderReference: "KRN-7H1M9Q", status: "success", amountKobo: 30500000, channel: "card" },
  { orderReference: "KRN-3T8B2Z", status: "success", amountKobo: 32750000, channel: "bank_transfer" },
  { orderReference: "KRN-5R6N7P", status: "success", amountKobo: 41500000, channel: "card" },
  { orderReference: "KRN-2W4X8C", status: "success", amountKobo: 37500000, channel: "card" },
  { orderReference: "KRN-8Q1V5D", status: "success", amountKobo: 35000000, channel: "bank_transfer" },
  { orderReference: "KRN-6E3J9F", status: "success", amountKobo: 63500000, channel: "card" },
  { orderReference: "KRN-4K7G1H", status: "pending", amountKobo: 19000000, channel: "card" },
  { orderReference: "KRN-1Z5T3N", status: "failed", amountKobo: 41500000, channel: "card" },
];

export const mockComplaints: MockComplaint[] = [
  {
    subject: "Hem adjustment request",
    customerName: "Chiamaka Obi",
    status: "open",
    createdAt: "2026-10-11T15:20:00Z",
  },
  {
    subject: "Delivery address correction",
    customerName: "Amina Bello",
    status: "open",
    createdAt: "2026-10-10T10:02:00Z",
  },
  {
    subject: "Fabric query before commission",
    customerName: "Tolu Ajayi",
    status: "in_review",
    createdAt: "2026-10-09T08:44:00Z",
  },
  {
    subject: "Sizing advice follow-up",
    customerName: "Ngozi Eze",
    status: "resolved",
    createdAt: "2026-10-03T14:10:00Z",
  },
];

// --- Derivations (pure; same shape Phase B will compute server-side) ---

function isPaid(reference: string): boolean {
  return mockPayments.some(
    (payment) => payment.orderReference === reference && payment.status === "success"
  );
}

export function getCompletedOrders(): MockOrder[] {
  return mockOrders.filter(
    (order) =>
      order.status === "delivered" && order.items.length > 0 && isPaid(order.reference)
  );
}

export interface DashboardKpis {
  completedOrders: number;
  customerRecords: number;
  /** Product value of completed orders: subtotal minus discount, no delivery fees. */
  totalSalesKobo: number;
}

export function getKpis(): DashboardKpis {
  const completed = getCompletedOrders();
  return {
    completedOrders: completed.length,
    customerRecords: mockCustomers.length,
    totalSalesKobo: completed.reduce(
      (sum, order) => sum + (order.subtotalKobo - order.discountKobo),
      0
    ),
  };
}

const FULFILMENT_QUEUE_STATUSES: MockOrderStatus[] = [
  "awaiting_fulfilment",
  "in_production",
  "ready",
  "shipped",
];

export function getFulfilmentQueue(): MockOrder[] {
  return mockOrders
    .filter(
      (order) =>
        isPaid(order.reference) &&
        (order.status === "requires_attention" ||
          FULFILMENT_QUEUE_STATUSES.includes(order.status))
    )
    .sort((a, b) => {
      // Attention orders first, then oldest commission first.
      if (a.status === "requires_attention" && b.status !== "requires_attention")
        return -1;
      if (b.status === "requires_attention" && a.status !== "requires_attention")
        return 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

export interface RankedProduct {
  name: string;
  image: string;
  unitsSold: number;
}

export function getTopProducts(): RankedProduct[] {
  const units = new Map<string, { units: number; revenue: number }>();
  for (const order of mockOrders) {
    // Paid and not cancelled: money genuinely changed hands for these items.
    if (!isPaid(order.reference) || order.status === "cancelled") continue;
    for (const item of order.items) {
      const entry = units.get(item.productName) ?? { units: 0, revenue: 0 };
      entry.units += item.quantity;
      entry.revenue += item.unitPriceKobo * item.quantity;
      units.set(item.productName, entry);
    }
  }
  return [...units.entries()]
    .map(([name, totals]) => ({
      name,
      image: mockProducts.find((product) => product.name === name)?.image ?? "",
      unitsSold: totals.units,
      revenue: totals.revenue,
    }))
    .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue)
    .map(({ name, image, unitsSold }) => ({ name, image, unitsSold }));
}

export function getUnresolvedComplaints(): MockComplaint[] {
  return mockComplaints
    .filter((complaint) => complaint.status === "open" || complaint.status === "in_review")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function formatAdminDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
