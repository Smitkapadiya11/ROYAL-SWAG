import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your Royal Swag account details and lung health recommendations.",
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
