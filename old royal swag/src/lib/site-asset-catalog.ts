/** Curated live-site assets under /public — safe to pick in admin media UI. */
export type SiteAsset = {
  url: string;
  name: string;
  kind: "image" | "video";
  category: string;
};

export const SITE_IMAGE_ASSETS: SiteAsset[] = [
  { url: "/images/hero/asset1-hero-product.webp", name: "Hero product", kind: "image", category: "Hero" },
  { url: "/images/hero/asset2.jpeg", name: "Hero lifestyle", kind: "image", category: "Hero" },
  { url: "/images/lungtest.webp", name: "Lung test", kind: "image", category: "Marketing" },
  { url: "/images/lungs-before.webp", name: "Lungs before", kind: "image", category: "Marketing" },
  { url: "/images/lungs-after.webp", name: "Lungs after", kind: "image", category: "Marketing" },
  { url: "/images/product/product-1.webp", name: "Product 1", kind: "image", category: "Product" },
  { url: "/images/product/product-4.webp", name: "Product 4", kind: "image", category: "Product" },
  { url: "/images/product/product-7.webp", name: "Product 7", kind: "image", category: "Product" },
  { url: "/images/product/product-10.webp", name: "Product 10", kind: "image", category: "Product" },
  { url: "/images/product/product-11.webp", name: "Product 11", kind: "image", category: "Product" },
  { url: "/images/herbs/tulsi.webp", name: "Tulsi", kind: "image", category: "Herbs" },
  { url: "/images/herbs/vasaka.webp", name: "Vasaka", kind: "image", category: "Herbs" },
  { url: "/images/herbs/mulethi.webp", name: "Mulethi", kind: "image", category: "Herbs" },
  { url: "/images/herbs/pippali.webp", name: "Pippali", kind: "image", category: "Herbs" },
  { url: "/images/herbs/pushkarmool.webp", name: "Pushkarmool", kind: "image", category: "Herbs" },
  { url: "/images/herbs/kantakari.webp", name: "Kantakari", kind: "image", category: "Herbs" },
  { url: "/images/hitesh.jpeg", name: "Hitesh", kind: "image", category: "Team" },
  { url: "/images/manoj.jpeg", name: "Manoj", kind: "image", category: "Team" },
  { url: "/images/jaideep singh.jpeg", name: "Jaideep Singh", kind: "image", category: "Team" },
  { url: "/images/royal-swag-logo.png", name: "Logo", kind: "image", category: "Brand" },
];

export const SITE_VIDEO_ASSETS: SiteAsset[] = [
  { url: "/videos/doctor1.mp4", name: "Dr. Rajesh Sharma", kind: "video", category: "Doctors" },
  { url: "/videos/doctor2.mp4", name: "Dr. Priya Mehta", kind: "video", category: "Doctors" },
  { url: "/videos/doctor3.mp4", name: "Dr. Vikram Patel", kind: "video", category: "Doctors" },
];

export const ALL_SITE_ASSETS = [...SITE_IMAGE_ASSETS, ...SITE_VIDEO_ASSETS];

export function filterSiteAssets(kind?: "image" | "video" | "all") {
  if (!kind || kind === "all") return ALL_SITE_ASSETS;
  return ALL_SITE_ASSETS.filter((a) => a.kind === kind);
}
