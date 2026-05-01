import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LeadCaptureProvider from "@/components/LeadCaptureProvider";
import { SITE_ORIGIN } from "@/lib/config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" className={`${playfair.variable} ${inter.variable} overflow-x-hidden`}>
      <body className="overflow-x-hidden">
        <LeadCaptureProvider>
          <Nav />
          <main className="rs-main-nav-pad">{children}</main>
          <Footer />
        </LeadCaptureProvider>
      </body>
    </html>
  );
}
