/** Server-only order confirmation notifications */

type OrderRow = {
  order_number: string;
  full_name: string;
  phone: string;
  email?: string | null;
  amount: number;
  city?: string;
  state?: string;
};

export async function sendOrderConfirmationSms(order: OrderRow) {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  const mobile = order.phone.replace(/\D/g, "").slice(-10);

  const message = `Hi ${order.full_name}, your Royal Swag order #${order.order_number} is confirmed. Amount Rs ${order.amount}. Ships in 24hrs.`;

  if (!authKey) {
    console.log("[MSG91] skipped (no MSG91_AUTH_KEY):", message);
    return;
  }

  try {
    if (templateId) {
      await fetch("https://control.msg91.com/api/v5/flow/", {
        method: "POST",
        headers: {
          authkey: authKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_id: templateId,
          recipients: [
            {
              mobiles: `91${mobile}`,
              var1: order.full_name,
              var2: order.order_number,
              var3: String(order.amount),
            },
          ],
        }),
      });
    } else {
      await fetch("https://control.msg91.com/api/v5/flow/", {
        method: "POST",
        headers: {
          authkey: authKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flow_id: process.env.MSG91_FLOW_ID || templateId,
          sender: process.env.MSG91_SENDER_ID || "ROYLSW",
          mobiles: `91${mobile}`,
          message,
        }),
      });
    }
  } catch (err) {
    console.error("[MSG91] send failed:", err);
  }
}

export async function sendOrderConfirmationEmail(order: OrderRow) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = order.email?.trim();
  const from = process.env.RESEND_FROM_EMAIL || "orders@royalswag.in";

  if (!apiKey || !to) {
    console.log("[Resend] skipped:", to ? "no API key" : "no customer email");
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Royal Swag <${from}>`,
        to: [to],
        subject: `Order confirmed — ${order.order_number}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#324023">
            <h1 style="font-size:22px">Thank you, ${order.full_name}!</h1>
            <p>Your Royal Swag Lung Detox Tea order <strong>#${order.order_number}</strong> is confirmed.</p>
            <p><strong>Amount paid:</strong> ₹${order.amount}</p>
            <p>We will ship within 24 hours. Delivery is typically 3–7 business days pan India.</p>
            <p style="color:#666;font-size:13px">Questions? Reply to this email or WhatsApp us.</p>
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error("[Resend] send failed:", err);
  }
}
