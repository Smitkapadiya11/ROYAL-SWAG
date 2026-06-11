"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminMediaLibrary() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [source, setSource] = useState<"uploads" | "site">("uploads");
  const [uploading, setUploading] = useState(false);

  const { data, mutate, isLoading } = useSWR(
    `/api/admin/site-assets?kind=${filter}`,
    fetcher
  );

  const uploads = data?.uploaded ?? [];
  const site = data?.site ?? [];

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
      toast.success("Uploaded successfully");
      void mutate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this file from the library?")) return;
    const res = await fetch(`/api/dashboard/media?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    void mutate();
  };

  const items =
    source === "site"
      ? site
      : uploads.map(
          (a: {
            id: string;
            public_url: string;
            file_name: string;
            mime_type: string;
            thumbnail_url?: string;
            size_bytes?: number;
            created_at?: string;
          }) => ({
            id: a.id,
            url: a.public_url,
            name: a.file_name,
            kind: a.mime_type?.startsWith("video/") ? "video" : "image",
            thumb: a.thumbnail_url || a.public_url,
            size: a.size_bytes,
            created_at: a.created_at,
            deletable: true,
          })
        );

  return (
    <div className="admin-pro-panel">
      <div className="admin-pro-header">
        <div>
          <h2 className="font-display text-xl font-bold text-[#324023]">Media Library</h2>
          <p className="mt-1 text-sm text-[#75786e]">
            Upload images & videos, or browse assets already on the live site.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Uploading…" : "+ Attach file"}
        </button>
      </div>

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

      <div
        className="admin-dropzone mt-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void upload(f);
        }}
      >
        <p className="font-semibold text-[#324023]">Drag & drop files here</p>
        <p className="text-xs text-[#75786e]">Images auto-convert to WebP · MP4/MOV up to 200MB</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="admin-tabs">
          {(["uploads", "site"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={cn("admin-tab", source === s && "admin-tab--active")}
              onClick={() => setSource(s)}
            >
              {s === "uploads" ? "Your uploads" : "Live site files"}
            </button>
          ))}
        </div>
        <select
          className="admin-input w-auto text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">All types</option>
          <option value="image">Images only</option>
          <option value="video">Videos only</option>
        </select>
      </div>

      {isLoading ? (
        <div className="admin-skeleton mt-4 h-48 rounded-2xl" />
      ) : items.length === 0 ? (
        <p className="mt-8 text-center text-sm text-[#75786e]">No files in this view.</p>
      ) : (
        <div className="admin-media-grid mt-4">
          {items.map(
            (item: {
              id?: string;
              url: string;
              name: string;
              kind?: string;
              thumb?: string;
              category?: string;
              deletable?: boolean;
            }) => (
              <div key={item.url} className="admin-media-card">
                {item.kind === "video" || /\.(mp4|mov)/i.test(item.url) ? (
                  <div className="admin-media-card-preview admin-media-tile-video">▶ Video</div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumb || item.url} alt="" className="admin-media-card-preview" />
                )}
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-[#324023]">{item.name}</p>
                  {item.category ? (
                    <p className="text-xs text-[#9A6F1A]">{item.category}</p>
                  ) : null}
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm flex-1"
                      onClick={() => {
                        void navigator.clipboard.writeText(item.url);
                        toast.success("URL copied");
                      }}
                    >
                      Copy URL
                    </button>
                    {item.deletable && item.id ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost admin-btn--sm text-red-700"
                        onClick={() => void remove(item.id!)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
