import { NextRequest } from "next/server";
import crypto from "crypto";

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const secret = (process.env.ADMIN_SECRET_KEY || "").trim().replace(/^["']|["']$/g, "");
    if (!secret) return false;
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [username, timestamp, sig] = parts;
    const payload = `${username}:${timestamp}`;
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return sig === expectedSig;
  } catch {
    return false;
  }
}

export function isAdminRequest(req: NextRequest): boolean {
  return verifyAdminToken(req.cookies.get("admin_token")?.value);
}
