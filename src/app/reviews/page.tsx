"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            fill={i < count ? "var(--brand-gold)" : "var(--brand-sage)"}
          />
        </svg>
      ))}
    </div>
  );
}

const REVIEWS = [
  { id: "r1", name: "Sneha Patil", city: "Mumbai", rating: 5, tier: "Was: High Risk", text: "I live near a textile factory in Dharavi and the air quality is terrible. After 4 weeks of Royal Swag I can finally climb stairs without getting winded. Completely changed my mornings." },
  { id: "r2", name: "Aditya Verma", city: "Delhi", rating: 5, tier: "Was: Moderate Risk", text: "Delhi winters are brutal. I used to wake up with a rattling chest every morning from November to February. This is my second year drinking Royal Swag and I noticed the difference by week 2." },
  { id: "r3", name: "Kavitha Nair", city: "Bangalore", rating: 5, tier: "Was: Mild Risk", text: "Skeptical at first — I thought it was just fancy chai. But my ENT specialist noticed improved airway health at my follow-up 6 weeks after starting Royal Swag. Converts me completely." },
  { id: "r4", name: "Vikram Mehta", city: "Surat", rating: 5, tier: "Was: High Risk", text: "Smoked for 12 years, quit 2 years ago. The residual heaviness in my chest that no doctor could fix? Royal Swag cleared it in 3 weeks. I recommend it to every ex-smoker I know." },
  { id: "r5", name: "Pooja Sharma", city: "Ahmedabad", rating: 5, tier: "Was: Moderate Risk", text: "My husband has mild asthma and was hesitant. His chest doctor approved trying it as a supplement. 45 days in — fewer rescue inhaler uses and more energy. We're sold for life." },
  { id: "r6", name: "Rajesh Kumar", city: "Kanpur", rating: 4, tier: "Was: Mild Risk", text: "Kanpur is very polluted and I've had sinus issues for years. Royal Swag hasn't cured them but it's making everything much more manageable. The taste takes getting used to but I enjoy it now." },
  { id: "r7", name: "Anita Singh", city: "Lucknow", rating: 5, tier: "Was: High Risk", text: "My father (67 years old) has been on this for 2 months and his spirometry improved. The doctor asked what he changed. He said 'a morning tea.' I've been gifting it to all the elders in my family." },
  { id: "r8", name: "Suresh Rao", city: "Chennai", rating: 5, tier: "Was: Moderate Risk", text: "Chennai humidity combined with my garage work (paint fumes) was wrecking my lungs. I take Royal Swag every morning and evening and the difference in how I feel after work is night and day." },
  { id: "r9", name: "Priya Joshi", city: "Pune", rating: 5, tier: "Was: Mild Risk", text: "My seasonal allergies in March and October made me dread changing seasons. Royal Swag has become my seasonal armor — I start it 3 weeks before season change and barely notice the transition now." },
  { id: "r10", name: "Deepak Gupta", city: "Jaipur", rating: 5, tier: "Was: High Risk", text: "Truck driver for 15 years — my lungs took a beating from diesel fumes. Started Royal Swag 3 months ago. I still drive but my breathing quality is genuinely better. Hard to explain but everyone around me notices it in how I speak." },
];

export default function ReviewsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const lowPerf = window.navigator.hardwareConcurrency <= 4;

      ctx = gsap.context(() => {
        // Review card batch
        ScrollTrigger.batch(".review-card", {
          start: "top 90%",
          once: true,
          onEnter: (els) => {
            gsap.fromTo(els, { opacity: 0, y: 20 }, {
              opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out",
            });
          },
        });

        // Product float
        if (!lowPerf && productRef.current) {
          gsap.to(productRef.current, {
            y: -8,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "power2.out",
          });
        }
      }, containerRef);
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--brand-ivory)] pt-24 pb-20">
      <div className="container-rs">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-3">
            Verified Reviews
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[var(--brand-dark)] mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Our Customers Say
          </h1>
          <p className="text-base text-[var(--brand-dark)]/55">
            2,400+ verified reviews · 4.8 ⭐ average
          </p>
        </div>

        {/* Layout: sticky product image + scrolling reviews */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 items-start">

          {/* Sticky product image (desktop) */}
          <div
            ref={productRef}
            className="hidden lg:block sticky top-28 self-start"
            aria-hidden="true"
          >
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30">
              <Image
                src="/images/product/product-3.jpg"
                alt="Royal Swag Lung Detox Tea"
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="font-bold text-[var(--brand-dark)] text-sm" style={{ fontFamily: "var(--font-playfair)" }}>
                Royal Swag Lung Detox Tea
              </p>
              <div className="flex justify-center mt-1.5">
                <StarRating count={5} />
              </div>
              <p className="text-xs text-[var(--brand-dark)]/40 mt-1">4.8 / 5 · 2,400+ reviews</p>
            </div>
          </div>

          {/* Review grid (CSS masonry via columns) */}
          <div
            className="columns-1 sm:columns-2 gap-4 space-y-4"
            style={{ columnFill: "balance" }}
          >
            {REVIEWS.map(({ id, name, city, rating, tier, text }) => (
              <article
                key={id}
                id={`review-${id}`}
                className="review-card break-inside-avoid bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm p-6 opacity-0 mb-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--brand-green)] text-[var(--brand-gold)] font-bold text-sm flex items-center justify-center shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[var(--brand-dark)]">{name}</p>
                      <p className="text-xs text-[var(--brand-dark)]/40">{city}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] px-2 py-1 rounded-full border border-[var(--brand-gold)]/20 shrink-0 ml-2">
                    {tier}
                  </span>
                </div>
                <StarRating count={rating} />
                <p className="mt-3 text-sm text-[var(--brand-dark)]/65 leading-relaxed">
                  "{text}"
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    ✓ Verified Buyer
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
