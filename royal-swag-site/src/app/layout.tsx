import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import StyledComponentsRegistry from "@/lib/registry";
import { SITE_ORIGIN } from "@/lib/config";
import PageTransition from "@/components/layout/PageTransition";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import LeadCapturePopup from "@/components/ui/LeadCapturePopup";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { Suspense } from "react";
import SiteTracker from "@/components/analytics/SiteTracker";
import TrackingProvider from "@/components/analytics/TrackingProvider";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { CheckoutUiProvider } from "@/contexts/CheckoutUiContext";
import { ConversionBarProvider } from "@/contexts/ConversionBarContext";
import MobileStickyBarHost from "@/components/conversion/MobileStickyBarHost";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Royal Swag Lung Detox Tea | 7 Ayurvedic Herbs — Free Delivery India",
  description:
    "Cleanse your lungs with 7 Ayurvedic herbs. FSSAI certified. From ₹349. Free delivery. COD available pan India.",
  metadataBase: new URL(SITE_ORIGIN),
  openGraph: {
    title: "Royal Swag Lung Detox Tea | 7 Ayurvedic Herbs — Free Delivery India",
    description:
      "Cleanse your lungs with 7 Ayurvedic herbs. FSSAI certified. From ₹349. Free delivery. COD available pan India.",
    images: [
      {
        url: "/images/hero/asset1-hero-product.webp",
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
    description: "7 Ayurvedic herbs for clean healthy lungs. From ₹349. Free delivery India.",
    images: ["/images/hero/asset1-hero-product.webp"],
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
      className={`${playfair.variable} ${inter.variable} overflow-x-hidden`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=shopping_bag"
        />
        <AnalyticsScripts />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${inter.className} overflow-x-hidden font-sans text-on-surface antialiased`}
      >
        <OrganizationSchema />
        <StyledComponentsRegistry>
          <LocaleProvider>
          <CheckoutUiProvider>
          <ConversionBarProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider />
            <SiteTracker />
            <TrackingProvider />
          </Suspense>
          <AnnouncementBar />
          <Header />
          <main className="w-full min-w-0 overflow-x-hidden">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppFloat />
          <MobileStickyBarHost />
          <LeadCapturePopup />
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
          </ConversionBarProvider>
          </CheckoutUiProvider>
          </LocaleProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
