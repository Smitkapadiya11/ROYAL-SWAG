import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/profile") && !session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/admin/login")
  ) {
    const adminEmail = "admin@eximburginternational.in";
    if (session?.user?.email === adminEmail) {
      return res;
    }
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
