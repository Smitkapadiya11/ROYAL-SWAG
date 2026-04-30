import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, answers, score, riskLevel } = await req.json();

    if (!name || !email || !Array.isArray(answers) || answers.length !== 8) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const level = score <= 2 ? "MILD" : score <= 5 ? "MODERATE" : "HIGH";

    const customer = await db.customer.upsert({
      where: { email },
      create: { name, email, phone: phone || "" },
      update: { name, phone: phone || "" },
    });

    const result = await db.lungTestResult.create({
      data: {
        name,
        email,
        phone: phone || "",
        score,
        riskLevel: riskLevel || level,
        q1_pollution: answers[0] ?? false,
        q2_smoking: answers[1] ?? false,
        q3_cough: answers[2] ?? false,
        q4_breathless: answers[3] ?? false,
        q5_occupational: answers[4] ?? false,
        q6_sleep: answers[5] ?? false,
        q7_exercise: answers[6] ?? false,
        q8_diet: answers[7] ?? false,
        customerId: customer.id,
      },
    });

    return NextResponse.json({ ok: true, sessionId: result.sessionId });
  } catch (e: unknown) {
    console.error("[lung-test/submit]", e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
