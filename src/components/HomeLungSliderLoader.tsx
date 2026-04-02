"use client";

import dynamic from "next/dynamic";

const LungSlider = dynamic(
  () => import("@/components/LungSlider"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full items-center justify-center bg-[#0a1a0a]">
        <p className="animate-pulse text-sm text-green-400">Loading Lung Comparison...</p>
      </div>
    ),
  }
);

export default function HomeLungSliderLoader() {
  return <LungSlider />;
}
