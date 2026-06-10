"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

type Asset = {
  id: string;
  file_name: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  thumbnail_url?: string;
  used_on: string[];
  created_at: string;
  visible: boolean;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MediaPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { data, mutate, isLoading } = useSWR("/api/dashboard/media", fetcher);
  const [uploading, setUploading] = useState(false);

  const assets: Asset[] = data?.assets ?? [];

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/dashboard/media", { method: "POST", body: form });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error || "Upload failed");
      }
      toast.success("Uploaded (WebP conversion applied for images)");
      void mutate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (asset: Asset) => {
    const used = asset.used_on?.length ?? 0;
    const ok = window.confirm(
      used > 0
        ? `This file is referenced on ${used} page(s). Delete anyway?`
        : "Delete this file?"
    );
    if (!ok) return;

    const res = await fetch(`/api/dashboard/media?id=${asset.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    void mutate();
  };

  const formatSize = (n: number) => {
    if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-card flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="font-medium">Upload assets</p>
          <p className="text-xs text-[#9CA3AF]">
            JPG, PNG, WEBP (max 50MB) · MP4, MOV (max 200MB) · Images auto-convert to WebP
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className="dashboard-btn"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>

      <div className="dashboard-card p-4">
        <h2 className="mb-4 font-semibold">Video testimonials</h2>
        <p className="text-sm text-[#9CA3AF]">
          Upload videos with customer name & city in metadata (JSON) — visible on /reviews when
          Sprint 3 video module is enabled.
        </p>
      </div>

      {isLoading ? (
        <div className="dashboard-skeleton h-40" />
      ) : assets.length === 0 ? (
        <p className="text-center text-sm text-[#9CA3AF]">No media uploaded yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <div key={a.id} className="dashboard-card overflow-hidden">
              {a.thumbnail_url || a.mime_type?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.thumbnail_url || a.public_url}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center bg-black/30 text-4xl">
                  🎬
                </div>
              )}
              <div className="space-y-2 p-3 text-xs">
                <p className="truncate font-medium">{a.file_name}</p>
                <p className="text-[#9CA3AF]">
                  {a.mime_type} · {formatSize(a.size_bytes)}
                </p>
                <p className="text-[#9CA3AF]">
                  {new Date(a.created_at).toLocaleDateString("en-IN")}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="dashboard-btn flex-1 text-xs"
                    onClick={() => {
                      void navigator.clipboard.writeText(a.public_url);
                      toast.success("URL copied");
                    }}
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[#EF4444]/40 px-2 py-1 text-[#EF4444]"
                    onClick={() => void remove(a)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
