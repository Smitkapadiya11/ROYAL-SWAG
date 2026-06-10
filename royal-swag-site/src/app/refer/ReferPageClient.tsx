"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { trackUnified } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";

type ReferralData = {
  code: string;
  link: string;
  referralsSent: number;
  ordersPlaced: number;
  earnings: number;
};

export default function ReferPageClient() {
  const params = useSearchParams();
  const orderParam = params?.get("order") || params?.get("orderId") || "";
  const [data, setData] = useState<ReferralData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderParam) {
      setError("This page is available after purchase. Use the link from your order confirmation.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/referral/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderParam }),
        });
        const json = (await res.json()) as ReferralData & { error?: string };
        if (!res.ok) throw new Error(json.error || "Could not load referral");
        if (!cancelled) {
          setData({
            code: json.code,
            link: json.link,
            referralsSent: 0,
            ordersPlaced: 0,
            earnings: 0,
          });
          trackUnified.customEvent("referral_page_view", { order: orderParam });

          const statsRes = await fetch(
            `/api/referral/stats?order=${encodeURIComponent(orderParam)}`
          );
          if (statsRes.ok) {
            const stats = (await statsRes.json()) as Omit<ReferralData, "code" | "link">;
            setData((d) =>
              d
                ? {
                    ...d,
                    referralsSent: stats.referralsSent ?? 0,
                    ordersPlaced: stats.ordersPlaced ?? 0,
                    earnings: stats.earnings ?? 0,
                  }
                : d
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderParam]);

  const copyLink = useCallback(async () => {
    if (!data?.link) return;
    await navigator.clipboard.writeText(data.link);
    setCopied(true);
    trackUnified.customEvent("referral_copy", { code: data.code });
    if (orderParam) {
      void fetch("/api/referral/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderParam }),
      });
    }
    setTimeout(() => setCopied(false), 2000);
  }, [data, orderParam]);

  const shareWhatsApp = useCallback(() => {
    if (!data?.link) return;
    const text = `Try Royal Swag Lung Detox Tea — Ayurvedic herbs for cleaner lungs. Use my link: ${data.link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    trackUnified.whatsappClick("referral");
    if (orderParam) {
      void fetch("/api/referral/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderParam }),
      });
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, [data, orderParam]);

  if (loading) {
    return (
      <Section bg="cream">
        <Container className="py-16 text-center font-body text-on-surface-variant">
          Loading your referral link…
        </Container>
      </Section>
    );
  }

  if (error || !data) {
    return (
      <Section bg="cream">
        <Container className="max-w-lg py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-primary">Refer a Friend</h1>
          <p className="mt-4 font-body text-on-surface-variant">{error}</p>
          <Link href="/product" className="btn-primary mt-8 inline-flex">
            Shop Now
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section bg="cream">
      <Container className="max-w-xl py-12 md:py-16">
        <h1 className="text-center font-display text-3xl font-bold text-primary md:text-4xl">
          Refer a Friend, Earn ₹100
        </h1>
        <p className="mt-3 text-center font-body text-on-surface-variant">
          Share your unique link. When a friend orders, ₹100 is added to your wallet.
        </p>

        <div className="glass-card mt-8 p-6">
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Your unique link
          </p>
          <p className="mt-2 break-all font-mono text-sm text-primary">{data.link}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={copyLink} className="btn-primary flex-1">
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              type="button"
              onClick={shareWhatsApp}
              className="flex-1 rounded-xl border border-primary/20 bg-white px-4 py-3 font-body text-sm font-semibold text-primary transition-colors hover:bg-surface"
            >
              Share on WhatsApp
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="glass-card p-4">
            <p className="font-display text-2xl font-bold text-primary">{data.referralsSent}</p>
            <p className="mt-1 font-body text-xs text-on-surface-variant">Referrals sent</p>
          </div>
          <div className="glass-card p-4">
            <p className="font-display text-2xl font-bold text-primary">{data.ordersPlaced}</p>
            <p className="mt-1 font-body text-xs text-on-surface-variant">Orders placed</p>
          </div>
          <div className="glass-card p-4">
            <p className="font-display text-2xl font-bold text-gold">₹{data.earnings}</p>
            <p className="mt-1 font-body text-xs text-on-surface-variant">Earnings</p>
          </div>
        </div>

        <p className="mt-8 text-center font-body text-xs text-on-surface-variant">
          Questions? WhatsApp us at {siteConfig.phone}
        </p>
      </Container>
    </Section>
  );
}
