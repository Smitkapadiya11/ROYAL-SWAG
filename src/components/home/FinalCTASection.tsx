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
      className="py-28 md:py-40 bg-[var(--brand-green)]"
      aria-label="Take the lung test CTA"
    >
      <div className="container-rs text-center final-cta-inner">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-4">
          The First Step is Free
        </p>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Your Lungs Deserve Better.
        </h2>
        <p className="text-base text-white/55 max-w-md mx-auto mb-10">
          Start with a free lung health assessment. 2 minutes. Instant results. Personalized for you.
        </p>
        <Link
          href="/lung-test"
          id="final-cta-btn"
          className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-[var(--brand-gold)] text-[var(--brand-green)] font-bold text-base shadow-sm hover:opacity-90 hover:scale-105 transition-all duration-200 active:scale-98"
          aria-label="Take the free lung health test now"
        >
          Take the Lung Test →
        </Link>
        <p className="mt-6 text-xs text-white/30">
          🔒  100% free. No credit card needed.
        </p>
      </div>
    </section>
  );
}
