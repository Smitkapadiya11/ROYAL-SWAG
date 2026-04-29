import { NextRequest, NextResponse } from "next/server";
import crypto                        from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Razorpay sends raw body — must read as text before parsing
export async function POST(req: NextRequest) {
  try {
    const rawBody   = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // ── 1. Validate webhook signature ───────────────────
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[webhook] RAZORPAY_WEBHOOK_SECRET not configured.");
      return NextResponse.json({ received: false }, { status: 500 });
    }

    if (!signature) {
      console.error("[webhook] Missing x-razorpay-signature header.");
      return NextResponse.json({ received: false }, { status: 400 });
    }

    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const sigBuf = Buffer.from(signature,   "hex");
    const expBuf = Buffer.from(expectedSig, "hex");

    const isValid =
      sigBuf.length === expBuf.length &&
      crypto.timingSafeEqual(sigBuf, expBuf);

    if (!isValid) {
      console.error("[webhook] Invalid signature — possible forgery.");
      return NextResponse.json({ received: false }, { status: 400 });
    }

    // ── 2. Parse and handle event ────────────────────────
    const event = JSON.parse(rawBody) as {
      event: string;
      payload: {
        payment?: { entity: Record<string, unknown> };
        order?:   { entity: Record<string, unknown> };
      };
    };

    console.log("[webhook] Event received:", event.event);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment?.entity;
        // TODO: Update DB → mark order as PAID
        // await prisma.order.update({
        //   where: { razorpayOrderId: payment?.order_id as string },
        //   data:  { status: "PAID", paidAt: new Date() },
        // });
        console.log("[webhook] payment.captured:", payment?.id);
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment?.entity;
        // TODO: Update DB → mark order as FAILED
        // await prisma.order.update({
        //   where: { razorpayOrderId: payment?.order_id as string },
        //   data:  { status: "FAILED" },
        // });
        console.log("[webhook] payment.failed:", payment?.id);
        break;
      }

      case "refund.created": {
        console.log("[webhook] refund.created:", event.payload);
        break;
      }

      default:
        console.log("[webhook] Unhandled event:", event.event);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
