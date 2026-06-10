"use client";

import {
  DEFAULT_PRODUCT_BUNDLE,
  PRODUCT_BUNDLE_OPTIONS,
  type ProductBundleOption,
} from "@/lib/bundle-options";
import { cn } from "@/lib/utils";

type BundleSelectorProps = {
  selectedId: string;
  onSelect: (bundle: ProductBundleOption) => void;
  className?: string;
};

export default function BundleSelector({
  selectedId,
  onSelect,
  className,
}: BundleSelectorProps) {
  return (
    <section className={cn("w-full", className)}>
      <h2 className="mb-3 font-display text-lg font-semibold text-primary md:text-xl">
        Choose Your Pack
      </h2>
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        {PRODUCT_BUNDLE_OPTIONS.map((bundle) => {
          const selected = bundle.id === selectedId;
          const isBestValue = bundle.id === DEFAULT_PRODUCT_BUNDLE.id;

          return (
            <button
              key={bundle.id}
              type="button"
              onClick={() => onSelect(bundle)}
              data-track-button={`bundle-${bundle.id}`}
              data-track-label={bundle.title}
              className={cn(
                "relative flex w-full flex-col rounded-2xl border-2 p-4 text-left transition-all duration-200",
                selected
                  ? "border-[#0D3B1F] bg-surface/80 shadow-md"
                  : "border-glass-border bg-white/40 hover:border-primary/30"
              )}
            >
              {bundle.badge ? (
                <span
                  className={cn(
                    "absolute -top-2.5 left-3 rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold tracking-wide text-white",
                    isBestValue ? "bg-[#0D3B1F]" : "bg-ayurvedic-gold"
                  )}
                >
                  {bundle.badge}
                </span>
              ) : null}

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 pt-1">
                  <p className="font-display text-sm font-bold text-primary md:text-base">
                    {bundle.title}
                  </p>
                  <p className="mt-0.5 font-sans text-[11px] leading-snug text-on-surface-variant md:text-xs">
                    {bundle.subtitle}
                  </p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    {bundle.isSubscription ? (
                      <span className="font-number text-xl font-bold tabular-nums text-primary">
                        ₹{bundle.price}
                        <span className="font-sans text-xs font-medium text-on-surface-variant">
                          /month
                        </span>
                      </span>
                    ) : (
                      <>
                        <span className="font-number text-xl font-bold tabular-nums text-primary">
                          ₹{bundle.price}
                        </span>
                        <span className="font-number text-sm tabular-nums text-on-surface-variant line-through">
                          ₹{bundle.mrp}
                        </span>
                      </>
                    )}
                  </div>
                  {bundle.saveLabel ? (
                    <span className="mt-1 inline-block font-sans text-[10px] font-bold uppercase tracking-wide text-[#0D3B1F]">
                      {bundle.saveLabel}
                    </span>
                  ) : null}
                </div>

                <span
                  className={cn(
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selected
                      ? "border-[#0D3B1F] bg-[#0D3B1F] text-white"
                      : "border-[#c5c8bc] bg-white"
                  )}
                  aria-hidden
                >
                  {selected ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
