import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";

export const metadata: Metadata = {
  title: "Royal Swag Lung Detox Tea | 7 Ayurvedic Herbs — Free Delivery India",
  description: "Cleanse your lungs with Royal Swag — 7 Ayurvedic herbs, FSSAI certified, COD available. ₹349 only. Free delivery pan India.",
  metadataBase: new URL("https://royalswag.in"),
  openGraph: {
    title: "Royal Swag Lung Detox Tea",
    description: "7 Ayurvedic herbs for clean, healthy lungs. ₹349.",
    images: [{ url: "/images/product/product-2.jpg" }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main style={{ paddingTop: 64 }}>{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
