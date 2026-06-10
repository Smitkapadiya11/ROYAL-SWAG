"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import UrgencySignals, { TrustStrip } from "@/components/product/UrgencySignals";
import ProductBuyButton from "@/components/product/ProductBuyButton";
import { ProductCta } from "@/components/product/ProductCta";
import { writeCart } from "@/lib/cart";
import ProductGallery from "@/components/product/ProductGallery";
import ProductSchema from "@/components/seo/ProductSchema";
import ProductViewTracker from "@/components/analytics/ProductViewTracker";
import {
  DEFAULT_PRODUCT_BUNDLE,
  type ProductBundleOption,
} from "@/lib/bundle-options";
import { getSaving } from "@/lib/productPricing";
import { useConversionBar } from "@/contexts/ConversionBarContext";
import { EVENTS, trackEvent } from "@/lib/events";
import {
  BUNDLE_GALLERY_IMAGE,
  MAIN_PRODUCT_IMAGE,
  PRODUCT_GALLERY,
} from "@/lib/product-images";
import { useCheckoutUi } from "@/contexts/CheckoutUiContext";
import ClientPortal from "@/components/ui/ClientPortal";
import { Container } from "@/components/layout";
import { useTranslations } from "@/contexts/LocaleContext";

const MAIN_FALLBACK = MAIN_PRODUCT_IMAGE;

const CountdownTimer = dynamic(() => import("@/components/product/CountdownTimer"), {
  ssr: false,
  loading: () => <div className="h-8 w-48 animate-pulse rounded bg-surface-container" />,
});

const BundleSelector = dynamic(() => import("@/components/product/BundleSelector"), {
  loading: () => <div className="h-40 animate-pulse rounded-2xl bg-surface-container" />,
});

const CheckoutModal = dynamic(() => import("@/components/checkout/CheckoutModal"), {
  ssr: false,
});

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

