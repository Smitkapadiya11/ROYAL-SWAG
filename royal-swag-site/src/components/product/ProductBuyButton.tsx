"use client";

import { cn } from "@/lib/utils";

type ProductBuyButtonProps = {
  price: number;
  mrp: number;
  packLabel: string;
  savingPct: number;
  onClick: () => void;
  size?: "default" | "compact";
  className?: string;
};

export default function ProductBuyButton({
  price,
  mrp,
  packLabel,
  savingPct,
  onClick,
  size = "default",
  className,
}: ProductBuyButtonProps) {
  const compact = size === "compact";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl text-left transition-all duration-300",
        "bg-gradient-to-br from-primary via-[#3a4f2a] to-primary-container",
        "shadow-[0_8px_32px_rgba(50,64,35,0.28)]",
        "hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(154,111,26,0.35)]",
        "active:translate-y-0",
        compact ? "px-5 py-3" : "px-6 py-4",
        className
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(154,111,26,0.25) 50%, transparent 70%)",
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-ayurvedic-gold/15 blur-2xl"
        aria-hidden
      />

      <span
        className={cn(
          "relative flex items-center gap-3",
          compact ? "gap-3" : "gap-4"
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl bg-ayurvedic-gold/20 text-ayurvedic-gold ring-1 ring-ayurvedic-gold/30",
            compact ? "h-10 w-10 text-lg" : "h-12 w-12 text-xl"
          )}
        >
          🛍
        </span>

        <span className="min-w-0 flex-1 overflow-hidden">
          <span
            className={cn(
              "block font-sans font-bold tracking-wide text-white",
              compact ? "text-sm" : "text-base"
            )}
          >
            Buy Now
          </span>
          <span
            className={cn(
              "block truncate font-sans text-white/70",
              compact ? "text-[10px]" : "text-xs"
            )}
          >
            {packLabel} · Save {savingPct}%
          </span>
        </span>

        <span className="shrink-0 text-right">
          <span
            className={cn(
              "price-num block font-number font-bold tabular-nums text-ayurvedic-gold",
              compact ? "text-lg" : "text-2xl"
            )}
          >
            ₹{price}
          </span>
          {!compact && (
            <span className="font-number block text-xs tabular-nums text-white/50 line-through">
              ₹{mrp}
            </span>
          )}
        </span>
      </span>

      {!compact && (
        <span className="relative mt-3 flex items-center justify-center gap-4 border-t border-white/15 pt-3 font-sans text-[10px] font-medium uppercase tracking-wider text-white/60">
          <span>Free Delivery</span>
          <span className="h-1 w-1 rounded-full bg-ayurvedic-gold/60" />
          <span>COD Available</span>
          <span className="h-1 w-1 rounded-full bg-ayurvedic-gold/60" />
          <span>30-Day Guarantee</span>
        </span>
      )}
    </button>
  );
}
