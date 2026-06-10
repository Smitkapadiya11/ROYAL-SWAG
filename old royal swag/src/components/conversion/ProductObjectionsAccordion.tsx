"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Will this actually work for me?",
    a: "If you breathe polluted air, you have lung toxin buildup. The herbs in Royal Swag have been used in Ayurvedic medicine for centuries specifically for this. If it doesn&apos;t work for you in 30 days, we refund every rupee.",
  },
  {
    q: "Is it safe to drink daily?",
    a: "Yes. All 4 herbs — Tulsi, Vasaka, Mulethi, Pippali — are food-grade Ayurvedic ingredients used in Indian households for generations. No chemicals, no additives, no dependency.",
  },
  {
    q: "What if I forget to drink it?",
    a: "Most customers drink it with their morning chai or evening routine. It takes 2 minutes. We also send a WhatsApp reminder for the first 7 days if you opt in at checkout.",
  },
  {
    q: "I've tried detox teas before and they didn't work.",
    a: "Most 'detox teas' are just laxatives with green tea. Royal Swag contains Vasaka — a herb clinically recognized in Ayurveda specifically for bronchial cleansing. It is not the same category of product.",
  },
] as const;

export default function ProductObjectionsAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mt-12 border-t border-[var(--brand-sage)] pt-10" aria-labelledby="objections-heading">
      <h2
        id="objections-heading"
        className="text-xl font-bold text-[var(--brand-dark)] mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        You Might Be Wondering...
      </h2>
      <ul className="space-y-2">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q} className="rounded-xl border border-[var(--brand-sage)] bg-[var(--brand-ivory)] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[var(--brand-dark)]"
                aria-expanded={isOpen}
              >
                {item.q}
                <span className="shrink-0 text-[var(--brand-green)]">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <p className="px-4 pb-4 text-sm text-[var(--brand-dark)]/70 leading-relaxed border-t border-[var(--brand-sage)]/50 pt-3">
                  {item.a}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
