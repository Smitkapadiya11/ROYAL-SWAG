import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_ORIGIN } from "@/lib/config";

/** Fonts use stacks from globals.css (no next/font Google fetch — builds offline / behind strict firewalls). */

export const metadata: Metadata = {
  title: "Royal Swag Lung Detox Tea | 7 Ayurvedic Herbs — Free Delivery India",
  description:
    "Cleanse your lungs with 7 Ayurvedic herbs. FSSAI certified. ₹349. Free delivery. COD available pan India.",
  metadataBase: new URL(SITE_ORIGIN),
  openGraph: {
    title: "Royal Swag Lung Detox Tea",
    description: "7 Ayurvedic herbs for clean healthy lungs. ₹349.",
    images: [{ url: "/images/product-2.jpg" }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <Nav />
        <main className="rs-main-nav-pad">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
