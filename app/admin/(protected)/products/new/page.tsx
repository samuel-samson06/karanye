import CreatePieceForm from "@/components/admin/products/CreatePieceForm";
import { listCollections } from "@/lib/admin/product-actions";

// Lightweight route entry: live collection options load here (admin RLS
// session); the form owns all interactive state.
export default async function AdminProductNewPage() {
  const { collections, error } = await listCollections();

  return (
    <CreatePieceForm
      collections={collections}
      collectionsError={error ?? null}
    />
  );
}
