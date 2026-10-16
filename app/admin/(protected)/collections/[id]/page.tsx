// Mock-only collection detail route: resolves the collection from the dummy
// catalogue by the same id CollectionsTable navigates with. No Supabase
// anywhere in this flow. Unknown ids use notFound(). Nothing here persists —
// the detail component holds edits in component state for the session only.
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CollectionDetail from "@/components/admin/collections/CollectionDetail";
import { mockCollections } from "@/lib/admin/collections-mock";

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams(): { id: string }[] {
  return mockCollections.map((collection) => ({ id: collection.id }));
}

// Lightweight shell shown while the URL-dependent section resolves.
function CollectionLoading() {
  return (
    <main aria-busy="true">
      <p className="text-label-md text-muted">Catalogue</p>
      <div
        role="status"
        className="mt-3 border border-platinum bg-linen px-6 py-14 text-center"
      >
        <p className="text-body-md text-muted">Loading collection…</p>
      </div>
    </main>
  );
}

// URL-dependent section: unwraps params inside the Suspense boundary so
// navigations paint the shell first.
async function CollectionLoader({ params }: CollectionPageProps) {
  const { id } = await params;
  const collection = mockCollections.find(
    (candidate) => candidate.id === id
  );

  if (!collection) notFound();

  return <CollectionDetail collection={collection} />;
}

export default function AdminCollectionDetailPage({
  params,
}: CollectionPageProps) {
  return (
    <Suspense fallback={<CollectionLoading />}>
      <CollectionLoader params={params} />
    </Suspense>
  );
}

