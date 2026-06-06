import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Royal Swag account to view orders and profile.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
