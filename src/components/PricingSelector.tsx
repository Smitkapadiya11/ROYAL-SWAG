"use client";

import { cn } from "@/lib/utils";
import type { PlanId, PricingPlan } from "@/lib/product-pricing";

type Props = {
  plans: PricingPlan[];
  value: PlanId;
  onChange: (id: PlanId) => void;
};

export default function PricingSelector({ plans, value, onChange }: Props) {
  const p20 = plans.find((p) => p.id === "20");
  const p60 = plans.find((p) => p.id === "60");
  const upgradeDelta =
    p20 && p60 ? Math.max(0, p60.priceRupees - p20.priceRupees) : null;

  return (
    <div className="product-pricing w-full max-w-full">
      <div className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-4">
        {plans.map((plan) => {
          const selected = value === plan.id;
          const is60 = plan.id === "60";
          const is40 = plan.id === "40";

          return (
            <div key={plan.id} className="relative flex-1 min-w-0">
              <button
                type="button"
                onClick={() => onChange(plan.id)}
                className={cn(
                  "relative w-full text-left rounded-xl border-2 p-4 pt-8 transition-colors min-h-[200px] flex flex-col",
                  selected
                    ? "border-green-700 bg-green-50"
                    : "border-gray-200 bg-white",
                  is60 && "shadow-[0_0_0_2px_#16a34a]"
                )}
              >
                {is40 && (
                  <span
                    className="absolute top-2 right-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs"
                    aria-hidden="true"
                  >
                    MOST POPULAR 🔥
                  </span>
                )}
                {is60 && (
                  <span
                    className="absolute top-2 right-2 rounded-full bg-green-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs"
                    aria-hidden="true"
                  >
                    BEST VALUE 💚
                  </span>
                )}

                <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gold)]">
                  {plan.title}
                </p>
                <p className="mt-1 text-sm text-[var(--brand-dark)]/70">
                  {plan.bags} tea bags · {plan.days}-Day Supply
                </p>

                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-bold text-[var(--brand-dark)] tabular-nums">
                    Rs {plan.priceRupees}
                  </span>
                  <span className="text-sm line-through text-[var(--brand-dark)]/40 tabular-nums">
                    Rs {plan.mrpRupees}
                  </span>
                  {plan.savingsRupees > 0 && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
                      Save Rs {plan.savingsRupees}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm font-semibold text-[var(--brand-dark)]">
                  {plan.perDayDisplay}
                </p>

                <p className="mt-3 text-xs text-[var(--brand-dark)]/65 leading-snug">
                  {plan.tagline}
                </p>

                {is60 && (
                  <>
                    <p className="mt-3 text-xs text-[var(--brand-dark)]/55 leading-relaxed border-t border-[var(--brand-sage)]/60 pt-3">
                      ⚡ Ayurvedic results need minimum 60 days — this pack completes your full detox cycle
                    </p>
                    <p className="mt-2 text-xs font-medium text-orange-700">
                      📦 Limited stock available at this price
                    </p>
                  </>
                )}
              </button>

              {plan.id === "20" && (
                <p className="mt-2 text-[11px] leading-snug text-amber-800/90 px-0.5">
                  ⚠️ Most customers need 40–60 days to feel full results
                </p>
              )}
            </div>
          );
        })}
      </div>

      {upgradeDelta !== null && (
        <p className="mt-4 text-center text-sm text-[var(--brand-dark)]/70 leading-snug px-1 max-w-xl mx-auto">
          Going from 20 days to 60 days costs just Rs {upgradeDelta} more — but gives you 3x the results.
        </p>
      )}
    </div>
  );
}
