import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;

/** Server-only Supabase client (service role). Lazily initialized for build safety. */
export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  _admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _admin;
}

/** Safe variant for API routes — returns null when env is missing. */
export function tryGetSupabaseAdmin(): SupabaseClient | null {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}
