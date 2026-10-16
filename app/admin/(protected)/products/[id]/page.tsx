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

export default async function AdminProductEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const product = mockAdminProducts.find((candidate) => candidate.id === id);

  if (!product) notFound();

  return <EditPieceForm initial={product} />;
}
