import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_ORIGIN } from "@/lib/config";

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
};

async function sendWhatsAppConfirmation(order: {
  full_name: string;
  order_number: string;
  amount: number;
  phone: string;
}) {
  const text =
    "Hi " +
    order.full_name +
    ", your Royal Swag Lung Detox Tea order #" +
    order.order_number +
    " is confirmed! Amount: Rs " +
    order.amount +
    ". We will ship within 24 hours. Track: " +
    SITE_ORIGIN +
    "/profile — Team Royal Swag";
  const phone = order.phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
  const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
  console.log("[whatsapp] confirmation link:", waUrl);
  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
    console.log("[whatsapp] MSG91 configured; dispatch via your template workflow.");
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

    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    let valid = false;
    try {
      const sigBuf = Buffer.from(razorpay_signature, "hex");
      const expBuf = Buffer.from(expectedSig, "hex");
      valid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
    } catch {
      valid = false;
    }

    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const orderNumber =
      "RS" +
      new Date().toISOString().slice(2, 10).replace(/-/g, "") +
      Math.floor(1000 + Math.random() * 9000);

    const { data, error } = await getSupabaseAdmin()
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: orderData.userId || null,
        full_name: orderData.fullName,
        phone: orderData.phone,
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

    await sendWhatsAppConfirmation(data);

    return NextResponse.json({ success: true, order: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
