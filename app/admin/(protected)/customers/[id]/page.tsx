import { Suspense } from "react";
import { notFound } from "next/navigation";
import CustomerDetail from "@/components/admin/customers/CustomerDetail";
import { getMockCustomerById, getMockCustomers } from "@/lib/admin/customers";

interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

// Mock-only detail route: resolves the customer from the derived directory.
// Unknown ids use notFound(). Live reads replace this lookup.
export function generateStaticParams(): { id: string }[] {
  return getMockCustomers().map((customer) => ({ id: customer.id }));
}

// Lightweight shell shown while the URL-dependent section resolves.
function CustomerLoading() {
  return (
    <main aria-busy="true">
      <p className="text-label-md text-muted">Commerce</p>
      <div
        role="status"
        className="mt-3 border border-platinum bg-linen px-6 py-14 text-center"
      >
        <p className="text-body-md text-muted">Loading customer…</p>
      </div>
    </main>
  );
}

// URL-dependent section: unwraps params (the instant-shell trigger) inside
// the Suspense boundary so navigations paint the shell first.
async function CustomerLoader({ params }: CustomerPageProps) {
  const { id } = await params;
  const customer = getMockCustomerById(id);

  if (!customer) notFound();

  return <CustomerDetail customer={customer} />;
}

export default function AdminCustomerDetailPage({ params }: CustomerPageProps) {
  return (
    <Suspense fallback={<CustomerLoading />}>
      <CustomerLoader params={params} />
    </Suspense>
  );
}
