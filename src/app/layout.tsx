import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import LocationOrderTicker from "@/components/conversion/LocationOrderTicker";
import ConversionShell from "@/components/conversion/ConversionShell";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Royal Swag Lung Detox Tea | Ayurvedic Lung Cleanse — Free Delivery India",
    template: "%s | Royal Swag",
  },
  description:
    "Cleanse your lungs naturally with Royal Swag Lung Detox Tea — 7 Ayurvedic herbs including Vasaka & Tulsi. FSSAI certified. COD available. ₹349 only. Order now.",
  keywords: [
    "lung detox tea india",
    "ayurvedic lung cleanse",
    "vasaka tulsi tea",
    "lung health tea",
    "herbal tea for smokers lungs",
    "royal swag",
    "ayurvedic tea",
    "respiratory health",
  ],
  openGraph: {
    title: "Royal Swag Lung Detox Tea | Ayurvedic Lung Cleanse",
    description: "7 Ayurvedic herbs. FSSAI certified. Free delivery. COD available. ₹349 only.",
    url: "https://royalswag.in",
    siteName: "Royal Swag",
    images: [{
      url:    "/images/product/product-1.jpg",
      width:  1200,
      height: 630,
      alt:    "Royal Swag Lung Detox Tea 20 tea bags Ayurvedic herbal",
    }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Swag Lung Detox Tea",
    description: "7 Ayurvedic herbs for clean, healthy lungs. Free delivery. COD.",
  },
  alternates: { canonical: "https://royalswag.in" },
  metadataBase: new URL("https://royalswag.in"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geist.variable,
        geistMono.variable,
        playfair.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ScrollProgress />
        <WhatsAppButton />
        <Navbar />
        {/* ── Trust strip ── */}
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            zIndex: 49,
            background: "var(--brand-dark)",
            overflow: "hidden",
            padding: "7px 0",
            whiteSpace: "nowrap",
          }}
          className="min-[769px]:top-[70px]"
        >
          <div style={{ display: "inline-block", animation: "marquee 35s linear infinite" }}>
            {"🌿 FSSAI Certified  │  ⭐ 4.7/5 Rating  │  🚚 Free Delivery Pan India  │  💰 COD Available  │  🔄 30-Day Money Back  │  🏆 AYUSH Certified Unit  │  📺 Featured on Amazon Prime & Netflix  │  ".repeat(4)}
          </div>
        </div>
        <main className="flex-1 pt-[92px] min-[769px]:pt-[104px]">{children}</main>
        <LocationOrderTicker />
        <Footer />
        <ConversionShell />
      </body>
    </html>
  );
}
