import Link from "next/link";

// Public access-denied page (outside the protected layout by construction).
// Renders unconditionally and redirects nowhere, so it cannot loop.
export default function AdminUnauthorizedPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-14 text-center">
      <p className="text-label-md text-muted">Karanyé Atelier</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Not Authorized
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-body-md text-muted">
        This area is for provisioned administrators. If you believe you should
        have access, contact the atelier to review your account role.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/admin/login"
          className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson text-label-md text-canvas transition-colors hover:bg-crimson-deep"
        >
          Sign In
        </Link>
        <Link
          href="/"
          className="editorial-link text-label-md text-crimson"
        >
          Back to Storefront
        </Link>
      </div>
    </main>
  );
}
