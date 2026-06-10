"use client";

import { Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";
import { Container } from "@/components/layout";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params?.get("orderId") || params?.get("id") || params?.get("order");

  const deliveryFrom = new Date();
  deliveryFrom.setDate(deliveryFrom.getDate() + 5);
  const deliveryTo = new Date();
  deliveryTo.setDate(deliveryTo.getDate() + 7);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    orderId
      ? `Hi, I just placed order #${orderId}. Please share tracking updates.`
      : "Hi, I just placed an order on Royal Swag."
  )}`;

  const handleShare = useCallback(async () => {
    const text = `I just ordered Royal Swag Lung Detox Tea! Clean lungs, Ayurvedic herbs. ${typeof window !== "undefined" ? window.location.origin : ""}/product`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Royal Swag Lung Detox Tea",
          text,
          url: `${window.location.origin}/product`,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  }, []);

  return (
    <div className="min-h-[70vh] bg-parchment py-12 md:py-16">
      <Container size="sm" className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0D3B1F] text-4xl text-white">
          ✓
        </div>

        <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">
          Order Placed Successfully! 🎉
        </h1>

        {orderId ? (
          <p className="mt-4 font-sans text-base text-on-surface-variant">
            Order ID:{" "}
            <span className="font-number font-bold tabular-nums text-primary">
              #{orderId}
            </span>
          </p>
        ) : null}

        <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-on-surface-variant md:text-base">
          Estimated delivery:{" "}
          <strong className="text-primary">
            {fmt(deliveryFrom)} – {fmt(deliveryTo)}
          </strong>{" "}
          (5–7 business days). We&apos;ll ship within 24 hours.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex w-full items-center justify-center px-8 py-3.5 sm:w-auto"
          >
            Track on WhatsApp
          </a>
          {orderId ? (
            <Link
              href={`/refer?order=${encodeURIComponent(orderId)}`}
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-gold bg-gold/10 px-8 py-3.5 font-sans text-sm font-semibold text-primary transition hover:bg-gold/20 sm:w-auto"
            >
              Refer & Earn ₹100
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void handleShare()}
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-primary px-8 py-3.5 font-sans text-sm font-semibold text-primary transition hover:bg-primary/5 sm:w-auto"
            >
              Share with Friends
            </button>
          )}
        </div>

        <Link
          href="/product"
          className="mt-8 inline-block font-sans text-sm font-medium text-ayurvedic-gold hover:underline"
        >
          ← Continue shopping
        </Link>
      </Container>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-parchment font-sans text-on-surface-variant">
          Loading…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
