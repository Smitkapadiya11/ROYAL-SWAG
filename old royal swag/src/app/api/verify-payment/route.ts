import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/admin/session";
import {
  sendOrderConfirmationEmail,
  sendOrderConfirmationSms,
} from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CustomerPayload = {
  name?: string;
  fullName?: string;
  full_name?: string;
  phone: string;
  email?: string;
  address?: string;
  addressLine1?: string;
  line1?: string;
  addressLine2?: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  userId?: string | null;
};

type PackPayload = {
  pack_name?: string;
  packId?: string;
  amount: number;
  days?: number;
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

function normalizeCustomer(raw?: CustomerPayload) {
  if (!raw) return null;
  const name = raw.name || raw.fullName || raw.full_name || "";
  const addressLine1 = raw.address || raw.addressLine1 || raw.line1 || "";
  if (!name || !raw.phone || !addressLine1 || !raw.city || !raw.state || !raw.pincode) {
    return null;
  }
  return {
    fullName: name,
    phone: raw.phone.replace(/\D/g, "").slice(-10),
    email: raw.email || "",
    addressLine1,
    addressLine2: raw.addressLine2 || raw.line2 || "",
    city: raw.city,
    state: raw.state,
    pincode: raw.pincode,
    userId: raw.userId ?? null,
  };
}

function normalizePack(raw?: PackPayload, legacyPackId?: string, legacyAmount?: number) {
  if (raw?.amount) {
    return {
      packId: raw.packId || raw.pack_name || legacyPackId || "progress",
      amount: Math.round(raw.amount),
    };
  }
  if (legacyPackId && legacyAmount) {
    return { packId: legacyPackId, amount: Math.round(legacyAmount) };
  }
  return null;
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
      customerData,
      packData,
      orderData,
    } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      customerData?: CustomerPayload;
      packData?: PackPayload;
      orderData?: CustomerPayload & { packId?: string; amount?: number; orderNumber?: string };
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, secret)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const customer = normalizeCustomer(customerData || orderData);
    const pack = normalizePack(packData, orderData?.packId, orderData?.amount);

    if (!customer || !pack) {
      return NextResponse.json({ error: "Missing customer or pack data" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: existingByPayment } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_id", razorpay_payment_id)
      .maybeSingle();

    if (existingByPayment) {
      return NextResponse.json({
        success: true,
        orderNumber: existingByPayment.order_number,
        orderId: existingByPayment.order_number,
        order: existingByPayment,
      });
    }

    const { data: existingByRzpOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .maybeSingle();

    if (existingByRzpOrder) {
      return NextResponse.json({
        success: true,
        orderNumber: existingByRzpOrder.order_number,
        orderId: existingByRzpOrder.order_number,
        order: existingByRzpOrder,
      });
    }

    const orderNumber =
      orderData?.orderNumber ||
      "RS" +
        new Date().toISOString().slice(2, 10).replace(/-/g, "") +
        Math.floor(1000 + Math.random() * 9000);

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: customer.userId,
        full_name: customer.fullName,
        phone: customer.phone,
        email: customer.email || null,
        address_line1: customer.addressLine1,
        address_line2: customer.addressLine2 || null,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        pack_type: pack.packId,
        quantity: 1,
        amount: pack.amount,
        payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        payment_method: "razorpay",
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("ORDER INSERT ERROR:", error);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    await Promise.all([
      sendOrderConfirmationSms(data),
      sendOrderConfirmationEmail(data),
    ]).catch((err) => console.error("[verify-payment] notifications:", err));

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: orderNumber,
      order: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    console.error("VERIFY PAYMENT ERROR:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
