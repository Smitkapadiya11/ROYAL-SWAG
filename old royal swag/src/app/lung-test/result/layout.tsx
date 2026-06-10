import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "@/lib/config";

export const metadata: Metadata = {
  title: "Your Lung Health Results — Royal Swag",
  description:
    "See your lung health risk level, personalised herb cards, and next steps from Royal Swag based on your answers.",
  alternates: { canonical: `${SITE_ORIGIN}/lung-test/result` },
};

export default function LungTestResultLayout({ children }: { children: ReactNode }) {
  return children;
}
