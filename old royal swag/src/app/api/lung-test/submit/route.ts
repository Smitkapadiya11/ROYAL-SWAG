import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function normalizeRiskLevel(raw: string | undefined, score: number): string {
  const fallback = score <= 2 ? "Mild" : score <= 5 ? "Moderate" : "High";
  if (!raw || typeof raw !== "string") return fallback;
  const u = raw.trim().toUpperCase();
  if (u === "HIGH") return "High";
  if (u === "MODERATE") return "Moderate";
  if (u === "MILD") return "Mild";
  return raw.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, answers, score, riskLevel } = await req.json();

    if (!name || !email || !Array.isArray(answers) || answers.length !== 8) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const mobileClean = String(phone ?? "").replace(/\D/g, "").slice(-10);
    if (mobileClean.length !== 10) {
      return NextResponse.json({ error: "Valid phone required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[lung-test/submit] SUPABASE ENV MISSING");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const scoreNum = Number(score) || 0;
    const risk_level = normalizeRiskLevel(riskLevel, scoreNum);
    const answersPayload = {
      q1_pollution: Boolean(answers[0]),
      q2_smoking: Boolean(answers[1]),
      q3_cough: Boolean(answers[2]),
      q4_breathless: Boolean(answers[3]),
      q5_occupational: Boolean(answers[4]),
      q6_sleep: Boolean(answers[5]),
      q7_exercise: Boolean(answers[6]),
      q8_diet: Boolean(answers[7]),
      responses: answers.map((a: unknown) => a === true),
    };

    let customerId: string | null = null;
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("mobile", mobileClean)
      .maybeSingle();

    if (existing?.id) {
      customerId = existing.id;
    } else {
      const { data: created, error: custError } = await supabase
        .from("customers")
        .insert({
          name: String(name).trim(),
          mobile: mobileClean,
          email: String(email).trim().toLowerCase(),
        })
        .select("id")
        .maybeSingle();
      if (custError) console.error("[lung-test/submit] Customer error:", custError);
      customerId = created?.id ?? null;
    }

    const { data: result, error: lungError } = await supabase
      .from("lung_test_results")
      .insert({
        customer_id: customerId,
        name: String(name).trim(),
        mobile: mobileClean,
        email: String(email).trim().toLowerCase(),
        risk_level,
        score: scoreNum,
        answers: answersPayload,
      })
      .select("id")
      .maybeSingle();

    if (lungError) {
      console.error("[lung-test/submit]", lungError);
      return NextResponse.json({ error: lungError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sessionId: result?.id ?? "" });
  } catch (e: unknown) {
    console.error("[lung-test/submit]", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
