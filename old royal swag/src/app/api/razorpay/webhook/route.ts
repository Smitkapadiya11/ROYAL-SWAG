import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { writeAuditLog } from "@/lib/audit-log";
import { hashIp } from "@/lib/api-security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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

    const ipHash = hashIp(
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || ""
    );

    await writeAuditLog({
      event_type: `razorpay_webhook_${event.event}`,
      ip_hash: ipHash,
      payload: { event: event.event },
    });

    console.log("[webhook] Event received:", event.event);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment?.entity;
        const paymentId = typeof payment?.id === "string" ? payment.id : null;
        if (paymentId) {
          const { error } = await getSupabaseAdmin()
            .from("orders")
            .update({ status: "paid", updated_at: new Date().toISOString() })
            .eq("payment_id", paymentId);
          if (error) console.error("[webhook] payment.captured update:", error.message);
        }
        console.log("[webhook] payment.captured:", paymentId);
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment?.entity;
        const paymentId = typeof payment?.id === "string" ? payment.id : null;
        if (paymentId) {
          const { error } = await getSupabaseAdmin()
            .from("orders")
            .update({ status: "cancelled", updated_at: new Date().toISOString() })
            .eq("payment_id", paymentId);
          if (error) console.error("[webhook] payment.failed update:", error.message);
        }
        console.log("[webhook] payment.failed:", paymentId);
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
