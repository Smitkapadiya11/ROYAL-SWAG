import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Royal Swag",
  description:
    "Born in 2016, Royal Swag was created to bring Ayurvedic lung care to every Indian household. Our story, mission, and the team behind the tea.",
};
export default function AboutPage() {
  return <AboutContent />;
}
