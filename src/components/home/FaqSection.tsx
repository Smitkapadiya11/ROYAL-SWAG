"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    id: "what-is-lung-detox-tea",
    q: "What is Lung Detox Tea?",
    a: "A herbal tea designed to support respiratory health and help the body cope with daily exposure to pollution.",
  },
  {
    id: "best-time-drink",
    q: "When is the best time to drink it?",
    a: "Morning or evening, depending on your routine.",
  },
  {
    id: "suitable-smokers",
    q: "Is it suitable for smokers?",
    a: "Yes, it is often used by individuals looking to support their respiratory health.",
  },
  {
    id: "suitable-non-smokers",
    q: "Is it suitable for non-smokers?",
    a: "Absolutely, it is beneficial for anyone exposed to pollution or looking to support respiratory wellness.",
  },
  {
    id: "what-benefits",
    q: "What benefits can I expect?",
    a: "Supports lung function, helps soothe throat and airways, promotes easier breathing.",
  },
  {
    id: "side-effects",
    q: "Are there any side effects?",
    a: "The tea is made from natural herbs and is generally well tolerated when consumed as directed.",
  },
  {
    id: "who-should-start",
    q: "Who should start using this tea today?",
    a: "Anyone living in urban environments, exposed to pollution, or looking to build a daily respiratory care habit.",
  },
  {
    id: "delivery-time",
    q: "How long will delivery take?",
    a: "Delivery usually takes 3–7 business days depending on your location.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="py-12 min-[769px]:py-20 bg-[var(--brand-ivory)]"
      aria-labelledby="faq-heading"
    >
      <div className="container-rs max-w-3xl">
        <div className="text-center mb-8">
          <p className="rs-section-label text-[var(--brand-gold)]">
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
              className="bg-white border border-[var(--brand-sage)] rounded-2xl px-4 shadow-sm min-[769px]:px-6"
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
