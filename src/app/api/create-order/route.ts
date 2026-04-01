import { NextRequest, NextResponse } from "next/server";

// TODO: Add to .env.local:
//   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
//   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? "rzp_test_placeholder";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "placeholder_secret";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount = 69900 } = body; // amount in paise (₹699 = 69900 paise)

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `rcpt_rs_${Date.now()}`,
        notes: {
          product: "Royal Swag Lung Detox Tea",
          quantity: 1,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Razorpay create order error:", errData);
      return NextResponse.json(
        { error: "Failed to create Razorpay order" },
        { status: 500 }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error("create-order error:", err?.message ?? err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
