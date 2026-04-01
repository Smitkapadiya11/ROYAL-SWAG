"use client";

import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    id: "ananya",
    name: "Ananya Sharma",
    city: "Delhi",
    rating: 5,
    quote:
      "I've lived in Delhi my whole life and always assumed the morning cough was just 'normal city life.' After 3 weeks of Royal Swag, it's almost completely gone. This isn't magic — it's just real Ayurveda.",
    tier: "Was: Moderate Risk",
  },
  {
    id: "rohit",
    name: "Rohit Kulkarni",
    city: "Mumbai",
    rating: 5,
    quote:
      "Quit smoking 8 months ago but my chest still felt heavy. Two weeks of Royal Swag changed that. The taste is earthy and grounding — I actually look forward to my morning cup now.",
    tier: "Was: High Risk",
  },
  {
    id: "priya",
    name: "Priya Mehta",
    city: "Surat",
    rating: 5,
    quote:
      "Seasonal allergies knocked me out every October. This year I started Royal Swag in mid-September and sailed through the entire month. My husband noticed before I did.",
    tier: "Was: Mild Risk",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="star-icon w-4 h-4" viewBox="0 0 20 20" aria-hidden="true" style={{ transformOrigin: "center" }}>
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            fill={i < count ? "var(--brand-gold)" : "var(--brand-sage)"}
          />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // BG shift
        gsap.from('.testimonials-section', {
          scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%' },
          backgroundColor: 'transparent',
          duration: 1.2,
        });

        // CARDS fan in dramatically
        gsap.from('.testimonial-card', {
          scrollTrigger: { trigger: '.testimonials-section', start: 'top 85%', once: true },
          y: 120,
          opacity: 0,
          scale: 0.75,
          rotation: 'random(-8, 8)',
          duration: 0.85,
          stagger: 0.18,
          ease: 'back.out(2)',
        });

        // STAR RATINGS stagger reveal
        gsap.from(".star-icon", {
          scrollTrigger: { trigger: ".testimonials-section", start: "top 82%", once: true },
          scale: 0, rotation: 72, opacity: 0,
          duration: 0.4, stagger: 0.05, ease: "back.out(3)", delay: 0.5,
        });

      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="testimonials-section py-24 md:py-32 bg-[var(--brand-green)] overflow-hidden">
      <div className="container-rs">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-3">
            2,400+ Reviews
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Real People. Real Relief.
          </h2>
          <p className="mt-4 text-base text-white/50 max-w-md mx-auto">
            From Delhi's smog to Mumbai's humidity — Royal Swag works everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ id, name, city, rating, quote, tier }) => (
            <blockquote
              key={id}
              className="testimonial-card bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--brand-gold)]/20 flex items-center justify-center text-[var(--brand-gold)] font-bold text-base border border-[var(--brand-gold)]/30">
                  {name[0]}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--brand-gold)]/15 text-[var(--brand-gold)] px-2 py-1 rounded-full border border-[var(--brand-gold)]/20">
                  {tier}
                </span>
              </div>
              <StarRating count={rating} />
              <p className="mt-4 text-sm text-white/75 leading-relaxed italic">
                "{quote}"
              </p>
              <footer className="mt-4">
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-xs text-white/40">{city}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
