"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import HowItsMadeMini from "@/components/conversion/HowItsMadeMini";
import ProductObjectionsAccordion from "@/components/conversion/ProductObjectionsAccordion";
import TrustAuthorityStrip from "@/components/conversion/TrustAuthorityStrip";
import MobileStickyBar from "@/components/MobileStickyBar";
import ProductImageGallery from "@/components/ProductImageGallery";
import PricingSelector from "@/components/PricingSelector";
import { PRODUCT_GALLERY_IMAGES } from "@/lib/product-images";
import {
  buildPricingPlans,
  planToAmountPaise,
  razorpayDescriptionForPlan,
  type PlanId,
} from "@/lib/product-pricing";
import { getSeasonalUrgencyMessage } from "@/lib/seasonal-urgency";

const SocialProofTicker24h = dynamic(() => import("@/components/SocialProofTicker24h"), {
  ssr: false,
});

const STOCK_COUNT = process.env.NEXT_PUBLIC_STOCK_COUNT ?? "47";

const GOLD_PARTICLES = [
  { style: { top: "14%", left: "22%" } },
  { style: { top: "22%", right: "20%" } },
  { style: { top: "38%", left: "14%" } },
  { style: { top: "52%", right: "14%" } },
  { style: { bottom: "30%", left: "26%" } },
  { style: { bottom: "22%", right: "24%" } },
  { style: { top: "66%", left: "42%" } },
  { style: { top: "30%", right: "38%" } },
];

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const PRODUCT_NAME = "Royal Swag Lung Detox Tea";
const CHECKOUT_CURRENCY = "INR";

const PRICING_PLANS = buildPricingPlans();

