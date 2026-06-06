"use client";

import Link from "next/link";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { HerbsSection } from "@/components/home/HerbsSection";
import { DoctorEndorsements } from "@/components/sections/DoctorEndorsements";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { S } from "@/lib/config";

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

function HeroCopy({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="hero-label font-body text-xs font-semibold uppercase tracking-[0.2em] text-ayurvedic-gold">
        Modern Ayurvedic
      </p>
      <h1 className="hero-title mt-2 break-words font-display text-4xl font-bold leading-[1.05] text-parchment sm:text-5xl">
        {S.tagline.split(". ").map((line, i, arr) => (
          <span key={line}>
            {line}
            {i < arr.length - 1 ? "." : ""}
            {i < arr.length - 1 ? <br /> : null}
          </span>
        ))}
      </h1>
      <p className="hero-subtitle mt-4 max-w-md font-body text-base leading-relaxed text-parchment/90 md:text-lg">
        Decades of research distilled into a premium lung detox tea.
      </p>
      <div className="mt-8 flex w-full max-w-full flex-col gap-3">
        <Link
          href="/lung-test"
          className="hero-cta btn-primary inline-flex w-full items-center justify-center px-6 py-3.5 sm:w-fit sm:px-8"
        >
          Take the Free Lung Test
        </Link>
        <Link
          href="/product"
          className="inline-flex w-full items-center justify-center rounded-xl border border-parchment/40 px-6 py-3.5 font-body text-sm font-semibold text-parchment transition-colors hover:bg-parchment/10 sm:w-fit sm:px-8"
        >
          Shop Detox Tea →
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="page-mobile-pad w-full min-w-0">
      <FaqJsonLd />

      {/* Mobile hero — full-bleed background */}
      <section className="relative flex h-[70vh] min-h-[500px] w-full items-end overflow-hidden md:hidden">
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
        <div className="relative z-10 flex w-full min-w-0 flex-col justify-end overflow-hidden px-5 pb-12 pt-28">
          <HeroCopy className="w-full min-w-0 max-w-full" />
        </div>
      </section>

      {/* Desktop hero — split layout */}
      <section className="relative hidden min-h-[calc(100svh-100px)] w-full overflow-hidden bg-parchment md:grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-16 py-20 lg:px-20">
          <div className="max-w-xl">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ayurvedic-gold">
              Modern Ayurvedic
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-[1.05] text-primary lg:text-6xl">
              {S.tagline.split(". ").map((line, i, arr) => (
                <span key={line}>
                  {line}
                  {i < arr.length - 1 ? "." : ""}
                  {i < arr.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-md font-body text-lg leading-relaxed text-on-surface-variant">
              Decades of research distilled into a premium lung detox tea.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/lung-test"
                className="btn-primary inline-flex items-center justify-center px-8 py-3.5"
              >
                Take the Free Lung Test
              </Link>
              <Link
                href="/product"
                className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white/50 px-8 py-3.5 font-body text-sm font-semibold text-primary transition-colors hover:bg-white/80"
              >
                Shop Detox Tea →
              </Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[480px]">
          <SafeImage
            src={HERO_BG}
            alt="Royal Swag Lung Detox Tea"
            label="Royal Swag"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-parchment/30 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      </section>

      <div className="site-container md:py-4">
        <Reveal direction="up">
          <section className="border-y border-glass-border bg-surface/50 py-8 md:rounded-2xl md:border md:py-10">
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

        <div className="md:grid md:grid-cols-2 md:items-center md:gap-12 md:py-20">
          <Reveal direction="up" delay={0}>
            <section className="bg-parchment py-section-gap md:py-0">
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
            <section className="bg-surface py-section-gap md:rounded-2xl md:p-6 md:py-0">
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

        <Reveal direction="up" delay={100}>
          <DoctorEndorsements />
        </Reveal>

        <section className="bg-parchment py-section-gap">
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

        {/* Desktop CTA band */}
        <section className="mb-8 hidden rounded-2xl bg-primary px-12 py-14 text-center md:block">
          <h2 className="font-display text-3xl font-bold text-parchment lg:text-4xl">
            Ready to Breathe Cleaner?
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-base text-parchment/80">
            Take the free lung test or order the Progress Pack — free delivery
            across India with COD available.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/lung-test"
              className="inline-flex items-center justify-center rounded-xl bg-ayurvedic-gold px-8 py-3.5 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Free Lung Test
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center justify-center rounded-xl border border-parchment/30 px-8 py-3.5 font-body text-sm font-semibold text-parchment transition-colors hover:bg-white/10"
            >
              Order Now — {S.price.now}
            </Link>
          </div>
        </section>
      </div>

      <MobileBottomNav />
    </div>
  );
}
