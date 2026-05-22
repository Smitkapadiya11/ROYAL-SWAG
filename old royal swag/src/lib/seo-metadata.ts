import type { Metadata } from "next";
import { SITE_ORIGIN } from "@/lib/config";

const OG_IMAGE_PATH = "/images/product-1.jpg";

export function ogImageAbsolute(): string {
  return `${SITE_ORIGIN}${OG_IMAGE_PATH}`;
}

/** Shared Open Graph + Twitter fields for a route path (e.g. "/product"). */
export function socialMetadata(path: string): Pick<Metadata, "openGraph" | "twitter"> {
  const url = `${SITE_ORIGIN}${path === "/" ? "" : path}`;
  const image = ogImageAbsolute();
  return {
    openGraph: {
      url,
      type: "website",
      siteName: "Royal Swag",
      images: [{ url: image, width: 1200, height: 630, alt: "Royal Swag Lung Detox Tea" }],
    },
    twitter: {
      card: "summary_large_image",
      images: [image],
    },
  };
}

export function pageMetadata(
  path: string,
  opts: { title: string; description: string }
): Metadata {
  const social = socialMetadata(path);
  return {
    title: opts.title,
    description: opts.description,
    openGraph: {
      ...social.openGraph,
      title: opts.title,
      description: opts.description,
    },
    twitter: {
      ...social.twitter,
      title: opts.title,
      description: opts.description,
    },
  };
}
