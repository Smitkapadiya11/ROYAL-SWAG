"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    id: "how-to-use",
    q: "How do I use Royal Swag?",
    a: "Steep one tea bag in hot water (85–95°C) for 5 minutes. Drink twice daily — morning on an empty stomach and before bed. You can add a teaspoon of honey.",
  },
  {
    id: "how-soon",
    q: "How soon will I see results?",
    a: "Most customers report easier breathing and reduced morning cough within 7–10 days of consistent use. For deeper cleansing (especially for smokers or high-pollution areas), we recommend 4–6 weeks.",
  },
  {
    id: "safe",
    q: "Is it safe for daily use?",
    a: "Yes. Royal Swag is 100% natural with no artificial additives. All herbs are within safe Ayurvedic dosage ranges. Consult a doctor if pregnant, nursing, or on prescription medication.",
  },
  {
    id: "asthma",
    q: "I have asthma. Can I drink Royal Swag?",
    a: "Many customers use Royal Swag alongside existing asthma management. However, it is a wellness supplement and not a substitute for prescribed medication. Consult your pulmonologist first.",
  },
  {
    id: "shipping",
    q: "How fast is delivery?",
    a: "Metro cities (Delhi, Mumbai, Bangalore, etc.) receive delivery in 2–3 business days. Tier-2 and Tier-3 cities in 4–6 business days. Free shipping on all orders.",
  },
  {
    id: "return",
    q: "What if I don't see results?",
    a: "We offer a 30-day happiness guarantee. If you've used Royal Swag consistently for 30 days and aren't satisfied, contact us for a full refund — no questions asked.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="py-24 md:py-32 bg-[var(--brand-ivory)]"
      aria-labelledby="faq-heading"
    >
      <div className="container-rs max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-gold)] mb-3">
            Got Questions?
          </p>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-bold text-[var(--brand-dark)]"
          >
            Common Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map(({ id, q, a }) => (
            <AccordionItem
              key={id}
              value={id}
              className="bg-white border border-[var(--brand-sage)] rounded-2xl px-6 shadow-sm"
            >
              <AccordionTrigger
                id={`faq-trigger-${id}`}
                className="text-left font-semibold text-[var(--brand-dark)] text-base py-5 hover:no-underline"
              >
                {q}
              </AccordionTrigger>
              <AccordionContent
                id={`faq-panel-${id}`}
                className="text-sm text-[var(--brand-dark)]/60 leading-relaxed pb-5"
              >
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
