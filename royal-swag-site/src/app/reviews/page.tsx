import Link from "next/link";
import { LeadGuardLink } from "@/components/LeadGuardLink";
import { DoctorEndorsements } from "@/components/sections/DoctorEndorsements";
import { S } from "@/lib/config";

export default function ReviewsPage() {
  return (
    <div className="page-mobile-pad w-full min-w-0">
      <section className="bg-primary px-5 py-20 text-center md:px-16 md:py-28">
        <div className="site-container">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ayurvedic-gold/80">
            Real Stories
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-parchment md:text-5xl lg:text-6xl">
            People Like You.
            <br />
            <span className="text-ayurvedic-gold">Specific Results.</span>
          </h1>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-ayurvedic-gold" />
          <p className="mt-6 font-sans text-base text-parchment/70 md:text-lg">
            4.7 stars · 847+ verified Amazon reviews
          </p>
        </div>
      </section>

      <DoctorEndorsements />

      <section className="site-container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {S.reviews.map((r) => (
            <article
              key={r.name}
              className="glass-card rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container font-sans text-sm font-semibold text-parchment">
                  {r.initials}
                </div>
                <span className="rounded border border-primary/20 bg-surface px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-wide text-primary">
                  Was: {r.risk}
                </span>
              </div>

              <div className="mb-4 text-ayurvedic-gold">★★★★★</div>

              <p className="mb-3 font-sans text-sm leading-relaxed text-on-surface-variant">
                <strong className="font-medium text-on-surface">Before: </strong>
                {r.before}
              </p>
              <p className="font-sans text-sm font-medium leading-relaxed text-primary">
                After: {r.after}
              </p>

              <p className="mt-5 border-t border-outline-variant/60 pt-4 font-sans text-xs font-semibold text-on-surface-variant">
                — {r.name}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary-container px-5 py-20 text-center md:px-16">
        <div className="site-container">
          <h2 className="font-display text-3xl font-bold text-parchment md:text-4xl">
            Join 847+ Customers
            <br />
            Breathing Easier.
          </h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-ayurvedic-gold" />
          <p className="mx-auto mt-6 max-w-lg font-sans text-base text-parchment/80 md:text-lg">
            {S.price.now} · Free Delivery · 30-Day Guarantee · COD Available
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LeadGuardLink
              href="/product"
              className="btn-primary inline-flex items-center justify-center px-8 py-3.5"
            >
              Order Now — {S.price.now} →
            </LeadGuardLink>
            <Link
              href="/lung-test"
              className="inline-flex items-center justify-center rounded-xl border border-parchment/30 px-8 py-3.5 font-sans text-sm font-semibold text-parchment transition-colors hover:bg-white/10"
            >
              Take Free Lung Test
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
