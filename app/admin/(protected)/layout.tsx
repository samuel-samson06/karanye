import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";

// Dynamic on every visit: requireAdmin() reads cookies, so the session is
// re-verified server-side per request (no static caching of gated pages).
export const instant = false;

// Protected admin shell. requireAdmin() runs BEFORE anything renders or
// fetches: anonymous visitors leave for /admin/login, non-admins for
// /admin/unauthorized. Plain functional chrome (same tokens, zero radius).
export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-full flex-1">
      <nav
        aria-label="Admin"
        className="flex w-56 shrink-0 flex-col gap-1 border-r border-platinum bg-linen px-4 py-8"
      >
        <p
          className="px-2 text-headline-sm tracking-[0.08em]"
          style={{ fontFamily: "var(--font-bodoni)" }}
        >
          KARANYÉ
        </p>
        <p className="px-2 text-label-sm text-muted">Atelier Admin</p>
        <div className="mt-6 flex flex-col gap-1">
          <Link href="/admin" className="px-2 py-3 text-label-md text-ink">
            Dashboard
          </Link>
          <Link href="/admin/products" className="px-2 py-3 text-label-md text-ink">
            Products
          </Link>
          <Link
            href="/admin/collections"
            className="px-2 py-3 text-label-md text-ink"
          >
            Collections
          </Link>
          <Link href="/" className="px-2 py-3 text-label-md text-muted">
            View Storefront
          </Link>
        </div>
      </nav>
      <div className="flex min-w-0 flex-1 flex-col px-5 py-8 md:px-8">
        {children}
      </div>
    </div>
  );
}
