/** Prefer WebP sibling paths (originals kept in /public for fallback). */
export function toWebp(src: string): string {
  if (/\.(webp|svg|gif|mp4)$/i.test(src)) return src;
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}

export const HERO_PRODUCT_IMAGE = "/images/hero/asset1-hero-product.webp";

export const HERO_PRODUCT_ALT =
  "Royal Swag Lung Detox Tea — Tar Out packaging with seven Ayurvedic herbs";

export const LUNG_TEST_INTRO_IMAGE = "/images/lungtest.webp";

export const LUNG_TEST_INTRO_ALT =
  "Royal Swag free lung health assessment — breathe test preview";
