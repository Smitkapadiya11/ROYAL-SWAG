"use client";

import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const SECTIONS = [
  { key: "hero", title: "Hero Section" },
  { key: "product", title: "Product Info" },
  { key: "herbs", title: "Herb Descriptions" },
  { key: "testimonials", title: "Testimonials" },
  { key: "faq", title: "FAQ" },
  { key: "banners", title: "Homepage Banners" },
] as const;

export default function ContentPage() {
  const { data, mutate, isLoading } = useSWR("/api/dashboard/cms", fetcher);
  const [open, setOpen] = useState<string>("hero");
  const sections = (data?.sections ?? {}) as Record<string, Record<string, unknown>>;

  const save = async (sectionKey: string) => {
    const content = sections[sectionKey];
    const res = await fetch("/api/dashboard/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section_key: sectionKey, content }),
    });
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    toast.success("Saved — live site updates within ~60s");
    void mutate();
  };

  const updateField = (sectionKey: string, field: string, value: unknown) => {
    void mutate(
      {
        sections: {
          ...sections,
          [sectionKey]: { ...sections[sectionKey], [field]: value },
        },
      },
      false
    );
  };

  if (isLoading) {
    return <div className="dashboard-skeleton h-64" />;
  }

  const hero = sections.hero ?? {};
  const product = sections.product ?? {};
  const herbs = (sections.herbs ?? {}) as Record<string, { image?: string; benefit?: string }>;

  return (
    <div className="space-y-3">
      {SECTIONS.map((s) => (
        <div key={s.key} className="dashboard-card overflow-hidden">
          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
            onClick={() => setOpen(open === s.key ? "" : s.key)}
          >
            {s.title}
            <span>{open === s.key ? "−" : "+"}</span>
          </button>

          {open === s.key ? (
            <div className="space-y-4 border-t border-white/10 px-5 py-4 text-sm">
              {s.key === "hero" ? (
                <>
                  <label className="block text-[#9CA3AF]">
                    Hero image URL
                    <input
                      className="dashboard-input mt-1"
                      value={String(hero.image ?? "")}
                      onChange={(e) => updateField("hero", "image", e.target.value)}
                    />
                  </label>
                  <label className="block text-[#9CA3AF]">
                    Tagline 🔒
                    <input
                      className="dashboard-input mt-1 opacity-60"
                      value={String(hero.tagline ?? "")}
                      readOnly
                    />
                  </label>
                  <label className="block text-[#9CA3AF]">
                    Subtitle
                    <textarea
                      className="dashboard-input mt-1 min-h-[80px]"
                      value={String(hero.subtitle ?? "")}
                      onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                    />
                  </label>
                  <label className="block text-[#9CA3AF]">
                    CTA button text
                    <input
                      className="dashboard-input mt-1"
                      value={String(hero.cta_text ?? "")}
                      onChange={(e) => updateField("hero", "cta_text", e.target.value)}
                    />
                  </label>
                </>
              ) : null}

              {s.key === "product" ? (
                <>
                  <label className="block text-[#9CA3AF]">
                    Product name
                    <input
                      className="dashboard-input mt-1"
                      value={String(product.name ?? "")}
                      onChange={(e) => updateField("product", "name", e.target.value)}
                    />
                  </label>
                  <label className="block text-[#9CA3AF]">
                    Short description
                    <textarea
                      className="dashboard-input mt-1 min-h-[80px]"
                      value={String(product.short_description ?? "")}
                      onChange={(e) =>
                        updateField("product", "short_description", e.target.value)
                      }
                    />
                  </label>
                  <p className="text-[#F59E0B]">
                    Price 🔒 — Contact Manoj Bhai to change (₹{String(product.price ?? "")})
                  </p>
                  <label className="block text-[#9CA3AF]">
                    Discount badge text
                    <input
                      className="dashboard-input mt-1"
                      value={String(product.discount_badge ?? "")}
                      onChange={(e) =>
                        updateField("product", "discount_badge", e.target.value)
                      }
                    />
                  </label>
                </>
              ) : null}

              {s.key === "herbs" ? (
                <div className="space-y-4">
                  <p className="text-xs text-[#F59E0B]">
                    Requires Eximburg approval before publishing herb copy changes.
                  </p>
                  {["Tulsi", "Vasaka", "Mulethi", "Pippali"].map((name) => (
                    <div key={name} className="rounded-lg border border-white/10 p-3">
                      <p className="font-semibold">{name}</p>
                      <input
                        className="dashboard-input mt-2"
                        placeholder="Image URL"
                        value={herbs[name]?.image ?? ""}
                        onChange={(e) =>
                          void mutate(
                            {
                              sections: {
                                ...sections,
                                herbs: {
                                  ...herbs,
                                  [name]: { ...herbs[name], image: e.target.value },
                                },
                              },
                            },
                            false
                          )
                        }
                      />
                      <textarea
                        className="dashboard-input mt-2 min-h-[60px]"
                        placeholder="Benefit text"
                        value={herbs[name]?.benefit ?? ""}
                        onChange={(e) =>
                          void mutate(
                            {
                              sections: {
                                ...sections,
                                herbs: {
                                  ...herbs,
                                  [name]: { ...herbs[name], benefit: e.target.value },
                                },
                              },
                            },
                            false
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {s.key === "testimonials" || s.key === "faq" || s.key === "banners" ? (
                <p className="text-[#9CA3AF]">
                  JSON editor for {s.title} — use Media for assets. Full drag-and-drop
                  editor ships in Sprint 3. Current data is preserved on save.
                </p>
              ) : null}

              <button type="button" className="dashboard-btn" onClick={() => void save(s.key)}>
                Save {s.title}
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
