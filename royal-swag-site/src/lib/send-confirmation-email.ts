/** Server-only order confirmation email via Resend */

type OrderEmailPayload = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  productName?: string;
  addressLine1?: string;
  city?: string;
  pincode?: string;
};

export async function sendOrderConfirmationEmailResend(
  payload: OrderEmailPayload
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !payload.customerEmail?.trim()) {
    return false;
  }

  const from = process.env.RESEND_FROM_EMAIL || "orders@royalswag.in";
  const cc =
    process.env.RESEND_CC_EMAIL ||
    process.env.NEXT_PUBLIC_EMAIL ||
    "hello@royalswag.in";

  const {
    orderNumber,
    customerName,
    customerEmail,
    amount,
    productName = "Royal Swag Lung Detox Tea",
    addressLine1 = "",
    city = "",
    pincode = "",
  } = payload;

  const addressBlock = [addressLine1, city, pincode].filter(Boolean).join(", ");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Royal Swag <${from}>`,
        to: [customerEmail],
        cc: [cc],
        subject: "Order Confirmed — Royal Swag Lung Detox Tea 🍃",
        html: `
          <div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;color:#324023;background:#F4EDD6;padding:32px;border-radius:16px">
            <h1 style="font-size:24px;margin:0 0 8px">Order Placed Successfully 🍃</h1>
            <p style="margin:0 0 20px;color:#45483f">Hi ${customerName}, thank you for choosing Royal Swag.</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#75786e">Order ID</td><td style="padding:8px 0;font-weight:600">#${orderNumber}</td></tr>
              <tr><td style="padding:8px 0;color:#75786e">Product</td><td style="padding:8px 0">${productName}</td></tr>
              <tr><td style="padding:8px 0;color:#75786e">Amount paid</td><td style="padding:8px 0;font-weight:600">₹${amount}</td></tr>
              <tr><td style="padding:8px 0;color:#75786e">Delivery to</td><td style="padding:8px 0">${addressBlock || "As provided at checkout"}</td></tr>
            </table>
            <p style="margin:24px 0 0;font-size:14px;color:#45483f">
              We ship within 24 hours. Estimated delivery: <strong>5–7 business days</strong> pan India.
            </p>
            <p style="margin:12px 0 0;font-size:13px;color:#75786e">
              Questions? Reply to this email or WhatsApp us. 30-Day Guarantee applies.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      console.error("[send-confirmation-email] Resend error:", await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("[send-confirmation-email]", err);
    return false;
  }
}
