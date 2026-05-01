import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Trims and strips wrapping quotes (common when pasting into Vercel / .env). */
function envPlain(raw: string | undefined): string {
  let s = (raw ?? "").trim().replace(/^\uFEFF/, "");
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { username?: unknown; password?: unknown };
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";

    const envUser = envPlain(process.env.ADMIN_USERNAME);
    const envHash = envPlain(process.env.ADMIN_PASSWORD_HASH).toLowerCase();
    const envPasswordPlain = envPlain(process.env.ADMIN_PASSWORD);
    const plainPasswords = envPasswordPlain
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const authConfigured =
      envUser.length > 0 && (envHash.length > 0 || plainPasswords.length > 0);

    if (!authConfigured) {
      console.error(
        "[admin/login] Missing env: set ADMIN_USERNAME and ADMIN_PASSWORD_HASH or ADMIN_PASSWORD (e.g. on Vercel → Settings → Environment Variables)."
      );
      return NextResponse.json(
        {
          error:
            "Admin login is not configured on this server. In Vercel add ADMIN_USERNAME, ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH), DATABASE_URL, then redeploy.",
        },
        { status: 503 }
      );
    }

    const validUser = username.toLowerCase() === envUser.toLowerCase();
    const passHash = crypto.createHash("sha256").update(password).digest("hex").toLowerCase();
    const validPass =
      (envHash.length > 0 && passHash === envHash) ||
      plainPasswords.some((p) => password === p);

    if (!validUser || !validPass) {
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const dbUrl = envPlain(process.env.DATABASE_URL);
    if (!dbUrl) {
      return NextResponse.json(
        {
          error:
            "DATABASE_URL is missing on this server. Add it in Vercel → Environment Variables (same Supabase Postgres URI as local), then redeploy.",
        },
        { status: 503 }
      );
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
    console.error("[admin/login] session DB error:", e);
    return NextResponse.json(
      {
        error:
          "Login failed: database did not save your session. On Vercel, set DATABASE_URL to your Supabase Postgres URI, add ?sslmode=require, URL-encode any special characters in the password, redeploy, then run prisma migrate deploy against that database (AdminSession table must exist).",
      },
      { status: 500 }
    );
  }
}
