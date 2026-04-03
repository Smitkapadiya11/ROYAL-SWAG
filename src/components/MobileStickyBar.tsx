"use client";

import Link from "next/link";

export default function MobileStickyBar(props: {
  onBuyNow?: () => void;
  href?: string;
}) {
  const { onBuyNow, href = "/product" } = props;

  return (
    <div
      id="mobile-sticky-cta"
      role="region"
      aria-label="Buy Royal Swag"
      className="block md:hidden fixed bottom-0 left-0 right-0 z-[9998] h-[60px] bg-[#0D3B1F] px-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
    >
      <p className="text-white text-[13px] font-medium leading-tight pr-3 truncate">
        Royal Swag Lung Detox Tea — from Rs 359
      </p>

      {onBuyNow ? (
        <button
          type="button"
          id="mobile-sticky-buy-btn"
          onClick={onBuyNow}
          className="bg-green-500 text-white px-4 py-2 rounded-md font-bold whitespace-nowrap"
        >
          Buy Now
        </button>
      ) : (
        <Link
          id="mobile-sticky-buy-btn"
          href={href}
          className="bg-green-500 text-white px-4 py-2 rounded-md font-bold whitespace-nowrap"
        >
          Buy Now
        </Link>
      )}
    </div>
  );
}
