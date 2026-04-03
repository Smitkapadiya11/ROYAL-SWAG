"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderContent() {
  const params = useSearchParams();
  const orderId = params?.get("orderId") ?? "—";
  const paymentId = params?.get("paymentId") ?? "—";

  // Estimated delivery: 3-5 business days from today
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 3);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  // WhatsApp follow-up
  const waNumber = "917096553300";
  const waMsg = encodeURIComponent(
    `Hi, I just placed an order for Royal Swag Lung Detox Tea. My Order ID is ${orderId}. Please confirm my order.`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;

  return (
    <div className="min-h-[100svh] bg-[var(--brand-ivory)] flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">

        {/* Success icon */}
        <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} className="w-12 h-12" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-2">
          Order Confirmed 🎉
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold text-[var(--brand-dark)] mb-4 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Thank you! Your order is confirmed.
        </h1>
        <p className="text-base text-[var(--brand-dark)]/60 mb-8 max-w-sm mx-auto">
          We'll WhatsApp you the details within 2 hours.
        </p>

        {/* Order details */}
        <div className="bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm p-6 text-left mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--brand-dark)]/40 mb-4">Order Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--brand-dark)]/60">Product</span>
              <span className="font-semibold text-[var(--brand-dark)]">Royal Swag Lung Detox Tea</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--brand-dark)]/60">Amount Paid</span>
              <span className="font-bold text-[var(--brand-dark)]">₹699</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--brand-dark)]/60">Delivery</span>
              <span className="font-semibold text-green-700">Free · {fmt(deliveryStart)}–{fmt(deliveryEnd)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--brand-dark)]/60">Payment ID</span>
              <span className="font-mono text-xs text-[var(--brand-dark)]/50 break-all">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--brand-dark)]/60">Order ID</span>
              <span className="font-mono text-xs text-[var(--brand-dark)]/50 break-all">{orderId}</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="order-success-wa-btn"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-[#25D366] text-white font-bold text-base shadow-md hover:bg-[#1da851] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Confirm Order on WhatsApp
          </a>
          <Link
            href="/product"
            id="order-success-shop-more"
            className="w-full py-4 rounded-full border-2 border-[var(--brand-green)] text-[var(--brand-green)] font-bold text-base text-center hover:bg-[var(--brand-sage)] transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--brand-dark)]/40 hover:text-[var(--brand-dark)] transition-colors underline underline-offset-2"
          >
            Back to Home
          </Link>
        </div>

        {/* Guarantee */}
        <p className="mt-8 text-xs text-[var(--brand-dark)]/30 leading-relaxed">
          30-Day money-back guarantee. If you're not happy, we'll refund in full — no questions asked.
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}
