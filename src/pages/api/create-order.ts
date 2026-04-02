import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

type CreateOrderRequestBody = {
  amount: number;
  currency: string;
};

type CreateOrderResponseBody =
  | { orderId: string; amount: number; currency: string; keyId: string }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateOrderResponseBody>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { amount, currency } = (req.body ?? {}) as Partial<CreateOrderRequestBody>;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  if (typeof currency !== "string" || currency.length < 3) {
    return res.status(400).json({ error: "Invalid currency" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Replace with live keys before launch
  if (!keyId || !keySecret) {
    return res.status(500).json({ error: "Razorpay keys are not configured" });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rs_${Date.now()}`,
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    return res.status(500).json({ error: message });
  }
}

