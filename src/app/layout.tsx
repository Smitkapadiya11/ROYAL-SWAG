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
    default: "Royal Swag — Herbal Lung Detox Tea",
    template: "%s | Royal Swag",
  },
  description:
    "Premium Ayurvedic lung detox tea crafted from Tulsi, Vasaka & Mulethi. Breathe clean, live free. Trusted by 2,400+ customers across India.",
  keywords: [
    "lung detox tea",
    "herbal tea India",
    "ayurvedic tea",
    "respiratory health",
    "tulsi tea",
    "mulethi",
    "vasaka",
    "royal swag",
  ],
  openGraph: {
    title: "Royal Swag — Herbal Lung Detox Tea",
    description: "Ancient Ayurvedic wisdom, brewed for modern lungs.",
    url: "https://www.royalswag.in",
    siteName: "Royal Swag",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Swag — Herbal Lung Detox Tea",
    description: "Breathe Clean. Live Free.",
  },
  metadataBase: new URL("https://www.royalswag.in"),
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
        <main className="flex-1">{children}</main>
        <LocationOrderTicker />
        <Footer />
        <ConversionShell />
      </body>
    </html>
  );
}
