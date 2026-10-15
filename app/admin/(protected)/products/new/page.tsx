import CreatePieceForm from "@/components/admin/products/CreatePieceForm";
import { listCollections } from "@/lib/admin/product-actions";

// Blocking route: collections must resolve before the form renders, so this
// segment opts out of instant-navigation validation (the layout's export
// covers only the layout segment, not this page).
export const instant = false;

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
