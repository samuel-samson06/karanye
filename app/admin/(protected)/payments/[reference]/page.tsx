import { notFound } from "next/navigation";
import PaymentDetail from "@/components/admin/payments/PaymentDetail";
import { mockPayments } from "@/lib/admin/data";

interface PaymentPageProps {
  params: Promise<{ reference: string }>;
}

// Mock-only detail route: resolves the payment from the dummy catalogue.
// Unknown references use notFound(). Live reads replace this lookup.
export function generateStaticParams(): { reference: string }[] {
  return mockPayments.map((payment) => ({ reference: payment.paystackReference }));
}

export default async function AdminPaymentDetailPage({ params }: PaymentPageProps) {
  const { reference } = await params;
  const payment = mockPayments.find(
    (candidate) => candidate.paystackReference === reference
  );

  if (!payment) notFound();

  return <PaymentDetail payment={payment} />;
}
