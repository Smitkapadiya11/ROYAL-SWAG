"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import MobileStickyBar from "@/components/MobileStickyBar";
import CountdownTimer from "@/components/CountdownTimer";
import PricingSelector from "@/components/PricingSelector";
import {
  buildPricingPlans,
  planToAmountPaise,
  razorpayDescriptionForPlan,
  type PlanId,
} from "@/lib/product-pricing";
import { getSeasonalUrgencyMessage } from "@/lib/seasonal-urgency";
import { SITE } from "@/lib/config";

declare global {
  interface Window { Razorpay?: any; }
}

const PRODUCT_NAME = "Royal Swag Lung Detox Tea";
const CHECKOUT_CURRENCY = "INR";
const PRICING_PLANS = buildPricingPlans();
const STOCK_COUNT = process.env.NEXT_PUBLIC_STOCK_COUNT ?? "47";

export default function ProductPage() {
  const seasonalUrgencyMessage = useMemo(() => getSeasonalUrgencyMessage(), []);
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

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);
      const SRC = "https://checkout.razorpay.com/v1/checkout.js";
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      const timeout = window.setTimeout(() => resolve(!!window.Razorpay), 10000);
      const cleanup = (script?: HTMLScriptElement) => {
        window.clearTimeout(timeout);
        if (!script) return;
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
      };
      const onLoad = () => { cleanup(existing ?? undefined); resolve(true); };
      const onError = () => { cleanup(existing ?? undefined); resolve(false); };
      if (existing) {
        if (window.Razorpay) { cleanup(existing); return resolve(true); }
        existing.addEventListener("load", onLoad, { once: true });
        existing.addEventListener("error", onError, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.addEventListener("load", () => { cleanup(script); resolve(true); }, { once: true });
      script.addEventListener("error", () => { cleanup(script); resolve(false); }, { once: true });
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
      if (!res.ok || "error" in data) throw new Error("error" in data ? data.error : "Failed to create order");
      const options = {
        key: data.keyId, amount: data.amount, currency: data.currency,
        name: PRODUCT_NAME, description: razorpayDescriptionForPlan(selectedPlan),
        order_id: data.orderId,
        prefill: { name: prefill.name, email: prefill.email, contact: prefill.contact },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response?.razorpay_order_id ?? data.orderId,
                razorpay_payment_id: response?.razorpay_payment_id,
                razorpay_signature: response?.razorpay_signature,
                customerName: prefill.name, customerPhone: prefill.contact,
                customerEmail: prefill.email, amountPaise,
              }),
            });
            const verifyData = (await verifyRes.json()) as
              | { success: true; orderId: string; paymentId: string }
              | { error: string };
            if (!verifyRes.ok || "error" in verifyData)
              throw new Error("error" in verifyData ? verifyData.error : "Payment verification failed");
            const qp = new URLSearchParams({
              orderId: verifyData.orderId, paymentId: verifyData.paymentId,
              amountPaise: String(amountPaise),
            });
            window.location.href = `/order-success?${qp.toString()}`;
          } catch (err) {
            alert(err instanceof Error ? err.message : "Payment verification failed");
            setIsPaying(false);
          }
        },
        modal: { ondismiss: () => setIsPaying(false) },
        theme: { color: "#4A6422" },
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
    <div style={{ paddingBottom: 80 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Product",
          name: "Royal Swag Lung Detox Tea",
          description: "7 Ayurvedic herbs for lung detox. FSSAI certified. Free delivery.",
          brand: { "@type": "Brand", name: "Royal Swag" },
          offers: {
            "@type": "Offer", price: "349", priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "Eximburg International Pvt. Ltd." },
          },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.7", reviewCount: "847" },
        })}}
      />

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(160deg, var(--rs-deep) 0%, var(--rs-olive) 100%)",
        padding: "80px var(--section-px) 64px", minHeight: "60vh",
        display: "flex", alignItems: "center",
      }}>
        <div className="container hero-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 56, alignItems: "center", width: "100%",
        }}>
          <div>
            <span style={{ fontSize: 11, letterSpacing: 3, color: "var(--rs-gold)", fontWeight: 600, display: "block", marginBottom: 16, textTransform: "uppercase" }}>
              Ayurvedic Lung Detox Tea
            </span>
            <h1 style={{ color: "var(--rs-cream)", marginBottom: 16, fontSize: "clamp(32px, 4vw, 52px)" }}>
              Royal Swag<br />Lung Detox Tea
            </h1>
            <p style={{ color: "rgba(242,230,206,0.75)", fontSize: 17, marginBottom: 32, lineHeight: 1.8, maxWidth: 440 }}>
              7 Ayurvedic herbs. FSSAI certified. Free delivery. 30-day money-back guarantee.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button
                onClick={() => setIsPrefillOpen(true)}
                disabled={isPaying}
                style={{
                  background: "var(--rs-gold)", color: "var(--rs-deep)",
                  border: "none", borderRadius: "var(--r-md)",
                  padding: "14px 32px", fontSize: 16, fontWeight: 700,
                  cursor: isPaying ? "not-allowed" : "pointer",
                  opacity: isPaying ? 0.6 : 1,
                }}
              >
                Buy Now — Rs {selectedPlan.priceRupees}
              </button>
              <Link href="/lung-test" style={{
                color: "rgba(242,230,206,0.7)", border: "1px solid rgba(242,230,206,0.3)",
                borderRadius: "var(--r-md)", padding: "14px 28px", fontSize: 15,
                display: "inline-flex", alignItems: "center",
              }}>
                Free Lung Test First
              </Link>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "rgba(242,230,206,0.08)", border: "1px solid rgba(242,230,206,0.15)",
              borderRadius: "var(--r-lg)", padding: 32, textAlign: "center", maxWidth: 320, width: "100%",
            }}>
              <Image
                src={SITE.herbs[0].image}
                alt="Vasaka — key herb in Royal Swag"
                width={160} height={160}
                style={{ objectFit: "cover", borderRadius: "50%", margin: "0 auto 20px",
                         border: "3px solid rgba(196,154,42,0.4)" }}
              />
              <p style={{ color: "var(--rs-gold)", fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                ⭐ 4.7 · 847+ Reviews
              </p>
              <p style={{ color: "rgba(242,230,206,0.6)", fontSize: 12 }}>
                ISO · GMP · FSSAI · AYUSH Certified
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Urgency strip ── */}
      <section style={{ background: "var(--rs-olive)", padding: "14px var(--section-px)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(242,230,206,0.9)", fontSize: 13, margin: 0 }}>
            {seasonalUrgencyMessage} · Only <strong>{STOCK_COUNT}</strong> units left at this price
          </p>
        </div>
      </section>

      {/* ── Main product section ── */}
      <section style={{ background: "var(--rs-white)", padding: "var(--section-py) 0" }}>
        <div className="container" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 56, alignItems: "start",
        }}>
          {/* Left: info + purchase */}
          <div>
            <h2 style={{ marginBottom: 8, color: "var(--rs-dark)" }}>Order Your Pack</h2>
            <p style={{ marginBottom: 24 }}>
              Choose the pack that fits your detox journey.
            </p>

            <div style={{ marginBottom: 16, padding: "12px 16px", background: "var(--rs-cream)", borderRadius: "var(--r-md)", fontSize: 14 }}>
              <CountdownTimer />
            </div>

            <div style={{ marginBottom: 24 }}>
              <PricingSelector plans={PRICING_PLANS} value={selectedPlanId} onChange={setSelectedPlanId} />
            </div>

            <p style={{ fontSize: 13, color: "var(--rs-text)", marginBottom: 8 }}>
              Rs {selectedPlan.priceRupees} = Rs {perDayForButton}/day — less than one cup of chai.
            </p>
            <p style={{ fontSize: 13, color: "var(--rs-olive)", fontWeight: 600, marginBottom: 24 }}>
              ✓ Free delivery · Ships in 24 hours
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: "var(--rs-text)", background: "var(--rs-cream)", borderRadius: "var(--r-md)", padding: "12px 16px" }}>
                Every day without lung detox, PM2.5 particles accumulate further. It&apos;s reversible — but only if you start.
              </p>
              <button
                onClick={() => setIsPrefillOpen(true)}
                disabled={isPaying}
                style={{
                  background: "var(--rs-olive)", color: "var(--rs-cream)",
                  border: "none", borderRadius: "var(--r-md)", padding: "16px",
                  fontSize: 17, fontWeight: 700, cursor: isPaying ? "not-allowed" : "pointer",
                  opacity: isPaying ? 0.6 : 1, width: "100%",
                }}
              >
                Buy Now — Rs {selectedPlan.priceRupees} ({selectedPlan.days}-Day Pack)
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "var(--rs-text)" }}>
                Secure checkout · Razorpay · Ships tomorrow
              </p>
              <Link href="/lung-test" style={{
                display: "block", textAlign: "center", padding: "14px",
                border: "1.5px solid var(--rs-sand)", borderRadius: "var(--r-md)",
                color: "var(--rs-text)", fontSize: 14,
              }}>
                Take the Free Lung Test First →
              </Link>
            </div>
          </div>

          {/* Right: product details & trust */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "var(--rs-cream)", borderRadius: "var(--r-lg)", padding: "28px 24px" }}>
              <h3 style={{ marginBottom: 16 }}>Product Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "🌿", label: "Ingredients", val: "Vasaka, Tulsi, Mulethi, Pippali, Kantakari, Bibhitaki, Pushkarmool" },
                  { icon: "📦", label: "Size",        val: "20, 40, or 60 tea bags" },
                  { icon: "🏷️", label: "Weight",      val: "75g per pack" },
                  { icon: "📅", label: "Shelf Life",  val: "24 months from manufacture" },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--rs-dark)" }}>{label}: </span>
                      <span style={{ fontSize: 13, color: "var(--rs-text)" }}>{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {[
              { icon: "🌿", label: "100% Ayurvedic",  sub: "No artificial ingredients" },
              { icon: "🛡️", label: "No Side Effects",  sub: "Safe for long-term daily use" },
              { icon: "🔄", label: "30-Day Guarantee", sub: "Full refund, no questions asked" },
              { icon: "🚚", label: "Free Delivery",    sub: "Pan-India · Ships in 24 hours" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{
                display: "flex", gap: 16, alignItems: "center",
                background: "var(--rs-cream)", borderRadius: "var(--r-md)",
                padding: "16px 20px", border: "1px solid var(--rs-sand)",
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--rs-dark)", margin: 0, fontSize: 14 }}>{label}</p>
                  <p style={{ color: "var(--rs-text)", margin: 0, fontSize: 12 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Herb showcase ── */}
      <section style={{ background: "var(--rs-cream)", padding: "var(--section-py) 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="eyebrow">Inside Every Bag</span>
            <h2>The 7-Herb Formula</h2>
            <div className="divider divider--center" />
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}>
            {SITE.herbs.map((herb) => (
              <div key={herb.id} style={{
                background: "var(--rs-white)", borderRadius: "var(--r-lg)",
                border: "1px solid var(--rs-sand)", overflow: "hidden",
              }}>
                <div style={{ position: "relative", paddingBottom: "65%", overflow: "hidden" }}>
                  <Image
                    src={herb.image}
                    alt={herb.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <span style={{ fontSize: 10, color: "var(--rs-gold)", fontWeight: 700, letterSpacing: 2 }}>
                    {herb.role.toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: 16, marginTop: 4, marginBottom: 6 }}>{herb.name}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>{herb.benefit}</p>
                </div>
              </div>
            ))}
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

      <MobileStickyBar
        onBuyNow={() => setIsPrefillOpen(true)}
        subline={`Rs ${selectedPlan.priceRupees} · Secure checkout · Ships tomorrow`}
      />
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

  const inputStyle: React.CSSProperties = {
    width: "100%", borderRadius: "var(--r-md)",
    border: "1.5px solid var(--rs-sand)", padding: "12px 16px",
    fontSize: 15, fontFamily: "var(--font-body)",
    outline: "none", background: "var(--rs-white)",
    color: "var(--rs-dark)", marginTop: 6,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <button
        aria-label="Close"
        onClick={onClose}
        type="button"
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer" }}
      />
      <div style={{
        position: "relative", width: "100%", maxWidth: 440,
        background: "var(--rs-white)", borderRadius: "var(--r-lg)", padding: 28,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <h3 style={{ marginBottom: 4, fontSize: 20 }}>Enter your details</h3>
        <p style={{ fontSize: 14, color: "var(--rs-text)", marginBottom: 24 }}>
          We&apos;ll prefill these in Razorpay Checkout.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--rs-dark)" }}>Name</span>
            <input style={inputStyle} value={values.name}
              onChange={(e) => onChange({ ...values, name: e.target.value })}
              placeholder="Your full name" autoComplete="name" />
          </label>
          <label>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--rs-dark)" }}>Email</span>
            <input style={inputStyle} value={values.email}
              onChange={(e) => onChange({ ...values, email: e.target.value })}
              placeholder="you@example.com" inputMode="email" autoComplete="email" />
          </label>
          <label>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--rs-dark)" }}>Mobile</span>
            <input style={inputStyle} value={values.contact}
              onChange={(e) => onChange({ ...values, contact: e.target.value })}
              placeholder="10-digit mobile" inputMode="tel" autoComplete="tel" />
            <p style={{ fontSize: 12, color: "var(--rs-text)", marginTop: 4 }}>
              Never shared. Only used for order updates.
            </p>
          </label>
        </div>
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || isBusy}
            style={{
              background: "var(--rs-olive)", color: "var(--rs-cream)",
              border: "none", borderRadius: "var(--r-md)", padding: "16px",
              fontSize: 16, fontWeight: 700, cursor: (!canContinue || isBusy) ? "not-allowed" : "pointer",
              opacity: (!canContinue || isBusy) ? 0.55 : 1, width: "100%",
            }}
          >
            Continue to Payment
          </button>
          <p style={{ fontSize: 12, textAlign: "center", color: "var(--rs-text)" }}>
            Secure · Razorpay protected · Ships tomorrow
          </p>
        </div>
      </div>
    </div>
  );
}
