import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = pageMetadata("/lung-test/result", {
  title: "Your Lung Health Results",
  description:
    "See your lung health risk level, personalised herb cards, and next steps from Royal Swag based on your answers.",
});

export default function LungTestResultLayout({ children }: { children: ReactNode }) {
  return children;
}
