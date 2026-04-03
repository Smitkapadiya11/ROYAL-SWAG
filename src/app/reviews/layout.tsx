import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = pageMetadata("/reviews", {
  title: "Customer Reviews — Royal Swag | 2,400+ Verified Buyers",
  description:
    "Real results from Delhi, Mumbai, Surat, Bengaluru and across India. 4.8 stars from 2,400+ reviews.",
});

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