export default function ProductPage() {
  const seasonalUrgencyMessage = useMemo(() => getSeasonalUrgencyMessage(), []);
  const introRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const gsapRef = useRef<any>(null);

  const [isPrefillOpen, setIsPrefillOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [prefill, setPrefill] = useState({ name: "", email: "", contact: "" });
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("40");
  const deepLinkOpenedRef = useRef(false);

  const selectedPlan = useMemo(
    () => PRICING_PLANS.find((p) => p.id === selectedPlanId) ?? PRICING_PLANS[1],
    [selectedPlanId]
  );
  const perDayForButton = useMemo(
    () => (selectedPlan.priceRupees / selectedPlan.days).toFixed(2),
    [selectedPlan]
  );

  useEffect(() => {
    let ctx: any;
    let galleryCtx: any;
    let infoCtx: any;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;

      // ── Intro Animations ──
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.fromTo(
          ".product-hero-img",
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2 }
        )
          .fromTo(
            ".gold-particle",
            { opacity: 0 },
            { opacity: 0.8, duration: 0.4, stagger: 0.15 },
            "-=0.7"
          )
          .fromTo(
            ".product-hero-title",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75 },
            "-=0.5"
          )
          .fromTo(
            ".product-hero-sub",
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55 },
            "-=0.4"
          );

        gsap.utils.toArray<HTMLElement>(".gold-particle").forEach((el) => {
          gsap.to(el, {
            y: "random(-15, 15)",
            x: "random(-10, 10)",
            duration: "random(2, 4)",
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        });

        gsap.to(".scroll-bounce", {
          y: 8,
          duration: 0.7,
          yoyo: true,
          repeat: -1,
          ease: "power2.out",
        });
      }, introRef);

      // ── Gallery Animations (stagger reveal) ──
      galleryCtx = gsap.context(() => {
        ScrollTrigger.batch(".gallery-item", {
          onEnter: (elements) => {
            gsap.from(elements, {
              opacity: 0,
              y: 40,
              scale: 0.94,
              duration: 0.6,
              stagger: 0.1,
              ease: "expo.out",
            });
          },
          once: true,
          start: "top 88%",
        });
      }, galleryRef);

      // ── Product Info Entrance ──
      infoCtx = gsap.context(() => {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".product-info-section",
            start: "top 85%",
            once: true,
          },
          delay: 0.3,
        });
        tl2
          .from(".product-title", { x: 30, opacity: 0, duration: 0.7, ease: "expo.out" })
          .from(".product-urgency", { x: 30, opacity: 0, duration: 0.5, ease: "expo.out" }, "-=0.4")
          .from(".product-pricing", { x: 30, opacity: 0, duration: 0.5, ease: "expo.out" }, "-=0.35")
          .from(".product-details", { x: 30, opacity: 0, duration: 0.45, ease: "expo.out" }, "-=0.3")
          .from(".product-badge", { scale: 0, opacity: 0, duration: 0.4, stagger: 0.1, ease: "back.out(2)" }, "-=0.3")
          .from(".product-cta", { y: 20, opacity: 0, scale: 0.95, duration: 0.5, ease: "back.out(1.7)" }, "-=0.2");
      }, infoRef);
    };

    init();

    return () => {
      ctx?.revert();
      galleryCtx?.revert();
      infoCtx?.revert();
    };
  }, []);

  useEffect(() => {
    if (deepLinkOpenedRef.current) return;
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("buy") === "1") {
      deepLinkOpenedRef.current = true;
      setIsPrefillOpen(true);
    }
  }, []);

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);

      const SRC = "https://checkout.razorpay.com/v1/checkout.js";
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);

      // Prevent hanging forever if load/error already happened.
      const timeout = window.setTimeout(() => resolve(!!window.Razorpay), 10000);
      const cleanup = (script?: HTMLScriptElement) => {
        window.clearTimeout(timeout);
        if (!script) return;
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
      };
      const onLoad = () => {
        cleanup(existing ?? undefined);
        resolve(true);
      };
      const onError = () => {
        cleanup(existing ?? undefined);
        resolve(false);
      };

      if (existing) {
        if (window.Razorpay) {
          cleanup(existing);
          return resolve(true);
        }
        existing.addEventListener("load", onLoad, { once: true });
        existing.addEventListener("error", onError, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.addEventListener("load", () => {
        cleanup(script);
        resolve(true);
      }, { once: true });
      script.addEventListener("error", () => {
        cleanup(script);
        resolve(false);
      }, { once: true });
      document.body.appendChild(script);
    });

  const startPayment = async () => {
    if (isPaying) return;
    setIsPaying(true);
    try {
      const scriptOk = await loadRazorpay();
      if (!scriptOk) throw new Error("Failed to load Razorpay Checkout");

      const amountPaise = planToAmountPaise(selectedPlan);

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPaise, currency: CHECKOUT_CURRENCY }),
      });
      const data = (await res.json()) as
        | { orderId: string; amount: number; currency: string; keyId: string }
        | { error: string };
      if (!res.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Failed to create order");
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: PRODUCT_NAME,
        description: razorpayDescriptionForPlan(selectedPlan),
        order_id: data.orderId,
        prefill: {
          name: prefill.name,
          email: prefill.email,
          contact: prefill.contact,
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response?.razorpay_order_id ?? data.orderId,
                razorpay_payment_id: response?.razorpay_payment_id,
                razorpay_signature: response?.razorpay_signature,
                customerName: prefill.name,
                customerPhone: prefill.contact,
                customerEmail: prefill.email,
                amountPaise,
              }),
            });

            const verifyData = (await verifyRes.json()) as
              | { success: true; orderId: string; paymentId: string }
              | { error: string };

            if (!verifyRes.ok || "error" in verifyData) {
              throw new Error("error" in verifyData ? verifyData.error : "Payment verification failed");
            }

            const qp = new URLSearchParams({
              orderId: verifyData.orderId,
              paymentId: verifyData.paymentId,
              amountPaise: String(amountPaise),
            });
            window.location.href = `/order-success?${qp.toString()}`;
          } catch (err) {
            alert(err instanceof Error ? err.message : "Payment verification failed");
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
        theme: { color: "#15803d" },
      };

      const rz = new window.Razorpay(options);
      rz.open();
      setIsPrefillOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Payment failed");
      setIsPaying(false);
    }
  };

  return (
    <div className="pb-16 md:pb-0">
      {/* ── Hero ── */}
      <section
        ref={introRef}
        className="relative min-h-[100svh] bg-[var(--brand-green)] flex flex-col items-center justify-center overflow-hidden pt-20 pb-16"
      >
        <div aria-hidden="true">
          {GOLD_PARTICLES.map(({ style }, i) => (
            <div
              key={i}
              className="gold-particle pointer-events-none absolute w-[6px] h-[6px] rounded-full bg-[var(--brand-gold)] opacity-0"
              style={style as React.CSSProperties}
            />
          ))}
        </div>

        <div className="relative z-10 mb-10 product-hero-img opacity-0">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[340px] md:h-[340px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={PRODUCT_GALLERY_IMAGES[0]}
              alt="Royal Swag Herbal Lung Detox Tea"
              fill
              priority
              sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, 340px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-xl">
          <h1
            className="product-hero-title text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight opacity-0"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The Ultimate Herbal Formula
          </h1>
          <p className="product-hero-sub text-base text-white/55 opacity-0">
            One tea. Complete lung restoration.
          </p>
          <div className="product-hero-sub opacity-0 mt-6 w-full max-w-3xl mx-auto px-2">
            <TrustAuthorityStrip variant="dark" className="!py-4" />
          </div>
          {/* Hero Buy Now CTA */}
          <div className="product-hero-sub opacity-0 mt-6">
            <div className="mx-auto w-full max-w-md">
              <button
                id="product-hero-buy-btn"
                onClick={() => setIsPrefillOpen(true)}
                className="bg-green-700 text-white px-8 py-4 text-xl rounded-lg w-full sm:w-auto sm:px-10 font-bold shadow-lg hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isPaying}
              >
                Buy Now — Rs {selectedPlan.priceRupees} ({selectedPlan.days}-Day Pack)
              </button>
              <p className="mt-2 text-center text-xs text-white/60">
                Secure checkout · Razorpay protected · Ships tomorrow
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-30 pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest text-white">Scroll</span>
          <div className="scroll-bounce w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section ref={galleryRef} className="py-24 md:py-32 bg-[var(--brand-ivory)]">
        <div className="container-rs">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-3">
              Gallery
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[var(--brand-dark)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Crafted With Intention
            </h2>
          </div>

          <ProductImageGallery images={PRODUCT_GALLERY_IMAGES} />
        </div>
      </section>

      {/* ── Product Info ── */}
      <section ref={infoRef} className="product-info-section py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-rs max-w-3xl">
          <TrustAuthorityStrip className="pb-6 pt-0" />
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="product-title text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-3">
                Premium Blend
              </p>
              <h2
                className="product-title text-3xl sm:text-4xl font-bold text-[var(--brand-dark)] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Royal Swag <br />Lung Detox Tea
              </h2>

              <div className="product-urgency space-y-3 mb-6 max-w-full">
                <p className="text-xs sm:text-sm text-[var(--brand-dark)]/70 leading-snug border border-[var(--brand-sage)] rounded-xl px-3 py-2 bg-[var(--brand-ivory)]">
                  {seasonalUrgencyMessage}
                </p>
                <p className="text-sm font-medium text-amber-700 leading-snug">
                  We produce Royal Swag in small batches to maintain quality. Current batch:{" "}
                  <span className="font-bold text-amber-600 tabular-nums">{STOCK_COUNT}</span> units remaining.
                </p>
                <SocialProofTicker24h />
              </div>

              {/* Product details */}
              <ul className="product-details product-title text-sm text-[var(--brand-dark)]/65 space-y-2 mb-8">
                <li>🌿 <strong>Ingredients:</strong> Tulsi, Vasaka, Mulethi, Pippali, Ginger, Black Pepper, Cinnamon</li>
                <li>📦 <strong>Size:</strong> 20, 40, or 60 tea bags — pick your pack below</li>
                <li>🏷️ <strong>Weight:</strong> 75g</li>
                <li>📅 <strong>Shelf Life:</strong> 24 months from manufacture</li>
              </ul>

              <PricingSelector
                plans={PRICING_PLANS}
                value={selectedPlanId}
                onChange={setSelectedPlanId}
              />

              <p className="mt-4 text-sm text-[var(--brand-dark)]/75 leading-snug">
                Rs 699 = Rs 23/day = less than one cup of chai from a café. Your lungs work 24 hours a day. This costs
                less than your morning snack.
              </p>
              <p className="mt-2 text-sm font-medium text-green-800">
                ✓ Free delivery included — no minimum order required
              </p>

              {/* CTA buttons */}
              <div className="product-cta space-y-3 mt-6">
                <div className="rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-ivory)] px-4 py-3 text-xs sm:text-sm text-[var(--brand-dark)]/75 leading-relaxed">
                  Every day without lung detox, PM2.5 particles accumulate further. This isn&apos;t fear — it&apos;s
                  biology. And it&apos;s reversible right now.
                </div>
                <button
                  id="product-buy-now-btn"
                  onClick={() => setIsPrefillOpen(true)}
                  className="bg-green-700 text-white px-8 py-4 text-xl rounded-lg w-full font-bold shadow-sm hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isPaying}
                >
                  Buy Now — Rs {selectedPlan.priceRupees} ({selectedPlan.days}-Day Pack)
                </button>
                <p className="text-sm text-center text-[var(--brand-dark)]/60">
                  That&apos;s just Rs {perDayForButton}/day for cleaner lungs
                </p>
                <p className="text-xs text-gray-600 text-center leading-snug px-1">
                  Secure checkout · Razorpay protected · Ships tomorrow
                </p>
                <p className="text-xs text-gray-500 text-center leading-snug px-1">
                  🔒 Secure Payment | 🚚 Free Delivery | ↩️ 30-Day Guarantee
                </p>
                <Link
                  href="/lung-test"
                  className="inline-flex items-center justify-center w-full gap-2 px-8 py-3 rounded-xl border-2 border-[var(--brand-sage)] text-[var(--brand-dark)]/60 font-semibold text-sm hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all"
                >
                  Take the Free Lung Test First →
                </Link>
                <p className="text-center text-[10px] text-[var(--brand-dark)]/45">
                  No email required to see your result
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-4">
              {[
                { icon: "🌿", label: "100% Ayurvedic", sub: "No artificial ingredients", link: null },
                { icon: "🛡️", label: "No Side Effects", sub: "Safe for long-term daily use", link: null },
                { icon: "🔄", label: "30-Day Guarantee", sub: "Full refund, no questions asked", link: null },
                { icon: "🚚", label: "Free Delivery", sub: "Pan-India · Ships in 24 hours", link: null },
              ].map(({ icon, label, sub }) => (
                <div key={label}>
                  <div className="product-badge flex items-center gap-4 bg-[var(--brand-sage)]/50 rounded-2xl px-5 py-4 border border-[var(--brand-sage)] hover:border-[var(--brand-green)]/30 transition-colors">
                    <span className="text-2xl" aria-hidden="true">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-dark)]">{label}</p>
                      <p className="text-xs text-[var(--brand-dark)]/50">{sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 space-y-10">
            <HowItsMadeMini />
            <ProductObjectionsAccordion />
          </div>
        </div>
      </section>

      <PrefillModal
        isOpen={isPrefillOpen}
        isBusy={isPaying}
        values={prefill}
        onChange={setPrefill}
        onClose={() => setIsPrefillOpen(false)}
        onContinue={startPayment}
      />

      {/* Mobile sticky bar */}
      <MobileStickyBar onBuyNow={() => setIsPrefillOpen(true)} />
    </div>
  );
}

function PrefillModal(props: {
  isOpen: boolean;
  isBusy: boolean;
  values: { name: string; email: string; contact: string };
  onChange: (v: { name: string; email: string; contact: string }) => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const { isOpen, isBusy, values, onChange, onClose, onContinue } = props;
  if (!isOpen) return null;

  const canContinue =
    values.name.trim().length >= 2 &&
    values.email.trim().includes("@") &&
    values.contact.trim().length >= 8;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        type="button"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-[var(--brand-dark)]">Enter details for payment</h3>
        <p className="mt-1 text-sm text-gray-500">
          We’ll prefill these in Razorpay Checkout.
        </p>

        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="text-sm font-semibold text-[var(--brand-dark)]/70">Name</span>
            <input
              value={values.name}
              onChange={(e) => onChange({ ...values, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-base outline-none focus:border-green-700"
              placeholder="Your full name"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[var(--brand-dark)]/70">Email</span>
            <input
              value={values.email}
              onChange={(e) => onChange({ ...values, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-base outline-none focus:border-green-700"
              placeholder="you@example.com"
              inputMode="email"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[var(--brand-dark)]/70">Mobile</span>
            <input
              value={values.contact}
              onChange={(e) => onChange({ ...values, contact: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-base outline-none focus:border-green-700"
              placeholder="10-digit mobile number"
              inputMode="tel"
              autoComplete="tel"
            />
            <p className="mt-1 text-xs text-gray-500">We never share your number. Only used for order updates.</p>
          </label>
        </div>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || isBusy}
            className="bg-green-700 text-white px-8 py-4 text-xl rounded-lg w-full font-bold hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continue to payment
          </button>
          <p className="text-sm text-gray-500 text-center">Secure checkout · Razorpay protected · Ships tomorrow</p>
        </div>
      </div>
    </div>
  );
}
