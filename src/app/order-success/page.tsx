"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SITE } from "@/lib/config";

function OrderContent() {
  const params = useSearchParams();
  const orderId = params?.get("orderId") ?? "—";
  const paymentId = params?.get("paymentId") ?? "—";
  const amountPaiseRaw = params?.get("amountPaise");
  const amountPaise = amountPaiseRaw ? Number.parseInt(amountPaiseRaw, 10) : NaN;
  const amountDisplay = Number.isFinite(amountPaise) && amountPaise > 0
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amountPaise / 100)
    : "—";

  const today = new Date();
  const deliveryStart = new Date(today); deliveryStart.setDate(today.getDate() + 3);
  const deliveryEnd = new Date(today);   deliveryEnd.setDate(today.getDate() + 5);
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  const waMsg = encodeURIComponent(`Hi, I just placed an order for Royal Swag Lung Detox Tea. My Order ID is ${orderId}. Please confirm my order.`);
  const waUrl = `https://wa.me/${SITE.whatsapp.number}?text=${waMsg}`;

  const rowStyle: React.CSSProperties = {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    paddingBottom: 12, borderBottom: "1px solid var(--rs-sand)",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--rs-cream)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "80px 20px",
    }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {/* Success icon */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "rgba(74,100,34,0.12)", margin: "0 auto 28px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--rs-olive)" strokeWidth={2.5}
            width={44} height={44} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="eyebrow">Order Confirmed 🎉</span>
        <h1 style={{ color: "var(--rs-dark)", marginBottom: 12, fontSize: "clamp(24px, 4vw, 36px)" }}>
          Thank you! Your order is confirmed.
        </h1>
        <p style={{ fontSize: 15, color: "var(--rs-text)", marginBottom: 8, maxWidth: 360, margin: "0 auto 8px" }}>
          We&apos;ll WhatsApp you the details within 2 hours.
        </p>
        <p style={{ fontSize: 14, color: "var(--rs-olive)", fontWeight: 600, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.6 }}>
          You just did something most people don&apos;t. Your lungs will thank you in 30 days.
        </p>

        {/* Order details */}
        <div className="card" style={{ padding: "24px", textAlign: "left", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--rs-text)", marginBottom: 20 }}>
            Order Details
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Product",     val: "Royal Swag Lung Detox Tea", bold: true },
              { label: "Amount Paid", val: amountDisplay, bold: true },
              { label: "Delivery",    val: `Free · ${fmt(deliveryStart)}–${fmt(deliveryEnd)}`, green: true },
              { label: "Payment ID",  val: paymentId, mono: true },
              { label: "Order ID",    val: orderId, mono: true },
            ].map(({ label, val, bold, green, mono }) => (
              <div key={label} style={{ ...rowStyle }}>
                <span style={{ fontSize: 13, color: "var(--rs-text)" }}>{label}</span>
                <span style={{
                  fontSize: mono ? 11 : 13, fontWeight: bold ? 700 : 500,
                  color: green ? "var(--rs-olive)" : "var(--rs-dark)",
                  fontFamily: mono ? "monospace" : "inherit",
                  maxWidth: "55%", textAlign: "right", wordBreak: "break-all",
                }}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px", borderRadius: "var(--r-md)", background: "#25D366",
            color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Confirm Order on WhatsApp
          </a>
          <Link href="/" className="btn-outline" style={{ textAlign: "center", display: "block" }}>
            Back to Home
          </Link>
        </div>

        <p style={{ marginTop: 28, fontSize: 12, color: "var(--rs-text)", opacity: 0.6, lineHeight: 1.6 }}>
          30-Day money-back guarantee. If you&apos;re not happy, we&apos;ll refund in full — no questions asked.
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--rs-cream)" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "4px solid var(--rs-olive)", borderTopColor: "transparent" }} />
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}
