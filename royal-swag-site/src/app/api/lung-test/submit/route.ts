import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendNurtureEmail } from "@/lib/nurture-email";
import {
  adjustScoreForBreathHold,
  computeSymptomPoints,
  getHerbRecommendations,
  getLungScore,
  getMatchedHerbNames,
  type SymptomAnswers,
} from "@/lib/lungScore";

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
      mucus,
      worsened,
      breathHoldSeconds,
      score: clientScore,
      sourceUrl,
    } = body as {
      name?: string;
      email?: string;
      phone?: string;
      city?: boolean;
      smoke?: boolean;
      cough?: boolean;
      breathless?: boolean;
      dust?: boolean;
      mucus?: boolean;
      worsened?: boolean;
      breathHoldSeconds?: number;
      score?: number;
      sourceUrl?: string;
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
      mucus: Boolean(mucus),
      worsened: Boolean(worsened),
    };

    const symptomPoints = computeSymptomPoints(answers);
    const breath =
      typeof breathHoldSeconds === "number" && !Number.isNaN(breathHoldSeconds)
        ? Math.round(breathHoldSeconds * 10) / 10
        : null;
    const points =
      breath != null
        ? adjustScoreForBreathHold(symptomPoints, breath)
        : symptomPoints;
    const lungScore = getLungScore(points);

    if (clientScore != null && Math.abs(clientScore - points) > 1) {
      console.warn("[lung-test/submit] score mismatch", { clientScore, points });
    }

    const matchedHerbs = getMatchedHerbNames(answers);
    const herbs = getHerbRecommendations(answers);

    const admin = getSupabaseAdmin();
    const sourcePage = sourceUrl || "/lung-test";

    const lungRow = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phoneDigits,
      city: answers.city,
      smoke: answers.smoke,
      cough: answers.cough,
      breathless: answers.breathless,
      dust: answers.dust,
      mucus: answers.mucus,
      worsened: answers.worsened,
      breath_hold_seconds: breath,
      score: points,
      level: lungScore.level,
      matched_herbs: matchedHerbs,
      source_page: sourcePage,
    };

    const { data: inserted, error: leadError } = await admin
      .from("lung_test_leads")
      .insert(lungRow)
      .select("id")
      .single();

    if (leadError) {
      console.error("[lung-test/submit] lung_test_leads:", leadError.message);
    }

    try {
      await admin.from("leads").insert({
        name: lungRow.name,
        email: lungRow.email,
        phone: lungRow.phone,
        score: points,
        risk_level: lungScore.riskSlug,
        answers,
        matched_herbs: matchedHerbs,
        source_page: sourcePage,
        source: "lung_test",
        nurture_emails_sent: ["day0"],
      });
      void sendNurtureEmail(lungRow.email, 0);
    } catch (leadsErr) {
      console.error("[lung-test/submit] leads:", leadsErr);
    }

    return NextResponse.json({
      ok: true,
      id: inserted?.id,
      score: points,
      level: lungScore.level,
      riskSlug: lungScore.riskSlug,
      color: lungScore.color,
      matchedHerbs,
      herbs,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Save failed";
    console.error("[lung-test/submit]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
