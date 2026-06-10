"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { LungHealthReport } from "@/components/lung-test/LungHealthReport";
import {
  clearStoredLungResult,
  readStoredLungResult,
  type StoredLungResult,
} from "@/lib/lung-test-constants";
import { getLungScore, getMatchedHerbNames } from "@/lib/lungScore";
import { EVENTS, trackEvent } from "@/lib/events";

function readFromUrlParams(searchParams: URLSearchParams): StoredLungResult | null {
  const name = searchParams.get("name");
  const scoreRaw = searchParams.get("score");
  if (!name?.trim() || !scoreRaw) return null;

  const score = Number(scoreRaw);
  if (!Number.isFinite(score)) return null;

  const lungScore = getLungScore(score);
  return {
    name: name.trim(),
    email: searchParams.get("email")?.trim() ?? "",
    phone: searchParams.get("phone")?.trim() ?? "",
    city: false,
    smoke: false,
    cough: false,
    breathless: false,
    dust: false,
    mucus: false,
    worsened: false,
    score,
    level: lungScore.level,
    riskSlug: lungScore.riskSlug,
    matchedHerbs: getMatchedHerbNames({
      city: false,
      smoke: false,
      cough: false,
      breathless: false,
      dust: false,
      mucus: false,
      worsened: false,
    }),
    timestamp: Date.now(),
  };
}

export default function LungTestResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stored, setStored] = useState<StoredLungResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const fromStorage = readStoredLungResult();
      const fromUrl = searchParams ? readFromUrlParams(searchParams) : null;
      setStored(fromStorage ?? fromUrl);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [searchParams]);

  useEffect(() => {
    if (stored) {
      try {
        sessionStorage.setItem("lung_test_lead_captured", "1");
      } catch {
        /* ignore */
      }
      trackEvent(EVENTS.LUNG_RESULT_VIEW, {
        score: stored.score,
        level: stored.level,
      });
    }
  }, [stored]);

  if (!loaded) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center bg-parchment">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#9A6F1A] border-t-transparent" />
      </div>
    );
  }

  if (!stored) {
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
            Your personalised score and herb matches appear here after the
            symptom quiz.
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

  return (
    <div className="min-h-screen bg-parchment">
      <header
        className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/60 px-5 backdrop-blur-md md:px-10"
        style={{ background: "rgba(255,255,255,0.45)" }}
      >
        <Link href="/" aria-label="Royal Swag home">
          <BrandLogo variant="on-light" className="h-9 w-auto md:h-10" />
        </Link>
        <span className="rounded-full bg-[#324023]/10 px-3 py-1 font-sans text-xs font-bold text-[#9A6F1A]">
          Lung Health Report
        </span>
      </header>

      <div className="mx-auto w-full max-w-lg px-5 pb-24 pt-8 md:max-w-4xl md:px-10">
        <LungHealthReport
          stored={stored}
          onRetake={() => {
            clearStoredLungResult();
            router.push("/lung-test");
          }}
        />
      </div>
    </div>
  );
}
