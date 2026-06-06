import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  computeSymptomPoints,
  getHerbRecommendations,
  getLungScore,
  type SymptomAnswers,
} from "@/lib/lungScore";
import { sendLungTestResultEmail } from "@/lib/lung-test-email";
import { SITE_ORIGIN } from "@/lib/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      city,
      smoke,
      cough,
      breathless,
      dust,
      breathHoldSeconds,
      score: clientScore,
      level: clientLevel,
    } = body as {
      name?: string;
      email?: string;
      phone?: string;
      city?: boolean;
      smoke?: boolean;
      cough?: boolean;
      breathless?: boolean;
      dust?: boolean;
      breathHoldSeconds?: number;
      score?: number;
      level?: string;
    };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    const phoneDigits = String(phone ?? "")
      .replace(/\D/g, "")
      .slice(-10);
    if (phoneDigits.length !== 10) {
      return NextResponse.json({ error: "Valid 10-digit phone required" }, { status: 400 });
    }

    const answers: SymptomAnswers = {
      city: Boolean(city),
      smoke: Boolean(smoke),
      cough: Boolean(cough),
      breathless: Boolean(breathless),
      dust: Boolean(dust),
    };

    const points = computeSymptomPoints(answers);
    const lungScore = getLungScore(points);

    if (clientScore != null && Math.abs(clientScore - points) > 1) {
      console.warn("[lung-test/submit] score mismatch", { clientScore, points });
    }

    const level = lungScore.level;
    const breath =
      typeof breathHoldSeconds === "number" && !Number.isNaN(breathHoldSeconds)
        ? Math.round(breathHoldSeconds * 10) / 10
        : null;

    const admin = getSupabaseAdmin();
    const row = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phoneDigits,
      city: answers.city,
      smoke: answers.smoke,
      cough: answers.cough,
      breathless: answers.breathless,
      dust: answers.dust,
      breath_hold_seconds: breath,
      score: points,
      level,
    };

    const { data: inserted, error: leadError } = await admin
      .from("lung_test_leads")
      .insert(row)
      .select("id")
      .single();

    if (leadError) {
      console.error("[lung-test/submit] lung_test_leads:", leadError.message);
      return NextResponse.json({ error: leadError.message }, { status: 500 });
    }

    try {
      await admin.from("lung_test_results").insert({
        name: row.name,
        mobile: row.phone,
        email: row.email,
        risk_level: level,
        score: points,
        answers: {
          ...answers,
          breath_hold_seconds: breath,
        },
      });
    } catch {
      /* legacy table optional */
    }

    const herbs = getHerbRecommendations(answers);
    const reportUrl = `${SITE_ORIGIN}/lung-test/result`;

    await sendLungTestResultEmail({
      name: row.name,
      email: row.email,
      score: lungScore,
      herbs,
      answers,
      breathHoldSeconds: breath ?? 0,
      reportUrl,
    });

    return NextResponse.json({
      ok: true,
      id: inserted.id,
      score: points,
      level,
      color: lungScore.color,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Save failed";
    console.error("[lung-test/submit]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
