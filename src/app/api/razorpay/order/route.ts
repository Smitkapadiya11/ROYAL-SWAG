import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const { amount, packLabel } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await rzp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rs_${Date.now()}`,
      notes: { product: "Royal Swag Lung Detox Tea", pack: packLabel || "" },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Order failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
