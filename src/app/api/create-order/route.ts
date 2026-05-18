import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const keyId =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;

export async function POST(req: NextRequest) {
  if (!razorpay) {
    return NextResponse.json({ error: "Razorpay keys are not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { amount, packId, customerData } = body as {
      amount?: number;
      packId?: string;
      customerData?: { phone?: string };
    };

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const rzpOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "rs_" + Date.now(),
      notes: {
        pack: packId ?? "",
        customer: customerData?.phone ?? "",
      },
    });

    return NextResponse.json({ orderId: rzpOrder.id, amount: rzpOrder.amount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
