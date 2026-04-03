import AboutContent from "./AboutContent";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata = pageMetadata("/about", {
  title: "About Royal Swag | Our Story, Mission & Team",
  description:
    "Born in Surat in 2016, Royal Swag was founded to help India breathe better with proven Ayurvedic herbs.",
});
export default function AboutPage() {
  return <AboutContent />;
}
