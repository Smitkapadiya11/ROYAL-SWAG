"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type PickerKind = "image" | "video" | "all";

type AdminMediaPickerProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind?: PickerKind;
  hint?: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminMediaPicker({
  label,
  value,
  onChange,
  kind = "image",
  hint,
}: AdminMediaPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"site" | "uploads" | "upload">("site");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const { data, mutate } = useSWR(
    `/api/admin/site-assets?kind=${kind === "all" ? "all" : kind}`,
    fetcher
  );

  const siteAssets: { url: string; name: string; kind: string; category: string }[] =
    data?.site ?? [];
  const uploads: {
    id: string;
    public_url: string;
    file_name: string;
    mime_type: string;
    thumbnail_url?: string;
  }[] = data?.uploaded ?? [];

  const accept =
    kind === "video"
      ? "video/mp4,video/quicktime"
      : kind === "image"
        ? "image/*"
        : "image/*,video/mp4,video/quicktime";

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/dashboard/media", { method: "POST", body: form });
      const json = (await res.json()) as { asset?: { public_url: string }; error?: string };
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange(json.asset?.public_url ?? "");
      toast.success("File uploaded and selected");
      void mutate();
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = (url: string) => /\.(mp4|mov|webm)(\?|$)/i.test(url);

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      {hint ? <p className="admin-field-hint">{hint}</p> : null}

      <div className="admin-media-current">
        {value ? (
          isVideo(value) ? (
            <video src={value} className="admin-media-thumb" muted playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="admin-media-thumb" />
          )
        ) : (
          <div className="admin-media-thumb admin-media-thumb--empty">No file</div>
        )}
        <div className="min-w-0 flex-1">
          <input
            className="admin-input font-mono text-xs"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... or paste URL"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => setOpen(!open)}>
              {open ? "Close library" : "Choose file"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Attach new"}
            </button>
            {value ? (
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => onChange("")}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void uploadFile(f);
          e.target.value = "";
        }}
      />

      {open ? (
        <div className="admin-media-library mt-3">
          <div className="admin-tabs">
            {(["site", "uploads", "upload"] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={cn("admin-tab", tab === t && "admin-tab--active")}
                onClick={() => setTab(t)}
              >
                {t === "site" ? "Live site" : t === "uploads" ? "Your uploads" : "Attach"}
              </button>
            ))}
          </div>

          {tab === "site" ? (
            <div className="admin-media-grid">
              {siteAssets.map((a) => (
                <button
                  key={a.url}
                  type="button"
                  className={cn("admin-media-tile", value === a.url && "admin-media-tile--active")}
                  onClick={() => {
                    onChange(a.url);
                    setOpen(false);
                    toast.success(`Selected ${a.name}`);
                  }}
                >
                  {a.kind === "video" ? (
                    <div className="admin-media-tile-video">▶</div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.url} alt="" />
                  )}
                  <span className="admin-media-tile-name">{a.name}</span>
                  <span className="admin-media-tile-cat">{a.category}</span>
                </button>
              ))}
            </div>
          ) : null}

          {tab === "uploads" ? (
            uploads.length === 0 ? (
              <p className="p-4 text-center text-sm text-[#75786e]">
                No uploads yet — use Attach to add files.
              </p>
            ) : (
              <div className="admin-media-grid">
                {uploads.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className={cn(
                      "admin-media-tile",
                      value === a.public_url && "admin-media-tile--active"
                    )}
                    onClick={() => {
                      onChange(a.public_url);
                      setOpen(false);
                      toast.success("Selected upload");
                    }}
                  >
                    {a.mime_type?.startsWith("video/") ? (
                      <div className="admin-media-tile-video">▶</div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.thumbnail_url || a.public_url} alt="" />
                    )}
                    <span className="admin-media-tile-name">{a.file_name}</span>
                  </button>
                ))}
              </div>
            )
          ) : null}

          {tab === "upload" ? (
            <div
              className="admin-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) void uploadFile(f);
              }}
            >
              <p className="font-semibold text-[#324023]">Drop image or video here</p>
              <p className="mt-1 text-xs text-[#75786e]">
                JPG, PNG, WEBP (50MB) · MP4, MOV (200MB)
              </p>
              <button
                type="button"
                className="admin-btn mt-4"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                Browse files
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
