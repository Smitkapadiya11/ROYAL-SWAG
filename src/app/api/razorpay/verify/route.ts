import { NextRequest, NextResponse } from "next/server";
import crypto                        from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export interface VerifyPayload {
  razorpay_order_id:   string;
  razorpay_payment_id: string;
  razorpay_signature:  string;
  amount?:    number;
  packLabel?: string;
}

export interface VerifyResponse {
  ok:        boolean;
  paymentId: string;
  orderId:   string;
  message:   string;
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse payload ─────────────────────────────────
    let body: VerifyPayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON." },
        { status: 400 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      packLabel,
    } = body;

    // ── 2. Validate required fields ──────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { ok: false, message: "Missing required payment fields." },
        { status: 400 }
      );
    }

    // ── 3. Retrieve secret — server-side only, never browser ──
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("[/api/razorpay/verify] RAZORPAY_KEY_SECRET not set.");
      return NextResponse.json(
        { ok: false, message: "Payment gateway configuration error." },
        { status: 500 }
      );
    }

    // ── 4. HMAC SHA256 signature verification ────────────
    // Razorpay signature = HMAC_SHA256(order_id + "|" + payment_id, secret)
    const bodyString = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyString)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(razorpay_signature,  "hex");
    const expBuffer = Buffer.from(expectedSignature, "hex");

    const isValid =
      sigBuffer.length === expBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expBuffer);

    if (!isValid) {
      console.error("[/api/razorpay/verify] Signature mismatch.", {
        orderId:   razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      return NextResponse.json(
        { ok: false, message: "Payment verification failed. Signature invalid." },
        { status: 400 }
      );
    }

    // ── 5. Log verified payment ──────────────────────────
    // Replace this block with your ORM/DB call when ready:
    // await prisma.order.upsert({ where: { razorpayOrderId: razorpay_order_id }, ... })
    console.log("[/api/razorpay/verify] Payment verified.", {
      orderId:   razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      packLabel,
      timestamp: new Date().toISOString(),
    });

    // ── 6. Return success ────────────────────────────────
    const response: VerifyResponse = {
      ok:        true,
      paymentId: razorpay_payment_id,
      orderId:   razorpay_order_id,
      message:   "Payment verified successfully.",
    };

    return NextResponse.json(response, { status: 200 });

  } catch (err: unknown) {
    console.error("[/api/razorpay/verify] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, message: "Internal server error during verification." },
      { status: 500 }
    );
  }
}
