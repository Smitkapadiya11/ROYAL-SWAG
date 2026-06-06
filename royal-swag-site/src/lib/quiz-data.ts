export type QuizOption = {
  label: string;
  score: number;
};

export type QuizQuestion = {
  id: string;
  step: number;
  question: string;
  multiSelect?: boolean;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Original 7 questions ────────────────────────────────────────
  {
    id: "shortness-of-breath",
    step: 1,
    question: "How often do you feel short of breath?",
    options: [
      { label: "Never", score: 0 },
      { label: "Sometimes", score: 1 },
      { label: "Often", score: 2 },
      { label: "Always", score: 3 },
    ],
  },
  {
    id: "smoking",
    step: 2,
    question: "Do you smoke or live with a smoker?",
    options: [
      { label: "Non-smoker", score: 0 },
      { label: "Quit smoking", score: 1 },
      { label: "Passive smoker", score: 2 },
      { label: "Current smoker", score: 3 },
    ],
  },
  {
    id: "air-quality",
    step: 3,
    question: "What is your city's air quality like?",
    options: [
      { label: "Clean area", score: 0 },
      { label: "Moderate pollution", score: 1 },
      { label: "High pollution", score: 2 },
      { label: "Very high pollution", score: 3 },
    ],
  },
  {
    id: "morning-cough",
    step: 4,
    question: "Do you experience morning cough or chest tightness?",
    options: [
      { label: "Never", score: 0 },
      { label: "Occasionally", score: 1 },
      { label: "Frequently", score: 2 },
      { label: "Every day", score: 3 },
    ],
  },
  {
    id: "energy-level",
    step: 5,
    question: "How is your energy level throughout the day?",
    options: [
      { label: "Very high", score: 0 },
      { label: "Good", score: 1 },
      { label: "Low", score: 2 },
      { label: "Very fatigued", score: 3 },
    ],
  },
  {
    id: "conditions",
    step: 6,
    question: "Do you have any of these? (Select all that apply)",
    multiSelect: true,
    options: [
      { label: "Dust allergy", score: 1 },
      { label: "Asthma", score: 2 },
      { label: "Frequent cold", score: 1 },
      { label: "None of the above", score: 0 },
    ],
  },
  {
    id: "age-group",
    step: 7,
    question: "Your age group?",
    options: [
      { label: "Under 25", score: 0 },
      { label: "25–35", score: 1 },
      { label: "35–50", score: 2 },
      { label: "50+", score: 3 },
    ],
  },

  // ── 5 Symptom Questions (Sprint 2 — Task 2.1) ────────────────────
  {
    id: "pollution-city",
    step: 8,
    question: "Do you live in a high-pollution city (e.g., Delhi, Mumbai, Pune, Kanpur)?",
    options: [
      { label: "No — I live in a clean or rural area", score: 0 },
      { label: "Yes — moderate pollution city", score: 1 },
      { label: "Yes — heavily polluted city", score: 2 },
    ],
  },
  {
    id: "recently-quit",
    step: 9,
    question: "Do you smoke or have you recently quit smoking (within last 2 years)?",
    options: [
      { label: "No — never smoked", score: 0 },
      { label: "Quit more than 2 years ago", score: 1 },
      { label: "Recently quit (within 2 years)", score: 2 },
      { label: "Still smoking", score: 3 },
    ],
  },
  {
    id: "persistent-morning-cough",
    step: 10,
    question: "Do you have a persistent morning cough that produces phlegm or mucus?",
    options: [
      { label: "No", score: 0 },
      { label: "Occasionally", score: 1 },
      { label: "Yes, most mornings", score: 2 },
    ],
  },
  {
    id: "breathless-stairs",
    step: 11,
    question: "Do you feel breathless or tired when climbing stairs or walking fast?",
    options: [
      { label: "No — I feel fine", score: 0 },
      { label: "Slightly breathless", score: 1 },
      { label: "Yes — noticeably short of breath", score: 2 },
    ],
  },
  {
    id: "occupational-exposure",
    step: 12,
    question: "Do you work near dust, chemicals, fumes, or construction sites?",
    options: [
      { label: "No", score: 0 },
      { label: "Occasionally / once a week", score: 1 },
      { label: "Yes — daily exposure", score: 2 },
    ],
  },
];

export type LungHealthTier = "healthy" | "mild" | "moderate" | "high";

