import { QuizProvider } from "@/store/quiz-store";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free Lung Health Test",
  description:
    "Answer a few questions about your breathing and habits. Get a personalized risk snapshot and herb recommendations from Royal Swag.",
};

// Wraps /lung-test, /lung-test/report, and /lung-test/result with QuizProvider.
export default function LungTestLayout({ children }: { children: ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}
