/** Lung health symptom scoring — 5 questions + result bands */

export type SymptomKey = "city" | "smoke" | "cough" | "breathless" | "dust";

export type SymptomAnswers = Record<SymptomKey, boolean>;

export const SYMPTOM_QUESTIONS: ReadonlyArray<{
  key: SymptomKey;
  text: string;
  weight: number;
}> = [
  { key: "city", text: "Do you live in a high-pollution city?", weight: 2 },
  { key: "smoke", text: "Do you smoke or recently quit?", weight: 3 },
  { key: "cough", text: "Do you have morning cough?", weight: 2 },
  { key: "breathless", text: "Feel breathless climbing stairs?", weight: 2 },
  { key: "dust", text: "Work near dust, chemicals, or fumes?", weight: 2 },
] as const;

export const MAX_SYMPTOM_POINTS = SYMPTOM_QUESTIONS.reduce((s, q) => s + q.weight, 0);

export type LungLevel = "Mild" | "Moderate" | "High";

export interface LungScore {
  points: number;
  level: LungLevel;
  color: string;
  recommendation: string;
}

export function computeSymptomPoints(answers: SymptomAnswers): number {
  return SYMPTOM_QUESTIONS.reduce(
    (sum, q) => sum + (answers[q.key] ? q.weight : 0),
    0
  );
}

export function getLungScore(points: number): LungScore {
  if (points <= 3) {
    return {
      points,
      level: "Mild",
      color: "#16a34a",
      recommendation:
        "Your symptom score is in the mild range. Keep protecting your lungs with clean air habits and consider preventive herbal support.",
    };
  }
  if (points <= 6) {
    return {
      points,
      level: "Moderate",
      color: "#d97706",
      recommendation:
        "Your lungs are showing moderate stress from pollution or lifestyle factors. A structured 30-day detox routine can help clear buildup before symptoms worsen.",
    };
  }
  return {
    points,
    level: "High",
    color: "#dc2626",
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

export function getHerbRecommendations(answers: SymptomAnswers): HerbHighlight[] {
  const out: HerbHighlight[] = [];
  const seen = new Set<string>();

  const push = (id: string, name: string, line: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ id, name, line, highlight: true });
  };

  if (answers.smoke) {
    push("vasaka", "Vasaka", "Clears tar and opens airways — key for smokers & recent quitters");
    push("pippali", "Pippali", "Rebuilds lung capacity and oxygen uptake");
  }
  if (answers.city) {
    push("tulsi", "Tulsi", "Fights pollution-related inflammation");
    push("mulethi", "Mulethi", "Soothes irritated airways from PM2.5 exposure");
  }
  if (answers.cough) {
    push("kantakari", "Kantakari", "Targets morning cough and mucus buildup");
  }
  if (answers.breathless) {
    push("pippali", "Pippali", "Supports stamina and breath on exertion");
  }
  if (answers.dust) {
    push("vasaka", "Vasaka", "Helps clear occupational dust & fume exposure");
    push("tulsi", "Tulsi", "Antioxidant shield for chemical irritants");
  }

  if (out.length === 0) {
    push("tulsi", "Tulsi", "Daily lung shield for urban India");
    push("vasaka", "Vasaka", "Keeps airways clear year-round");
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
      color: "#dc2626",
      note: "Most healthy adults hold 40–60 seconds. Shorter holds often pair with higher symptom scores.",
    };
  }
  if (s < 40) {
    return {
      seconds: s,
      tier: "average",
      label: "Average capacity",
      color: "#d97706",
      note: "Room to improve — daily breath work plus herbal detox can raise retention over 2–4 weeks.",
    };
  }
  if (s < 55) {
    return {
      seconds: s,
      tier: "strong",
      label: "Good lung retention",
      color: "#16a34a",
      note: "Solid hold time. Symptom score still matters — toxins from pollution can build silently.",
    };
  }
  return {
    seconds: s,
    tier: "excellent",
    label: "Excellent hold",
    color: "#16a34a",
    note: "Strong breath hold! Keep protecting lungs from daily pollution with preventive care.",
  };
}

/** @deprecated Use getLungScore + computeSymptomPoints */
export function computeLungTestScore(yesAnswers: readonly boolean[]): number {
  const keys: SymptomKey[] = ["city", "smoke", "cough", "breathless", "dust"];
  const answers = keys.reduce((acc, k, i) => {
    acc[k] = !!yesAnswers[i];
    return acc;
  }, {} as SymptomAnswers);
  return computeSymptomPoints(answers);
}

/** @deprecated Use getLungScore */
export function getLungTestRiskBand(score: number): "low" | "moderate" | "high" {
  const { level } = getLungScore(score);
  if (level === "Mild") return "low";
  if (level === "Moderate") return "moderate";
  return "high";
}

export const LUNG_TEST_MAX_SCORE = MAX_SYMPTOM_POINTS;
