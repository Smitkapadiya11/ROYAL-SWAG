import { redirect } from "next/navigation";

/** Canonical privacy policy lives at /privacy */
export default function PrivacyPolicyRedirect() {
  redirect("/privacy");
}
