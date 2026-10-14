"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Admin sign-in form (no sign-up anywhere in this project). On success the
// router lands on /admin, where the server-side guard admits admins and
// turns everyone else to /admin/unauthorized. Errors render as text,
// never by colour alone.
export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const signIn = async (formData: FormData): Promise<void> => {
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    setPending(false);
    if (signInError) {
      setError("Sign-in failed. Check your email and password, then try again.");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <form action={signIn} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="admin-email" className="text-label-md text-muted">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="h-[52px] min-h-11 border border-hairline bg-canvas px-4 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="admin-password" className="text-label-md text-muted">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-[52px] min-h-11 border border-hairline bg-canvas px-4 text-body-md text-ink placeholder:text-muted focus:border-crimson focus:outline-none"
        />
      </div>
      {error && (
        <p role="alert" className="text-body-sm text-crimson-vibrant">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-[52px] min-h-11 items-center justify-center bg-crimson text-label-md text-canvas transition-colors hover:bg-crimson-deep disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
