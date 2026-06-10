import { PRODUCT_BUNDLE_OPTIONS } from "@/lib/bundle-options";
import { BUNDLES } from "@/lib/productPricing";

/** Primary SKU = 1 Pack starter (₹349 / ₹399 MRP). */
export function getStarterPackOffer() {
  return (
    PRODUCT_BUNDLE_OPTIONS.find((b) => b.id === "single") ??
    PRODUCT_BUNDLE_OPTIONS[0]
  );
}

/** @deprecated Use getStarterPackOffer().price */
export function getPrimaryProductPrice(): number {
  return getStarterPackOffer().price;
}

/** @deprecated Use getStarterPackOffer().mrp */
export function getPrimaryProductMrp(): number {
  return getStarterPackOffer().mrp;
}

export function getPrimaryDiscountPercent(): number {
  const price = getPrimaryProductPrice();
  const mrp = getPrimaryProductMrp();
  return Math.round(((mrp - price) / mrp) * 100);
}

/** Server-side allowed checkout amounts (INR rupees, not paise). */
export function getAllowedCheckoutAmounts(): number[] {
  const amounts = new Set<number>([
    getPrimaryProductPrice(),
    ...BUNDLES.map((b) => b.price),
    ...PRODUCT_BUNDLE_OPTIONS.map((b) => b.price),
  ]);
  return [...amounts].filter((n) => n > 0);
}

export function isAllowedCheckoutAmount(amount: number): boolean {
  return getAllowedCheckoutAmounts().includes(Math.round(amount));
}

export const PRODUCT_SKU = "RSLD-001";
