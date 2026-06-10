import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireDashboardAuthAsync } from "@/lib/dashboard-api";
import { DEFAULT_CMS_CONTENT } from "@/lib/cms-defaults";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const denied = await requireDashboardAuthAsync(req);
  if (denied) return denied;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from("cms_content").select("section_key, content, updated_at, updated_by");

  if (error) {
    return NextResponse.json({ sections: DEFAULT_CMS_CONTENT });
  }

  const merged: Record<string, unknown> = { ...DEFAULT_CMS_CONTENT };
  for (const row of data ?? []) {
    const prev = merged[row.section_key];
    const base =
      prev && typeof prev === "object" && !Array.isArray(prev)
        ? (prev as Record<string, unknown>)
        : {};
    merged[row.section_key] = {
      ...base,
      ...(row.content as Record<string, unknown>),
      _updated_at: row.updated_at,
      _updated_by: row.updated_by,
    };
  }

  return NextResponse.json({ sections: merged });
}

export async function PUT(req: NextRequest) {
  const denied = await requireDashboardAuthAsync(req);
  if (denied) return denied;

  const body = (await req.json()) as {
    section_key?: string;
    content?: Record<string, unknown>;
  };

  if (!body.section_key || !body.content) {
    return NextResponse.json({ error: "section_key and content required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin.from("cms_content").upsert(
    {
      section_key: body.section_key,
      content: body.content,
      updated_at: new Date().toISOString(),
      updated_by: "dashboard",
    },
    { onConflict: "section_key" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/product");
  revalidatePath("/reviews");

  return NextResponse.json({ success: true });
}
