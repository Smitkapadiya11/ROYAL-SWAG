"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      if (r.ok) {
        router.push("/admin/dashboard");
      } else {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        setError(d.error || (r.status === 503 ? "Server configuration error" : "Invalid credentials"));
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0F1710",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#1A2818",
          borderRadius: 16,
          border: "1px solid rgba(74,100,34,0.3)",
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              background: "transparent",
            }}
          >
            <Image
              src="/images/new_logo.png"
              alt=""
              width={2048}
              height={2048}
              sizes="180px"
              style={{
                objectFit: "contain",
                background: "transparent",
                width: 140,
                height: "auto",
                aspectRatio: "1",
              }}
              priority
            />
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#F2E6CE",
              marginBottom: 4,
            }}
          >
            Admin
          </h1>
          <p style={{ fontSize: 12, color: "rgba(242,230,206,0.45)", letterSpacing: 2 }}>
            DASHBOARD
          </p>
          <p style={{ fontSize: 11, color: "rgba(242,230,206,0.38)", marginTop: 12, lineHeight: 1.5 }}>
            Use the <strong style={{ color: "rgba(242,230,206,0.55)" }}>dashboard password</strong> from{" "}
            <code style={{ fontSize: 10 }}>ADMIN_PASSWORD</code> /{" "}
            <code style={{ fontSize: 10 }}>ADMIN_PASSWORD_HASH</code> — not your Supabase database password.
          </p>
        </div>

        <form onSubmit={submit}>
          {["Username", "Password"].map((label, i) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 2,
                  color: "rgba(242,230,206,0.5)",
                  marginBottom: 6,
                }}
              >
                {label.toUpperCase()}
              </label>
              <input
                type={i === 1 ? "password" : "text"}
                value={i === 0 ? user : pass}
                onChange={(e) => (i === 0 ? setUser(e.target.value) : setPass(e.target.value))}
                required
                autoComplete={i === 1 ? "current-password" : "username"}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#0F1710",
                  border: "1px solid rgba(74,100,34,0.4)",
                  borderRadius: 8,
                  color: "#F2E6CE",
                  fontSize: 15,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          ))}

          {error && (
            <div
              style={{
                background: "rgba(160,32,32,0.15)",
                border: "1px solid rgba(160,32,32,0.3)",
                borderRadius: 6,
                padding: "10px 14px",
                fontSize: 13,
                color: "#ff8080",
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              background: "#4A6422",
              color: "#F2E6CE",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.18s",
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>
      </div>
    </main>
  );
}
