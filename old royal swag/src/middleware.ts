import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_ENTRY_COOKIE,
  getAdminSecretPath,
} from "@/lib/admin/secret-path";

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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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