export default function ProductPage() {
  const { t } = useTranslations();
  const { showCheckout, setShowCheckout, openCheckout } = useCheckoutUi();
  const [activeIdx, setActiveIdx] = useState(1);
  const [activeImage, setActiveImage] = useState<string>(
    BUNDLE_GALLERY_IMAGE.double ?? MAIN_FALLBACK
  );
  const { setBarConfig } = useConversionBar();
  const [selectedBundle, setSelectedBundle] = useState<ProductBundleOption>(
    DEFAULT_PRODUCT_BUNDLE
  );
  const [showStickyBuy, setShowStickyBuy] = useState(false);
  const [checkoutPhase, setCheckoutPhase] = useState<1 | 2>(1);
  const purchasePanelRef = useRef<HTMLDivElement>(null);

  const [productImages, setProductImages] = useState<string[]>(() =>
    PRODUCT_GALLERY.length > 0 ? [...PRODUCT_GALLERY] : [MAIN_FALLBACK]
  );

  const handleMainImageError = useCallback(() => {
    setActiveImage(MAIN_FALLBACK);
    setActiveIdx(0);
  }, []);

  const handleThumbImageError = useCallback((src: string) => {
    setProductImages((prev) => prev.filter((img) => img !== src));
  }, []);

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

  useEffect(() => {
    const panel = purchasePanelRef.current;
    if (!panel) return;

    const updateSticky = () => {
      const rect = panel.getBoundingClientRect();
      // Only show float after purchase panel has fully left the viewport
      setShowStickyBuy(rect.bottom <= 0);
    };

    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky);
    return () => {
      window.removeEventListener("scroll", updateSticky);
      window.removeEventListener("resize", updateSticky);
    };
  }, []);

  const selectBundle = useCallback(
    (bundle: ProductBundleOption) => {
      setSelectedBundle(bundle);
      const gallerySrc = BUNDLE_GALLERY_IMAGE[bundle.id];
      if (gallerySrc) {
        setActiveImage(gallerySrc);
        const idx = productImages.indexOf(gallerySrc);
        if (idx >= 0) setActiveIdx(idx);
      }
      trackEvent(EVENTS.BUNDLE_SELECT, {
        pack_name: bundle.title,
        packId: bundle.id,
        price: bundle.price,
        page: "/product",
      });
    },
    [productImages]
  );

  const handleBuyNow = useCallback(() => {
    trackEvent(EVENTS.STICKY_BAR_BUY, {
      page: "/product",
      packId: selectedBundle.id,
      price: selectedBundle.price,
    });
    setCheckoutPhase(1);
    openCheckout();
  }, [openCheckout, selectedBundle.id, selectedBundle.price]);

  useEffect(() => {
    setBarConfig({
      productName: "Royal Swag Lung Detox Tea",
      price: selectedBundle.price,
      mrp: selectedBundle.mrp,
      packId: selectedBundle.id,
      packLabel: selectedBundle.title,
      onBuyNow: handleBuyNow,
    });
    return () => setBarConfig(null);
  }, [selectedBundle, setBarConfig, handleBuyNow]);

  const handleAddToCart = useCallback(() => {
    writeCart({
      packId: selectedBundle.id,
      packLabel: selectedBundle.title,
      price: selectedBundle.price,
      mrp: selectedBundle.mrp,
      quantity: 1,
    });
    trackEvent(EVENTS.ADD_TO_CART, {
      page: "/product",
      packId: selectedBundle.id,
      price: selectedBundle.price,
    });
    toast.success("Added to cart");
    setCheckoutPhase(2);
    openCheckout();
  }, [openCheckout, selectedBundle]);

  const handleImageSelect = useCallback((idx: number, src: string) => {
    setActiveIdx(idx);
    setActiveImage(src);
  }, []);

  const savingPct = getSaving(selectedBundle.price, selectedBundle.mrp);

  const titleBlock = (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-primary-container/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-container">
          Bestseller
        </span>
        <span className="rounded bg-ayurvedic-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ayurvedic-gold">
          100% Ayurvedic
        </span>
      </div>
      <h1 className="font-display text-[32px] font-bold leading-tight text-primary md:text-[36px] md:leading-[42px]">
        {t("product.title")}
      </h1>
      <p className="font-sans text-base leading-6 text-on-surface-variant">
        {t("product.subtitle")}
      </p>
      <ProductCta
        price={selectedBundle.price}
        mrp={selectedBundle.mrp}
        discountPct={savingPct}
        onBuyNow={handleBuyNow}
        onAddToCart={handleAddToCart}
        hideDeliveryNote
        beforeBuy={
          <>
            <CountdownTimer className="mb-3 mt-1" />
            <UrgencySignals className="mb-3" />
          </>
        }
        afterBuy={<TrustStrip className="mt-2" />}
      />
    </div>
  );

  const bundlePicker = (
    <BundleSelector
      selectedId={selectedBundle.id}
      onSelect={selectBundle}
      className="rounded-2xl bg-white/30 p-4 md:bg-white/40 md:p-5"
    />
  );

  const buyCta = (compact = false) => (
    <ProductBuyButton
      price={selectedBundle.price}
      mrp={selectedBundle.mrp}
      packLabel={selectedBundle.title}
      savingPct={savingPct}
      onClick={handleBuyNow}
      size={compact ? "compact" : "default"}
    />
  );

  return (
    <div
      className="product-page-root min-h-screen w-full min-w-0 overflow-x-hidden bg-parchment pb-32 font-sans text-on-surface md:pb-16"
      style={{
        backgroundImage:
          "radial-gradient(rgba(73,87,56,0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <ProductViewTracker />
      <ProductSchema />

      {/* Desktop floating buy bar — portaled so fixed positioning stays viewport-locked */}
      <ClientPortal>
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-6 z-40 hidden justify-center px-4 transition-all duration-500 md:flex ${
            showStickyBuy && !showCheckout
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
          aria-hidden={!showStickyBuy || showCheckout}
        >
          <div className="pointer-events-auto w-full max-w-xl rounded-2xl border border-glass-border bg-glass-surface/95 p-2 shadow-[0_12px_48px_rgba(50,64,35,0.2)] backdrop-blur-xl">
            {buyCta(true)}
          </div>
        </div>
      </ClientPortal>

      <Container as="main" className="w-full min-w-0">
        <nav className="mb-4 flex items-center gap-2 pt-4 text-xs text-on-surface-variant">
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

        {/* Above-fold: gallery + desktop purchase panel */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10 lg:gap-14">
          <div className="min-w-0 md:sticky md:top-24 md:self-start">
            <ProductGallery
              images={productImages}
              activeIdx={activeIdx}
              activeImage={activeImage}
              fallback={MAIN_FALLBACK}
              onSelect={handleImageSelect}
              onMainError={handleMainImageError}
              onThumbError={handleThumbImageError}
            />
            <div className="mt-4 md:hidden">{titleBlock}</div>
          </div>

          {/* Desktop purchase panel — title, packs, buy at top */}
          <div
            ref={purchasePanelRef}
            id="purchase-panel"
            className="hidden min-w-0 flex-col gap-5 md:sticky md:top-24 md:flex md:self-start"
          >
            {titleBlock}
            {bundlePicker}
            <div className="flex items-center gap-3 rounded-xl bg-[#324023] px-4 py-3">
              <span className="text-2xl">🛡</span>
              <div>
                <p className="font-sans text-sm font-bold text-white">
                  {t("product.guarantee")}
                </p>
                <p className="font-sans text-[11px] text-white/70">
                  Full refund via WhatsApp — we&apos;ve done this 47 times in 3
                  years.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile title + details — all content preserved */}
        <div className="mt-6 flex min-w-0 flex-col gap-6 md:mt-12">
          <div className="flex items-center gap-3 rounded-xl bg-[#324023] px-4 py-3 md:hidden">
            <span className="text-2xl">🛡</span>
            <div>
              <p className="font-sans text-sm font-bold text-white">
                {t("product.guarantee")}
              </p>
              <p className="font-sans text-[11px] text-white/70">
                If you don&apos;t feel a difference — WhatsApp us. Full refund.
                We&apos;ve done this 47 times in 3 years.
              </p>
            </div>
          </div>

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
                  &quot;Ex-smoker of 11 years. My morning cough was embarrassing.
                  After 3 weeks of this tea — gone. My doctor asked what I
                  changed.&quot;
                </p>
                <p className="mt-1 font-sans text-[10px] text-[#75786e]">
                  Purchased 40-Day Pack · Verified Buyer
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#ba1a1a]/20 bg-[#ffdad6]/20 p-4">
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

          <div className="flex flex-wrap gap-2">
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

          {/* Mobile-only bundle picker (desktop has it in purchase panel) */}
          <div className="md:hidden">{bundlePicker}</div>

          <section className="border-t border-[rgba(200,210,190,0.4)] py-8">
            <h3 className="mb-2 font-display text-2xl font-bold text-[#324023]">
              What&apos;s Inside
            </h3>
            <p className="mb-5 font-sans text-sm text-[#45483f]">
              Every tea bag contains 6 clinically-validated Ayurvedic herbs.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

          <section>
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

          <section className="border-t border-[rgba(200,210,190,0.4)] pb-8 pt-8">
            <h3 className="mb-6 font-display text-2xl font-bold text-[#324023]">
              How to Use
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {HOW_TO_STEPS.map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="flex shrink-0 flex-col items-center">
                    <div className="font-number flex h-11 w-11 items-center justify-center rounded-full bg-[#324023] text-base font-bold text-white">
                      {s.step}
                    </div>
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
                Drink on empty stomach (before breakfast) for maximum absorption.
                Consistent daily use for 30+ days gives best results.
              </p>
            </div>
          </section>

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
                &quot;My father smoked for 30 years. When I saw how much his lungs
                suffered — I spent 4 years developing this formula. I drink it
                every morning. My team does too.&quot;
              </p>
            </div>
          </div>

          <section className="pb-6">
            <h3 className="mb-4 font-display text-xl font-bold text-[#324023]">
              Why Not Just Steam Inhalation?
            </h3>
            <div className="overflow-x-auto md:overflow-visible">
              <table className="w-full text-left">
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
        </div>

        <section className="mt-8 border-y border-glass-border bg-surface-container/50 py-8 md:mt-12 md:rounded-2xl md:border md:py-10">
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
      </Container>

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        price={selectedBundle.price}
        mrp={selectedBundle.mrp}
        packId={selectedBundle.id}
        packLabel={selectedBundle.title}
        initialPhase={checkoutPhase}
      />

    </div>
  );
}
