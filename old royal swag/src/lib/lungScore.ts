/** Lung health symptom scoring — 7 questions + result bands */

export type SymptomKey =
  | "city"
  | "smoke"
  | "cough"
  | "breathless"
  | "dust"
  | "mucus"
  | "worsened";

export type SymptomAnswers = Record<SymptomKey, boolean>;

export const SYMPTOM_QUESTIONS: ReadonlyArray<{
  key: SymptomKey;
  text: string;
  weight: number;
}> = [
  { key: "city", text: "High-pollution city", weight: 2 },
  { key: "smoke", text: "Smoking / recent quit", weight: 3 },
  { key: "cough", text: "Morning cough or chest heaviness", weight: 3 },
  { key: "breathless", text: "Breathless on stairs", weight: 2 },
  { key: "dust", text: "Dust, chemicals, or fumes exposure", weight: 2 },
  { key: "mucus", text: "Throat clearing / mucus buildup", weight: 1 },
  { key: "worsened", text: "Breathing worsened (6 months)", weight: 2 },
] as const;

export const MAX_SYMPTOM_POINTS = SYMPTOM_QUESTIONS.reduce((s, q) => s + q.weight, 0);

export type LungLevel = "Mild" | "Moderate" | "High";
export type RiskSlug = "mild" | "moderate" | "high";

export interface LungScore {
  points: number;
  level: LungLevel;
  riskSlug: RiskSlug;
  color: string;
  label: string;
  recommendation: string;
  subtitle: string;
}

export function riskSlugFromLevel(level: LungLevel): RiskSlug {
  if (level === "Mild") return "mild";
  if (level === "Moderate") return "moderate";
  return "high";
}

export function computeSymptomPoints(answers: SymptomAnswers): number {
  return SYMPTOM_QUESTIONS.reduce(
    (sum, q) => sum + (answers[q.key] ? q.weight : 0),
    0
  );
}

/** Adjust symptom score from breath-hold capacity test (seconds). */
export function adjustScoreForBreathHold(points: number, breathHoldSeconds: number): number {
  if (breathHoldSeconds >= 40) return Math.max(0, points - 2);
  if (breathHoldSeconds >= 20) return points;
  return points + 3;
}

export function getLungScore(points: number): LungScore {
  if (points <= 4) {
    return {
      points,
      level: "Mild",
      riskSlug: "mild",
      color: "#4CAF50",
      label: "MILD",
      subtitle: "Your lungs are holding up well — preventive care will keep them strong.",
      recommendation:
        "Your symptom score is in the mild range. Keep protecting your lungs with clean air habits and consider preventive herbal support.",
    };
  }
  if (points <= 9) {
    return {
      points,
      level: "Moderate",
      riskSlug: "moderate",
      color: "#FF9800",
      label: "MODERATE",
      subtitle: "Your lungs are under stress — a structured detox can restore clarity.",
      recommendation:
        "Your lungs are showing moderate stress from pollution or lifestyle factors. A structured 30-day detox routine can help clear buildup before symptoms worsen.",
    };
  }
  return {
    points,
    level: "High",
    riskSlug: "high",
    color: "#F44336",
    label: "HIGH",
    subtitle: "Significant strain detected — early daily detox is strongly recommended.",
    recommendation:
      "Your answers suggest significant respiratory strain. Start a daily lung detox plan now — early action makes recovery faster and easier.",
  };
}

export type HerbHighlight = {
  id: string;
  name: string;
  line: string;
  highlight: boolean;
};

export type SymptomHerbMatch = {
  symptomKey: SymptomKey;
  symptomLabel: string;
  herbName: string;
  benefit: string;
};

const HERB_BENEFITS: Record<string, string> = {
  Tulsi: "Fights pollution-related inflammation and morning respiratory stress",
  Vasaka: "Clears chest heaviness and supports open, easy breathing",
  Mulethi: "Soothes throat irritation and reduces mucus buildup",
  Pippali: "Aids smoking recovery and rebuilds lung capacity",
};

