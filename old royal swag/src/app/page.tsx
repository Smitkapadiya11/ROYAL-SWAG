"use client";

import Link from "next/link";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { HerbsSection } from "@/components/home/HerbsSection";
import { VideoTestimonialsSection } from "@/components/home/VideoTestimonialsSection";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { S } from "@/lib/config";
import { cn } from "@/lib/utils";

const HERO_BG = "/images/hero/asset1-hero-product.jpeg";

const BEFORE_AFTER = {
  before: "/images/lungs-before.png",
  after: "/images/lungs-after.png",
} as const;

const ritualSteps = [
  {
    n: 1,
    title: "Boil",
    desc: "Bring 200ml of fresh water to a rolling boil.",
  },
  {
    n: 2,
    title: "Steep",
    desc: "Add one tea bag and steep for 3–5 minutes.",
  },
  {
    n: 3,
    title: "Breathe",
    desc: "Inhale the aromatic steam before slowly sipping.",
  },
];

const MOBILE_NAV = [
  { href: "/", label: "Home", icon: "🏠", active: true },
  { href: "/product", label: "Shop", icon: "🛍", active: false },
  { href: "/lung-test", label: "Test", icon: "🫁", active: false },
  { href: "/about", label: "About", icon: "ℹ", active: false },
] as const;

export default function Home() {
  return (
    <div className="pb-[calc(80px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <FaqJsonLd />

      {/* Hero — above fold, no scroll reveal */}
      <section className="relative flex h-[70vh] min-h-[500px] w-full items-end overflow-hidden md:h-screen">
        <div className="absolute inset-0">
          <SafeImage
            src={HERO_BG}
            alt=""
            label="Royal Swag"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex w-full flex-col justify-end px-5 pb-12 pt-24 md:px-16 md:pb-24">
          <div className="md:max-w-xl">
            <p className="hero-label font-body text-xs font-semibold uppercase tracking-[0.2em] text-ayurvedic-gold">
              Modern Ayurvedic
            </p>
            <h1 className="hero-title mt-2 font-display text-4xl font-bold leading-[1.05] text-parchment sm:text-5xl md:text-6xl">
              {S.tagline.split(". ").map((line, i, arr) => (
                <span key={line}>
                  {line}
                  {i < arr.length - 1 ? "." : ""}
                  {i < arr.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
            <p className="hero-subtitle mt-4 max-w-md font-body text-base leading-relaxed text-parchment/90">
              Decades of research distilled into a premium lung detox tea.
            </p>
            <Link
              href="/lung-test"
              className="hero-cta btn-primary mt-8 inline-flex w-fit items-center justify-center px-8 py-3.5"
            >
              Take the Free Lung Test
            </Link>
          </div>
        </div>
      </section>

      <div className="md:mx-auto md:max-w-6xl md:px-16">
        <Reveal direction="up">
          <section className="border-y border-glass-border bg-surface/50 px-5 py-8 md:rounded-2xl md:border md:py-10">
            <p className="mb-6 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              Trusted across India
            </p>
            <div className="grid grid-cols-3 gap-4 text-center md:gap-8">
              <div>
                <p className="font-display text-2xl font-bold text-primary md:text-3xl">
                  <CountUp end={2400} suffix="+" />
                </p>
                <p className="mt-1 font-sans text-xs text-on-surface-variant md:text-sm">
                  customers
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-primary md:text-3xl">
                  <CountUp end={4} prefix="★ " suffix=".9" />
                </p>
                <p className="mt-1 font-sans text-xs text-on-surface-variant md:text-sm">
                  rating
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-primary md:text-3xl">
                  <CountUp end={30} suffix=" Days" />
                </p>
                <p className="mt-1 font-sans text-xs text-on-surface-variant md:text-sm">
                  guarantee
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <div className="md:grid md:grid-cols-2 md:gap-12 md:py-20">
          <Reveal direction="up" delay={0}>
            <section className="bg-parchment px-5 py-section-gap md:px-0 md:py-0">
              <div className="text-center md:text-left">
                <p className="font-body text-sm font-semibold tracking-widest text-ayurvedic-gold">
                  ✦
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">
                  A Decade of Purity
                </h2>
                <p className="mt-6 font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
                  We believe in the power of nature, elevated by science. Ayurveda
                  understood the complexities of the human respiratory system long
                  before the industrial age — we&apos;ve carefully sourced and blended
                  time-tested botanicals into a revitalizing daily ritual for modern
                  lungs.
                </p>
              </div>
            </section>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <section className="bg-surface px-5 py-section-gap md:px-0 md:py-0">
              <div>
                <h2 className="text-center font-display text-3xl font-bold text-primary md:text-left md:text-4xl">
                  The Journey to Clarity
                </h2>
                <p className="mt-3 text-center font-body text-sm text-on-surface-variant md:text-left">
                  Drag to compare lung health before and after 30 days of Royal Swag.
                </p>
                <div className="mt-10">
                  <BeforeAfterSlider
                    beforeSrc={BEFORE_AFTER.before}
                    afterSrc={BEFORE_AFTER.after}
                    beforeLabel="Before"
                    afterLabel="After 30 Days"
                  />
                </div>
              </div>
            </section>
          </Reveal>
        </div>

        <Reveal direction="left">
          <HerbsSection />
        </Reveal>

        <Reveal direction="up">
          <VideoTestimonialsSection />
        </Reveal>

        <section className="bg-parchment px-5 py-section-gap md:mx-auto md:max-w-2xl md:px-0">
          <Reveal direction="up">
            <h2 className="text-center font-display text-3xl font-bold text-primary md:text-4xl">
              The Daily Ritual
            </h2>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {ritualSteps.map((s, i) => (
              <Reveal key={s.n} direction="up" delay={i * 100}>
                <article className="glass-card relative rounded-2xl p-6 pt-10 text-center">
                  <span className="absolute left-1/2 top-4 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary font-body text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-primary">
                    {s.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
                    {s.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/60 bg-glass-surface backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Mobile primary"
      >
        <ul className="grid h-16 grid-cols-4">
          {MOBILE_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "bottom-nav-link flex h-full min-h-[44px] flex-col items-center justify-center gap-0.5 font-body text-[10px] font-medium",
                  item.active
                    ? "bottom-nav-link--active text-primary"
                    : "text-on-surface-variant hover:text-primary"
                )}
                aria-current={item.active ? "page" : undefined}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
