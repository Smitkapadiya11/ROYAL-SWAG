import { Suspense } from "react";
import type { Metadata } from "next";
import ReferPageClient from "./ReferPageClient";

export const metadata: Metadata = {
  title: "Refer a Friend | Royal Swag",
  description: "Earn ₹100 for every friend who orders Royal Swag Lung Detox Tea.",
  robots: { index: false, follow: false },
};

export default function ReferPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center font-body text-on-surface-variant">
          Loading…
        </div>
      }
    >
      <ReferPageClient />
    </Suspense>
  );
}
