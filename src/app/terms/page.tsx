import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Royal Swag terms of use and website conditions.",
};

export default function TermsPage() {
  return (
    <div className="min-h-[100svh] bg-[var(--brand-ivory)] py-20 px-4">
      <div className="container-rs max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold text-[var(--brand-dark)] mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Terms of Use
        </h1>
        <p className="text-sm text-[var(--brand-dark)]/70 leading-relaxed mb-4">
          By using this website you agree to these terms. Our products are wellness foods; they are not intended to
          diagnose, treat, cure, or prevent any disease. Consult a healthcare professional for medical concerns.
        </p>
        <ul className="list-disc pl-5 text-sm text-[var(--brand-dark)]/70 space-y-2 mb-8">
          <li>Prices and offers are subject to change; the amount charged is the one shown at checkout.</li>
          <li>Our 30-day guarantee applies as described on the product page.</li>
          <li>We may update these terms; continued use of the site constitutes acceptance.</li>
        </ul>
        <p className="text-xs text-[var(--brand-dark)]/50">
          Last updated: April 2026.
        </p>
        <Link href="/" className="inline-block mt-8 text-sm font-semibold text-[var(--brand-green)] underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
