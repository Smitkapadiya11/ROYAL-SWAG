import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = pageMetadata("/product", {
  title: "Buy Royal Swag Lung Detox Tea — Rs 649 | Free Delivery",
  description:
    "20, 40, or 60 tea bag packs. 100% Ayurvedic. Razorpay secure checkout. Ships in 24 hours.",
});

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
