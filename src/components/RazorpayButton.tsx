"use client";
import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window { Razorpay: new (opts: unknown) => { open(): void; on(event: string, cb: (r: unknown) => void): void }; }
}

export default function RazorpayButton({
  amount, packLabel, label, full, onSuccess,
}: {
  amount: number;
  packLabel: string;
  label: string;
  full?: boolean;
  onSuccess?: (paymentId: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, packLabel }),
      });
      const order = await r.json();
      if (!order.orderId) throw new Error(order.error || "Order failed");

      const opt = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Royal Swag",
        description: `Lung Detox Tea — ${packLabel}`,
        order_id: order.orderId,
        image: "/images/royal-swag-logo.png",
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#4A6422" },
        handler: async (resp: Record<string, string>) => {
          const v = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          const j = await v.json();
          if (j.ok) {
            onSuccess?.(j.paymentId);
            window.location.href = `/order-success?id=${j.paymentId}`;
          } else {
            alert("Payment verification failed. Contact support.");
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rz = new window.Razorpay(opt);
      rz.on("payment.failed", (resp: unknown) => {
        const r = resp as { error?: { description?: string } };
        alert("Payment failed: " + (r.error?.description || "Try again"));
        setLoading(false);
      });
      rz.open();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not start checkout";
      alert(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button
        onClick={pay}
        disabled={loading}
        style={{
          width: full ? "100%" : "auto",
          background: "#4A6422", color: "#F2E6CE",
          border: "none", padding: "16px 32px",
          borderRadius: 8, fontWeight: 600, fontSize: 15,
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "all 0.2s",
        }}
        onMouseEnter={e => !loading && (e.currentTarget.style.background = "#2D3D15")}
        onMouseLeave={e => !loading && (e.currentTarget.style.background = "#4A6422")}
      >
        {loading ? "Processing…" : label}
      </button>
    </>
  );
}
