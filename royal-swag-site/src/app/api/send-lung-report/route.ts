import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendLungReportEmail } from "@/lib/lung-report-email";
import { getLungScore, type RiskSlug } from "@/lib/lungScore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  score?: number;
  riskLevel?: RiskSlug;
  matchedHerbs?: string[];
  answers?: Record<string, boolean>;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const { name, email, phone, score, riskLevel, matchedHerbs = [], answers } = body;

    if (!name?.trim() || !email?.trim() || typeof score !== "number") {
      return NextResponse.json({ error: "Name, email, and score required" }, { status: 400 });
    }

    const lungScore = getLungScore(score);
    const slug = riskLevel ?? lungScore.riskSlug;

    const sent = await sendLungReportEmail({
      name: name.trim(),
      email: email.trim(),
      score,
      riskLevel: slug,
      riskLabel: lungScore.label,
      riskColor: lungScore.color,
      matchedHerbs,
      recommendation: lungScore.recommendation,
    });

    if (!sent) {
      return NextResponse.json({ error: "Could not send email" }, { status: 502 });
    }

    try {
      const admin = getSupabaseAdmin();
      const phoneDigits = phone ? String(phone).replace(/\D/g, "").slice(-10) : null;

      const { data: existing } = await admin
        .from("leads")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!existing) {
        await admin.from("leads").insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phoneDigits,
          score,
          risk_level: slug,
          answers: answers ?? {},
          matched_herbs: matchedHerbs,
          source_page: "/lung-test/result",
        });
      }
    } catch (dbErr) {
      console.error("[send-lung-report] leads insert:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
