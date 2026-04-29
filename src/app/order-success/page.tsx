"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function Success() {
  const p = useSearchParams();
  const id = p?.get("id");

  return (
    <section style={{
      minHeight: "100svh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "60px 20px", textAlign: "center",
    }}>
      <div style={{ maxWidth: 480 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "#4A6422",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", fontSize: 36, color: "#fff",
        }}>✓</div>
        <h1 style={{ marginBottom: 12, color: "#1A1A14" }}>Order Confirmed!</h1>
        <p style={{ marginBottom: 8, color: "#5C5647", fontSize: 16 }}>
          Thank you for your order. We will ship within 24 hours.
        </p>
        {id && (
          <p style={{ fontSize: 12, color: "#5C5647", opacity: 0.6, marginBottom: 32 }}>
            Payment ID: {id}
          </p>
        )}
        <Link href="/" className="b b-olive">
          Back to Home →
        </Link>
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div />}>
      <Success />
    </Suspense>
  );
}
