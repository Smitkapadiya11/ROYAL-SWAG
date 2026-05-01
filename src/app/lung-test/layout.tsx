import { QuizProvider } from "@/store/quiz-store";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "@/lib/config";

export const metadata: Metadata = {
  title: "Free Lung Health Test — Royal Swag | 2 Minutes, Instant Results",
  description:
    "Take the free lung test. Get your personalised lung health score and Ayurvedic recommendations in 2 minutes.",
  alternates: { canonical: `${SITE_ORIGIN}/lung-test` },
};

export default function LungTestLayout({ children }: { children: ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}
