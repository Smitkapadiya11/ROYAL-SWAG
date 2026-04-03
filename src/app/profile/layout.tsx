import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = pageMetadata("/profile", {
  title: "My Profile",
  description: "View your Royal Swag account details and lung health recommendations.",
});

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
