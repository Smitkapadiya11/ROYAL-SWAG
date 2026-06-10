import { createHash, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const DASHBOARD_AUTH_COOKIE = "rs_admin_auth";
export const DASHBOARD_ATTEMPTS_COOKIE = "rs_admin_attempts";
export const DASHBOARD_LOCKOUT_COOKIE = "rs_admin_lockout_until";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function getDashboardPassword(): string | null {
  return process.env.DASHBOARD_PASSWORD?.trim() || null;
}

export function createDashboardSessionToken(): string {
  const secret = process.env.ADMIN_SECRET_KEY || process.env.DASHBOARD_PASSWORD || "rs-dashboard";
  const expires = Date.now() + SESSION_MS;
  const payload = `${expires}`;
  const sig = sha256(`${payload}:${secret}`);
  return `${payload}.${sig}`;
}

export function verifyDashboardSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_SECRET_KEY || process.env.DASHBOARD_PASSWORD || "rs-dashboard";
  const [expiresRaw, sig] = token.split(".");
  if (!expiresRaw || !sig) return false;
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expected = sha256(`${expiresRaw}:${secret}`);
  return safeEqual(sig, expected);
}

export function isDashboardAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get(DASHBOARD_AUTH_COOKIE)?.value;
  return verifyDashboardSessionToken(token);
}

export function setDashboardAuthCookie(res: NextResponse): void {
  res.cookies.set(DASHBOARD_AUTH_COOKIE, createDashboardSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_MS / 1000),
  });
  res.cookies.set(DASHBOARD_ATTEMPTS_COOKIE, "", { maxAge: 0, path: "/" });
  res.cookies.set(DASHBOARD_LOCKOUT_COOKIE, "", { maxAge: 0, path: "/" });
}

export function clearDashboardAuthCookie(res: NextResponse): void {
  res.cookies.set(DASHBOARD_AUTH_COOKIE, "", { maxAge: 0, path: "/" });
}

export type LoginAttemptResult =
  | { ok: true }
  | { ok: false; error: string; lockedUntil?: number };

export function verifyDashboardPassword(
  password: string,
  req: NextRequest
): LoginAttemptResult {
  const expected = getDashboardPassword();
  if (!expected) {
    return { ok: false, error: "Dashboard password is not configured on the server." };
  }

  const lockoutRaw = req.cookies.get(DASHBOARD_LOCKOUT_COOKIE)?.value;
  if (lockoutRaw) {
    const lockedUntil = Number(lockoutRaw);
    if (Number.isFinite(lockedUntil) && Date.now() < lockedUntil) {
      return {
        ok: false,
        error: "Too many attempts. Try again in 15 minutes.",
        lockedUntil,
      };
    }
  }

  if (password === expected) {
    return { ok: true };
  }

  const attempts = Number(req.cookies.get(DASHBOARD_ATTEMPTS_COOKIE)?.value || "0") + 1;
  if (attempts >= MAX_ATTEMPTS) {
    return {
      ok: false,
      error: "Too many attempts. Locked for 15 minutes.",
      lockedUntil: Date.now() + LOCKOUT_MS,
    };
  }

  return {
    ok: false,
    error: `Incorrect password. ${MAX_ATTEMPTS - attempts} attempt(s) left.`,
  };
}

export function applyFailedLoginCookies(res: NextResponse, req: NextRequest): void {
  const attempts = Number(req.cookies.get(DASHBOARD_ATTEMPTS_COOKIE)?.value || "0") + 1;
  if (attempts >= MAX_ATTEMPTS) {
    res.cookies.set(DASHBOARD_LOCKOUT_COOKIE, String(Date.now() + LOCKOUT_MS), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(LOCKOUT_MS / 1000),
    });
    res.cookies.set(DASHBOARD_ATTEMPTS_COOKIE, "0", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: LOCKOUT_MS / 1000,
    });
    return;
  }

  res.cookies.set(DASHBOARD_ATTEMPTS_COOKIE, String(attempts), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: LOCKOUT_MS / 1000,
  });
}
