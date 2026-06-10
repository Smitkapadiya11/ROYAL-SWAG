export const LUNG_TEST_QUESTION_COUNT = 7;

export const LUNG_TEST_STORAGE_KEY = "lungTestResult";

export type StoredLungResult = {
  name: string;
  email: string;
  phone: string;
  city: boolean;
  smoke: boolean;
  cough: boolean;
  breathless: boolean;
  dust: boolean;
  mucus: boolean;
  worsened: boolean;
  breathHoldSeconds?: number;
  score: number;
  level: "Mild" | "Moderate" | "High";
  riskSlug: "mild" | "moderate" | "high";
  matchedHerbs: string[];
  timestamp?: number;
};

export function readStoredLungResult(): StoredLungResult | null {
  if (typeof window === "undefined") return null;
  for (const key of [LUNG_TEST_STORAGE_KEY, "lung_lead"]) {
    try {
      const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as StoredLungResult;
      if (parsed?.name && typeof parsed.score === "number") {
        return {
          ...parsed,
          mucus: Boolean(parsed.mucus),
          worsened: Boolean(parsed.worsened),
          matchedHerbs: parsed.matchedHerbs ?? [],
        };
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

export function writeStoredLungResult(payload: StoredLungResult): void {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(payload);
    sessionStorage.setItem(LUNG_TEST_STORAGE_KEY, json);
    localStorage.setItem(LUNG_TEST_STORAGE_KEY, json);
  } catch {
    /* ignore */
  }
}

export function clearStoredLungResult(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(LUNG_TEST_STORAGE_KEY);
    localStorage.removeItem(LUNG_TEST_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
