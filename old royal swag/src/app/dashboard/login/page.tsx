"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error || "Login failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1117] px-4">
      <form
        onSubmit={submit}
        className="dashboard-card w-full max-w-sm p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981]">
          Royal Swag
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#F0F0F0]">Admin Login</h1>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          Enter your dashboard password to continue.
        </p>

        <label className="mt-6 block text-sm font-medium text-[#9CA3AF]">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="dashboard-input mt-2"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-[#EF4444]" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className="dashboard-btn mt-6 w-full">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
