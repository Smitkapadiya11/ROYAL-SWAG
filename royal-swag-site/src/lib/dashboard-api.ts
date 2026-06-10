import { NextRequest, NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";

export function requireDashboardAuth(req: NextRequest): NextResponse | null {
  if (!isDashboardAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
