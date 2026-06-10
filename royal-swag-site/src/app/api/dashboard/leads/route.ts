import { NextRequest, NextResponse } from "next/server";
import { requireDashboardAuthAsync } from "@/lib/dashboard-api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const denied = await requireDashboardAuthAsync(req);
  if (denied) return denied;

  const risk = req.nextUrl.searchParams.get("risk");
  const converted = req.nextUrl.searchParams.get("converted");
  const admin = getSupabaseAdmin();

  let query = admin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (risk && risk !== "all") {
    query = query.eq("risk_level", risk.toLowerCase());
  }
  if (converted === "true") query = query.eq("converted", true);
  if (converted === "false") query = query.eq("converted", false);

  const { data: leadsData, error: leadsError } = await query;

  if (!leadsError && (leadsData?.length ?? 0) > 0) {
    return NextResponse.json({
      leads: (leadsData ?? []).map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        risk_level: l.risk_level,
        score: l.score,
        answers: l.answers,
        matched_herbs: l.matched_herbs,
        converted: l.converted,
        created_at: l.created_at,
      })),
    });
  }

  const { data: legacy, error } = await admin
    .from("lung_test_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    leads: (legacy ?? []).map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone || l.mobile,
      risk_level: (l.level || "mild").toLowerCase(),
      score: l.score,
      answers: {
        city: l.city,
        smoke: l.smoke,
        cough: l.cough,
        breathless: l.breathless,
        dust: l.dust,
        mucus: l.mucus,
        worsened: l.worsened,
      },
      matched_herbs: l.matched_herbs ?? [],
      converted: false,
      created_at: l.created_at,
    })),
  });
}
