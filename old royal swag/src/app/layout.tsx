import type { Metadata } from "next";
import { Playfair_Display, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import StyledComponentsRegistry from "@/lib/registry";
import { SITE_ORIGIN } from "@/lib/config";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import LeadPopup from "@/components/LeadPopup";
import { Suspense } from "react";
import SiteTracker from "@/components/analytics/SiteTracker";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Royal Swag Lung Detox Tea | 7 Ayurvedic Herbs — Free Delivery India",
  description:
    "Cleanse your lungs with 7 Ayurvedic herbs. FSSAI certified. Progress Pack ₹599. From ₹349. Free delivery. COD available pan India.",
  metadataBase: new URL(SITE_ORIGIN),
  openGraph: {
    title: "Royal Swag Lung Detox Tea | 7 Ayurvedic Herbs — Free Delivery India",
    description:
      "Cleanse your lungs with 7 Ayurvedic herbs. FSSAI certified. Progress Pack ₹599. From ₹349. Free delivery. COD available pan India.",
    images: [
      {
        url: "/images/hero/asset1-hero-product.jpeg",
        width: 1200,
        height: 630,
        alt: "Royal Swag Lung Detox Tea",
      },
    ],
    url: SITE_ORIGIN,
    type: "website",
    siteName: "Royal Swag",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Swag Lung Detox Tea",
    description: "7 Ayurvedic herbs for clean healthy lungs. Progress Pack ₹599. Free delivery India.",
    images: ["/images/hero/asset1-hero-product.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${hanken.variable} overflow-x-hidden`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=shopping_bag"
        />
        <AnalyticsScripts />
      </head>
      <body
        className={`${playfair.variable} ${hanken.variable} ${hanken.className} overflow-x-hidden font-sans text-on-surface antialiased`}
      >
        <StyledComponentsRegistry>
          <Suspense fallback={null}>
            <AnalyticsProvider />
            <SiteTracker />
          </Suspense>
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <LeadPopup />
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
