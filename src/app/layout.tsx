import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Royal Swag Lung Detox Tea | Ayurvedic Lung Cleanse — Free Delivery India",
  description: "7 Ayurvedic herbs — Vasaka, Tulsi, Mulethi & more. FSSAI certified. COD available. ₹349. Free delivery pan India.",
  openGraph: {
    title: "Royal Swag Lung Detox Tea",
    description: "7 Ayurvedic herbs for clean, healthy lungs.",
    url: "https://royalswag.in",
    siteName: "Royal Swag",
    images: [{ url: "/images/vasaka.webp", width: 1200, height: 630 }],
    type: "website",
  },
  metadataBase: new URL("https://royalswag.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ paddingTop: 68 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
