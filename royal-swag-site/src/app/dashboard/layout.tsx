import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Swag Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return <div className="dashboard-root">{children}</div>;
}
