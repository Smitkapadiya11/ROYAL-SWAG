import { NextRequest, NextResponse }  from "next/server";
import { getRazorpayClient }          from "@/lib/razorpay";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export interface CreateOrderPayload {
  amount:    number;   // Amount in INR (e.g. 349)
  packLabel: string;   // e.g. "20 Bags — 30-Day Supply"
  currency?: string;   // Default: "INR"
}

export interface CreateOrderResponse {
  orderId:  string;
  amount:   number;    // Amount in paise
  currency: string;
  receipt:  string;
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse and validate ────────────────────────────
    let body: CreateOrderPayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { amount, packLabel, currency = "INR" } = body;

    if (typeof amount !== "number" || amount < 1 || amount > 100000) {
      return NextResponse.json(
        { error: "Amount must be a number between 1 and 100000 (INR)." },
        { status: 400 }
      );
    }

    if (!packLabel || typeof packLabel !== "string") {
      return NextResponse.json(
        { error: "packLabel is required." },
        { status: 400 }
      );
    }

    // ── 2. Get singleton client ──────────────────────────
    const rzp = getRazorpayClient();

    // ── 3. Create order ──────────────────────────────────
    const receipt = `rs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const order = await rzp.orders.create({
      amount:   Math.round(amount * 100), // INR → paise
      currency,
      receipt,
      notes: {
        product:  "Royal Swag Lung Detox Tea",
        pack:     packLabel,
        platform: "lungdetox.royalswag.in",
      },
    });

    // ── 4. Return safe data to frontend ─────────────────
    const response: CreateOrderResponse = {
      orderId:  order.id,
      amount:   order.amount as number,
      currency: order.currency,
      receipt,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (err: unknown) {
    console.error("[/api/razorpay/order] Error:", err);
    const message = err instanceof Error ? err.message : "Order creation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
