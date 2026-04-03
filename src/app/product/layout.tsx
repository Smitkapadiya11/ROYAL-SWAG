import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Herbal Lung Detox Tea — Buy",
  description:
    "Royal Swag Ayurvedic lung detox tea with Tulsi, Vasaka & Mulethi. Choose your pack, secure checkout with Razorpay, pan-India delivery.",
};

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
