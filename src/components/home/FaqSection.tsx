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
    a: "A daily herbal tea with seven whole herbs — Tulsi, Vasaka, Mulethi, Pippali, and more — steeped like normal chai without milk. People drink it when pollution, smoke, or a stubborn cough won’t leave them alone.",
  },
  {
    id: "best-time-drink",
    q: "When is the best time to drink it?",
    a: "Morning on an empty stomach works for most buyers. A second cup before bed is fine if that fits your routine.",
  },
  {
    id: "suitable-smokers",
    q: "Is it suitable for smokers?",
    a: "Yes. Many current and former smokers keep a box handy while they cut back or after they quit — pair it with your doctor’s advice, not instead of it.",
  },
  {
    id: "suitable-non-smokers",
    q: "Is it suitable for non-smokers?",
    a: "Yes. Traffic dust, Diwali smoke, and office AC bother plenty of people who never touched a cigarette. If your chest feels tight or your throat stays scratchy, this is for you too.",
  },
  {
    id: "what-benefits",
    q: "What benefits can I expect?",
    a: "Buyers tell us breathing feels lighter, coughs soften, and sleep gets easier within the first couple of weeks. Bodies differ — give it at least one full box before you judge.",
  },
  {
    id: "side-effects",
    q: "Are there any side effects?",
    a: "It’s food-grade herbs, not a prescription. Start with one cup. If you’re pregnant, on blood thinners, or managing serious lung disease, ask your doctor first.",
  },
  {
    id: "who-should-start",
    q: "Who should start using this tea today?",
    a: "Anyone over 18 who commutes through Indian cities, lives near construction dust, or wants a simple daily lung habit without pills.",
  },
  {
    id: "delivery-time",
    q: "How long will delivery take?",
    a: "Most PIN codes see the parcel in three to seven working days. Remote areas can take a day or two longer.",
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
                className="text-sm text-[var(--brand-dark)]/70 leading-[1.65] pb-5"
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
