"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const loadingEl = (
  <div style={{ display: "flex", minHeight: "70svh", alignItems: "center", justifyContent: "center", background: "var(--rs-deep)", padding: "64px 16px" }}>
    <div style={{ width: 32, height: 32, borderRadius: "50%", border: "4px solid var(--rs-olive)", borderTopColor: "transparent" }} />
  </div>
);

const LungTestResultClient = dynamic(() => import("./LungTestResultClient"), {
  ssr: false,
  loading: () => loadingEl,
});

export default function LungTestResultGate() {
  return (
    <Suspense fallback={loadingEl}>
      <LungTestResultClient />
    </Suspense>
  );
}
