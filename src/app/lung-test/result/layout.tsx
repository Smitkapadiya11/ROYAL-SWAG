import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your Lung Health Results",
  description:
    "See your lung health risk level, personalized herb cards, and next steps from Royal Swag based on your answers.",
};

export default function LungTestResultLayout({ children }: { children: ReactNode }) {
  return children;
}
