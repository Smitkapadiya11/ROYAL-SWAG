import { NextRequest, NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";
import { isAdminAuthorized } from "@/lib/admin/session";

export function requireDashboardAuth(req: NextRequest): NextResponse | null {
  if (isDashboardAuthenticated(req)) {
    return null;
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Accept legacy dashboard cookie or Supabase /admin session. */
export async function requireDashboardAuthAsync(
  req: NextRequest
): Promise<NextResponse | null> {
  if (isDashboardAuthenticated(req)) {
    return null;
  }
  if (await isAdminAuthorized(req)) {
    return null;
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
