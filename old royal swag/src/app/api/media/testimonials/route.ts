import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export type VideoTestimonialDto = {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  customerName: string;
  city: string;
  quote: string;
};

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("media_assets")
      .select("*")
      .eq("visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const videos = (data ?? []).filter(
      (a) =>
        a.mime_type?.startsWith("video/") ||
        a.used_on?.includes("reviews") ||
        (a.metadata as Record<string, unknown>)?.customerName
    );

    const testimonials: VideoTestimonialDto[] = videos.map((asset) => {
      const meta = (asset.metadata ?? {}) as Record<string, string>;
      return {
        id: asset.id,
        thumbnailUrl:
          asset.thumbnail_url ||
          meta.thumbnailUrl ||
          "/images/lungtest.webp",
        videoUrl: asset.public_url,
        customerName: meta.customerName || meta.name || "Royal Swag Customer",
        city: meta.city || "",
        quote:
          meta.quote ||
          meta.beforeAfter ||
          "Breathing feels clearer after my daily tea ritual.",
      };
    });

    return NextResponse.json(
      { testimonials },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
