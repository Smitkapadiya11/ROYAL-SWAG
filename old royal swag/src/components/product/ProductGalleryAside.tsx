"use client";

import Link from "next/link";
import type { ProductBundleOption } from "@/lib/bundle-options";

type Spec = { label: string; value: string };
type BoxItem = { icon: string; label: string; detail: string };

type ProductGalleryAsideProps = {
  specs: readonly Spec[];
  boxItems: readonly BoxItem[];
  selectedBundle: ProductBundleOption;
  benefits?: readonly { label: string }[];
};

const EXTRA_SPECS = [
  { label: "Made in", value: "Surat, Gujarat · India" },
  { label: "Daily use", value: "1 cup every morning · 3–5 min brew" },
] as const;

export function ProductGalleryAside({
  specs,
  boxItems,
  selectedBundle,
  benefits = [
    { label: "Reduces Inflammation" },
    { label: "Clears Airways" },
    { label: "Boosts Immunity" },
  ],
}: ProductGalleryAsideProps) {
  const allSpecs = [...specs, ...EXTRA_SPECS];

  return (
    <div className="flex flex-col gap-3">
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-display text-base font-bold text-primary">
          Product Details
        </h3>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
          {allSpecs.map((spec) => (
            <div key={spec.label} className="min-w-0">
              <dt className="font-sans text-[9px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {spec.label}
              </dt>
              <dd className="mt-0.5 font-sans text-xs leading-snug text-on-surface">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap gap-2">
        {benefits.map((b) => (
          <span
            key={b.label}
            className="glass-card inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-sans text-[11px] font-medium text-primary"
          >
            <span className="text-ayurvedic-gold">✦</span>
            {b.label}
          </span>
        ))}
      </div>

      <div className="glass-card rounded-xl p-4">
        <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-ayurvedic-gold">
          In every {selectedBundle.title.toLowerCase()}
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {boxItems.map((item) => (
            <li key={item.label} className="flex items-start gap-2">
              <span className="shrink-0 text-sm">{item.icon}</span>
              <span className="min-w-0 font-sans text-xs leading-snug text-on-surface">
                <strong className="font-semibold text-primary">{item.label}</strong>
                <span className="text-on-surface-variant"> — {item.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="glass-card flex items-center gap-2 rounded-lg px-3 py-2">
          <span className="text-base">🚚</span>
          <span className="font-sans text-[11px] font-medium text-primary">
            Free delivery
          </span>
        </div>
        <div className="glass-card flex items-center gap-2 rounded-lg px-3 py-2">
          <span className="text-base">🛡</span>
          <span className="font-sans text-[11px] font-medium text-primary">
            30-day guarantee
          </span>
        </div>
      </div>

      <Link
        href="/lung-test"
        className="flex items-center justify-between rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 transition hover:bg-primary/10"
      >
        <span className="flex items-center gap-2 font-sans text-sm font-semibold text-primary">
          <span aria-hidden>🫁</span>
          Free Lung Test
        </span>
        <span className="font-sans text-xs text-ayurvedic-gold">2 min →</span>
      </Link>
    </div>
  );
}
