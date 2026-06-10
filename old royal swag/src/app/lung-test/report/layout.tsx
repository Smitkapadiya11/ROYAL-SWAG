import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your Lung Health Report",
  description:
    "Your personalized Royal Swag lung health report with recommendations and herb highlights based on your quiz answers.",
};

export default function LungTestReportLayout({ children }: { children: ReactNode }) {
  return children;
}
