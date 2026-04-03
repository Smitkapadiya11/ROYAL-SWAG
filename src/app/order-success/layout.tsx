import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your Royal Swag order. You will receive confirmation and shipping updates shortly.",
};

export default function OrderSuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
