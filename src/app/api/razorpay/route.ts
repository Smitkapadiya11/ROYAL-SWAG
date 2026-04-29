import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const rzp = getRazorpayClient();
    const order = await rzp.orders.create({
      amount: Math.round(amount * 100), // INR → paise
      currency: "INR",
      receipt: `rs_${Date.now()}`,
      notes: { product: "Royal Swag Lung Detox Tea" },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("[/api/razorpay] Error:", err);
    return NextResponse.json({ error: "Order creation failed." }, { status: 500 });
  }
}
