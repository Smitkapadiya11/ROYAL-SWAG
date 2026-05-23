"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LungTestResult } from "@/components/lung-test/LungTestResult";
import { LUNG_TEST_STORAGE_KEY } from "@/lib/lung-test-constants";
import type { LungLevel, SymptomAnswers } from "@/lib/lungScore";
import { EVENTS, trackEvent } from "@/lib/events";

type StoredResult = {
  name: string;
  email: string;
  phone: string;
  city: boolean;
  smoke: boolean;
  cough: boolean;
  breathless: boolean;
  dust: boolean;
  breathHoldSeconds?: number;
  score: number;
  level: LungLevel;
  timestamp?: number;
};

function readStored(): StoredResult | null {
  if (typeof window === "undefined") return null;
  for (const key of [LUNG_TEST_STORAGE_KEY, "lungTestResult", "lung_lead"]) {
    try {
      const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as StoredResult;
      if (key === "lung_lead" && parsed.name) {
        const full = sessionStorage.getItem(LUNG_TEST_STORAGE_KEY);
        if (full) return JSON.parse(full) as StoredResult;
        continue;
      }
      if (parsed?.name && typeof parsed.score === "number") {
        return parsed;
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

export default function LungTestResultClient() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setStored(readStored());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (stored) {
      trackEvent(EVENTS.LUNG_RESULT_VIEW, {
        score: stored.score,
        level: stored.level,
      });
    }
  }, [stored]);

  const answers: SymptomAnswers | null = useMemo(() => {
    if (!stored) return null;
    return {
      city: !!stored.city,
      smoke: !!stored.smoke,
      cough: !!stored.cough,
      breathless: !!stored.breathless,
      dust: !!stored.dust,
    };
  }, [stored]);

  if (!loaded) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center bg-parchment">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#9A6F1A] border-t-transparent" />
      </div>
    );
  }

  if (!stored || !answers) {
    return (
      <div className="flex min-h-[70svh] flex-col items-center justify-center bg-parchment px-5 py-16">
        <div className="max-w-md text-center">
          <span className="text-5xl" aria-hidden>
            🫁
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-[#324023] sm:text-3xl">
            Complete your lung test first
          </h1>
          <p className="mt-3 font-sans text-sm text-[#45483f]">
            Your personalised score, breath-hold result, and herb matches appear
            here after the quiz.
          </p>
          <Link
            href="/lung-test"
            className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-[#324023] px-6 py-3 font-sans text-base font-bold text-white"
          >
            Take Free Lung Test →
          </Link>
        </div>
      </div>
    );
  }

  const level = (stored.level as LungLevel) ?? "Mild";
  const breathSeconds = stored.breathHoldSeconds ?? 0;

  return (
    <div className="min-h-screen bg-parchment px-5 pb-24 pt-8">
      <div className="mx-auto max-w-lg">
        <p className="mb-2 text-center font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#9A6F1A]">
          {stored.name.trim().split(/\s+/)[0] ?? "Your"} lung profile
        </p>
        <LungTestResult
          score={stored.score}
          level={level}
          breathSeconds={breathSeconds}
          answers={answers}
          onRetake={() => {
            try {
              sessionStorage.removeItem(LUNG_TEST_STORAGE_KEY);
              localStorage.removeItem(LUNG_TEST_STORAGE_KEY);
            } catch {
              /* ignore */
            }
            router.push("/lung-test");
          }}
        />
      </div>
    </div>
  );
}
