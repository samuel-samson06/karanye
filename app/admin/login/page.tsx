import { redirect } from "next/navigation";
import LoginForm from "@/app/admin/login/LoginForm";
import { createClient } from "@/lib/supabase/server";

// Session-checked per visit, never prerendered.
export const instant = false;

// Public sign-in page (outside the protected layout by construction).
// Already-authenticated admins skip the form straight to /admin.
export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.app_metadata?.role === "admin") redirect("/admin");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-14">
      <p className="text-label-md text-muted">Karanyé Atelier</p>
      <h1
        className="mt-3 text-display-lg text-ink"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        Admin Sign In
      </h1>
      <p className="mt-4 text-body-md text-muted">
        Provisioned administrators only. There is no public registration.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
