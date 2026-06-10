import type { HerbHighlight, LungScore, SymptomAnswers } from "@/lib/lungScore";
import { getBreathHoldInsight } from "@/lib/lungScore";

export type LungTestEmailPayload = {
  name: string;
  email: string;
  score: LungScore;
  herbs: HerbHighlight[];
  answers: SymptomAnswers;
  breathHoldSeconds: number;
  reportUrl: string;
};

function buildHerbListHtml(herbs: HerbHighlight[]): string {
  if (herbs.length === 0) {
    return "<li>Royal Swag blend — Tulsi, Vasaka, Mulethi, Pippali & more</li>";
  }
  return herbs
    .map((h) => `<li><strong>${h.name}</strong> — ${h.line}</li>`)
    .join("");
}

export function buildLungTestResultEmailHtml(data: LungTestEmailPayload): string {
  const breath = getBreathHoldInsight(data.breathHoldSeconds);
  const firstName = data.name.trim().split(/\s+/)[0] || "there";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Georgia,serif;background:#f4edd6;margin:0;padding:24px;color:#324023">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;box-shadow:0 8px 32px rgba(50,64,35,0.12)">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9a6f1a">Royal Swag</p>
    <h1 style="margin:0 0 16px;font-size:24px;color:#324023">Your Lung Health Result</h1>
    <p style="margin:0 0 24px;line-height:1.6">Hi ${firstName}, thank you for completing the free lung assessment.</p>

    <div style="border-radius:12px;padding:20px;background:${data.score.color}15;border-left:4px solid ${data.score.color};margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:${data.score.color}">${data.score.level} Risk</p>
      <p style="margin:0;font-size:28px;font-weight:700;color:#324023">${data.score.points} / 11 points</p>
      <p style="margin:12px 0 0;font-size:14px;line-height:1.55">${data.score.recommendation}</p>
    </div>

    <h2 style="font-size:16px;margin:0 0 12px">Breath-hold test</h2>
    <p style="margin:0 0 8px;font-size:18px;font-weight:700">${breath.seconds}s — ${breath.label}</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.55;color:#555">${breath.note}</p>

    <h2 style="font-size:16px;margin:0 0 12px">Herbs matched to your profile</h2>
    <ul style="margin:0 0 24px;padding-left:20px;line-height:1.7;font-size:14px">
      ${buildHerbListHtml(data.herbs)}
    </ul>

    <a href="${data.reportUrl}" style="display:inline-block;background:#324023;color:#f4edd6;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px">View full report</a>
    <p style="margin:24px 0 0;font-size:13px;color:#666">
      Ready to start? <a href="https://lungdetox.royalswag.in/product" style="color:#9a6f1a">Royal Swag 2 Pack Bundle — ₹689</a>
    </p>
  </div>
</body>
</html>`;
}

export async function sendLungTestResultEmail(data: LungTestEmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "orders@royalswag.in";

  if (!apiKey || !data.email?.trim()) {
    console.log("[Resend] lung test email skipped:", data.email || "no email");
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
        subject: "Your Royal Swag Lung Health Result",
        html: buildLungTestResultEmailHtml(data),
      }),
    });

    if (!res.ok) {
      console.error("[Resend] lung test email failed:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Resend] lung test email error:", err);
    return false;
  }
}
