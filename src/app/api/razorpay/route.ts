import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// TODO: Set real LIVE keys in Vercel env variables before going live
export async function POST(req: NextRequest) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || keyId.includes("PLACEHOLDER") || !keySecret || keySecret.includes("PLACEHOLDER")) {
    return NextResponse.json(
      { error: "Razorpay keys not configured. Please add real keys to environment variables." },
      { status: 503 }
    );
  }

  try {
    const { amount } = await req.json();

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `rs_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("Razorpay error:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
