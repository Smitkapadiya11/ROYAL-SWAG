"use client";

import { useEffect, useRef } from "react";

const BENEFITS = [
  {
    id: "pollution",
    emoji: "🌿",
    title: "Stop silent daily damage",
    desc: "Stop the silent daily damage pollution causes — before PM2.5 builds further in your airways.",
  },
  {
    id: "airways",
    emoji: "💨",
    title: "Reclaim easier breathing",
    desc: "Reclaim the breathing you had 5 years ago — Vasaka helps clear what congestion is holding back.",
  },
  {
    id: "immunity",
    emoji: "🛡️",
    title: "Don't wait for the next smog spike",
    desc: "Tulsi helps your body fight back before the next AQI alert catches you unprepared.",
  },
  {
    id: "inflammation",
    emoji: "🔥",
    title: "End the morning cough",
    desc: "End the morning cough that’s been waking you up — Mulethi soothes irritated airway lining.",
  },
  {
    id: "energy",
    emoji: "⚡",
    title: "Stop feeling drained at midday",
    desc: "Stop feeling drained before your day even starts — better oxygen flow means real energy again.",
  },
  {
    id: "sleep",
    emoji: "😴",
    title: "Protect your nights",
    desc: "Stop losing sleep to chest tightness and throat tickle — calm airways mean deeper rest.",
  },
];

export default function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gsapRef = useRef<any>(null); // For hover events

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;
      
      ctx = gsap.context(() => {
        // HEADING split-text reveal
        gsap.from(".benefits-title", {
          scrollTrigger: { trigger: ".benefits-section", start: "top 85%", once: true },
          y: 40, opacity: 0, duration: 0.8, ease: "expo.out",
        });

        gsap.from('.benefit-circle', {
          scrollTrigger: { trigger: '.benefits-section', start: 'top 80%' },
          scale: 0, opacity: 0, duration: 1.2, ease: 'expo.out'
        });

        // CARD entrance with 3D tilt
        ScrollTrigger.batch('.benefit-card', {
          onEnter: (elements) => {
            gsap.from(elements, {
              y: 100,         // BIG movement
              opacity: 0,
              scale: 0.8,     // BIG scale
              rotation: 3,
              duration: 0.8,
              stagger: 0.15,
              ease: 'back.out(1.7)',
            });
          },
          once: true,
          start: 'top 90%',
        });

        // ICON bounce on scroll enter
        gsap.from(".benefit-icon", {
          scrollTrigger: { trigger: ".benefits-section", start: "top 85%", once: true },
          scale: 0, rotation: -45,
          duration: 0.6, stagger: 0.12, ease: "back.out(2.5)",
          delay: 0.3,
        });

        // 2 Floating Leaves (inherited from previous spec, now faster if required by general flow, or keep as is)
        gsap.to(".benefit-leaf", {
          y: -20,
          rotation: 10,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          stagger: 2,
        });

      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  // CARD hover 3D tilt on each card
  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gsapRef.current) return;
    gsapRef.current.to(e.currentTarget, {
      rotateY: 5, rotateX: -3, scale: 1.03,
      boxShadow: "0 20px 60px rgba(45,106,79,0.18)",
      duration: 0.3, ease: "power2.out"
    });
  };
  
  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gsapRef.current) return;
    gsapRef.current.to(e.currentTarget, {
      rotateY: 0, rotateX: 0, scale: 1,
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      duration: 0.4, ease: "power2.out"
    });
  };

  return (
    <section ref={sectionRef} className="benefits-section relative py-24 md:py-32 bg-[var(--brand-ivory)] overflow-hidden">
      
      {/* 2 Floating Leaves */}
      <div className="benefit-leaf absolute top-[10%] left-[15%] pointer-events-none" style={{ width: 40, height: 40, zIndex: 1 }}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="30" ry="45" fill="#2d6a4f" opacity="0.15" transform="rotate(-20 50 50)" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#1b4332" strokeWidth="2" opacity="0.3" transform="rotate(-20 50 50)" />
        </svg>
      </div>
      <div className="benefit-leaf absolute bottom-[20%] right-[10%] pointer-events-none" style={{ width: 48, height: 48, zIndex: 1 }}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="30" ry="45" fill="#2d6a4f" opacity="0.15" transform="rotate(-20 50 50)" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#1b4332" strokeWidth="2" opacity="0.3" transform="rotate(-20 50 50)" />
        </svg>
      </div>

      <div className="benefit-circle absolute -top-20 -right-20 w-64 h-64 rounded-full bg-green-100 opacity-40" />

      <div className="container-rs relative z-10">
        <div className="text-center mb-16 benefits-heading">
          <p className="benefits-title text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-3">
            Why Royal Swag
          </p>
          <h2 className="benefits-title text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-dark)]">
            Stop Losing Lung Capacity — Here&apos;s How Royal Swag Helps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" style={{ perspective: "1000px" }}>
          {BENEFITS.map(({ id, emoji, title, desc }) => (
            <div
              key={id}
              className="benefit-card bg-white rounded-2xl p-7 border border-[var(--brand-sage)] shadow-sm cursor-default"
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="benefit-icon text-3xl mb-4 block origin-center" aria-hidden="true">{emoji}</span>
              <h3
                className="text-lg font-bold text-[var(--brand-dark)] mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h3>
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
