"use client";

import { usePathname, useRouter } from "next/navigation";
import { URGENCY_CONFIG } from "@/lib/urgency-config";
import { EVENTS, trackEvent } from "@/lib/events";

type MobileStickyBarProps = {
  /** Selected pack price from product page (defaults to Progress Pack / env) */
  selectedPrice?: number;
  productName?: string;
};

export default function MobileStickyBar({
  selectedPrice = URGENCY_CONFIG.stickyPrice,
  productName = URGENCY_CONFIG.productName,
}: MobileStickyBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBuy = () => {
    trackEvent(EVENTS.STICKY_BAR_BUY, { page: pathname || "/" });

    if (pathname === "/product") {
      const el = document.getElementById("product-checkout");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    router.push("/product#product-checkout");
  };

  return (
    <div
      className="mobile-sticky-bar fixed bottom-0 left-0 right-0 z-[60] flex h-[60px] items-center justify-between border-t border-white/10 px-5 backdrop-blur-xl md:hidden"
      style={{ backgroundColor: "#0D3B1F" }}
      role="region"
      aria-label="Quick purchase"
    >
      <div className="min-w-0 flex-1 pr-3">
        <p className="truncate font-body text-xs font-medium text-white/90">
          {productName}
        </p>
        <p className="font-body text-xl font-bold leading-tight text-white">
          ₹{selectedPrice}
        </p>
      </div>
      <button
        type="button"
        onClick={handleBuy}
        data-track-button="sticky-buy-now"
        data-track-label="Buy Now"
        className="shrink-0 rounded-xl bg-[#9A6F1A] px-6 py-2 font-body text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
      >
        Buy Now
      </button>
    </div>
  );
}
