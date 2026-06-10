import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { siteConfig } from "@/lib/siteConfig";

const LAST_UPDATED = "June 2026";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Royal Swag terms of use and website conditions.",
};

export default function TermsPage() {
  return (
    <Section bg="cream" className="min-h-[100svh]">
      <Container size="sm">
        <h1 className="mb-6 font-display text-3xl font-bold text-on-surface">
          Terms of Use
        </h1>
        <p className="mb-4 font-body text-sm leading-relaxed text-on-surface-variant">
          By accessing lungdetox.royalswag.in you agree to these Terms of Service with{" "}
          {siteConfig.companyName}. Our Lung Detox Tea is a wellness food product; it is not
          intended to diagnose, treat, cure, or prevent any disease. Consult a qualified
          healthcare professional for medical advice.
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-5 font-body text-sm text-on-surface-variant">
          <li>Prices shown at checkout are final. Promotional offers may change without prior notice.</li>
          <li>Orders are subject to availability and successful payment verification via Razorpay.</li>
          <li>Our 30-day money-back guarantee is described in the{" "}
            <Link href="/refund-policy" className="text-primary underline">Refund Policy</Link>.
          </li>
          <li>You must provide accurate delivery and contact information for fulfilment.</li>
          <li>We may update these terms; continued use constitutes acceptance of the revised terms.</li>
        </ul>
        <p className="mb-8 font-body text-sm text-on-surface-variant">
          Governing law: India. Disputes shall be subject to courts at Surat, Gujarat. Contact:{" "}
          {siteConfig.email}
        </p>
        <p className="font-body text-xs text-on-surface-variant/70">
          Last updated: {LAST_UPDATED}.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block font-body text-sm font-semibold text-primary underline"
        >
          ← Back to home
        </Link>
      </Container>
    </Section>
  );
}
