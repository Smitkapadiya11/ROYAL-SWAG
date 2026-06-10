import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_ENTRY_COOKIE,
  getAdminSecretPath,
} from "@/lib/admin/secret-path";
import {
  DASHBOARD_AUTH_COOKIE,
  verifyDashboardSessionToken,
} from "@/lib/dashboard-auth";
import { applyCorsHeaders, validateApiRequest } from "@/lib/api-security";

function isAllowedAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const raw =
    process.env.ADMIN_ALLOWED_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    "admin@eximburginternational.in";
  const list = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.trim().toLowerCase());
}

function hideAsNotFound(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/404";
  return NextResponse.rewrite(url);
}

function pathnameIsSecret(pathname: string): boolean {
  const secret = getAdminSecretPath();
  if (!secret) return false;
  return pathname === `/${secret}` || pathname === `/${secret}/`;
}

const LOCALE_PREFIX = /^\/(hi|en)(\/.*)?$/;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const localeMatch = pathname.match(LOCALE_PREFIX);
  if (localeMatch) {
    const locale = localeMatch[1];
    const rest = localeMatch[2] || "/";
    const url = req.nextUrl.clone();
    url.pathname = rest === "" ? "/" : rest;
    const res = NextResponse.rewrite(url);
    res.cookies.set("rs_locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  if (pathname.startsWith("/api/")) {
    const apiError = validateApiRequest(req);
    if (apiError) {
      return applyCorsHeaders(req, apiError);
    }
    const res = NextResponse.next();
    return applyCorsHeaders(req, res);
  }

  const res = NextResponse.next();

  if (pathnameIsSecret(pathname)) {
    const allow = NextResponse.next();
    allow.cookies.set(ADMIN_ENTRY_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
    return allow;
  }

  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(DASHBOARD_AUTH_COOKIE)?.value;
    const authed = verifyDashboardSessionToken(token);

    if (pathname === "/dashboard/login" || pathname === "/dashboard/login/") {
      if (authed) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return res;
    }

    if (!authed) {
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }

    return res;
  }

  if (pathname.startsWith("/admin")) {
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const email = session?.user?.email;
    const hasValidSession =
      Boolean(email) && isAllowedAdminEmail(email);

    const hasEntryCookie =
      req.cookies.get(ADMIN_ENTRY_COOKIE)?.value === "1";

    if (pathname === "/admin/login") {
      if (hasValidSession) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      if (hasEntryCookie) {
        return res;
      }

      const referer = req.headers.get("referer") ?? "";
      const secret = getAdminSecretPath();
      if (secret && referer.includes(`/${secret}`)) {
        const allow = NextResponse.next();
        allow.cookies.set(ADMIN_ENTRY_COOKIE, "1", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60,
          path: "/",
        });
        return allow;
      }

      return hideAsNotFound(req);
    }

    if (hasValidSession) {
      return res;
    }

    return hideAsNotFound(req);
  }

  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|videos|assets).*)"],
};
