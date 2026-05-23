/** Secret URL gate for admin (server-only — never expose in client bundles). */

export const ADMIN_ENTRY_COOKIE = "rs_admin_entry";

export function getAdminSecretPath(): string | null {
  const raw = process.env.ADMIN_SECRET_PATH?.trim();
  if (!raw) return null;
  return raw.replace(/^\/+|\/+$/g, "");
}

export function isAdminSecretPath(segment: string): boolean {
  const secret = getAdminSecretPath();
  if (!secret) return false;
  return segment === secret;
}

export function adminSecretPathname(): string | null {
  const secret = getAdminSecretPath();
  return secret ? `/${secret}` : null;
}
