/** Pure helper — safe for Server and Client Components (not a React hook). */
export function isProductPath(href: string): boolean {
  return href === "/product" || href.startsWith("/product/") || href.startsWith("/product?");
}
