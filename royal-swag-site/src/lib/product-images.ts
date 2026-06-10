/** Combo pack renders in public/images/combos/ — paths URL-encoded for spaces */
function comboImage(filename: string) {
  return `/images/combos/${encodeURIComponent(filename)}`;
}

export const COMBO_PACK_IMAGES = {
  single: comboImage("1 product-13.jpg_202605240444.webp"),
  double: comboImage("2 product_render_202605240445.webp"),
  triple: comboImage("3 product 202605240445.webp"),
} as const;

export type ComboPackId = keyof typeof COMBO_PACK_IMAGES;

/** Main gallery image when a pack is selected (not shown in bundle selector) */
export const BUNDLE_GALLERY_IMAGE: Record<string, string> = {
  single: COMBO_PACK_IMAGES.single,
  double: COMBO_PACK_IMAGES.double,
  triple: COMBO_PACK_IMAGES.triple,
  subscribe: COMBO_PACK_IMAGES.single,
};

/** Detail / lifestyle shots only — shown in thumbnail strip */
export const PRODUCT_DETAIL_GALLERY = [
  "/images/product/product-1.webp",
  "/images/product/product-4.webp",
  "/images/product/product-5.webp",
  "/images/product/product-7.webp",
  "/images/product/product-8.webp",
  "/images/product/product-10.webp",
  "/images/product/product-11.webp",
  "/images/product/product-13.webp",
] as const;

/** All images for SEO schema (combos + detail) */
export const PRODUCT_GALLERY = [
  ...Object.values(COMBO_PACK_IMAGES),
  ...PRODUCT_DETAIL_GALLERY,
] as const;

export const PRODUCT_IMAGE_ALT =
  "Royal Swag Lung Detox Tea — Ayurvedic lung cleanse tea packaging";

export const MAIN_PRODUCT_IMAGE = COMBO_PACK_IMAGES.double;

export function productImageSrc(path: string): string {
  if (!path.includes(" ")) return path;
  return path
    .split("/")
    .map((segment) => (segment.includes(" ") ? encodeURIComponent(segment) : segment))
    .join("/");
}

export function isComboImagePath(path: string): boolean {
  return path.includes("/images/combos/");
}
