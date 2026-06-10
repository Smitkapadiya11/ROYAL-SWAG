"use client";

import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

const FIELDS = [
  { key: "whatsapp_number", label: "WhatsApp number" },
  { key: "phone_display", label: "Phone number" },
  { key: "email", label: "Email" },
  { key: "fssai_license", label: "FSSAI license number" },
  { key: "company_address", label: "Company address" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "youtube_url", label: "YouTube URL" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "stock_count", label: "Stock count (urgency ticker)" },
  { key: "timer_seed", label: "Timer seed timestamp (countdown)" },
] as const;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SettingsPage() {
  const { data, mutate, isLoading } = useSWR("/api/dashboard/settings", fetcher);
  const [saving, setSaving] = useState<string | null>(null);

  const settings = (data?.settings ?? {}) as Record<
    string,
    { value: string; updated_at?: string; updated_by?: string }
  >;

  const save = async (key: string, value: string) => {
    setSaving(key);
    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Setting saved");
      void mutate();
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(null);
    }
  };

  if (isLoading) {
    return <div className="dashboard-skeleton h-64" />;
  }

  return (
    <div className="dashboard-card divide-y divide-white/10">
      {FIELDS.map((f) => {
        const row = settings[f.key] ?? { value: "" };
        return (
          <div key={f.key} className="space-y-2 p-5">
            <label className="block text-sm font-medium text-[#F0F0F0]">{f.label}</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="dashboard-input flex-1"
                value={row.value}
                onChange={(e) =>
                  mutate(
                    {
                      settings: {
                        ...settings,
                        [f.key]: { ...row, value: e.target.value },
                      },
                    },
                    false
                  )
                }
              />
              <button
                type="button"
                className="dashboard-btn shrink-0"
                disabled={saving === f.key}
                onClick={() => void save(f.key, row.value)}
              >
                {saving === f.key ? "Saving…" : "Save"}
              </button>
            </div>
            {row.updated_at ? (
              <p className="text-xs text-[#9CA3AF]">
                Last updated {new Date(row.updated_at).toLocaleString("en-IN")}
                {row.updated_by ? ` by ${row.updated_by}` : ""}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
