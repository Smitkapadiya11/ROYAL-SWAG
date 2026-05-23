/** Public urgency / social-proof copy (env overrides) */

function readCount(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const URGENCY_CONFIG = {
  stockCount: readCount("NEXT_PUBLIC_STOCK_COUNT", 38),
  orderCount: readCount("NEXT_PUBLIC_ORDER_COUNT", 12),
  stickyPrice: readCount("NEXT_PUBLIC_STICKY_BAR_PRICE", 599),
  productName: "Lung Detox Tea",
} as const;
