import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "@/lib/config";
import { getPrimaryProductPrice } from "@/lib/product-price";
import { ogImageAbsolute } from "@/lib/seo-metadata";

const price = getPrimaryProductPrice();
const title = `Royal Swag Lung Detox Tea — ₹${price} | 30 Ayurvedic Tea Bags`;
const description = `₹${price} · 7 Ayurvedic herbs for lung detox & clearer breathing. Tulsi, Vasaka, Mulethi, Pippali. FSSAI certified. Free delivery India.`;

export const revalidate = 60;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_ORIGIN}/product` },
  openGraph: {
    title,
    description,
    url: `${SITE_ORIGIN}/product`,
    type: "website",
    images: [{ url: ogImageAbsolute(), width: 1200, height: 630, alt: "Royal Swag Lung Detox Tea" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageAbsolute()],
  },
};

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
