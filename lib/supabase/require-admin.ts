import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Trusted server-side admin gate. Uses getUser() (verified against the Auth
// server — never getSession() alone) and the app_metadata role claim, which
// only the service role can set. Call at the top of every protected layout,
// page, Server Action, and admin Route Handler BEFORE any data access.
// Redirects: anonymous → /admin/login, authed non-admin → /admin/unauthorized.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (user.app_metadata?.role !== "admin") redirect("/admin/unauthorized");

  return user;
}
