"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: any;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          ".final-cta-inner",
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".final-cta-inner",
              start: "top 85%",
              once: true,
            },
          }
        );
      }, sectionRef);
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      className="rs-brand-dark-grain py-12 min-[769px]:py-20 bg-[var(--brand-green)]"
      aria-label="Take the lung test CTA"
    >
      <div className="container-rs text-center final-cta-inner">
        <p className="rs-section-label text-[var(--brand-gold)]">
          Commit in 60 seconds
        </p>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Stop Guessing What Pollution Is Costing You.
        </h2>
        <p className="text-base text-white/55 max-w-md mx-auto mb-8">
          Get your personal lung toxin score — free. Eight quick questions. Then you&apos;ll know exactly where you stand.
        </p>
        <Link
          href="/lung-test"
          id="final-cta-btn"
          className="rs-cta-gold inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-gold)] px-10 py-4 text-base text-[var(--brand-green)]"
          aria-label="Take the free lung health test now"
        >
          Take the Lung Test →
        </Link>
        <p className="mt-3 text-xs text-white/40">We only use your contact to send your report.</p>
        <p className="mt-2 text-xs text-white/30">100% free · No credit card</p>
      </div>
    </section>
  );
}
