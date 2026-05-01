import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { username?: unknown; password?: unknown };
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";

    const envUser = (process.env.ADMIN_USERNAME ?? "").trim();
    const envHash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim();

    const validUser = username === envUser;
    const passHash = crypto.createHash("sha256").update(password).digest("hex");
    const validPass = passHash === envHash;

    if (!validUser || !validPass) {
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = crypto.randomBytes(48).toString("hex");
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

    await db.adminSession.create({ data: { token, expiresAt } });

    const res = NextResponse.json({ ok: true });
    // path "/" so /api/admin/* receives the cookie (dashboard fetch calls APIs at root path).
    res.cookies.set("rs_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("[admin/login]", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
