import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Royal Swag privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[100svh] bg-[var(--brand-ivory)] py-20 px-4">
      <div className="container-rs max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold text-[var(--brand-dark)] mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--brand-dark)]/70 leading-relaxed mb-4">
          Royal Swag (&quot;we&quot;, &quot;us&quot;) respects your privacy. This page describes how we collect and use
          information when you use our website, including the free lung test and checkout.
        </p>
        <ul className="list-disc pl-5 text-sm text-[var(--brand-dark)]/70 space-y-2 mb-8">
          <li>We use your contact details to fulfil orders and respond to enquiries.</li>
          <li>Payment processing is handled securely by Razorpay; we do not store your full card details on our servers.</li>
          <li>You may request correction or deletion of your data by contacting us at the email shown in the site footer.</li>
        </ul>
        <p className="text-xs text-[var(--brand-dark)]/50">
          Last updated: April 2026. For questions, use the contact details in the footer.
        </p>
        <Link href="/" className="inline-block mt-8 text-sm font-semibold text-[var(--brand-green)] underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
