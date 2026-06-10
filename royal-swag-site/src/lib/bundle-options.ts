/** Product bundle cards for /product — Sprint 3 will extend subscription flow. */

function readPrice(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export type ProductBundleOption = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  mrp: number;
  badge: string | null;
  saveLabel: string | null;
  isSubscription?: boolean;
  isDefault?: boolean;
};

const singlePrice = readPrice("NEXT_PUBLIC_PRODUCT_PRICE", 349);
const singleMrp = readPrice("NEXT_PUBLIC_PRODUCT_MRP", 399);
const doublePrice = readPrice("NEXT_PUBLIC_BUNDLE_2_PRICE", 689);
const doubleMrp = readPrice("NEXT_PUBLIC_BUNDLE_2_MRP", 899);
const triplePrice = readPrice("NEXT_PUBLIC_BUNDLE_3_PRICE", 999);
const tripleMrp = readPrice("NEXT_PUBLIC_BUNDLE_3_MRP", 1199);
const subPrice = readPrice("NEXT_PUBLIC_SUBSCRIPTION_PRICE", 649);

export const PRODUCT_BUNDLE_OPTIONS: readonly ProductBundleOption[] = [
  {
    id: "single",
    title: "1 Pack",
    subtitle: "30 bags · 30-day supply",
    price: singlePrice,
    mrp: singleMrp,
    badge: null,
    saveLabel: null,
  },
  {
    id: "double",
    title: "2 Pack Bundle",
    subtitle: "60 bags · 60-day supply",
    price: doublePrice,
    mrp: doubleMrp,
    badge: "BEST VALUE 🏆",
    saveLabel: `SAVE ₹${doubleMrp - doublePrice}`,
    isDefault: true,
  },
  {
    id: "triple",
    title: "3 Pack Bundle",
    subtitle: "90 bags · 90-day supply",
    price: triplePrice,
    mrp: tripleMrp,
    badge: null,
    saveLabel: `SAVE ₹${tripleMrp - triplePrice}`,
  },
  {
    id: "subscribe",
    title: "Monthly Subscription",
    subtitle: "₹649/month · Cancel anytime",
    price: subPrice,
    mrp: singleMrp,
    badge: "AUTO-DELIVER 🔄",
    saveLabel: null,
    isSubscription: true,
  },
] as const;

export type ProductBundleOptionId = (typeof PRODUCT_BUNDLE_OPTIONS)[number]["id"];

export const DEFAULT_PRODUCT_BUNDLE: ProductBundleOption =
  PRODUCT_BUNDLE_OPTIONS.find((b) => b.isDefault) ?? PRODUCT_BUNDLE_OPTIONS[1];

export function getProductBundleById(id: string): ProductBundleOption {
  return PRODUCT_BUNDLE_OPTIONS.find((b) => b.id === id) ?? DEFAULT_PRODUCT_BUNDLE;
}

export function getBundleSaving(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return mrp - price;
}
