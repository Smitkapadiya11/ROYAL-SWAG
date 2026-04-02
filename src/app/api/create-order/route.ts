import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

type CreateOrderRequestBody = {
  amount: number;
  currency: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<CreateOrderRequestBody>;
    const { amount, currency } = body;

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (typeof currency !== "string" || currency.length < 3) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Replace with live keys before launch
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay keys are not configured" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rs_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err: any) {
    console.error("create-order error:", err?.message ?? err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
