import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { siteConfig } from "@/lib/siteConfig";

const LAST_UPDATED = "June 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Royal Swag privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <Section bg="cream" className="min-h-[100svh]">
      <Container size="sm">
        <h1 className="mb-6 font-display text-3xl font-bold text-on-surface">
          Privacy Policy
        </h1>
        <p className="mb-4 font-body text-sm leading-relaxed text-on-surface-variant">
          {siteConfig.companyName} (&quot;Royal Swag&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy.
          This policy explains how we collect, use, and protect personal information when you use
          lungdetox.royalswag.in, including the free lung test, checkout, and WhatsApp ordering.
          This notice is provided in accordance with the Information Technology Act, 2000 and
          applicable data protection principles.
        </p>
        <h2 className="mb-2 font-display text-xl font-semibold text-primary">Information we collect</h2>
        <ul className="mb-4 list-disc space-y-2 pl-5 font-body text-sm text-on-surface-variant">
          <li>Name, phone number, email, and delivery address when you place an order or take the lung test.</li>
          <li>Payment references from Razorpay (we do not store full card or UPI credentials).</li>
          <li>Technical data such as browser type and pages visited via analytics cookies where enabled.</li>
        </ul>
        <h2 className="mb-2 font-display text-xl font-semibold text-primary">How we use your data</h2>
        <ul className="mb-4 list-disc space-y-2 pl-5 font-body text-sm text-on-surface-variant">
          <li>To fulfil orders, send confirmations (SMS/email), and provide customer support.</li>
          <li>To personalise lung test results and improve our Ayurvedic wellness content.</li>
          <li>We do not sell your personal data to third parties.</li>
        </ul>
        <h2 className="mb-2 font-display text-xl font-semibold text-primary">Your rights</h2>
        <ul className="mb-8 list-disc space-y-2 pl-5 font-body text-sm text-on-surface-variant">
          <li>Request access, correction, or deletion of your data by emailing {siteConfig.email}.</li>
          <li>Opt out of marketing messages at any time via reply or unsubscribe instructions.</li>
        </ul>
        <p className="font-body text-xs text-on-surface-variant/70">
          Last updated: {LAST_UPDATED}. Questions: {siteConfig.email}
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
