/**
 * Product pack pricing — values come from NEXT_PUBLIC_* env vars.
 * Update .env.local only after business approval.
 */
export type PlanId = "20" | "40" | "60";

export type PricingPlan = {
  id: PlanId;
  title: string;
  bags: number;
  days: number;
  priceRupees: number;
  mrpRupees: number;
  savingsRupees: number;
  perDayDisplay: string;
  tagline: string;
  badge: "none" | "popular" | "value";
};

function numEnv(key: string, fallback: number): number {
  const v = process.env[key];
  if (v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function getPricingFromEnv() {
  return {
    price20: numEnv("NEXT_PUBLIC_PRICE_20DAY", 359),
    price40: numEnv("NEXT_PUBLIC_PRICE_40DAY", 649),
    price60: numEnv("NEXT_PUBLIC_PRICE_60DAY", 899),
    mrp20: numEnv("NEXT_PUBLIC_MRP_20DAY", 499),
    mrp40: numEnv("NEXT_PUBLIC_MRP_40DAY", 718),
    mrp60: numEnv("NEXT_PUBLIC_MRP_60DAY", 1077),
  };
}

function perDayLabel(priceRupees: number, days: number): string {
  const v = priceRupees / days;
  return `Just Rs ${v.toFixed(2)}/day`;
}

export function buildPricingPlans(): PricingPlan[] {
  const p = getPricingFromEnv();

  const p20: PricingPlan = {
    id: "20",
    title: "Starter Pack",
    bags: 20,
    days: 20,
    priceRupees: p.price20,
    mrpRupees: p.mrp20,
    savingsRupees: 0,
    perDayDisplay: perDayLabel(p.price20, 20),
    tagline: "Perfect to try Royal Swag",
    badge: "none",
  };

  const p40: PricingPlan = {
    id: "40",
    title: "Double Pack",
    bags: 40,
    days: 40,
    priceRupees: p.price40,
    mrpRupees: p.mrp40,
    savingsRupees: Math.max(0, p.mrp40 - p.price40),
    perDayDisplay: perDayLabel(p.price40, 40),
    tagline: "Best for first-time results",
    badge: "popular",
  };

  const p60: PricingPlan = {
    id: "60",
    title: "Full Detox Pack",
    bags: 60,
    days: 60,
    priceRupees: p.price60,
    mrpRupees: p.mrp60,
    savingsRupees: Math.max(0, p.mrp60 - p.price60),
    perDayDisplay: perDayLabel(p.price60, 60),
    tagline: "Recommended for complete lung detox",
    badge: "value",
  };

  return [p20, p40, p60];
}

export function planToAmountPaise(plan: PricingPlan): number {
  return Math.round(plan.priceRupees * 100);
}

export function razorpayDescriptionForPlan(plan: PricingPlan): string {
  return `${plan.bags} Tea Bags — ${plan.days}-Day Supply`;
}
