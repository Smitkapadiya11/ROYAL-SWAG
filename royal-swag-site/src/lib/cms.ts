import { cache } from "react";
import { DEFAULT_CMS_CONTENT } from "@/lib/cms-defaults";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type CmsSections = typeof DEFAULT_CMS_CONTENT;

function mergeSections(
  rows: { section_key: string; content: Record<string, unknown> }[] | null
): CmsSections {
  const merged: Record<string, unknown> = { ...DEFAULT_CMS_CONTENT };
  for (const row of rows ?? []) {
    const prev = merged[row.section_key];
    const base =
      prev && typeof prev === "object" && !Array.isArray(prev)
        ? (prev as Record<string, unknown>)
        : {};
    merged[row.section_key] = {
      ...base,
      ...row.content,
    };
  }
  return merged as CmsSections;
}

export const getCmsSections = cache(async (): Promise<CmsSections> => {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("cms_content")
      .select("section_key, content");

    if (error) {
      return DEFAULT_CMS_CONTENT as CmsSections;
    }

    return mergeSections(
      (data ?? []) as { section_key: string; content: Record<string, unknown> }[]
    );
  } catch {
    return DEFAULT_CMS_CONTENT as CmsSections;
  }
});

export async function getCmsSection<K extends keyof CmsSections>(
  key: K
): Promise<CmsSections[K]> {
  const sections = await getCmsSections();
  return (sections[key] ?? DEFAULT_CMS_CONTENT[key]) as CmsSections[K];
}
