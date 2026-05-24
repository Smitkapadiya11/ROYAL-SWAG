"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductSocialProof from "@/components/ui/ProductSocialProof";
import ProductCheckout from "@/components/product/ProductCheckout";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import ProductViewTracker from "@/components/analytics/ProductViewTracker";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  BUNDLES,
  DEFAULT_BUNDLE,
  getSaving,
  type Bundle,
} from "@/lib/productPricing";
import { EVENTS, trackEvent } from "@/lib/events";
import {
  MAIN_PRODUCT_IMAGE,
  PRODUCT_GALLERY,
} from "@/lib/product-images";
import { useCheckoutUi } from "@/contexts/CheckoutUiContext";

const MAIN_FALLBACK = MAIN_PRODUCT_IMAGE;

const HERBS = [
  {
    name: "Tulsi (Holy Basil)",
    amount: "200mg",
    benefit: "Fights respiratory infections, boosts immunity",
    icon: "🌿",
  },
  {
    name: "Vasaka",
    amount: "150mg",
    benefit: "Clears chest congestion, relieves bronchitis",
    icon: "🍃",
  },
  {
    name: "Mulethi (Licorice Root)",
    amount: "120mg",
    benefit: "Soothes throat, natural expectorant",
    icon: "🌱",
  },
  {
    name: "Pippali (Long Pepper)",
    amount: "100mg",
    benefit: "Opens airways, boosts lung capacity",
    icon: "🌾",
  },
  {
    name: "Pushkarmool",
    amount: "80mg",
    benefit: "Powerful bronchodilator, eases breathing",
    icon: "🪴",
  },
  {
    name: "Kantakari",
    amount: "75mg",
    benefit: "Stops morning cough, reduces inflammation",
    icon: "🌺",
  },
] as const;

const HOW_TO_STEPS = [
  {
    step: "01",
    time: "Morning",
    title: "Boil",
    icon: "🔥",
    desc: "Bring 200ml fresh water to a rolling boil. Use filtered water for best results.",
  },
  {
    step: "02",
    time: "2 minutes",
    title: "Steep",
    icon: "⏱",
    desc: "Drop one tea bag. Cover and steep 3–5 minutes. Do not over-steep.",
  },
  {
    step: "03",
    time: "Before drinking",
    title: "Inhale Steam",
    icon: "💨",
    desc: "Hold cup 10cm from face. Breathe the herbal steam for 30 seconds. This starts the healing.",
  },
  {
    step: "04",
    time: "Slowly",
    title: "Sip & Breathe",
    icon: "🍵",
    desc: "Drink warm (not hot). No milk, no sugar. Take slow conscious breaths as you drink.",
  },
] as const;

const COMPARISON_ROWS = [
  ["Removes deep toxins", "✓", "✗"],
  ["Heals inflamed tissue", "✓", "✗"],
  ["Works while sleeping", "✓", "✗"],
  ["Boosts immunity", "✓", "✗"],
  ["Daily in 5 minutes", "✓", "✓"],
] as const;

function hideBrokenImage(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement>,
  fallback: string
) {
  const el = e.currentTarget;
  if (el.src.endsWith(fallback)) {
    el.style.display = "none";
    return;
  }
  el.src = fallback;
}

