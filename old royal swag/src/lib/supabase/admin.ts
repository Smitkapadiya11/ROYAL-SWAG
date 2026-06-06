import { getSupabaseAdmin } from "@/lib/admin/session";

export { getSupabaseAdmin };

/** Returns null when Supabase admin env vars are missing. */
export function tryGetSupabaseAdmin() {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}
