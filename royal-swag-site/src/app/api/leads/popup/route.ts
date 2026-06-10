import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendLungHealthGuideEmail } from "@/lib/lung-guide-email";
import { sendNurtureEmail } from "@/lib/nurture-email";
import { apiNoStoreHeaders, readJsonBody } from "@/lib/api-security";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(`leads-popup:${ip}`, 8, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429, headers: apiNoStoreHeaders() }
      );
    }

    const parsed = await readJsonBody(req);
    if (parsed.error) return parsed.error;

    const { email, source = "popup", page } = parsed.data as {
      email?: string;
      source?: string;
      page?: string;
    };

    const normalized = email?.trim().toLowerCase() ?? "";
    if (!normalized || !EMAIL_RE.test(normalized)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400, headers: apiNoStoreHeaders() }
      );
    }

    const admin = getSupabaseAdmin();
    const { data: lead, error } = await admin
      .from("leads")
      .insert({
        email: normalized,
        source: source || "popup",
        page_path: page || null,
        name: null,
        score: null,
        risk_level: null,
        answers: {},
        nurture_day: 0,
        nurture_emails_sent: ["day0"],
      })
      .select("id")
      .single();

    if (error) {
      console.error("[leads/popup] insert error:", error);
      return NextResponse.json(
        { error: "Could not save lead" },
        { status: 500, headers: apiNoStoreHeaders() }
      );
    }

    await Promise.all([
      sendLungHealthGuideEmail(normalized),
      sendNurtureEmail(normalized, 0),
    ]).catch((err) => console.error("[leads/popup] email:", err));

    return NextResponse.json(
      { ok: true, leadId: lead?.id },
      { headers: apiNoStoreHeaders() }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: apiNoStoreHeaders() }
    );
  }
}
