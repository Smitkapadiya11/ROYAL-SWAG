import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_ORIGIN;
  const now = new Date();

  const paths = [
    "/",
    "/product",
    "/lung-test",
    "/reviews",
    "/about",
    "/privacy-policy",
    "/privacy",
    "/terms",
    "/refund-policy",
  ];

  return paths.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/product" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/product" ? 0.9 : 0.7,
  }));
}
