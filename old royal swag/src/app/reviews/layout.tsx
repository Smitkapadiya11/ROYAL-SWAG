import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "@/lib/config";

export const metadata: Metadata = {
  title: "Customer Reviews — Royal Swag | 847+ Verified Buyers | 4.7★",
  description:
    "Real results from Delhi, Mumbai, Surat, Bengaluru. 4.7 stars from 847+ Amazon verified reviews.",
  alternates: { canonical: `${SITE_ORIGIN}/reviews` },
};

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return children;
}
