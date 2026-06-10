import type { RiskSlug } from "@/lib/lungScore";
import { SITE_ORIGIN } from "@/lib/config";
import { getStarterPackOffer } from "@/lib/product-price";

export type LungReportEmailPayload = {
  name: string;
  email: string;
  score: number;
  riskLevel: RiskSlug;
  riskLabel: string;
  riskColor: string;
  matchedHerbs: string[];
  recommendation: string;
};

export function buildLungReportEmailHtml(data: LungReportEmailPayload): string {
  const firstName = data.name.trim().split(/\s+/)[0] || "there";
  const buyUrl = `${SITE_ORIGIN}/product?pack=single&utm_source=email&utm_medium=lung-test&utm_campaign=result`;
  const starter = getStarterPackOffer();

  const herbList =
    data.matchedHerbs.length > 0
      ? data.matchedHerbs.map((h) => `<li><strong>${h}</strong></li>`).join("")
      : "<li>Tulsi, Vasaka, Mulethi, Pippali — full Royal Swag blend</li>";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Georgia,serif;background:#f4edd6;margin:0;padding:24px;color:#324023">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9a6f1a">Royal Swag</p>
    <h1 style="margin:0 0 16px;font-size:24px">Your Lung Health Report</h1>
    <p style="margin:0 0 24px;line-height:1.6">Hi ${firstName}, here is your personalised lung health summary.</p>
    <div style="border-radius:12px;padding:20px;background:${data.riskColor}18;border-left:4px solid ${data.riskColor};margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${data.riskColor}">${data.riskLabel} RISK</p>
      <p style="margin:0;font-size:28px;font-weight:700">${data.score} points</p>
      <p style="margin:12px 0 0;font-size:14px;line-height:1.55">${data.recommendation}</p>
    </div>
    <h2 style="font-size:16px;margin:0 0 12px">Herbs matched to your profile</h2>
    <ul style="margin:0 0 24px;padding-left:20px;line-height:1.7">${herbList}</ul>
    <a href="${buyUrl}" style="display:inline-block;background:#0D3B1F;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600">Buy 1 Pack (30 bags) — ₹${starter.price}</a>
    <p style="margin:8px 0 0;font-size:12px;color:#888">MRP ₹${starter.mrp} · Free delivery · 30-day guarantee</p>
  </div>
</body>
</html>`;
}

export async function sendLungReportEmail(data: LungReportEmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "orders@royalswag.in";

  if (!apiKey || !data.email?.trim()) {
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Royal Swag <${from}>`,
        to: [data.email.trim()],
        subject: "Your Royal Swag Lung Health Report 🍃",
        html: buildLungReportEmailHtml(data),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[lung-report-email]", err);
    return false;
  }
}
