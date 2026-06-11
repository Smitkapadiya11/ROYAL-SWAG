import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin/session";
import { ALL_SITE_ASSETS, filterSiteAssets } from "@/lib/site-asset-catalog";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isDashboardAuthenticated } from "@/lib/dashboard-auth";

export const dynamic = "force-dynamic";

async function authorized(req: NextRequest) {
  if (isDashboardAuthenticated(req)) return true;
  return isAdminAuthorized(req);
}

export async function GET(req: NextRequest) {
  if (!(await authorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kind = req.nextUrl.searchParams.get("kind") as "image" | "video" | "all" | null;
  const site = filterSiteAssets(kind ?? "all");

  let uploaded: {
    id: string;
    file_name: string;
    public_url: string;
    mime_type: string;
    thumbnail_url?: string;
    created_at: string;
  }[] = [];

  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from("media_assets")
      .select("id, file_name, public_url, mime_type, thumbnail_url, created_at")
      .order("created_at", { ascending: false });
    uploaded = data ?? [];
  } catch {
    /* bucket optional */
  }

  const filteredUploads = uploaded.filter((a) => {
    if (!kind || kind === "all") return true;
    return kind === "video"
      ? a.mime_type?.startsWith("video/")
      : a.mime_type?.startsWith("image/");
  });

  return NextResponse.json({ site, uploaded: filteredUploads });
}
