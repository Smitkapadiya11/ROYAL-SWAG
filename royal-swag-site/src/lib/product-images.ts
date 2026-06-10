/** Combo pack renders (reference: productPricing.ts / public/images/combos/) */
function comboImage(filename: string) {
  return `/images/combos/${encodeURIComponent(filename)}`;
}

export const COMBO_PACK_IMAGES = {
  single: comboImage("1 product-13.jpg_202605240444.webp"),
  double: comboImage("2 product_render_202605240445.webp"),
  triple: comboImage("3 product 202605240445.webp"),
} as const;

export type ComboPackId = keyof typeof COMBO_PACK_IMAGES;

export const BUNDLE_COMBO_IMAGE: Record<string, string> = {
  single: COMBO_PACK_IMAGES.single,
  double: COMBO_PACK_IMAGES.double,
  triple: COMBO_PACK_IMAGES.triple,
  subscribe: COMBO_PACK_IMAGES.single,
};

/** Gallery: combo packs first, then product detail shots */
export const PRODUCT_GALLERY = [
  COMBO_PACK_IMAGES.single,
  COMBO_PACK_IMAGES.double,
  COMBO_PACK_IMAGES.triple,
  "/images/product/product-1.webp",
  "/images/product/product-4.webp",
  "/images/product/product-5.webp",
  "/images/product/product-7.webp",
  "/images/product/product-8.webp",
] as const;

export const PRODUCT_IMAGE_ALT =
  "Royal Swag Lung Detox Tea — Ayurvedic lung cleanse tea packaging";

export const MAIN_PRODUCT_IMAGE = COMBO_PACK_IMAGES.double;
