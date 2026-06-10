"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

function fireConfetti() {
  import("canvas-confetti").then(({ default: confetti }) => {
    const duration = 2800;
    const end = Date.now() + duration;
    const colors = ["#9A6F1A", "#324023", "#F4EDD6", "#5C946E"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  });
}

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params?.get("id") || params?.get("order");
  const ref = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);

  const deliveryFrom = new Date();
  deliveryFrom.setDate(deliveryFrom.getDate() + 3);
  const deliveryTo = new Date();
  deliveryTo.setDate(deliveryTo.getDate() + 7);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  useEffect(() => {
    fireConfetti();
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

  const whatsappHref = orderId
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hi, my order is #${orderId}`)}`
    : siteConfig.whatsappOrderLink;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0D2010,#1A3A1A)",
        padding: 20,
      }}
    >
      <div
        ref={ref}
        style={{
          background: "white",
          borderRadius: 24,
          padding: "clamp(40px,6vw,64px)",
          maxWidth: 520,
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
            background: "linear-gradient(135deg,#324023,#5C946E)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            margin: "0 auto 24px",
            boxShadow: "0 8px 32px rgba(50,64,35,0.35)",
            color: "#fff",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(28px,4vw,36px)",
            color: "#324023",
            marginBottom: 12,
          }}
        >
          Order Confirmed!
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: 15, marginBottom: 8 }}>
          Thank you for choosing Royal Swag Lung Detox Tea
        </p>
        {orderId && (
          <div
            style={{
              background: "#F4EDD6",
              borderRadius: 12,
              padding: "12px 20px",
              marginBottom: 20,
              fontWeight: 700,
              color: "#324023",
              fontSize: 16,
            }}
          >
            Order #{orderId}
          </div>
        )}

        <div
          style={{
            textAlign: "left",
            background: "#fafafa",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 20,
            fontSize: 14,
            color: "#444",
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#324023" }}>Order summary</p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Royal Swag Lung Detox Tea</li>
            <li>Payment received via Razorpay</li>
            <li>Ships within 24 hours</li>
          </ul>
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "#6B6B6B" }}>
            Estimated delivery: <strong>{fmt(deliveryFrom)}</strong> –{" "}
            <strong>{fmt(deliveryTo)}</strong>
          </p>
        </div>

        <p style={{ color: "#6B6B6B", fontSize: 13, marginBottom: 28 }}>
          Confirmation SMS and email have been sent when contact details were provided.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            className="btn-gold"
            style={{ textDecoration: "none", padding: "12px 24px", fontSize: 14 }}
          >
            Continue Shopping
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
