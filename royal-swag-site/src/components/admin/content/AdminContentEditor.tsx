"use client";

import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import AdminMediaPicker from "@/components/admin/ui/AdminMediaPicker";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const TABS = [
  { id: "hero", label: "Hero", icon: "🏠" },
  { id: "product", label: "Product", icon: "📦" },
  { id: "herbs", label: "Herbs", icon: "🌿" },
  { id: "videos", label: "Doctor Videos", icon: "🎬" },
  { id: "testimonials", label: "Testimonials", icon: "💬" },
  { id: "faq", label: "FAQ", icon: "❓" },
] as const;

const HERB_NAMES = [
  "Tulsi",
  "Vasaka",
  "Mulethi",
  "Pippali",
  "Pushkarmool",
  "Kantakari",
] as const;

const DEFAULT_DOCTORS = [
  { id: "doc1", videoSrc: "/videos/doctor1.mp4", name: "Dr. Rajesh Sharma", title: "MBBS, MD — Pulmonologist" },
  { id: "doc2", videoSrc: "/videos/doctor2.mp4", name: "Dr. Priya Mehta", title: "BAMS — Ayurvedic Specialist" },
  { id: "doc3", videoSrc: "/videos/doctor3.mp4", name: "Dr. Vikram Patel", title: "MD — Internal Medicine" },
];

