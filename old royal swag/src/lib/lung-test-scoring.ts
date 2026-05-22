/** Per-question weights (Yes = add points). Max total = 20. */
export const LUNG_TEST_QUESTION_WEIGHTS = [3, 3, 2, 2, 3, 2, 2, 3] as const;

export const LUNG_TEST_MAX_SCORE = LUNG_TEST_QUESTION_WEIGHTS.reduce((a, b) => a + b, 0);

export function computeLungTestScore(yesAnswers: readonly boolean[]): number {
  return yesAnswers.reduce((sum, yes, i) => {
    const w = LUNG_TEST_QUESTION_WEIGHTS[i];
    if (w == null) return sum;
    return sum + (yes ? w : 0);
  }, 0);
}

export type LungTestRiskBand = "low" | "moderate" | "high";

export function getLungTestRiskBand(score: number): LungTestRiskBand {
  if (score <= 4) return "low";
  if (score <= 10) return "moderate";
  return "high";
}
