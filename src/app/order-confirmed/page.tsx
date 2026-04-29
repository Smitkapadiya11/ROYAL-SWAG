import Link from "next/link";
import { Suspense } from "react";

function ConfirmedContent({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <main style={{
      minHeight: "100vh", background: "#F2E6CE",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "80px 24px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "#4A6422", color: "#F2E6CE",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 24px",
        }}>✓</div>
        <h1 style={{
          fontFamily: "var(--ff-head)", fontSize: 32,
          color: "#2D3D15", marginBottom: 12,
        }}>Order Confirmed</h1>
        <p style={{ color: "#5C5647", marginBottom: 8 }}>
          Thank you for your order. Your lungs are about to thank you too.
        </p>
        <p style={{ fontSize: 13, color: "#5C5647", opacity: 0.7, marginBottom: 32 }}>
          Payment ID: {searchParams.id || "—"}
        </p>
        <p style={{ color: "#5C5647", fontSize: 14, marginBottom: 32 }}>
          We will send order updates to your registered phone and email.
          Ships within 24 hours on weekdays.
        </p>
        <Link href="/" style={{
          background: "#4A6422", color: "#F2E6CE",
          padding: "13px 32px", borderRadius: 6,
          fontWeight: 500, textDecoration: "none",
        }}>Back to Home →</Link>
      </div>
    </main>
  );
}

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <ConfirmedContent searchParams={params} />
    </Suspense>
  );
}
