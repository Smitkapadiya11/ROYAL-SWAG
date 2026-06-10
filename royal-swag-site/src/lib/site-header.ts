/** Routes where the global marketing header is fully hidden. */
export function isHeaderHiddenPath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard")
  );
}

/** Minimal logo-only header (post-checkout). */
export function isMinimalHeaderPath(pathname: string): boolean {
  return (
    pathname === "/order-success" ||
    pathname === "/checkout/success"
  );
}

function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(hi|en)(?=\/|$)/, "") || "/";
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  const path = stripLocale(pathname);
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

export const MAIN_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/lung-test", label: "Lung Test" },
  { href: "/product", label: "Shop" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
] as const;
