import { NextResponse } from "next/server";
import { getAdminSessionRoute } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSessionRoute();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("lung_test_leads")
      .select(
        "id,name,email,phone,level,score,city,created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leads = (data ?? []).map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      mobile: l.phone,
      risk_level: l.level,
      city: l.city ? "Yes" : "No",
      score: l.score,
      created_at: l.created_at,
    }));

    return NextResponse.json({ leads });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load leads";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
