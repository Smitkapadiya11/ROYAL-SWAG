"use client";

import Link from "next/link";

const DEFAULT_HEADLINE = "Royal Swag Lung Detox Tea";
const DEFAULT_SUB = "Secure checkout · Ships tomorrow";

export default function MobileStickyBar(props: {
  onBuyNow?: () => void;
  href?: string;
  /** Shown on line 1 (single line, ellipsis if needed). */
  headline?: string;
  /** Shown on line 2 (e.g. price + secure checkout). */
  subline?: string;
}) {
  const { onBuyNow, href = "/product", headline = DEFAULT_HEADLINE, subline = DEFAULT_SUB } = props;

  return (
    <div
      id="mobile-sticky-cta"
      role="region"
      aria-label="Buy Royal Swag"
      className="flex h-[60px] w-full items-center justify-between gap-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] md:hidden fixed bottom-0 left-0 right-0 z-[9998] bg-[#0D3B1F]"
    >
      <div className="min-w-0 flex-1 pr-1">
        <p className="truncate text-[13px] font-medium leading-tight text-white">{headline}</p>
        <p className="truncate text-[10px] leading-tight text-white/50">{subline}</p>
      </div>

      {onBuyNow ? (
        <button
          type="button"
          id="mobile-sticky-buy-btn"
          onClick={onBuyNow}
          className="min-w-[110px] shrink-0 rounded-md bg-green-500 px-4 py-2 text-sm font-bold whitespace-nowrap text-white"
        >
          Buy Now
        </button>
      ) : (
        <Link
          id="mobile-sticky-buy-btn"
          href={href}
          className="min-w-[110px] shrink-0 rounded-md bg-green-500 px-4 py-2 text-center text-sm font-bold whitespace-nowrap text-white"
        >
          Buy Now
        </Link>
      )}
    </div>
  );
}
