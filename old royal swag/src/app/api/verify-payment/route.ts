import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  sendOrderConfirmationEmail,
  sendOrderConfirmationSms,
} from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OrderInsert = {
  userId?: string | null;
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  packId: string;
  amount: number;
  orderNumber?: string;
};

function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSig, "hex");
    return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Razorpay secret not configured" }, { status: 500 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      orderData?: OrderInsert;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    if (!orderData?.fullName || !orderData.phone || !orderData.packId) {
      return NextResponse.json({ error: "Missing order data" }, { status: 400 });
    }

    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const phoneDigits = orderData.phone.replace(/\D/g, "").slice(-10);
    const orderNumber =
      orderData.orderNumber ||
      "RS" +
        new Date().toISOString().slice(2, 10).replace(/-/g, "") +
        Math.floor(1000 + Math.random() * 9000);

    const admin = getSupabaseAdmin();

    const { data: existing } = await admin
      .from("orders")
      .select("*")
      .eq("payment_id", razorpay_order_id)
      .maybeSingle();

    let orderRecord;

    if (existing) {
      const { data, error } = await admin
        .from("orders")
        .update({
          status: "paid",
          payment_id: razorpay_payment_id,
          amount: orderData.amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      orderRecord = data;
    } else {
      const { data, error } = await admin
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: orderData.userId || null,
          full_name: orderData.fullName,
          phone: phoneDigits,
          email: orderData.email || null,
          address_line1: orderData.addressLine1,
          address_line2: orderData.addressLine2 || null,
          city: orderData.city,
          state: orderData.state,
          pincode: orderData.pincode,
          pack_type: orderData.packId,
          quantity: 1,
          amount: orderData.amount,
          payment_id: razorpay_payment_id,
          payment_method: "razorpay",
          status: "paid",
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      orderRecord = data;
    }

    await Promise.all([
      sendOrderConfirmationSms(orderRecord),
      sendOrderConfirmationEmail(orderRecord),
    ]);

    return NextResponse.json({
      success: true,
      order: orderRecord,
      orderId: orderRecord.order_number,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
