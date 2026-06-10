import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireDashboardAuth } from "@/lib/dashboard-api";
import { siteConfig } from "@/lib/siteConfig";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { URGENCY_CONFIG } from "@/lib/urgency-config";
import { getTimerSeedMs } from "@/lib/countdown-timer";

const DEFAULT_SETTINGS: Record<string, string> = {
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  phone_display: siteConfig.phone,
  email: siteConfig.email,
  fssai_license: siteConfig.fssaiLicense || "",
  company_address: siteConfig.address,
  instagram_url: siteConfig.social.instagram,
  youtube_url: siteConfig.social.youtube,
  facebook_url: siteConfig.social.facebook,
  stock_count: String(URGENCY_CONFIG.stockCount),
  timer_seed: String(getTimerSeedMs()),
};

export async function GET(req: NextRequest) {
  const denied = requireDashboardAuth(req);
  if (denied) return denied;

  const admin = getSupabaseAdmin();
  const { data } = await admin.from("site_settings").select("key, value, updated_at, updated_by");

  const settings: Record<string, { value: string; updated_at?: string; updated_by?: string }> =
    {};

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    settings[key] = { value };
  }

  for (const row of data ?? []) {
    settings[row.key] = {
      value: row.value,
      updated_at: row.updated_at,
      updated_by: row.updated_by,
    };
  }

  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const denied = requireDashboardAuth(req);
  if (denied) return denied;

  const body = (await req.json()) as { key?: string; value?: string };
  if (!body.key || body.value == null) {
    return NextResponse.json({ error: "key and value required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin.from("site_settings").upsert(
    {
      key: body.key,
      value: String(body.value),
      updated_at: new Date().toISOString(),
      updated_by: "dashboard",
    },
    { onConflict: "key" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/product");

  return NextResponse.json({ success: true });
}
