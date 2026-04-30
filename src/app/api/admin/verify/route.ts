import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("rs_admin_token")?.value;
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const session = await db.adminSession.findUnique({ where: { token } }).catch(() => null);
  if (!session || session.expiresAt < new Date()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
