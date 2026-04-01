import { QuizProvider } from "@/store/quiz-store";
import type { ReactNode } from "react";

// This layout wraps both /lung-test and /lung-test/report with QuizProvider.
// Note: Navbar and Footer from root layout will still show.
// The quiz page itself hides Navbar visually using pt padding.
export default function LungTestLayout({ children }: { children: ReactNode }) {
  return <QuizProvider>{children}</QuizProvider>;
}
