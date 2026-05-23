import type { SymptomKey } from "@/lib/lungScore";

export type LungTestQuestion = {
  id: string;
  key: SymptomKey;
  points: number;
  emoji: string;
  question: string;
  subtitle: string;
};

export const LUNG_TEST_QUESTIONS: readonly LungTestQuestion[] = [
  {
    id: "pollution",
    key: "city",
    points: 2,
    emoji: "🏙️",
    question: "Do you live in a high-pollution city?",
    subtitle: "Cities like Delhi, Mumbai, Surat, Ahmedabad",
  },
  {
    id: "smoking",
    key: "smoke",
    points: 3,
    emoji: "🚬",
    question: "Do you smoke or have you recently quit?",
    subtitle: "Current or past 5 years",
  },
  {
    id: "cough",
    key: "cough",
    points: 2,
    emoji: "🌅",
    question: "Do you have morning cough or congestion?",
    subtitle: "Regularly, most mornings",
  },
  {
    id: "breathless",
    key: "breathless",
    points: 2,
    emoji: "🏃",
    question: "Do you feel breathless climbing stairs?",
    subtitle: "Even just 2-3 floors",
  },
  {
    id: "dust",
    key: "dust",
    points: 2,
    emoji: "🏭",
    question: "Do you work near dust, chemicals, or fumes?",
    subtitle: "Factory, construction, kitchen, traffic",
  },
] as const;

export const HERB_IMAGE_BY_NAME: Record<string, string> = {
  Vasaka: "/images/herbs/vasaka.jpeg",
  Pippali: "/images/herbs/pippali.jpeg",
  Tulsi: "/images/herbs/tulsi.jpg",
  Mulethi: "/images/herbs/mulethi.jpeg",
  Kantakari: "/images/herbs/kantakari.jpg",
  Pushkarmool: "/images/herbs/pushkarmool.jpg",
};
