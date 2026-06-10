import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Royal Swag 30-day money-back guarantee and refund policy.",
};

const LAST_UPDATED = "June 2026";

export default function RefundPolicyPage() {
  return (
    <Section bg="cream" className="min-h-[100svh]">
      <Container size="sm">
        <h1 className="mb-6 font-display text-3xl font-bold text-on-surface">
          Refund Policy
        </h1>
        <p className="mb-4 font-body text-sm leading-relaxed text-on-surface-variant">
          At Royal Swag, we stand behind our 30-Day Money Back Guarantee. If you do not
          feel a meaningful difference after consistent daily use, you may request a
          full refund within 30 days of delivery.
        </p>
        <h2 className="mb-2 font-display text-xl font-semibold text-primary">
          How to request a refund
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-5 font-body text-sm text-on-surface-variant">
          <li>
            Contact us on WhatsApp or email at{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-medium text-primary underline"
            >
              {siteConfig.email}
            </a>{" "}
            with your order ID and reason for the request.
          </li>
          <li>Refunds are processed to your original payment method within 5–7 business days after approval.</li>
          <li>COD orders are refunded via UPI or bank transfer once details are verified.</li>
          <li>Opened or partially used packs are eligible under our guarantee — we ask only for honest feedback.</li>
        </ul>
        <h2 className="mb-2 font-display text-xl font-semibold text-primary">
          Non-refundable cases
        </h2>
        <ul className="mb-8 list-disc space-y-2 pl-5 font-body text-sm text-on-surface-variant">
          <li>Requests made after 30 days from the date of delivery.</li>
          <li>Orders placed through unauthorised resellers without proof of purchase from Royal Swag.</li>
        </ul>
        <p className="font-body text-xs text-on-surface-variant/70">
          Last updated: {LAST_UPDATED}. Operated by {siteConfig.companyName}.
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