export type TierResult = {
  tier: LungHealthTier;
  label: string;
  emoji: string;
  color: string;         // Tailwind text color
  bgColor: string;       // Tailwind bg color
  borderColor: string;   // Tailwind border color
  gaugeColor: string;    // SVG stroke color
  headline: string;
  subtitle: string;
  recommendations: string[];
  ingredients: { name: string; benefit: string }[];
};

export const TIER_RESULTS: Record<LungHealthTier, TierResult> = {
  healthy: {
    tier: "healthy",
    label: "Healthy Lungs",
    emoji: "🟢",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    gaugeColor: "#10b981",
    headline: "Your Lungs Look Great!",
    subtitle:
      "Your respiratory health is in good shape. A maintenance routine will keep it that way.",
    recommendations: [
      "Drink Royal Swag tea once daily as a maintenance ritual to stay ahead of urban pollution.",
      "Practice 10 minutes of deep breathing exercises each morning.",
      "Maintain your current lifestyle — keep avoiding smoking and high-pollution areas.",
    ],
    ingredients: [
      { name: "Tulsi", benefit: "Daily immunity booster and antioxidant" },
      { name: "Ginger", benefit: "Anti-inflammatory and digestive support" },
    ],
  },
  mild: {
    tier: "mild",
    label: "Mild Risk",
    emoji: "🟡",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    gaugeColor: "#eab308",
    headline: "Mild Signs of Stress on Your Lungs",
    subtitle:
      "Early intervention now will prevent these mild signs from progressing.",
    recommendations: [
      "Start a twice-daily Royal Swag tea routine — morning on empty stomach and before bed.",
      "Try steam inhalation twice a week with a drop of eucalyptus oil.",
      "Reduce exposure to indoor pollutants: incense, chemical cleaners, synthetic fragrances.",
    ],
    ingredients: [
      { name: "Tulsi", benefit: "Reduces inflammation and boosts immunity" },
      { name: "Mulethi", benefit: "Soothes mild irritation in airways" },
      { name: "Ginger", benefit: "Warming herb for respiratory comfort" },
    ],
  },
  moderate: {
    tier: "moderate",
    label: "Moderate Risk",
    emoji: "🟠",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    gaugeColor: "#f97316",
    headline: "Your Lungs Need Some Attention",
    subtitle:
      "There are clear signs of respiratory stress. A consistent detox routine is strongly recommended.",
    recommendations: [
      "Use Royal Swag tea twice daily consistently for at least 30 days for visible results.",
      "Do Anulom Vilom (alternate nostril breathing) for 10 minutes every morning.",
      "Consider a pulmonologist check-up if symptoms have persisted for 3+ months.",
    ],
    ingredients: [
      { name: "Vasaka", benefit: "Clears mucus and opens airways" },
      { name: "Mulethi", benefit: "Soothes persistently irritated airways" },
      { name: "Pippali", benefit: "Activates detox and boosts herb bioavailability" },
      { name: "Tulsi", benefit: "Powerful anti-inflammatory" },
    ],
  },
  high: {
    tier: "high",
    label: "High Risk",
    emoji: "🔴",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    gaugeColor: "#ef4444",
    headline: "Your Lungs Need Urgent Care",
    subtitle:
      "Your score indicates significant respiratory stress. Start a detox plan today and consult a doctor.",
    recommendations: [
      "Begin an intensive Royal Swag protocol: 2 cups daily + steam inhalation every day for 2 weeks.",
      "Visit a pulmonologist for a spirometry test — do not delay.",
      "Eliminate all smoking exposure (active and passive) immediately.",
    ],
    ingredients: [
      { name: "Vasaka", benefit: "Most powerful expectorant for heavy mucus" },
      { name: "Pippali", benefit: "Stimulates and repairs damaged lung tissue" },
      { name: "Mulethi", benefit: "Calms severe airway inflammation" },
      { name: "Tulsi", benefit: "Fights infection and rebuilds lung immunity" },
    ],
  },
};

export function calculateScore(answers: number[]): number {
  return answers.reduce((sum, val) => sum + val, 0);
}

export function getTier(score: number): LungHealthTier {
  if (score <= 8)  return "healthy";
  if (score <= 16) return "mild";
  if (score <= 24) return "moderate";
  return "high";
}

export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length; // 12
export const MAX_SCORE = 31; // 7×3=21 original + 5 new (max 2 each = 10) → 31
