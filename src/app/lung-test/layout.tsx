import { QuizProvider } from "@/store/quiz-store";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = pageMetadata("/lung-test", {
  title: "Free Lung Health Test — Royal Swag | 2 Minutes, Instant Results",
  description:
    "Take the free lung test to get your personalised lung health score and Ayurvedic recommendations.",
});

export default function LungTestLayout({ children }: { children: ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}
