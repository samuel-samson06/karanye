import { Suspense } from "react";
import { notFound } from "next/navigation";
import EditPieceForm from "@/components/admin/products/EditPieceForm";
import { mockAdminProducts } from "@/lib/admin/products";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

// Mock-only edit route: resolves the product from the dummy catalogue by the
// same id ProductsTable navigates with. No Supabase anywhere in this flow.
// Unknown ids use notFound(). Nothing here persists — the form holds edits
// in component state for the session only.
export function generateStaticParams(): { id: string }[] {
  return mockAdminProducts.map((product) => ({ id: product.id }));
}

// Lightweight shell shown while the URL-dependent section resolves.
function EditLoading() {
  return (
    <main aria-busy="true">
      <p className="text-label-md text-muted">Catalogue</p>
      <div
        role="status"
        className="mt-3 border border-platinum bg-linen px-6 py-14 text-center"
      >
        <p className="text-body-md text-muted">Loading piece…</p>
      </div>
    </main>
  );
}

// URL-dependent section: unwraps params (the instant-shell trigger) inside
// the Suspense boundary so navigations paint the shell first.
async function EditPieceLoader({ params }: EditPageProps) {
  const { id } = await params;
  const product = mockAdminProducts.find((candidate) => candidate.id === id);

  if (!product) notFound();

  return <EditPieceForm initial={product} />;
}

export default function AdminProductEditPage({ params }: EditPageProps) {
  return (
    <Suspense fallback={<EditLoading />}>
      <EditPieceLoader params={params} />
    </Suspense>
  );
}
