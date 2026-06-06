/** @deprecated Import from `@/lib/lungScore` */
export {
  computeLungTestScore,
  getLungTestRiskBand,
  LUNG_TEST_MAX_SCORE,
  type LungLevel,
} from "@/lib/lungScore";

export type LungTestRiskBand = "low" | "moderate" | "high";

export const LUNG_TEST_QUESTION_WEIGHTS = [2, 3, 2, 2, 2] as const;
