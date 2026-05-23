"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      const next = searchParams?.get("next") || "/admin/dashboard";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-6 py-12">
      <div className="glass-card w-full max-w-md rounded-2xl p-8 shadow-glass">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/royal-swag-logo.png"
            alt="Royal Swag"
            width={180}
            height={72}
            className="mb-4 h-12 w-auto object-contain"
            style={{ filter: "invert(1) sepia(1) saturate(2) hue-rotate(10deg)" }}
            priority
          />
          <h1 className="font-display text-xl font-bold text-primary">Admin</h1>
          <p className="mt-1 font-body text-sm text-on-surface-variant">
            Sign in with your Supabase admin account
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block font-body text-sm text-primary">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-primary/15 bg-white/70 px-4 py-3 font-body text-sm outline-none focus:border-primary/40"
            />
          </label>
          <label className="block font-body text-sm text-primary">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-primary/15 bg-white/70 px-4 py-3 font-body text-sm outline-none focus:border-primary/40"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-800">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Login to Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-parchment">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
