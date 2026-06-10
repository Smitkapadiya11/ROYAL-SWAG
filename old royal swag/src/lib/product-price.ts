import { PRODUCT_BUNDLE_OPTIONS } from "@/lib/bundle-options";
import { BUNDLES } from "@/lib/productPricing";

/** Primary SKU price — requires Manoj Bhai approval to change env default. */
export function getPrimaryProductPrice(): number {
  const fromEnv = Number(process.env.NEXT_PUBLIC_PRODUCT_PRICE);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return 699;
}

export function getPrimaryProductMrp(): number {
  const fromEnv = Number(process.env.NEXT_PUBLIC_PRODUCT_MRP);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return 999;
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
