"use client";

import { useEffect, useRef } from "react";
import StarRating48 from "@/components/conversion/StarRating48";

const TESTIMONIALS = [
  {
    id: "ramesh",
    initials: "RK",
    line: "Ramesh K., 44, Ahmedabad",
    before: "I used to cough every morning for 20 minutes before work.",
    after: "By week 3 it dropped to barely 5 minutes — I finally felt in control again.",
    tier: "Was: Moderate Risk",
  },
  {
    id: "sneha",
    initials: "SP",
    line: "Sneha P., 39, Delhi",
    before: "Stairs left me winded; I’d pause halfway up to our flat every evening.",
    after: "After a month of Royal Swag I walk up without stopping — my husband noticed first.",
    tier: "Was: High Risk",
  },
  {
    id: "vikram",
    initials: "VM",
    line: "Vikram M., 51, Mumbai",
    before: "Post-Diwali smog used to shut my chest down for two weeks straight.",
    after: "This year I started early; tightness eased within 10 days. Wish I’d done it sooner.",
    tier: "Was: Mild Risk",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.from(".testimonials-section", {
          scrollTrigger: { trigger: ".testimonials-section", start: "top 80%" },
          backgroundColor: "transparent",
          duration: 1.2,
        });

        gsap.from(".testimonial-card", {
          scrollTrigger: { trigger: ".testimonials-section", start: "top 85%", once: true },
          y: 120,
          opacity: 0,
          scale: 0.75,
          rotation: "random(-8, 8)",
          duration: 0.85,
          stagger: 0.18,
          ease: "back.out(2)",
        });
      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="testimonials-section rs-brand-dark-grain py-12 min-[769px]:py-20 bg-[var(--brand-green)] overflow-hidden"
    >
      <div className="container-rs">
        <div className="text-center mb-10">
          <p className="rs-section-label text-[var(--brand-gold)]">
            Real stories · City · Age · Symptoms
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            People Like You — Specific Results
          </h2>
          <p className="mt-4 text-base text-white/50 max-w-md mx-auto">
            The brain trusts detail. Here&apos;s what actually changed for our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-[769px]:gap-6">
          {TESTIMONIALS.map(({ id, initials, line, before, after, tier }) => (
            <blockquote
              key={id}
              className="testimonial-card premium-card-hover bg-white/5 border border-white/10 rounded-xl p-4 text-left min-[769px]:rounded-2xl min-[769px]:p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--brand-gold)]/35 bg-[var(--brand-gold)]/15 text-sm font-bold text-[var(--brand-gold)]"
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--brand-gold)]/15 text-[var(--brand-gold)] px-2 py-1 rounded-full border border-[var(--brand-gold)]/20 shrink-0">
                  {tier}
                </span>
              </div>
              <StarRating48 />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-white/50">{line}</p>
              <p className="mt-3 text-sm text-white/80 leading-relaxed">
                <span className="text-white/45">Before:</span> {before}
              </p>
              <p className="mt-2 text-sm text-white/90 leading-relaxed">
                <span className="text-[var(--brand-gold)]">After:</span> {after}
              </p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
