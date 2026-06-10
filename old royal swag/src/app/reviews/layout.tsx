import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "@/lib/config";

export const metadata: Metadata = {
  title: "2,400+ Customers — Royal Swag Reviews",
  description:
    "Real results from Delhi, Mumbai, Surat, Bengaluru. 4.8 stars from 2,400+ verified customers.",
  alternates: { canonical: `${SITE_ORIGIN}/reviews` },
  openGraph: {
    title: "2,400+ Customers — Royal Swag Reviews",
    description: "Verified buyer stories. Lung detox tea that actually works.",
    url: `${SITE_ORIGIN}/reviews`,
  },
};

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
