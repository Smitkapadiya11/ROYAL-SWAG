import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { requireDashboardAuth } from "@/lib/dashboard-api";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const IMAGE_MAX = 50 * 1024 * 1024;
const VIDEO_MAX = 200 * 1024 * 1024;
const BUCKET = "media";

export async function GET(req: NextRequest) {
  const denied = requireDashboardAuth(req);
  if (denied) return denied;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ assets: data ?? [] });
}

export async function POST(req: NextRequest) {
  const denied = requireDashboardAuth(req);
  if (denied) return denied;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const max = isVideo ? VIDEO_MAX : IMAGE_MAX;
  if (file.size > max) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const admin = getSupabaseAdmin();
  const buffer = Buffer.from(await file.arrayBuffer());
  let uploadBuffer: Buffer = buffer;
  let mime = file.type;
  let fileName = file.name;

  if (!isVideo && file.type !== "image/webp") {
    uploadBuffer = await sharp(buffer).webp({ quality: 82 }).toBuffer();
    mime = "image/webp";
    fileName = file.name.replace(/\.[^.]+$/, ".webp");
  }

  const path = `${Date.now()}-${fileName}`;
  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, uploadBuffer, { contentType: mime, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicData } = admin.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = publicData.publicUrl;

  let thumbnailUrl: string | null = null;
  if (!isVideo) {
    const thumb = await sharp(buffer).resize(320).webp({ quality: 70 }).toBuffer();
    const thumbPath = `thumbs/${path}`;
    await admin.storage.from(BUCKET).upload(thumbPath, thumb, {
      contentType: "image/webp",
      upsert: true,
    });
    thumbnailUrl = admin.storage.from(BUCKET).getPublicUrl(thumbPath).data.publicUrl;
  }

  const metadataRaw = form.get("metadata");
  const metadata =
    typeof metadataRaw === "string" ? JSON.parse(metadataRaw) : {};

  const { data: row, error } = await admin
    .from("media_assets")
    .insert({
      file_name: fileName,
      storage_path: path,
      public_url: publicUrl,
      mime_type: mime,
      size_bytes: uploadBuffer.length,
      thumbnail_url: thumbnailUrl,
      metadata,
      used_on: [],
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ asset: row });
}

export async function DELETE(req: NextRequest) {
  const denied = requireDashboardAuth(req);
  if (denied) return denied;

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: asset } = await admin.from("media_assets").select("*").eq("id", id).maybeSingle();
  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await admin.storage.from(BUCKET).remove([asset.storage_path]);
  if (asset.thumbnail_url) {
    await admin.storage.from(BUCKET).remove([`thumbs/${asset.storage_path}`]);
  }

  await admin.from("media_assets").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
