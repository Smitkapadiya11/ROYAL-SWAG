import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin/session";
import { tryGetSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = tryGetSupabaseAdmin();
  if (!admin) {
    console.error(
      "LEADS ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
    return NextResponse.json(
      { error: "Supabase admin not configured", leads: [] },
      { status: 503 }
    );
  }

  try {
    const { data, error } = await admin
      .from("lung_test_leads")
      .select("id,name,email,phone,level,score,city,created_at")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      console.error("LEADS ERROR:", error.message, error.code);
      return NextResponse.json({ error: error.message, leads: [] }, { status: 500 });
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
    console.error("LEADS ERROR:", message);
    return NextResponse.json({ error: message, leads: [] }, { status: 500 });
  }
}
