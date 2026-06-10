function comboPath(filename: string) {
  return `/images/combos/${encodeURIComponent(filename)}`;
}

export const BUNDLES = [
  {
    id: "starter",
    days: 20,
    label: "20-Day Starter",
    packs: "1 Pack",
    price: Number(process.env.NEXT_PUBLIC_PRICE_20DAY) || 349,
    mrp: Number(process.env.NEXT_PUBLIC_MRP_20DAY) || 499,
    img: comboPath("1 product-13.jpg_202605240444.webp"),
    badge: null,
    description: "Perfect to try. See results in 20 days.",
  },
  {
    id: "progress",
    days: 40,
    label: "40-Day Progress",
    packs: "2 Packs",
    price:
      Number(process.env.NEXT_PUBLIC_PRODUCT_PRICE) ||
      Number(process.env.NEXT_PUBLIC_PRICE_40DAY) ||
      599,
    mrp:
      Number(process.env.NEXT_PUBLIC_PRODUCT_MRP) ||
      Number(process.env.NEXT_PUBLIC_MRP_40DAY) ||
      698,
    img: comboPath("2 product_render_202605240445.webp"),
    badge: "BEST VALUE",
    description: "Most popular. Visible improvement guaranteed.",
  },
  {
    id: "result",
    days: 60,
    label: "60-Day Results",
    packs: "3 Packs",
    price: Number(process.env.NEXT_PUBLIC_PRICE_60DAY) || 849,
    mrp: Number(process.env.NEXT_PUBLIC_MRP_60DAY) || 1047,
    img: comboPath("3 product 202605240445.webp"),
    badge: "DOCTOR RECOMMENDED",
    description: "Complete detox. Maximum results.",
  },
] as const;

export type Bundle = (typeof BUNDLES)[number];

export const DEFAULT_BUNDLE: Bundle =
  BUNDLES.find((b) => b.id === "progress") ?? BUNDLES[1];

export function getSaving(price: number, mrp: number) {
  return Math.round(((mrp - price) / mrp) * 100);
}