export default function ProductPage() {
  const { showCheckout, setShowCheckout, openCheckout } = useCheckoutUi();
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeImage, setActiveImage] = useState<string>(
    PRODUCT_GALLERY[0] ?? MAIN_FALLBACK
  );
  const [selectedBundle, setSelectedBundle] = useState<Bundle>(DEFAULT_BUNDLE);

  const productImages = useMemo(
    () => (PRODUCT_GALLERY.length > 0 ? [...PRODUCT_GALLERY] : [MAIN_FALLBACK]),
    []
  );

  useEffect(() => {
    document.body.style.overflow = showCheckout ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCheckout]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCheckout(false);
    };
    if (showCheckout) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCheckout, setShowCheckout]);

  const selectBundle = useCallback((bundle: Bundle) => {
    setSelectedBundle(bundle);
    trackEvent(EVENTS.BUNDLE_SELECT, {
      pack_name: bundle.label,
      packId: bundle.id,
      price: bundle.price,
      page: "/product",
    });
  }, []);

  const handleBuyNow = useCallback(() => {
    trackEvent(EVENTS.STICKY_BAR_BUY, {
      page: "/product",
      packId: selectedBundle.id,
      price: selectedBundle.price,
    });
    openCheckout();
  }, [openCheckout, selectedBundle.id, selectedBundle.price]);

  return (
    <div
      className="min-h-screen bg-parchment pb-32 font-sans text-on-surface md:pb-12"
      style={{
        backgroundImage:
          "radial-gradient(rgba(73,87,56,0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <ProductViewTracker />
      <ProductJsonLd />

      <main className="mx-auto w-full max-w-md md:max-w-6xl">
        <nav className="mb-4 flex items-center gap-2 px-5 pt-4 text-xs text-on-surface-variant">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span aria-hidden>›</span>
          <Link href="/product" className="hover:text-primary">
            Shop
          </Link>
          <span aria-hidden>›</span>
          <span className="font-semibold text-primary">Detox Tea</span>
        </nav>

        <div className="md:mx-auto md:grid md:max-w-6xl md:grid-cols-2 md:gap-16 md:px-16 md:pt-12">
          <div className="md:sticky md:top-24 md:self-start">
            <section className="relative w-full overflow-hidden px-5 pb-8 pt-4">
              <div
                className="absolute left-1/2 top-1/4 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-container/10 blur-3xl"
                aria-hidden
              />

              <div className="glass-card group relative aspect-square w-full overflow-hidden rounded-xl p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full rounded-lg object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  src={activeImage || MAIN_FALLBACK}
                  alt="Lung Detox Tea"
                  onError={(e) => handleImageFallback(e, MAIN_FALLBACK)}
                />
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-glass-border bg-glass-surface px-3 py-1 shadow-sm backdrop-blur-md">
                  <span className="text-sm text-ayurvedic-gold">★</span>
                  <span className="font-number text-xs font-bold tabular-nums text-primary">
                    4.9
                  </span>
                </div>
              </div>

              <div
                className="mt-4 flex gap-2 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none" }}
              >
                {productImages.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img}
                    className={`h-16 w-16 shrink-0 cursor-pointer rounded-lg object-cover transition-all ${
                      activeIdx === i
                        ? "border-2 border-primary"
                        : "border border-glass-border"
                    }`}
                    src={img}
                    alt=""
                    loading="lazy"
                    onClick={() => {
                      setActiveIdx(i);
                      setActiveImage(img);
                    }}
                    onError={hideBrokenImage}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <div className="mb-2 flex flex-col gap-2 px-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded bg-primary-container/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-container">
                  Bestseller
                </span>
                <span className="rounded bg-ayurvedic-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ayurvedic-gold">
                  100% Ayurvedic
                </span>
              </div>
              <h1 className="font-display text-[36px] font-bold leading-[42px] text-primary">
                Lung Detox Tea
              </h1>
              <p className="font-sans text-base leading-6 text-on-surface-variant">
                Cleanse, soothe, and rejuvenate your respiratory system with
                ancient botanical wisdom.
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="price-num font-number text-[32px] font-semibold tabular-nums text-primary">
                  ₹{selectedBundle.price}
                </span>
                <span className="price-num font-number text-base tabular-nums text-on-surface-variant line-through">
                  ₹{selectedBundle.mrp}
                </span>
                <span className="ml-auto rounded-full bg-ayurvedic-gold/10 px-2 py-1 font-sans text-xs font-bold text-ayurvedic-gold">
                  Save{" "}
                  <span className="font-number tabular-nums">
                    {getSaving(selectedBundle.price, selectedBundle.mrp)}
                  </span>
                  %
                </span>
              </div>
              <div className="mt-2">
                <CountdownTimer />
              </div>
            </div>

            <div className="mx-5 mb-4 flex items-center gap-3 rounded-xl bg-[#324023] px-4 py-3">
              <span className="text-2xl">🛡</span>
              <div>
                <p className="font-sans text-sm font-bold text-white">
                  30-Day Money Back. Zero Questions.
                </p>
                <p className="font-sans text-[11px] text-white/70">
                  If you don&apos;t feel a difference — WhatsApp us. Full refund.
                  We&apos;ve done this 47 times in 3 years.
                </p>
              </div>
            </div>

            <div className="mx-5 mb-6">
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#495738] text-sm font-bold text-white">
                    P
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans text-sm font-bold text-[#324023]">
                        Priya M., Ahmedabad
                      </span>
                      <div className="flex">
                        {"★★★★★".split("").map((star, i) => (
                          <span key={i} className="text-xs text-[#9A6F1A]">
                            {star}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 font-sans text-xs italic leading-5 text-[#45483f]">
                      &quot;Ex-smoker of 11 years. My morning cough was
                      embarrassing. After 3 weeks of this tea — gone. My doctor
                      asked what I changed.&quot;
                    </p>
                    <p className="mt-1 font-sans text-[10px] text-[#75786e]">
                      Purchased 40-Day Pack · Verified Buyer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-5 mb-6 rounded-xl border border-[#ba1a1a]/20 bg-[#ffdad6]/20 p-4">
              <p className="mb-2 font-sans text-xs font-bold uppercase tracking-wider text-[#ba1a1a]">
                ⚠ Without daily lung care:
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  "Urban pollution deposits 14 grams of particles in lungs annually",
                  "Uncleaned toxins harden into chronic inflammation over 5–10 years",
                  "Morning cough is your lung warning system — don't ignore it",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-xs text-[#ba1a1a]">
                      •
                    </span>
                    <p className="font-sans text-xs text-[#45483f]">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2 px-5">
              {[
                { label: "Reduces Inflammation" },
                { label: "Clears Airways" },
                { label: "Boosts Immunity" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="glass-card flex items-center gap-2 rounded-lg px-3 py-2"
                >
                  <span className="text-xs text-primary">✦</span>
                  <span className="font-sans text-xs font-medium text-primary">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>

            <section className="bg-white/30 px-5 py-8">
              <h2 className="mb-6 text-center font-display text-2xl font-semibold text-primary">
                Choose Your Detox Pack
              </h2>
              <div className="flex flex-col gap-4">
                {BUNDLES.map((bundle) => (
                  <div
                    key={bundle.id}
                    role="button"
                    tabIndex={0}
                    data-track-button={`bundle-${bundle.id}`}
                    data-track-label={bundle.label}
                    onClick={() => selectBundle(bundle)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectBundle(bundle);
                      }
                    }}
                    className={`relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ${
                      selectedBundle.id === bundle.id
                        ? "shadow-[0_8px_32px_rgba(154,111,26,0.2)] ring-2 ring-[#9A6F1A]"
                        : "ring-1 ring-[rgba(255,255,255,0.5)] hover:ring-[#9A6F1A]/50"
                    }`}
                    style={{
                      background:
                        selectedBundle.id === bundle.id
                          ? "rgba(154,111,26,0.05)"
                          : "rgba(255,255,255,0.4)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {bundle.badge && (
                      <div className="absolute left-0 right-0 top-0 z-10 flex justify-center">
                        <span
                          className={`px-4 py-1 font-sans text-[10px] font-bold tracking-wider ${
                            bundle.badge === "BEST VALUE"
                              ? "bg-[#9A6F1A] text-white"
                              : "bg-[#324023] text-white"
                          }`}
                        >
                          {bundle.badge}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-4 pt-6">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#324023] to-[#9A6F1A]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={bundle.img}
                          alt={bundle.label}
                          className="h-full w-full object-contain p-1"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-1 font-sans text-sm font-bold text-[#324023]">
                          {bundle.label}
                        </h4>
                        <p className="mb-2 font-sans text-[11px] text-[#45483f]">
                          {bundle.packs} · {bundle.description}
                        </p>
                        <PriceDisplay
                          price={bundle.price}
                          mrp={bundle.mrp}
                          size="sm"
                        />
                      </div>
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          selectedBundle.id === bundle.id
                            ? "border-[#9A6F1A] bg-[#9A6F1A]"
                            : "border-[#c5c8bc] bg-white"
                        }`}
                      >
                        {selectedBundle.id === bundle.id && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <ProductSocialProof className="mx-auto max-w-full md:max-w-full" />

            <section className="border-t border-[rgba(200,210,190,0.4)] px-5 py-8">
              <h3 className="mb-2 font-display text-2xl font-bold text-[#324023]">
                What&apos;s Inside
              </h3>
              <p className="mb-5 font-sans text-sm text-[#45483f]">
                Every tea bag contains 6 clinically-validated Ayurvedic herbs.
              </p>
              <div className="flex flex-col gap-3">
                {HERBS.map((herb, i) => (
                  <div
                    key={herb.name}
                    className="glass-card flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className="shrink-0 text-xl">{herb.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-sans text-sm font-semibold text-[#324023]">
                          {herb.name}
                        </span>
                        <span className="font-number shrink-0 rounded-full bg-[#9A6F1A]/10 px-2 py-0.5 text-xs font-bold text-[#9A6F1A]">
                          {herb.amount}
                        </span>
                      </div>
                      <p className="mt-0.5 font-sans text-xs text-[#45483f]">
                        {herb.benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center font-sans text-[10px] text-[#75786e]">
                All herbs sourced from certified organic farms. GMP manufactured.
              </p>
            </section>

            <section className="px-5 pb-8">
              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ancient_manuscript.png"
                  alt="Ancient Ayurvedic manuscript reference"
                  className="h-auto w-full rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#324023]/70 to-transparent p-5">
                  <div>
                    <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white/70">
                      Ancient Wisdom
                    </p>
                    <p className="font-display text-lg font-bold leading-tight text-white">
                      Formulated from 3,000-year-old
                      <br />
                      Ayurvedic texts
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-[rgba(200,210,190,0.4)] px-5 pb-8 pt-8">
              <h3 className="mb-6 font-display text-2xl font-bold text-[#324023]">
                How to Use
              </h3>
              <div className="flex flex-col gap-4">
                {HOW_TO_STEPS.map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="flex shrink-0 flex-col items-center">
                      <div className="font-number flex h-11 w-11 items-center justify-center rounded-full bg-[#324023] text-base font-bold text-white">
                        {s.step}
                      </div>
                      <div className="mt-1 h-full min-h-[32px] w-px bg-[#dee5d1]" />
                    </div>
                    <div className="glass-card -mt-1 flex-1 rounded-xl p-4">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-base">{s.icon}</span>
                        <span className="font-sans text-sm font-bold text-[#324023]">
                          {s.title}
                        </span>
                        <span className="ml-auto font-sans text-[10px] text-[#9A6F1A]">
                          {s.time}
                        </span>
                      </div>
                      <p className="font-sans text-xs leading-5 text-[#45483f]">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card mt-5 rounded-xl border-l-4 border-[#9A6F1A] p-4">
                <p className="mb-1 font-sans text-xs font-semibold text-[#324023]">
                  💡 Pro Tip from our Vaidya
                </p>
                <p className="font-sans text-xs leading-5 text-[#45483f]">
                  Drink on empty stomach (before breakfast) for maximum
                  absorption. Consistent daily use for 30+ days gives best
                  results.
                </p>
              </div>
            </section>

            <div className="mx-5 mb-6">
              <div className="glass-card flex items-start gap-4 rounded-xl p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hitesh.jpeg"
                  alt="Hitesh"
                  className="h-12 w-12 shrink-0 rounded-full border-2 border-[#9A6F1A] object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div>
                  <p className="font-sans text-xs font-bold text-[#324023]">
                    A note from Hitesh, Co-founder
                  </p>
                  <p className="mt-1 font-sans text-xs italic leading-5 text-[#45483f]">
                    &quot;My father smoked for 30 years. When I saw how much his
                    lungs suffered — I spent 4 years developing this formula. I
                    drink it every morning. My team does too.&quot;
                  </p>
                </div>
              </div>
            </div>

            <section className="px-5 pb-6">
              <h3 className="mb-4 font-display text-xl font-bold text-[#324023]">
                Why Not Just Steam Inhalation?
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth: "300px" }}>
                  <thead>
                    <tr className="border-b border-[#dee5d1]">
                      <th className="pb-2 pr-4 font-sans text-[11px] text-[#45483f]">
                        Benefit
                      </th>
                      <th className="pb-2 pr-4 font-sans text-[11px] font-bold text-[#9A6F1A]">
                        Royal Swag
                      </th>
                      <th className="pb-2 font-sans text-[11px] text-[#75786e]">
                        Steam Only
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map(([benefit, rs, steam], i) => (
                      <tr key={i} className="border-b border-[#dee5d1]/50">
                        <td className="py-2 pr-4 font-sans text-xs text-[#45483f]">
                          {benefit}
                        </td>
                        <td className="py-2 pr-4 font-sans text-sm font-bold text-[#16a34a]">
                          {rs}
                        </td>
                        <td className="py-2 font-sans text-sm text-[#ba1a1a]">
                          {steam}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <button
              type="button"
              onClick={handleBuyNow}
              className="btn-primary mx-5 mt-2 hidden items-center justify-center gap-2 py-4 text-base font-semibold tracking-wide md:flex"
            >
              🛍 Buy Now — ₹{selectedBundle.price}
            </button>
          </div>
        </div>

        <div className="md:mx-auto md:max-w-6xl md:px-16">
          <section className="border-y border-glass-border bg-surface-container/50 px-5 py-8 md:rounded-2xl md:border md:py-10">
            <h3 className="mb-6 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              Backed By Science & Tradition
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center md:gap-8">
              {[
                { icon: "✓", label: "AYUSH Appr." },
                { icon: "🌿", label: "100% Natural" },
                { icon: "🔬", label: "GMP Cert." },
                { icon: "🛡", label: "No Side Effects" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-white text-lg text-ayurvedic-gold shadow-sm md:h-14 md:w-14">
                    {b.icon}
                  </div>
                  <span className="font-sans text-[10px] text-on-surface-variant md:text-xs">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {showCheckout && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close checkout"
            onClick={() => setShowCheckout(false)}
          />
          <div
            className="relative max-h-[90vh] overflow-y-auto rounded-t-3xl bg-[#F4EDD6]"
            style={{
              animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-sheet-title"
          >
            <div className="flex justify-center pb-1 pt-3">
              <div className="h-1 w-10 rounded-full bg-[#c5c8bc]" />
            </div>
            <div className="flex items-center justify-between border-b border-[rgba(200,210,190,0.4)] px-5 py-3">
              <div>
                <h3
                  id="checkout-sheet-title"
                  className="font-display text-xl font-bold text-[#324023]"
                >
                  Complete Your Order
                </h3>
                <p className="font-sans text-xs text-[#45483f]">
                  {selectedBundle.label} ·{" "}
                  <span className="font-number tabular-nums">
                    ₹{selectedBundle.price}
                  </span>
                  <span className="ml-1 font-number text-[#75786e] line-through tabular-nums">
                    ₹{selectedBundle.mrp}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dee5d1] text-sm font-bold text-[#324023]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="px-5 pb-8 pt-4">
              <ProductCheckout
                key={selectedBundle.id}
                price={selectedBundle.price}
                packId={selectedBundle.id}
                packLabel={selectedBundle.label}
                showSocialProof={false}
                embedded
              />
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 z-[60] w-full border-t border-glass-border bg-glass-surface px-5 py-4 shadow-[0_-8px_30px_rgba(73,87,56,0.1)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <div className="flex flex-col">
            <span className="font-sans text-[10px] text-on-surface-variant">
              <span className="font-number line-through tabular-nums">
                ₹{selectedBundle.mrp}
              </span>{" "}
              → Save{" "}
              <span className="font-number tabular-nums">
                {getSaving(selectedBundle.price, selectedBundle.mrp)}
              </span>
              %
            </span>
            <span className="font-number text-2xl font-bold leading-none tabular-nums text-primary">
              ₹{selectedBundle.price}
            </span>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-sans text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-skew-x-3 hover:shadow-lg"
          >
            🛍 Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
