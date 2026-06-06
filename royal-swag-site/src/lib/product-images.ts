/** Unique gallery assets under `public/images/product/` (no duplicates, no missing files). */
export const PRODUCT_GALLERY = [
  "/images/product/product-1.jpg",
  "/images/product/product-4.jpg",
  "/images/product/product-5.jpg",
  "/images/product/product-7.jpg",
  "/images/product/product-8.jpg",
  "/images/product/product-10.jpg",
  "/images/product/product-11.jpg",
  "/images/product/product-13.jpg",
] as const;

export const MAIN_PRODUCT_IMAGE = PRODUCT_GALLERY[0];
