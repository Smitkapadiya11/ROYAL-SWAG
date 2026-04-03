"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getTier, TIER_RESULTS } from "@/lib/quiz-data";
import {
  ROYAL_SWAG_LOGO_HEIGHT,
  ROYAL_SWAG_LOGO_SRC,
  ROYAL_SWAG_LOGO_WIDTH,
} from "@/lib/brand-logo";

type Lead = {
  id: string;
  full_name: string;
  mobile: string;
  created_at: string;
  quiz_score: number | null;
  lung_tier: string | null;
};

function maskMobile(mobile: string) {
  if (mobile.length < 5) return mobile;
  return mobile.slice(0, 2) + "*".repeat(mobile.length - 4) + mobile.slice(-3);
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    Healthy: "bg-green-50 text-green-700 border-green-200",
    "Mild Risk": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Moderate Risk": "bg-orange-50 text-orange-700 border-orange-200",
    "High Risk": "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
        colors[tier] ?? "bg-[var(--brand-sage)] text-[var(--brand-green)] border-[var(--brand-sage)]"
      }`}
    >
      {tier}
    </span>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const maxWait = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 2000);

    const run = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;

        if (!session?.user) {
          setUser(null);
          setLead(null);
          return;
        }

        setUser(session.user);

        const { data } = await supabase
          .from("leads")
          .select("*")
          .eq("email", session.user.email ?? "")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!cancelled) setLead(data ?? null);
      } catch {
        if (!cancelled) {
          setUser(null);
          setLead(null);
        }
      } finally {
        if (!cancelled) {
          window.clearTimeout(maxWait);
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
      window.clearTimeout(maxWait);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--brand-ivory)] pt-0">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-green)] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--brand-ivory)] px-4 pb-24 pt-8">
        <Image
          src={ROYAL_SWAG_LOGO_SRC}
          alt="Royal Swag"
          width={ROYAL_SWAG_LOGO_WIDTH}
          height={ROYAL_SWAG_LOGO_HEIGHT}
          className="mb-8 h-16 w-auto"
        />
        <h1
          className="mb-3 text-center text-2xl font-bold text-[var(--brand-dark)] sm:text-3xl"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Track Your Lung Health Journey
        </h1>
        <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-[var(--brand-dark)]/60">
          Complete the Free Lung Test to see your personalised profile.
        </p>
        <Link
          href="/lung-test"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--brand-green)] px-8 py-3 text-base font-bold text-[var(--brand-gold)] shadow-md transition hover:bg-[#163d29]"
        >
          Take the Free Lung Test →
        </Link>
      </div>
    );
  }

  const initials = (lead?.full_name ?? user?.email ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const memberSince = new Date(user?.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" });
  const testDate = lead?.created_at
    ? new Date(lead.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
    : null;
  const tierResult = lead?.quiz_score !== null && lead?.lung_tier ? getTier(lead.quiz_score!) : null;
  const tierData = tierResult ? TIER_RESULTS[tierResult] : null;

  return (
    <div className="min-h-screen bg-[var(--brand-ivory)] px-4 pb-20 pt-6">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="rounded-2xl border border-[var(--brand-sage)] bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--brand-gold)] text-xl font-bold text-white">
              {initials}
            </div>
            <div>
              <h1
                className="text-xl font-bold text-[var(--brand-dark)]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {lead?.full_name ?? user?.email}
              </h1>
              {lead?.mobile && (
                <p className="mt-0.5 text-sm text-[var(--brand-dark)]/50">
                  📱 +91 {maskMobile(lead.mobile)}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs font-medium text-[var(--brand-dark)]/35">Member since {memberSince}</p>
        </div>

        <div className="rounded-2xl border border-[var(--brand-sage)] bg-white p-7 shadow-sm">
          <h2
            className="mb-5 text-lg font-bold text-[var(--brand-dark)]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Lung Health
          </h2>

          {lead?.quiz_score !== null && lead?.lung_tier && tierData ? (
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <TierBadge tier={lead.lung_tier} />
                <span className="text-sm text-[var(--brand-dark)]/50">
                  Score: <strong>{lead.quiz_score}</strong> / 21
                </span>
                {testDate && <span className="ml-auto text-xs text-[var(--brand-dark)]/35">{testDate}</span>}
              </div>

              <div className="mb-6 space-y-2.5">
                {tierData.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="leading-relaxed text-[var(--brand-dark)]/65">{rec}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/lung-test"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-green)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-green)] transition-all hover:bg-[var(--brand-sage)]"
              >
                Retake Test →
              </Link>
            </div>
          ) : (
            <div
              className="rounded-2xl border-2 border-[var(--brand-gold)] p-6 text-center"
              style={{ animation: "pulse-border 2.5s ease-in-out infinite" }}
            >
              <style>{`
                @keyframes pulse-border {
                  0%, 100% { border-color: var(--brand-gold); }
                  50% { border-color: transparent; }
                }
              `}</style>
              <p className="mb-3 text-2xl">🫁</p>
              <h3
                className="mb-2 text-base font-bold text-[var(--brand-dark)]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                You haven&apos;t taken the Lung Test yet.
              </h3>
              <p className="mb-5 text-sm text-[var(--brand-dark)]/55">Discover your lung health score in 2 minutes.</p>
              <Link
                href="/lung-test"
                id="profile-take-test-btn"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-green)] px-7 py-4 text-sm font-bold text-[var(--brand-gold)] shadow-sm transition-all hover:bg-[#163d29] active:scale-95"
              >
                Take the Lung Test Now →
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-[var(--brand-sage)] bg-white p-7 shadow-sm">
          <h2
            className="mb-4 text-base font-bold text-[var(--brand-dark)]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Actions
          </h2>
          <Link
            href="/product"
            className="flex items-center justify-between rounded-xl border border-[var(--brand-sage)] px-5 py-4 transition-all hover:border-[var(--brand-green)] hover:bg-[var(--brand-sage)]/30"
          >
            <span className="text-sm font-medium text-[var(--brand-dark)]">🍃 View Our Product</span>
            <svg className="h-4 w-4 text-[var(--brand-dark)]/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={handleLogout}
            id="logout-btn"
            type="button"
            className="w-full rounded-xl border-2 border-red-200 px-5 py-4 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-95"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