export function getSymptomHerbMatches(answers: SymptomAnswers): SymptomHerbMatch[] {
  const matches: SymptomHerbMatch[] = [];

  const add = (key: SymptomKey, label: string, herbName: string) => {
    if (!answers[key]) return;
    matches.push({
      symptomKey: key,
      symptomLabel: label,
      herbName,
      benefit: HERB_BENEFITS[herbName] ?? "Supports respiratory wellness",
    });
  };

  add("city", "High-pollution city exposure", "Tulsi");
  add("smoke", "Smoking or recent quit", "Pippali");
  add("cough", "Morning cough", "Tulsi");
  add("cough", "Chest heaviness", "Vasaka");
  add("breathless", "Breathlessness on exertion", "Vasaka");
  add("dust", "Dust, chemicals, or fumes", "Pippali");
  add("mucus", "Throat clearing / mucus", "Mulethi");
  add("worsened", "Worsening breathing (6 months)", "Pippali");

  return matches;
}

export function getMatchedHerbNames(answers: SymptomAnswers): string[] {
  const names = new Set<string>();
  for (const m of getSymptomHerbMatches(answers)) {
    names.add(m.herbName);
  }
  if (names.size === 0) {
    return ["Tulsi", "Vasaka"];
  }
  return [...names];
}

export function getHerbRecommendations(answers: SymptomAnswers): HerbHighlight[] {
  const out: HerbHighlight[] = [];
  const seen = new Set<string>();

  for (const match of getSymptomHerbMatches(answers)) {
    if (seen.has(match.herbName)) continue;
    seen.add(match.herbName);
    out.push({
      id: match.herbName.toLowerCase(),
      name: match.herbName,
      line: match.benefit,
      highlight: true,
    });
  }

  if (out.length === 0) {
    return [
      { id: "tulsi", name: "Tulsi", line: HERB_BENEFITS.Tulsi, highlight: true },
      { id: "vasaka", name: "Vasaka", line: HERB_BENEFITS.Vasaka, highlight: true },
    ];
  }

  return out;
}

export type BreathHoldInsight = {
  seconds: number;
  tier: "low" | "average" | "strong" | "excellent";
  label: string;
  color: string;
  note: string;
};

export function getBreathHoldInsight(seconds: number): BreathHoldInsight {
  const s = Math.max(0, Math.round(seconds * 10) / 10);
  if (s < 20) {
    return {
      seconds: s,
      tier: "low",
      label: "Below average hold",
      color: "#F44336",
      note: "Most healthy adults hold 40–60 seconds. Shorter holds often pair with higher symptom scores.",
    };
  }
  if (s < 40) {
    return {
      seconds: s,
      tier: "average",
      label: "Average capacity",
      color: "#FF9800",
      note: "Room to improve — daily breath work plus herbal detox can raise retention over 2–4 weeks.",
    };
  }
  if (s < 55) {
    return {
      seconds: s,
      tier: "strong",
      label: "Good lung retention",
      color: "#4CAF50",
      note: "Solid hold time. Symptom score still matters — toxins from pollution can build silently.",
    };
  }
  return {
    seconds: s,
    tier: "excellent",
    label: "Excellent hold",
    color: "#4CAF50",
    note: "Strong breath hold! Keep protecting lungs from daily pollution with preventive care.",
  };
}

/** @deprecated Use getLungScore + computeSymptomPoints */
export function computeLungTestScore(yesAnswers: readonly boolean[]): number {
  const keys: SymptomKey[] = [
    "city",
    "smoke",
    "cough",
    "breathless",
    "dust",
    "mucus",
    "worsened",
  ];
  const answers = keys.reduce((acc, k, i) => {
    acc[k] = !!yesAnswers[i];
    return acc;
  }, {} as SymptomAnswers);
  return computeSymptomPoints(answers);
}

/** @deprecated Use getLungScore */
export function getLungTestRiskBand(score: number): RiskSlug {
  return getLungScore(score).riskSlug;
}

export const LUNG_TEST_MAX_SCORE = MAX_SYMPTOM_POINTS;
