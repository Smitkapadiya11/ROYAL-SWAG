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
    subtitle: "Delhi, Mumbai, Surat, Ahmedabad, and similar metros",
  },
  {
    id: "smoking",
    key: "smoke",
    points: 3,
    emoji: "🚬",
    question: "Do you smoke, or have you quit smoking in the last 2 years?",
    subtitle: "Includes cigarettes, bidis, or vaping",
  },
  {
    id: "cough",
    key: "cough",
    points: 3,
    emoji: "🌅",
    question: "Do you wake up with a morning cough or chest heaviness?",
    subtitle: "Most mornings, even before you leave bed",
  },
  {
    id: "breathless",
    key: "breathless",
    points: 2,
    emoji: "🏃",
    question: "Do you feel breathless climbing stairs or walking fast?",
    subtitle: "Even routine daily activity",
  },
  {
    id: "dust",
    key: "dust",
    points: 2,
    emoji: "🏭",
    question: "Do you work near dust, chemicals, paint, or fumes?",
    subtitle: "Factory, construction, kitchen, traffic, or workshops",
  },
  {
    id: "mucus",
    key: "mucus",
    points: 1,
    emoji: "🗣️",
    question: "Do you have frequent throat clearing or mucus buildup?",
    subtitle: "Clearing your throat often through the day",
  },
  {
    id: "worsened",
    key: "worsened",
    points: 2,
    emoji: "📉",
    question: "Do you feel your breathing has worsened in the last 6 months?",
    subtitle: "Compared to six months ago",
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
