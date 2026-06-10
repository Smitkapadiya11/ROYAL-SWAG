import { NextResponse } from "next/server";
import { logAdminEnvCheck } from "@/lib/admin/env-check";
import { getSupabaseAdmin } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export async function GET() {
  logAdminEnvCheck();

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("lung_test_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LEADS QUERY ERROR:", error);
      return NextResponse.json({ error: error.message, leads: [] }, { status: 500 });
    }

    const leads = (data ?? []).map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      mobile: l.phone,
      risk_level: l.level,
      pollution_city: l.city ? "Yes" : "No",
      score: l.score,
      created_at: l.created_at,
    }));

    return NextResponse.json({ leads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load leads";
    console.error("LEADS ROUTE ERROR:", message);
    return NextResponse.json({ error: message, leads: [] }, { status: 500 });
  }
}
