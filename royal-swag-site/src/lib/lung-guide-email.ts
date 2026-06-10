import { SITE_ORIGIN } from "@/lib/config";

export async function sendLungHealthGuideEmail(email: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[lung-guide-email] skipped: no RESEND_API_KEY");
    return false;
  }

  const from = process.env.RESEND_FROM_EMAIL || "Royal Swag <noreply@royalswag.in>";
  const productUrl = `${SITE_ORIGIN}/product?utm_source=email&utm_medium=popup&utm_campaign=lung-guide`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Georgia,serif;background:#f4edd6;margin:0;padding:24px;color:#324023">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9a6f1a">Royal Swag</p>
    <h1 style="margin:0 0 16px;font-size:24px">Your Free Ayurvedic Lung Health Guide</h1>
    <p style="margin:0 0 20px;line-height:1.6">Here are <strong>7 daily habits</strong> for cleaner, stronger lungs:</p>
    <ol style="margin:0 0 24px;padding-left:20px;line-height:1.8">
      <li>Start mornings with warm Tulsi water</li>
      <li>Practice deep diaphragmatic breathing (5 min)</li>
      <li>Avoid smoke and heavy pollution when possible</li>
      <li>Stay hydrated — warm herbal tea counts</li>
      <li>Steam inhalation with eucalyptus or Tulsi</li>
      <li>Light movement: walking improves lung capacity</li>
      <li>Evening Royal Swag Lung Detox Tea ritual</li>
    </ol>
    <p style="margin:0 0 24px;line-height:1.6">Our blend combines Tulsi, Vasaka, Mulethi, and Pippali — herbs trusted in Ayurveda for respiratory wellness.</p>
    <a href="${productUrl}" style="display:inline-block;background:#324023;color:#fff;text-decoration:none;padding:14px 24px;border-radius:12px;font-weight:600">Shop Lung Detox Tea →</a>
    <p style="margin:24px 0 0;font-size:12px;color:#75786e">Breathe Clean. Live Free. · Royal Swag</p>
  </div>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: "Your Free Ayurvedic Lung Health Guide — Royal Swag",
        html,
      }),
    });

    if (!res.ok) {
      console.error("[lung-guide-email] Resend error:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[lung-guide-email] error:", err);
    return false;
  }
}
