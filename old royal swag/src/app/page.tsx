"use client";

import Link from "next/link";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { S } from "@/lib/config";
import { cn } from "@/lib/utils";

const HERO_BG = "/images/hero/asset1-hero-product.jpeg";

const herbs = [
  {
    name: "Pippali",
    desc: "Clears respiratory pathways and boosts lung capacity.",
    img: "/images/herbs/pippali.jpeg",
  },
  {
    name: "Tulsi",
    desc: "Sacred basil known for its powerful immunomodulatory effects.",
    img: "/images/herbs/tulsi.jpg",
  },
  {
    name: "Mulethi",
    desc: "Soothes the throat and acts as a natural expectorant.",
    img: "/images/herbs/mulethi.jpeg",
  },
  {
    name: "Pushkarmool",
    desc: "A potent bronchodilator supporting clear breathing.",
    img: "/images/herbs/pushkarmool.jpg",
  },
  {
    name: "Vasaka",
    desc: "Relieves chest congestion and persistent coughing.",
    img: "/images/herbs/vasaka.jpeg",
  },
  {
    name: "Kantakari",
    desc: "Effectively manages respiratory ailments and inflammation.",
    img: "/images/herbs/kantakari.jpg",
  },
];

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

function hideBrokenImage(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

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

      {/* ── HERO ── */}
      <section className="relative flex h-[70vh] min-h-[500px] w-full items-end overflow-hidden md:h-screen">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_BG}
            alt=""
            className="h-full w-full object-cover object-center"
            onError={hideBrokenImage}
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex w-full flex-col justify-end px-5 pb-12 pt-24 md:px-16 md:pb-24">
          <div className="md:max-w-xl">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ayurvedic-gold">
              Modern Ayurvedic
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] text-parchment sm:text-5xl md:text-6xl">
              {S.tagline.split(". ").map((line, i, arr) => (
                <span key={line}>
                  {line}
                  {i < arr.length - 1 ? "." : ""}
                  {i < arr.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
            <p className="mt-4 max-w-md font-body text-base leading-relaxed text-parchment/90">
              Decades of research distilled into a premium lung detox tea.
            </p>
            <Link
              href="/lung-test"
              className="btn-primary mt-8 inline-flex w-fit items-center justify-center px-8 py-3.5"
            >
              Take the Free Lung Test
            </Link>
          </div>
        </div>
      </section>

      <div className="md:mx-auto md:max-w-6xl md:px-16">
        {/* Vision + Before/After side by side on desktop */}
        <div className="md:grid md:grid-cols-2 md:gap-12 md:py-20">
          {/* ── VISION ── */}
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

          {/* ── BEFORE / AFTER ── */}
          <section className="bg-surface px-5 py-section-gap md:px-0 md:py-0">
            <div>
              <h2 className="text-center font-display text-3xl font-bold text-primary md:text-left md:text-4xl">
                The Journey to Clarity
              </h2>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <article className="glass-card overflow-hidden rounded-2xl p-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-primary-container/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/lungs-before.png"
                      alt="Lungs before detox"
                      className="h-full w-full object-cover"
                      onError={hideBrokenImage}
                    />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold text-primary">
                    Before
                  </p>
                  <p className="font-body text-sm text-on-surface-variant">
                    Congested
                  </p>
                </article>

                <article className="glass-card overflow-hidden rounded-2xl p-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-primary-container/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/lungs-after.png"
                      alt="Lungs after 30 days"
                      className="h-full w-full object-cover"
                      onError={hideBrokenImage}
                    />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold text-primary">
                    After 30 Days
                  </p>
                  <p className="font-body text-sm text-on-surface-variant">
                    Restored
                  </p>
                </article>
              </div>
            </div>
          </section>
        </div>

        {/* ── HERBS ── */}
        <section
          id="herbs"
          className="bg-primary-container px-0 py-section-gap text-parchment md:rounded-3xl md:px-8"
        >
          <div className="flex items-end justify-between gap-4 px-5 md:px-0">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              The Sacred Seven
            </h2>
            <span className="shrink-0 font-body text-sm text-parchment/70 md:hidden">
              Swipe →
            </span>
          </div>

          <div className="hide-scrollbar mt-8 flex gap-4 overflow-x-auto px-5 pb-2 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
            {herbs.map((h) => (
              <article
                key={h.name}
                className="glass-card w-[min(280px,78vw)] shrink-0 overflow-hidden rounded-2xl border-white/20 bg-white/10 p-0 md:w-72"
              >
                <div className="relative h-40 w-full bg-deep-forest/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={h.img}
                    alt={h.name}
                    className="h-full w-full object-cover"
                    onError={hideBrokenImage}
                  />
                  <p className="absolute bottom-3 left-3 font-display text-lg font-bold text-parchment drop-shadow-md">
                    {h.name}
                  </p>
                </div>
                <div className="p-4">
                  <p className="font-body text-sm leading-relaxed text-parchment/90">
                    {h.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── HOW TO USE ── */}
        <section className="bg-parchment px-5 py-section-gap md:max-w-2xl md:mx-auto md:px-0">
          <h2 className="text-center font-display text-3xl font-bold text-primary md:text-4xl">
            The Daily Ritual
          </h2>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {ritualSteps.map((s) => (
              <article
                key={s.n}
                className="glass-card relative rounded-2xl p-6 pt-10 text-center"
              >
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
            ))}
          </div>
        </section>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
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
                  "flex h-full flex-col items-center justify-center gap-0.5 font-body text-[10px] font-medium transition-colors",
                  item.active
                    ? "text-primary"
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
