import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const MAX_API_BODY_BYTES = 1024 * 1024;

const JSON_CONTENT_TYPE = "application/json";

const MULTIPART_ROUTES = ["/api/dashboard/media"] as const;

const RAW_BODY_ROUTES = ["/api/razorpay/webhook"] as const;

export function getSiteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://lungdetox.royalswag.in"
  );
}

export function hashIp(ip: string): string {
  if (!ip) return "";
  return createHash("sha256").update(ip).digest("hex");
}

export function getClientIp(req: NextRequest | Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    ""
  );
}

function isMultipartRoute(pathname: string): boolean {
  return MULTIPART_ROUTES.some((r) => pathname.startsWith(r));
}

function isRawBodyRoute(pathname: string): boolean {
  return RAW_BODY_ROUTES.some((r) => pathname.startsWith(r));
}

export function applyCorsHeaders(
  req: NextRequest,
  res: NextResponse
): NextResponse {
  const origin = req.headers.get("origin");
  const allowed = getSiteOrigin();

  if (origin && origin === allowed) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Vary", "Origin");
  }

  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Idempotency-Key, X-Idempotency-Key"
  );

  return res;
}

export function validateApiRequest(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  if (method === "OPTIONS") {
    const res = new NextResponse(null, { status: 204 });
    return applyCorsHeaders(req, res);
  }

  if (method === "GET" || method === "HEAD" || method === "DELETE") {
    return null;
  }

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > MAX_API_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  if (isMultipartRoute(pathname) || isRawBodyRoute(pathname)) {
    return null;
  }

  const contentType = req.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  if (contentType && contentType !== JSON_CONTENT_TYPE) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  const origin = req.headers.get("origin");
  if (origin) {
    const allowed = getSiteOrigin();
    if (origin !== allowed) {
      return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
    }
  }

  return null;
}

export function sanitizeString(
  value: unknown,
  maxLen = 500
): string | undefined {
  if (typeof value !== "string") return undefined;
  return value
    .replace(/[\0\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, maxLen);
}

export async function readJsonBody<T = unknown>(
  req: Request
): Promise<{ data?: T; error?: NextResponse }> {
  const raw = await req.text();
  if (raw.length > MAX_API_BODY_BYTES) {
    return {
      error: NextResponse.json({ error: "Payload too large" }, { status: 413 }),
    };
  }
  if (!raw) return { data: {} as T };
  try {
    return { data: JSON.parse(raw) as T };
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}

export function apiNoStoreHeaders(): HeadersInit {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
  };
}
