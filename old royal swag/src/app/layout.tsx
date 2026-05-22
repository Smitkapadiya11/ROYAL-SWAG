import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import StyledComponentsRegistry from "@/lib/registry";
import { SITE_ORIGIN } from "@/lib/config";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LeadPopup from "@/components/LeadPopup";

/** Fonts use stacks from globals.css (no next/font Google fetch — builds offline / behind strict firewalls). */

export const metadata: Metadata = {
  title: "Royal Swag Lung Detox Tea | 7 Ayurvedic Herbs — Free Delivery India",
  description:
    "Cleanse your lungs with 7 Ayurvedic herbs. FSSAI certified. ₹349. Free delivery. COD available pan India.",
  metadataBase: new URL(SITE_ORIGIN),
  openGraph: {
    title: "Royal Swag Lung Detox Tea | 7 Ayurvedic Herbs — Free Delivery India",
    description: "Cleanse your lungs with 7 Ayurvedic herbs. FSSAI certified. ₹349. Free delivery. COD available pan India.",
    images: [{ url: "/images/asset1-hero-product.jpg", width: 1200, height: 630, alt: "Royal Swag Lung Detox Tea" }],
    url: SITE_ORIGIN,
    type: "website",
    siteName: "Royal Swag",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Swag Lung Detox Tea",
    description: "7 Ayurvedic herbs for clean healthy lungs. ₹349. Free delivery India.",
    images: ["/images/asset1-hero-product.jpg"],
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
        <StyledComponentsRegistry>
          <Nav />
          <main className="rs-main-nav-pad">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <LeadPopup />
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
