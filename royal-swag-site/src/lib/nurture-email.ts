import { SITE_ORIGIN } from "@/lib/config";
import { getPrimaryProductPrice } from "@/lib/product-price";

type NurtureDay = 0 | 2 | 4 | 6 | 8;

const DAY_KEY: Record<NurtureDay, string> = {
  0: "day0",
  2: "day2",
  4: "day4",
  6: "day6",
  8: "day8",
};

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="font-family:Georgia,serif;background:#f4edd6;margin:0;padding:24px;color:#324023">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9a6f1a">Royal Swag</p>
    <h1 style="margin:0 0 16px;font-size:22px">${title}</h1>
    ${body}
    <p style="margin:24px 0 0;font-size:12px;color:#75786e">Breathe Clean. Live Free.</p>
  </div>
</body></html>`;
}

function getNurtureContent(day: NurtureDay): { subject: string; html: string } {
  const price = getPrimaryProductPrice();
  const productUrl = `${SITE_ORIGIN}/product?utm_source=email&utm_medium=nurture&utm_campaign=day${day}`;

  switch (day) {
    case 0:
      return {
        subject: "Your Lung Health Report + Free Guide PDF — Royal Swag",
        html: wrapHtml(
          "Welcome to cleaner lungs",
          `<p style="line-height:1.6">Thank you for trusting Royal Swag. Your free lung health resources are on the way — start with our 7 daily habits guide in your inbox.</p>
          <a href="${productUrl}" style="display:inline-block;margin-top:16px;background:#324023;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600">Explore Lung Detox Tea →</a>`
        ),
      };
    case 2:
      return {
        subject: "How Tulsi has been used for 3,000 years to clear lungs",
        html: wrapHtml(
          "Tulsi — the lung guardian",
          `<p style="line-height:1.6">Holy Basil (Tulsi) has soothed respiratory passages in Ayurveda for millennia. It supports natural mucus clearance and helps your body respond to daily pollution.</p>
          <p style="line-height:1.6">Royal Swag blends Tulsi with Vasaka, Mulethi, and Pippali for a complete daily ritual.</p>
          <a href="${productUrl}" style="display:inline-block;margin-top:16px;background:#324023;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600">See the blend →</a>`
        ),
      };
    case 4:
      return {
        subject: "Meet Vasaka — The herb smokers don't know they need",
        html: wrapHtml(
          "Why Vasaka matters",
          `<p style="line-height:1.6">Vasaka (Malabar Nut) is prized in Ayurveda for bronchial comfort — especially for those exposed to smoke or urban air.</p>
          <p style="line-height:1.6">Combined with Tulsi and Mulethi, it forms the backbone of our lung detox formula.</p>
          <a href="${productUrl}" style="display:inline-block;margin-top:16px;background:#324023;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600">Try Royal Swag →</a>`
        ),
      };
    case 6:
      return {
        subject: "Before and After: Real customers share their experience",
        html: wrapHtml(
          "Real stories, real relief",
          `<p style="line-height:1.6">847+ verified reviews. Customers report clearer mornings, less chest heaviness, and a calmer breathing ritual within weeks.</p>
          <a href="${SITE_ORIGIN}/reviews?utm_source=email&utm_medium=nurture" style="display:inline-block;margin-top:12px;color:#9a6f1a;font-weight:600">Read reviews →</a>
          <br/><a href="${productUrl}" style="display:inline-block;margin-top:16px;background:#324023;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600">Order now →</a>`
        ),
      };
    case 8:
      return {
        subject: "Your exclusive offer expires in 48 hours — 30% OFF",
        html: wrapHtml(
          "48 hours left on your offer",
          `<p style="line-height:1.6">As a thank-you for completing your lung assessment, unlock <strong>30% off</strong> Royal Swag Lung Detox Tea — from ${price} with free delivery.</p>
          <p style="line-height:1.6">30-day money-back guarantee. FSSAI certified.</p>
          <a href="${productUrl}" style="display:inline-block;margin-top:16px;background:#9a6f1a;color:#fff;text-decoration:none;padding:14px 24px;border-radius:12px;font-weight:600">Claim 30% OFF →</a>`
        ),
      };
    default:
      return { subject: "Royal Swag", html: wrapHtml("Royal Swag", "<p>Thank you.</p>") };
  }
}

export async function sendNurtureEmail(
  email: string,
  day: NurtureDay
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[nurture-email] skipped:", email, day);
    return false;
  }

  const { subject, html } = getNurtureContent(day);
  const from = process.env.RESEND_FROM_EMAIL || "Royal Swag <noreply@royalswag.in>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: email, subject, html }),
    });
    if (!res.ok) {
      console.error("[nurture-email] Resend error:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[nurture-email] error:", err);
    return false;
  }
}

export const NURTURE_SCHEDULE: NurtureDay[] = [0, 2, 4, 6, 8];

export function nurtureDayKey(day: NurtureDay): string {
  return DAY_KEY[day];
}

export function daysSinceCreated(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const ms = now.getTime() - created.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export function nurtureDayForAge(ageDays: number): NurtureDay | null {
  const match = NURTURE_SCHEDULE.find((d) => d === ageDays);
  return match ?? null;
}
