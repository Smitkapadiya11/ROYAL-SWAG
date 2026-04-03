"use client";

import { useEffect, useRef } from "react";

const INGREDIENTS = [
  {
    id: "tulsi",
    name: "Tulsi",
    sanskrit: "Ocimum sanctum",
    badge: "The Sacred Healer",
    desc: "The 'Queen of Herbs' — potent antioxidant that purifies the blood and fortifies the immune system against pollution-induced stress.",
  },
  {
    id: "vasaka",
    name: "Vasaka",
    sanskrit: "Adhatoda vasica",
    badge: "The Airway Opener",
    desc: "Used in Ayurveda for millennia to naturally dilate bronchial passages, dissolve mucus, and relieve chronic cough.",
  },
  {
    id: "mulethi",
    name: "Mulethi",
    sanskrit: "Glycyrrhiza glabra",
    badge: "The Soother",
    desc: "Licorice root that reduces airway inflammation, coats irritated tissue, and delivers a naturally sweet, smooth taste.",
  },
  {
    id: "pippali",
    name: "Pippali",
    sanskrit: "Piper longum",
    badge: "The Reviver",
    desc: "Long pepper that supercharges oxygen uptake, burns toxins, and restores the energy lost to poor respiratory function.",
  },
];

export default function IngredientsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: any;
    let mm: { revert: () => void } | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      mm = ScrollTrigger.matchMedia({
        "(min-width: 769px)": () => {
          gsap.from(".ingredient-card", {
            scrollTrigger: {
              trigger: ".ingredients-section",
              start: "top 85%",
              once: true,
            },
            x: -120,
            opacity: 0,
            rotation: -8,
            duration: 0.9,
            stagger: 0.15,
            ease: "back.out(1.4)",
          });
        },
        "(max-width: 768px)": () => {
          gsap.from(".ingredient-card", {
            scrollTrigger: {
              trigger: ".ingredients-section",
              start: "top 85%",
              once: true,
            },
            y: 20,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
          });
        },
      }) as unknown as { revert: () => void };

      ctx = gsap.context(() => {
        gsap.from(".ingredients-title", {
          scrollTrigger: { trigger: ".ingredients-section", start: "top 80%", once: true },
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
        });
        gsap.from(".ingredients-underline", {
          scrollTrigger: { trigger: ".ingredients-section", start: "top 80%", once: true },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          delay: 0.4,
          ease: "expo.out",
        });

        gsap.from(".ingredient-stat", {
          scrollTrigger: { trigger: ".ingredients-section", start: "top 80%" },
          textContent: 0,
          duration: 1.5,
          ease: "power1.out",
          snap: { textContent: 1 },
        });

        gsap.to(".herb-float", {
          y: -20,
          rotation: "random(-12, 12)",
          duration: "random(2.5, 4)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.8, from: "random" },
        });
      }, sectionRef);
    };

    init();
    return () => {
      mm?.revert();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="ingredients-section relative py-12 min-[769px]:py-20 bg-[var(--brand-sage)]/40 overflow-hidden">
      
      {/* 3 Floating Herb Leaves */}
      {[
        { top: "10%", right: "5%", size: 40 },
        { top: "45%", left: "-2%", size: 60 },
        { bottom: "10%", right: "15%", size: 30 },
      ].map((pos, i) => (
        <div key={i} className="herb-float absolute pointer-events-none" style={{ top: pos.top, left: pos.left, right: pos.right, width: pos.size, height: pos.size, zIndex: 1 }}>
          <svg viewBox="0 0 100 100" fill="none">
            <ellipse cx="50" cy="50" rx="30" ry="45" fill="#2d6a4f" opacity="0.15" transform="rotate(-20 50 50)" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#1b4332" strokeWidth="2" opacity="0.3" transform="rotate(-20 50 50)" />
          </svg>
        </div>
      ))}

      <div className="container-rs relative z-10">
        <div className="text-center mb-10 relative inline-block left-1/2 -translate-x-1/2">
          <p className="ingredients-title rs-section-label text-[var(--brand-gold)]">
            The Formula
          </p>
          <div className="relative inline-block">
            <h2 className="ingredients-title text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-dark)]">
              Rooted in Ancient Wisdom
            </h2>
            <div className="ingredients-underline absolute -bottom-3 left-0 w-full h-[3px] bg-[var(--brand-gold)] opacity-50 block" />
          </div>
          <p className="ingredients-title mt-4 text-base text-[var(--brand-dark)]/55 max-w-lg mx-auto">
            Four centuries-old Ayurvedic herbs, precisely combined for the polluted world we live in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-[769px]:gap-6">
          {INGREDIENTS.map(({ id, name, sanskrit, badge, desc }) => (
            <div
              key={id}
              className="ingredient-card premium-card-hover bg-white rounded-2xl border border-[var(--brand-sage)] p-4 shadow-sm min-[769px]:p-6"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3
                    className="text-2xl font-bold text-[var(--brand-dark)]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {name}
                  </h3>
                  <p className="text-xs italic text-[var(--brand-dark)]/40 mt-0.5">
                    {sanskrit}
                  </p>
                </div>
                <span className="shrink-0 ml-4 text-[10px] font-bold uppercase tracking-widest bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] px-3 py-1 rounded-full border border-[var(--brand-gold)]/20">
                  {badge}
                </span>
              </div>
              <p className="text-sm text-[var(--brand-dark)]/60 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
