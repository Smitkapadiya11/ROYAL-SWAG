"use client";

import Link from "next/link";

export default function ProfilePage() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
        background: "#0a1f0a",
        color: "#fff",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>🫁</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Track Your Lung Health Journey</h1>
      <p
        style={{
          fontSize: 15,
          opacity: 0.7,
          maxWidth: 420,
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        Complete the Free Lung Test to see your personalised lung health profile and product recommendations.
      </p>
      <Link
        href="/lung-test"
        style={{
          background: "#2d7a2d",
          color: "#fff",
          padding: "14px 32px",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        Take the Free Lung Test →
      </Link>
    </main>
  );
}
