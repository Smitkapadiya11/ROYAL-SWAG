"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getTier, TIER_RESULTS } from "@/lib/quiz-data";

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
    "Healthy": "bg-green-50 text-green-700 border-green-200",
    "Mild Risk": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Moderate Risk": "bg-orange-50 text-orange-700 border-orange-200",
    "High Risk": "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colors[tier] ?? "bg-[var(--brand-sage)] text-[var(--brand-green)] border-[var(--brand-sage)]"}`}>
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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/account/login");
        return;
      }
      setUser(session.user);

      // Fetch the most recent lead for this user's email/phone
      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("email", session.user.email ?? "")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setLead(data ?? null);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-ivory)] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[var(--brand-dark)]/40">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const initials = (lead?.full_name ?? user?.email ?? "U").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = new Date(user?.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" });
  const testDate = lead?.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : null;
  const tierResult = lead?.quiz_score !== null && lead?.lung_tier ? getTier(lead.quiz_score!) : null;
  const tierData = tierResult ? TIER_RESULTS[tierResult] : null;

  return (
    <div className="min-h-screen bg-[var(--brand-ivory)] pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto space-y-6">

        {/* User details card */}
        <div className="bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm p-7">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-gold)] text-white font-bold text-xl flex items-center justify-center shrink-0">
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
                <p className="text-sm text-[var(--brand-dark)]/50 mt-0.5">
                  📱 +91 {maskMobile(lead.mobile)}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-[var(--brand-dark)]/35 font-medium">
            Member since {memberSince}
          </p>
        </div>

        {/* Lung test results */}
        <div className="bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm p-7">
          <h2
            className="text-lg font-bold text-[var(--brand-dark)] mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Lung Health
          </h2>

          {lead?.quiz_score !== null && lead?.lung_tier && tierData ? (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <TierBadge tier={lead.lung_tier} />
                <span className="text-sm text-[var(--brand-dark)]/50">
                  Score: <strong>{lead.quiz_score}</strong> / 21
                </span>
                {testDate && (
                  <span className="text-xs text-[var(--brand-dark)]/35 ml-auto">{testDate}</span>
                )}
              </div>

              <div className="space-y-2.5 mb-6">
                {tierData.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--brand-green)] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[var(--brand-dark)]/65 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/lung-test"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-[var(--brand-green)] text-[var(--brand-green)] font-semibold text-sm hover:bg-[var(--brand-sage)] transition-all"
              >
                Retake Test →
              </Link>
            </div>
          ) : (
            /* Pulsing CTA — test not taken */
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
              <p className="text-2xl mb-3">🫁</p>
              <h3 className="font-bold text-[var(--brand-dark)] text-base mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}>
                You haven't taken the Lung Test yet.
              </h3>
              <p className="text-sm text-[var(--brand-dark)]/55 mb-5">
                Discover your lung health score in 2 minutes.
              </p>
              <Link
                href="/lung-test"
                id="profile-take-test-btn"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[var(--brand-green)] text-[var(--brand-gold)] font-bold text-sm shadow-sm hover:bg-[#163d29] transition-all active:scale-95"
              >
                Take the Lung Test Now →
              </Link>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl border border-[var(--brand-sage)] shadow-sm p-7 space-y-3">
          <h2
            className="text-base font-bold text-[var(--brand-dark)] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Actions
          </h2>
          <Link
            href="/product"
            className="flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--brand-sage)] hover:border-[var(--brand-green)] hover:bg-[var(--brand-sage)]/30 transition-all"
          >
            <span className="text-sm font-medium text-[var(--brand-dark)]">🍃 View Our Product</span>
            <svg className="w-4 h-4 text-[var(--brand-dark)]/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={handleLogout}
            id="logout-btn"
            className="w-full px-5 py-4 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-all active:scale-95"
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
