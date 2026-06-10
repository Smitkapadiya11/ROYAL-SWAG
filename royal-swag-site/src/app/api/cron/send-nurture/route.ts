import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  daysSinceCreated,
  nurtureDayForAge,
  nurtureDayKey,
  sendNurtureEmail,
} from "@/lib/nurture-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function authorizeCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: leads, error } = await admin
      .from("leads")
      .select("id, email, created_at, converted, nurture_emails_sent")
      .eq("converted", false)
      .order("created_at", { ascending: true })
      .limit(500);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let sent = 0;
    const errors: string[] = [];

    for (const lead of leads ?? []) {
      const age = daysSinceCreated(lead.created_at);
      const day = nurtureDayForAge(age);
      if (day == null || day === 0) continue;

      const key = nurtureDayKey(day);
      const sentList = (lead.nurture_emails_sent ?? []) as string[];
      if (sentList.includes(key)) continue;

      const ok = await sendNurtureEmail(lead.email, day);
      if (!ok) {
        errors.push(`${lead.id}:${key}`);
        continue;
      }

      await admin
        .from("leads")
        .update({
          nurture_day: day,
          nurture_emails_sent: [...sentList, key],
        })
        .eq("id", lead.id);

      sent += 1;
    }

    return NextResponse.json({
      ok: true,
      processed: leads?.length ?? 0,
      sent,
      errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
