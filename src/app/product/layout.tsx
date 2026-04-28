import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Buy Royal Swag Lung Detox Tea — ₹349 | Free Delivery | COD Available",
  description:
    "20 tea bags. 7 Ayurvedic herbs. FSSAI certified. Razorpay secure checkout. Ships in 24 hours. COD available across India.",
  alternates: { canonical: "https://royalswag.in/product" },
};

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
