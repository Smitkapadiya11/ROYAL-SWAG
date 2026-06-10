import { NextRequest, NextResponse } from "next/server";
import {
  applyFailedLoginCookies,
  clearDashboardAuthCookie,
  setDashboardAuthCookie,
  verifyDashboardPassword,
} from "@/lib/dashboard-auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { password?: string };
    const password = body.password ?? "";
    const result = verifyDashboardPassword(password, req);

    if (!result.ok) {
      const res = NextResponse.json(
        { error: result.error, lockedUntil: result.lockedUntil },
        { status: result.lockedUntil ? 429 : 401 }
      );
      if (!result.lockedUntil) {
        applyFailedLoginCookies(res, req);
      }
      return res;
    }

    const res = NextResponse.json({ success: true });
    setDashboardAuthCookie(res);
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  clearDashboardAuthCookie(res);
  return res;
}
