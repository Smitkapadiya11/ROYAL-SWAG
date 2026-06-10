import { QuizProvider } from "@/store/quiz-store";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "@/lib/config";

export const metadata: Metadata = {
  title: "Free Lung Health Test — Know Your Risk in 60 Seconds",
  description:
    "Take the free lung test. Get your personalised lung health score and Ayurvedic herb recommendations in under a minute.",
  alternates: { canonical: `${SITE_ORIGIN}/lung-test` },
  openGraph: {
    title: "Free Lung Health Test — Know Your Risk in 60 Seconds",
    description:
      "7 quick symptom questions. Instant risk score and personalised herb match from Royal Swag.",
    url: `${SITE_ORIGIN}/lung-test`,
  },
};

export default function LungTestLayout({ children }: { children: ReactNode }) {
  return (
    <QuizProvider>{children}</QuizProvider>
  );
}
