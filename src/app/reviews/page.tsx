"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import StarRating48 from "@/components/conversion/StarRating48";

const REVIEWS = [
  {
    id: "r1",
    initials: "SP",
    line: "Sneha Patil, 38, Mumbai",
    tier: "Was: High Risk",
    before: "I lived near a textile belt — stairs left me winded before 11 a.m.",
    after: "After 4 weeks I climb three floors without pausing. Mornings feel normal again.",
  },
  {
    id: "r2",
    initials: "AV",
    line: "Aditya Verma, 44, Delhi",
    tier: "Was: Moderate Risk",
    before: "Every winter I woke up with a rattling chest for hours — I thought it was just Delhi life.",
    after: "Second year on Royal Swag; by week 2 the morning rattle was half what it used to be.",
  },
  {
    id: "r3",
    initials: "KN",
    line: "Kavitha Nair, 41, Bengaluru",
    tier: "Was: Mild Risk",
    before: "I assumed it was fancy chai — didn’t expect anything measurable.",
    after: "Six weeks in, my ENT noted clearer airway readings at follow-up. I’m a convert.",
  },
  {
    id: "r4",
    initials: "VM",
    line: "Vikram Mehta, 49, Surat",
    tier: "Was: High Risk",
    before: "Quit smoking 2 years ago but chest heaviness never left — nothing else moved the needle.",
    after: "Three weeks of Royal Swag and the weight in my chest finally eased. I tell every ex-smoker I know.",
  },
  {
    id: "r5",
    initials: "PS",
    line: "Pooja Sharma, 36, Ahmedabad",
    tier: "Was: Moderate Risk",
    before: "My husband’s mild asthma meant we feared trying anything new without doctor buy-in.",
    after: "45 days in — fewer rescue inhaler days and more energy. His chest doctor said keep going.",
  },
  {
    id: "r6",
    initials: "RK",
    line: "Rajesh Kumar, 52, Kanpur",
    tier: "Was: Mild Risk",
    before: "Kanpur air + sinus pressure wore me down daily; I expected another gimmick.",
    after: "Symptoms didn’t vanish but they’re manageable now — and I actually like the taste.",
  },
  {
    id: "r7",
    initials: "AS",
    line: "Anita Singh, 35, Lucknow",
    tier: "Was: High Risk",
    before: "My father’s spirometry was flat for a year — we’d tried everything else.",
    after: "Two months of morning tea later, numbers improved. Doctor asked what changed.",
  },
  {
    id: "r8",
    initials: "SR",
    line: "Suresh Rao, 47, Chennai",
    tier: "Was: Moderate Risk",
    before: "Humidity + paint fumes from work left my chest tight every evening.",
    after: "Morning + evening cups — I walk off the job site breathing easier than I have in years.",
  },
  {
    id: "r9",
    initials: "PJ",
    line: "Priya Joshi, 33, Pune",
    tier: "Was: Mild Risk",
    before: "March and October allergies owned my calendar — I dreaded the season flip.",
    after: "I start Royal Swag three weeks early now; the transition barely registers.",
  },
  {
    id: "r10",
    initials: "DG",
    line: "Deepak Gupta, 51, Jaipur",
    tier: "Was: High Risk",
    before: "Fifteen years around diesel — talking full sentences without coughing felt impossible.",
    after: "Three months in, people comment on how I sound on calls. Breathing feels deeper.",
  },
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
    <div ref={containerRef} className="min-h-0 bg-[var(--brand-ivory)] pb-12 pt-6 min-[769px]:pb-20">
      <div className="container-rs">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="rs-section-label text-[var(--brand-gold)]">
            Verified Reviews
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[var(--brand-dark)] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What Our Customers Say
          </h1>
          <p className="text-base text-[var(--brand-dark)]/55">
            2,400+ verified reviews · detailed city + age + symptom stories
          </p>
        </div>

        {/* Layout: sticky product image + scrolling reviews */}
        <div className="items-start lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 min-[1200px]:gap-12">

          {/* Sticky product image (desktop) */}
          <div
            ref={productRef}
            className="hidden lg:block sticky top-28 self-start"
            aria-hidden="true"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-[var(--brand-sage)] bg-[var(--brand-sage)]/30 min-[769px]:rounded-xl">
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
                <StarRating48 />
              </div>
              <p className="text-xs text-[var(--brand-dark)]/40 mt-1">4.8 / 5 · 2,400+ reviews</p>
            </div>
          </div>

          {/* Review grid (CSS masonry via columns) */}
          <div
            className="columns-1 gap-0 sm:columns-2 sm:gap-4"
            style={{ columnFill: "balance" }}
          >
            {REVIEWS.map(({ id, initials, line, tier, before, after }) => (
              <article
                key={id}
                id={`review-${id}`}
                className="review-card premium-card-hover mb-3 break-inside-avoid rounded-2xl border border-[var(--brand-sage)] bg-white p-4 shadow-sm min-[769px]:mb-4 min-[769px]:p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--brand-green)] text-[var(--brand-gold)] font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[var(--brand-dark)] leading-tight">{line}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] px-2 py-1 rounded-full border border-[var(--brand-gold)]/20 shrink-0 ml-2">
                    {tier}
                  </span>
                </div>
                <StarRating48 />
                <p className="mt-3 text-sm text-[var(--brand-dark)]/60 leading-relaxed">
                  <span className="font-semibold text-[var(--brand-dark)]/45">Before:</span> {before}
                </p>
                <p className="mt-2 text-sm text-[var(--brand-dark)]/80 leading-relaxed">
                  <span className="font-semibold text-[var(--brand-gold)]">After:</span> {after}
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
