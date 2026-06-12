import Link from "next/link";

import { LeadGuardLink } from "@/components/LeadGuardLink";

import { DoctorEndorsements } from "@/components/sections/DoctorEndorsements";

import { ReviewCardsGrid } from "@/components/reviews/ReviewCardsGrid";
import { VideoTestimonials } from "@/components/reviews/VideoTestimonials";
import { Container, Section } from "@/components/layout";

import { S } from "@/lib/config";



export default function ReviewsPage() {

  return (

    <div className="page-shell page-mobile-pad w-full min-w-0 bg-parchment font-sans text-on-surface antialiased">

      <Section bg="green" className="text-center">

        <Container>

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

        </Container>

      </Section>



      <DoctorEndorsements />

      <Section bg="surface">
        <Container>
          <VideoTestimonials />
        </Container>
      </Section>

      <Section bg="transparent">

        <Container>
          <ReviewCardsGrid reviews={S.reviews} />
        </Container>

      </Section>



      <Section bg="green" className="bg-primary-container text-center">

        <Container>

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

        </Container>

      </Section>

    </div>

  );

}


