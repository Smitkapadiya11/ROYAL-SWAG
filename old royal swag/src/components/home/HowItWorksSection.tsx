"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    id: "brew",
    step: "01",
    title: "Brew",
    desc: "Steep one Royal Swag tea bag in hot water (85–95°C) for 5 minutes.",
    icon: "☕",
  },
  {
    id: "drink",
    step: "02",
    title: "Drink",
    desc: "Drink warm, twice daily — morning on empty stomach and before bed.",
    icon: "🍵",
  },
  {
    id: "breathe",
    step: "03",
    title: "Breathe",
    desc: "Feel airways open and energy return as herbs work within days.",
    icon: "🌬️",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      
      ctx = gsap.context(() => {
        // STEP NUMBER count up
        gsap.from('.how-step-number', {
          scrollTrigger: { trigger: '.how-section', start: 'top 82%', once: true },
          scale: 0,
          rotation: 360,
          opacity: 0,
          duration: 0.8,
          stagger: 0.25,
          ease: 'back.out(2)',
        });

        // LINE DRAW (left to right)
        gsap.from(".how-line", {
          scrollTrigger: { trigger: ".how-section", start: "top 78%", once: true },
          scaleX: 0, transformOrigin: "left center",
          duration: 1.0, ease: "expo.out", delay: 0.3,
        });

        // STEPS pop in sequence
        gsap.from('.how-step', {
          scrollTrigger: { trigger: '.how-section', start: 'top 82%', once: true },
          y: 80,
          opacity: 0,
          scale: 0.85,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)',
        });

      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="how-section py-12 min-[769px]:py-20 bg-[var(--brand-ivory)]">
      <div className="container-rs">
        <div className="text-center mb-10 how-heading">
          <p className="rs-section-label text-[var(--brand-gold)]">
            Easy Routine
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-dark)]">
            Simple. Daily. Powerful.
          </h2>
        </div>

        {/* Desktop connector line */}
        <div className="hidden md:block relative max-w-3xl mx-auto mb-0">
          <div className="absolute top-[32px] left-[16.67%] right-[16.67%] h-[2px] bg-[var(--brand-sage)]">
            <div className="how-line absolute inset-0 bg-[var(--brand-green)]" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 min-[769px]:gap-8 max-w-3xl mx-auto">
          {STEPS.map(({ id, step, title, desc, icon }) => (
            <div
              key={id}
              className="how-step flex-1 text-center relative"
            >
              <div className="how-step-number w-16 h-16 rounded-full bg-[var(--brand-green)] text-[var(--brand-gold)] text-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-[var(--brand-ivory)] relative z-10">
                {icon}
              </div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--brand-gold)] uppercase">
                Step {step}
              </span>
              <h3
                className="text-xl font-bold text-[var(--brand-dark)] mt-1 mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h3>
              <p className="text-sm text-[var(--brand-dark)]/55 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