export default function AdminContentEditor() {
  const { data, mutate, isLoading } = useSWR("/api/dashboard/cms", fetcher);
  const [tab, setTab] = useState<string>("hero");
  const [saving, setSaving] = useState(false);

  const sections = (data?.sections ?? {}) as Record<string, Record<string, unknown>>;
  const hero = (sections.hero ?? {}) as Record<string, string>;
  const product = (sections.product ?? {}) as Record<string, string>;
  const herbs = (sections.herbs ?? {}) as Record<string, { image?: string; benefit?: string }>;
  const videos = (sections.videos ?? { doctors: DEFAULT_DOCTORS }) as {
    doctors?: typeof DEFAULT_DOCTORS;
  };
  const doctors = videos.doctors ?? DEFAULT_DOCTORS;

  const save = async (sectionKey: string) => {
    setSaving(true);
    try {
      const content = sections[sectionKey];
      const res = await fetch("/api/dashboard/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_key: sectionKey, content }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Published — live site updates within ~60s");
      void mutate();
    } catch {
      toast.error("Could not save. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const patchSection = (key: string, value: unknown) => {
    void mutate({ sections: { ...sections, [key]: value } }, false);
  };

  const updateField = (sectionKey: string, field: string, value: unknown) => {
    patchSection(sectionKey, { ...sections[sectionKey], [field]: value });
  };

  if (isLoading) {
    return <div className="admin-skeleton h-72 rounded-2xl" />;
  }

  return (
    <div className="admin-pro-panel">
      <div className="admin-pro-header">
        <div>
          <h2 className="font-display text-xl font-bold text-[#324023]">Store Content</h2>
          <p className="mt-1 text-sm text-[#75786e]">
            Edit text, images, and videos shown on the live website.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn"
          disabled={saving}
          onClick={() => void save(tab)}
        >
          {saving ? "Saving…" : `Save ${TABS.find((t) => t.id === tab)?.label ?? "section"}`}
        </button>
      </div>

      <div className="admin-tabs mt-4 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={cn("admin-tab", tab === t.id && "admin-tab--active")}
            onClick={() => setTab(t.id)}
          >
            <span aria-hidden>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="admin-pro-card mt-4 p-5 md:p-6">
        {tab === "hero" ? (
          <div className="space-y-5">
            <AdminMediaPicker
              label="Hero product image"
              value={String(hero.image ?? "")}
              onChange={(url) => updateField("hero", "image", url)}
              kind="image"
              hint="Shown on the homepage hero — right side product shot."
            />
            <label className="admin-field">
              <span className="admin-field-label">Tagline 🔒 protected</span>
              <input className="admin-input opacity-60" value={String(hero.tagline ?? "")} readOnly />
            </label>
            <label className="admin-field">
              <span className="admin-field-label">Subtitle</span>
              <textarea
                className="admin-input min-h-[88px]"
                value={String(hero.subtitle ?? "")}
                onChange={(e) => updateField("hero", "subtitle", e.target.value)}
              />
            </label>
            <label className="admin-field">
              <span className="admin-field-label">Lung test button text</span>
              <input
                className="admin-input"
                value={String(hero.cta_text ?? "")}
                onChange={(e) => updateField("hero", "cta_text", e.target.value)}
              />
            </label>
          </div>
        ) : null}

        {tab === "product" ? (
          <div className="space-y-5">
            <label className="admin-field">
              <span className="admin-field-label">Product name</span>
              <input
                className="admin-input"
                value={String(product.name ?? "")}
                onChange={(e) => updateField("product", "name", e.target.value)}
              />
            </label>
            <label className="admin-field">
              <span className="admin-field-label">Short description</span>
              <textarea
                className="admin-input min-h-[88px]"
                value={String(product.short_description ?? "")}
                onChange={(e) => updateField("product", "short_description", e.target.value)}
              />
            </label>
            <p className="rounded-xl bg-[#9A6F1A]/10 px-4 py-3 text-sm text-[#6b4e1a]">
              Price is locked — contact Manoj Bhai to change (₹{String(product.price ?? "")})
            </p>
            <label className="admin-field">
              <span className="admin-field-label">Discount badge</span>
              <input
                className="admin-input"
                value={String(product.discount_badge ?? "")}
                onChange={(e) => updateField("product", "discount_badge", e.target.value)}
              />
            </label>
          </div>
        ) : null}

        {tab === "herbs" ? (
          <div className="space-y-4">
            <p className="text-sm text-[#75786e]">
              Sacred Seven herb cards on the homepage. Names are protected; you can update images
              and benefit text.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {HERB_NAMES.map((name) => (
                <div key={name} className="admin-herb-card">
                  <h3 className="font-display text-lg font-bold text-[#324023]">{name}</h3>
                  <AdminMediaPicker
                    label="Herb photo"
                    value={herbs[name]?.image ?? ""}
                    onChange={(url) =>
                      patchSection("herbs", {
                        ...herbs,
                        [name]: { ...herbs[name], image: url },
                      })
                    }
                    kind="image"
                  />
                  <label className="admin-field mt-3">
                    <span className="admin-field-label">Benefit text</span>
                    <textarea
                      className="admin-input min-h-[72px]"
                      value={herbs[name]?.benefit ?? ""}
                      onChange={(e) =>
                        patchSection("herbs", {
                          ...herbs,
                          [name]: { ...herbs[name], benefit: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "videos" ? (
          <div className="space-y-5">
            <p className="text-sm text-[#75786e]">
              Doctor endorsement videos on the homepage. Attach MP4 files or pick from the live site
              library.
            </p>
            {doctors.map((doc, i) => (
              <div key={doc.id} className="admin-herb-card">
                <h3 className="font-display font-bold text-[#324023]">Doctor {i + 1}</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <label className="admin-field">
                    <span className="admin-field-label">Name</span>
                    <input
                      className="admin-input"
                      value={doc.name}
                      onChange={(e) => {
                        const next = [...doctors];
                        next[i] = { ...doc, name: e.target.value };
                        patchSection("videos", { doctors: next });
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field-label">Title</span>
                    <input
                      className="admin-input"
                      value={doc.title}
                      onChange={(e) => {
                        const next = [...doctors];
                        next[i] = { ...doc, title: e.target.value };
                        patchSection("videos", { doctors: next });
                      }}
                    />
                  </label>
                </div>
                <AdminMediaPicker
                  label="Video file"
                  value={doc.videoSrc}
                  onChange={(url) => {
                    const next = [...doctors];
                    next[i] = { ...doc, videoSrc: url };
                    patchSection("videos", { doctors: next });
                  }}
                  kind="video"
                />
              </div>
            ))}
          </div>
        ) : null}

        {(tab === "testimonials" || tab === "faq") && (
          <label className="admin-field">
            <span className="admin-field-label">{tab === "testimonials" ? "Testimonials" : "FAQ"} (JSON)</span>
            <textarea
              className="admin-input min-h-[200px] font-mono text-xs"
              value={JSON.stringify(sections[tab] ?? [], null, 2)}
              onChange={(e) => {
                try {
                  patchSection(tab, JSON.parse(e.target.value) as unknown);
                } catch {
                  /* typing */
                }
              }}
            />
            <span className="admin-field-hint">Upload customer photos in Media, then paste URLs in JSON.</span>
          </label>
        )}
      </div>
    </div>
  );
}
