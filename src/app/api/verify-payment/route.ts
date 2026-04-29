import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("[verify-payment] RAZORPAY_KEY_SECRET not configured.");
      return NextResponse.json(
        { error: "Payment gateway configuration error." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }

    // ── HMAC SHA256 — constant-time comparison to prevent timing attacks ──
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    let isValid = false;
    try {
      const sigBuffer = Buffer.from(razorpay_signature, "hex");
      const expBuffer = Buffer.from(expectedSignature, "hex");
      isValid =
        sigBuffer.length === expBuffer.length &&
        crypto.timingSafeEqual(sigBuffer, expBuffer);
    } catch {
      isValid = false;
    }

    if (!isValid) {
      console.error("[verify-payment] Signature mismatch.", {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      return NextResponse.json(
        { error: "Payment verification failed. Signature invalid." },
        { status: 400 }
      );
    }

    console.log("[verify-payment] Verified.", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      ok: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err: unknown) {
    console.error("[verify-payment] Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
