import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("rs_admin_token")?.value;
  if (token) {
    await db.adminSession.deleteMany({ where: { token } }).catch(() => {});
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("rs_admin_token");
  return res;
}
