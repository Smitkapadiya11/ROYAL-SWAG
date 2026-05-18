"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import Link from "next/link";
import { APP_SITE } from "@/lib/config";

function OrderSuccessContent() {
  const params = useSearchParams();
  const order = params?.get("order");
  const ref = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => document.body.classList.remove("auth-page");
  }, []);

  useEffect(() => {
    if (!ref.current || !checkRef.current) return;
    const tl = gsap.timeline();
    tl.from(ref.current, { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" }).from(
      checkRef.current,
      { scale: 0, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.3"
    );
  }, []);

  const whatsappHref = order
    ? `https://wa.me/${APP_SITE.whatsapp}?text=${encodeURIComponent(`Hi, my order is #${order}`)}`
    : `https://wa.me/${APP_SITE.whatsapp}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0D2010,#1A3A1A)",
        padding: 20,
        marginTop: -72,
      }}
    >
      <div
        ref={ref}
        style={{
          background: "white",
          borderRadius: 24,
          padding: "clamp(40px,6vw,64px)",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        }}
      >
        <div
          ref={checkRef}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#2D6A2D,#4A7C59)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            margin: "0 auto 24px",
            boxShadow: "0 8px 32px rgba(45,106,45,0.4)",
            color: "#fff",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "clamp(28px,4vw,36px)",
            color: "#1A3A1A",
            marginBottom: 12,
          }}
        >
          Order Confirmed!
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: 15, marginBottom: 8 }}>
          Thank you for choosing Royal Swag Lung Detox Tea
        </p>
        {order && (
          <div
            style={{
              background: "#E8F5E9",
              borderRadius: 12,
              padding: "12px 20px",
              marginBottom: 20,
              fontWeight: 700,
              color: "#1A3A1A",
              fontSize: 16,
            }}
          >
            Order #{order}
          </div>
        )}
        <p style={{ color: "#6B6B6B", fontSize: 13, marginBottom: 28 }}>
          A confirmation has been sent to your WhatsApp. Your order will ship within 24 hours.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/profile"
            className="btn-gold"
            style={{ textDecoration: "none", padding: "12px 24px", fontSize: 14 }}
          >
            View My Orders
          </Link>
          <Link
            href={whatsappHref}
            style={{
              textDecoration: "none",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              background: "#25D366",
              color: "white",
              borderRadius: 50,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg,#0D2010,#1A3A1A)",
            color: "#FAF6EE",
          }}
        >
          Loading…
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
