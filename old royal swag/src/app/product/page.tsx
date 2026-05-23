"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductSocialProof from "@/components/ui/ProductSocialProof";
import ProductCheckout from "@/components/product/ProductCheckout";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import ProductViewTracker from "@/components/analytics/ProductViewTracker";
import { BUNDLES, DEFAULT_BUNDLE } from "@/lib/productData";
import { EVENTS, trackEvent } from "@/lib/events";

const PRODUCT_IMAGES = [
  "/images/product/product-1.jpg",
  "/images/product/product-2.jpg",
  "/images/product/product-3.jpg",
  "/images/product/product-4.jpg",
  "/images/product/product-5.jpg",
  "/images/product/product-6.jpg",
  "/images/product/product-7.jpg",
  "/images/product/product-8.jpg",
  "/images/product/product-9.jpg",
  "/images/product/product-10.jpg",
  "/images/product/product-11.jpg",
  "/images/product/product-12.jpg",
  "/images/product/product-13.jpg",
];

const MAIN_FALLBACK = "/images/product/product-1.jpg";

type Bundle = (typeof BUNDLES)[number];

function bundleSavingPercent(bundle: Bundle): number {
  return Math.round(
    ((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100
  );
}

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
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeImage, setActiveImage] = useState(
    PRODUCT_IMAGES[0] ?? MAIN_FALLBACK
  );
  const [selectedBundle, setSelectedBundle] = useState<Bundle>(DEFAULT_BUNDLE);

  const productImages = useMemo(
    () => (PRODUCT_IMAGES.length > 0 ? PRODUCT_IMAGES : [MAIN_FALLBACK]),
    []
  );

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
    const el = document.getElementById("product-checkout");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedBundle.id, selectedBundle.price]);

  const savingPercent = bundleSavingPercent(selectedBundle);

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
          {/* ── Images ── */}
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
                  onError={(e) => handleImageFallback(e, "/images/product/product-1.jpg")}
                />
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-glass-border bg-glass-surface px-3 py-1 shadow-sm backdrop-blur-md">
                  <span className="text-sm text-ayurvedic-gold">★</span>
                  <span className="font-sans text-xs font-bold text-primary">
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

          {/* ── Info + checkout ── */}
          <div className="flex flex-col gap-6">
            <div className="mb-6 flex flex-col gap-2 px-5">
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
                <span className="font-display text-[32px] font-semibold text-primary">
                  ₹{selectedBundle.price}
                </span>
                <span className="font-sans text-base text-on-surface-variant line-through">
                  ₹{selectedBundle.originalPrice}
                </span>
                <span className="ml-auto rounded-full bg-ayurvedic-gold/10 px-2 py-1 font-sans text-xs font-bold text-ayurvedic-gold">
                  Save {savingPercent}%
                </span>
              </div>
              <div className="mt-2">
                <CountdownTimer />
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2 px-5">
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
                {BUNDLES.map((b) => {
                  const saving = bundleSavingPercent(b);
                  const isBest = b.id === "progress";
                  return (
                    <div
                      key={b.id}
                      role="button"
                      tabIndex={0}
                      data-track-button={`bundle-${b.id}`}
                      data-track-label={b.label}
                      onClick={() => selectBundle(b)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectBundle(b);
                        }
                      }}
                      className={`glass-card relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl p-4 transition-all ${
                        selectedBundle.id === b.id
                          ? "border-2 border-ayurvedic-gold bg-ayurvedic-gold/5"
                          : "border border-[rgba(255,255,255,0.5)]"
                      }`}
                    >
                      {isBest && (
                        <div className="absolute right-0 top-0 rounded-bl-lg bg-ayurvedic-gold px-3 py-1 text-[10px] font-bold uppercase text-white">
                          Best Value
                        </div>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="h-24 w-24 shrink-0 rounded-lg object-contain"
                        src="/images/product/product-1.jpg"
                        alt={b.label}
                        onError={hideBrokenImage}
                      />
                      <div className="flex-1">
                        <h4 className="font-sans text-sm font-bold text-primary">
                          {b.label}
                        </h4>
                        <p className="mt-0.5 font-sans text-xs text-on-surface-variant">
                          {b.subtitle}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-display text-2xl font-semibold text-primary">
                            ₹{b.price}
                          </span>
                          <span className="font-sans text-[10px] font-bold text-ayurvedic-gold">
                            SAVE {saving}%
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pack"
                        readOnly
                        checked={selectedBundle.id === b.id}
                        className="h-5 w-5 shrink-0 accent-primary"
                        aria-label={b.label}
                      />
                    </div>
                  );
                })}
              </div>
            </section>

            <ProductSocialProof className="mx-auto max-w-full px-5 md:max-w-full" />

            <div className="px-5">
              <ProductCheckout
                key={selectedBundle.id}
                price={selectedBundle.price}
                packId={selectedBundle.id}
                packLabel={selectedBundle.label}
                showSocialProof={false}
              />
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              className="btn-primary mx-5 mt-4 hidden items-center justify-center gap-2 py-4 text-base font-semibold tracking-wide md:flex"
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

      <div className="fixed bottom-0 left-0 z-[60] w-full border-t border-glass-border bg-glass-surface px-5 py-4 shadow-[0_-8px_30px_rgba(73,87,56,0.1)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <div className="flex flex-col">
            <span className="font-sans text-xs text-on-surface-variant">
              Total Price
            </span>
            <span className="font-display text-2xl font-semibold leading-none text-primary">
              ₹{selectedBundle.price}
            </span>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-sans text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-skew-x-3 hover:shadow-lg"
          >
            🛍 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
