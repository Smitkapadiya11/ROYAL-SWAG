"use client";

import dynamic from "next/dynamic";

const LungTestResultClient = dynamic(() => import("./LungTestResultClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[70svh] items-center justify-center bg-[#061408] px-4 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#16a34a] border-t-transparent" />
    </div>
  ),
});

export default function LungTestResultGate() {
  return <LungTestResultClient />;
}
