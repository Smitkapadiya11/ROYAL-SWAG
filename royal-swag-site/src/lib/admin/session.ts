import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { Session } from "@supabase/supabase-js";
import { isAdminRequest } from "@/lib/admin-auth";

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("MISSING ENV:", { url: !!url, key: !!key });
    throw new Error("Supabase admin credentials missing");
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getAdminAllowlist(): string[] {
  const raw =
    process.env.ADMIN_ALLOWED_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    "admin@eximburginternational.in";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return getAdminAllowlist().includes(email.trim().toLowerCase());
}

export async function getAdminSession(): Promise<Session | null> {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.email) return null;
    if (!isAllowedAdminEmail(session.user.email)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSessionRoute(): Promise<Session | null> {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.email) return null;
    if (!isAllowedAdminEmail(session.user.email)) return null;
    return session;
  } catch {
    return null;
  }
}

/** Accept Supabase admin session or legacy admin_token cookie. */
export async function isAdminAuthorized(req: NextRequest): Promise<boolean> {
  if (isAdminRequest(req)) return true;
  const session = await getAdminSessionRoute();
  return session !== null;
}
