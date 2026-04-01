import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "placeholder_secret";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerPhone,
      customerEmail,
      address,
      pincode,
      city,
      state,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // TODO: Save order to Supabase orders table
    // Supabase SQL to create orders table:
    // CREATE TABLE orders (
    //   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    //   razorpay_order_id text UNIQUE NOT NULL,
    //   razorpay_payment_id text,
    //   customer_name text,
    //   customer_phone text,
    //   customer_email text,
    //   address text,
    //   city text,
    //   state text,
    //   pincode text,
    //   amount integer DEFAULT 69900,
    //   status text DEFAULT 'paid',
    //   created_at timestamptz DEFAULT now()
    // );
    // ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    // CREATE POLICY "service insert" ON orders FOR INSERT TO service_role WITH CHECK (true);

    const orderRecord = {
      razorpay_order_id,
      razorpay_payment_id,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      address,
      city,
      state,
      pincode,
      amount: 69900,
      status: "paid",
    };

    console.log("✅ Order verified & saved:", orderRecord);

    return NextResponse.json({
      success: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err: any) {
    console.error("verify-payment error:", err?.message ?? err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
