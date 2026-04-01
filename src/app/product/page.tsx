"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CheckoutModal from "@/components/CheckoutModal";
import CountdownTimer from "@/components/CountdownTimer";
import MobileStickyBar from "@/components/MobileStickyBar";

// TODO: Set via env var NEXT_PUBLIC_STOCK_COUNT (default 38)
const STOCK_COUNT = process.env.NEXT_PUBLIC_STOCK_COUNT ?? "38";
// TODO: Set via env var NEXT_PUBLIC_ORDERS_24H (default 12)
const ORDERS_24H = process.env.NEXT_PUBLIC_ORDERS_24H ?? "12";

// TODO: Replace XXXXXXXXXXXX with real FSSAI license number
const FSSAI_LICENSE = "XXXXXXXXXXXX"; // TODO: REPLACE

const productImages = [
  "/images/product/product-1.jpg",
  "/images/product/product-2.jpg",
  "/images/product/product-3.jpg",
  "/images/product/product-4.jpg",
  "/images/product/product-5.jpg",
  "/images/product/product-6.webp",
  "/images/product/product-7.jpg",
  "/images/product/product-8.jpg",
  "/images/product/product-9.jpg",
  "/images/product/product-10.jpg",
  "/images/product/product-11.jpg",
  "/images/product/product-12.jpg",
  "/images/product/product-13.jpg",
];

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

export default function ProductPage() {
  const introRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const gsapRef = useRef<any>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
          .from(".product-price", { x: 30, opacity: 0, duration: 0.5, ease: "expo.out" }, "-=0.4")
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

  // GALLERY HOVER ZOOM
  const handleImgEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (gsapRef.current)
      gsapRef.current.to(e.currentTarget.querySelector("img"), {
        scale: 1.08,
        duration: 0.4,
        ease: "power2.out",
      });
  };
  const handleImgLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (gsapRef.current)
      gsapRef.current.to(e.currentTarget.querySelector("img"), {
        scale: 1.0,
        duration: 0.4,
        ease: "power2.out",
      });
  };

  return (
    <div>
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
              src="/images/product/product-1.jpg"
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
          {/* Hero Buy Now CTA */}
          <div className="product-hero-sub opacity-0 mt-8">
            <button
              id="product-hero-buy-btn"
              onClick={() => setIsCheckoutOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--brand-gold)] text-[var(--brand-green)] font-bold text-base shadow-lg hover:shadow-xl transition-all"
            >
              🛒 Buy Now — ₹699
            </button>
            <p className="text-white/40 text-xs mt-3">Free delivery · 30-day guarantee</p>
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

          <div className="grid grid-cols-2 gap-2 px-4 max-w-4xl mx-auto">
            {productImages.map((img, i) => (
              <div
                key={i}
                className={`gallery-item relative overflow-hidden rounded-xl ${
                  i === 0 ? "col-span-2 h-72 sm:h-96" : "h-44 sm:h-64"
                }`}
                onMouseEnter={handleImgEnter}
                onMouseLeave={handleImgLeave}
              >
                <Image
                  src={img}
                  alt={`Product view ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading={i > 2 ? "lazy" : "eager"}
                  onError={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Info ── */}
      <section ref={infoRef} className="product-info-section py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-rs max-w-3xl">
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

              {/* Price row */}
              <div className="product-price flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-[var(--brand-dark)]">₹699</span>
                <span className="text-lg line-through text-[var(--brand-dark)]/30">₹999</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  30% OFF
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="product-price mb-4">
                <CountdownTimer />
              </div>

              {/* Urgency signals */}
              <div className="product-price flex flex-wrap gap-3 mb-6 text-xs font-semibold">
                <span className="flex items-center gap-1 text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-3 py-1">
                  📦 Only {STOCK_COUNT} packs left at this price
                </span>
                <span className="flex items-center gap-1 text-[var(--brand-green)] bg-[var(--brand-sage)] border border-[var(--brand-sage)] rounded-full px-3 py-1">
                  🔥 {ORDERS_24H} people ordered in the last 24 hours
                </span>
              </div>

              {/* Product details */}
              <ul className="product-title text-sm text-[var(--brand-dark)]/65 space-y-2 mb-8">
                <li>🌿 <strong>Ingredients:</strong> Tulsi, Vasaka, Mulethi, Pippali, Ginger, Black Pepper, Cinnamon</li>
                <li>📦 <strong>Size:</strong> 30 tea bags (30-day supply at 1/day)</li>
                <li>🏷️ <strong>Weight:</strong> 75g</li>
                <li>📅 <strong>Shelf Life:</strong> 24 months from manufacture</li>
              </ul>

              {/* CTA buttons */}
              <div className="product-cta space-y-3">
                <button
                  id="product-buy-now-btn"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="inline-flex items-center justify-center w-full gap-2 px-8 py-4 rounded-xl bg-[var(--brand-green)] text-white font-bold text-base shadow-sm hover:bg-[#163d29] transition-all"
                >
                  🛒 Buy Now — ₹699
                </button>
                <p className="text-xs text-[var(--brand-dark)]/40 text-center">
                  ✈️ Free delivery on all orders · Ships in 24 hours
                </p>
                <Link
                  href="/lung-test"
                  className="inline-flex items-center justify-center w-full gap-2 px-8 py-3 rounded-xl border-2 border-[var(--brand-sage)] text-[var(--brand-dark)]/60 font-semibold text-sm hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all"
                >
                  Take the Free Lung Test First →
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: "✅",
                  label: "FSSAI Certified",
                  sub: `License No. ${FSSAI_LICENSE}`,
                  link: `https://foscos.fssai.gov.in/`,
                },
                { icon: "🌿", label: "100% Ayurvedic", sub: "No artificial ingredients", link: null },
                { icon: "🛡️", label: "No Side Effects", sub: "Safe for long-term daily use", link: null },
                { icon: "🔄", label: "30-Day Guarantee", sub: "Full refund, no questions asked", link: null },
                { icon: "🚚", label: "Free Delivery", sub: "Pan-India · Ships in 24 hours", link: null },
              ].map(({ icon, label, sub, link }) => {
                const inner = (
                  <div className="product-badge flex items-center gap-4 bg-[var(--brand-sage)]/50 rounded-2xl px-5 py-4 border border-[var(--brand-sage)] hover:border-[var(--brand-green)]/30 transition-colors">
                    <span className="text-2xl" aria-hidden="true">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-dark)]">{label}</p>
                      <p className="text-xs text-[var(--brand-dark)]/50">{sub}</p>
                    </div>
                    {link && (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-auto text-[var(--brand-dark)]/20" aria-hidden="true">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    )}
                  </div>
                );
                return link ? (
                  <a key={label} href={link} target="_blank" rel="noopener noreferrer" aria-label={`${label} — verify on FSSAI portal`}>
                    {inner}
                  </a>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Checkout modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* Mobile sticky bar */}
      <MobileStickyBar />
    </div>
  );
}
