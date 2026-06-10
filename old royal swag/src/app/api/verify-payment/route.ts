import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/admin/session";
import { sendOrderConfirmationSms } from "@/lib/notifications";
import { sendOrderConfirmationEmailResend } from "@/lib/send-confirmation-email";
import { writeAuditLog } from "@/lib/audit-log";
import { trackReferralOnOrder } from "@/lib/referral";
import { apiNoStoreHeaders, hashIp, readJsonBody } from "@/lib/api-security";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

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
    const ip = getClientIp(req);
    if (!rateLimit(`verify-payment:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Razorpay secret not configured" }, { status: 500 });
    }

    const ipHash = hashIp(ip);
    const parsed = await readJsonBody(req);
    if (parsed.error) return parsed.error;
    const body = parsed.data as Record<string, unknown>;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerData,
      packData,
      orderData,
      ref,
      utm_source,
    } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      customerData?: CustomerPayload;
      packData?: PackPayload;
      orderData?: CustomerPayload & { packId?: string; amount?: number; orderNumber?: string };
      ref?: string;
      utm_source?: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, secret)) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
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
      await writeAuditLog({
        event_type: "verify_payment_duplicate",
        ip_hash: ipHash,
        idempotency_key: razorpay_payment_id,
        payload: { order_number: existingByPayment.order_number },
      });
      return NextResponse.json(
        {
          success: true,
          orderNumber: existingByPayment.order_number,
          orderId: existingByPayment.order_number,
          order: existingByPayment,
        },
        { headers: apiNoStoreHeaders() }
      );
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
        status: "paid",
      })
      .select()
      .single();

    if (error) {
      console.error("ORDER INSERT ERROR:", error);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    await Promise.all([
      sendOrderConfirmationSms(data),
      data.email
        ? sendOrderConfirmationEmailResend({
            orderNumber: data.order_number,
            customerName: data.full_name,
            customerEmail: data.email,
            amount: data.amount,
            productName: `Royal Swag Lung Detox Tea (${data.pack_type || "standard"})`,
            addressLine1: data.address_line1,
            city: data.city,
            pincode: data.pincode,
          })
        : Promise.resolve(false),
      trackReferralOnOrder({
        referredOrderId: data.id,
        referralCode: ref,
        utmSource: utm_source,
      }),
    ]).catch((err) => console.error("[verify-payment] notifications:", err));

    await writeAuditLog({
      event_type: "verify_payment_success",
      ip_hash: ipHash,
      idempotency_key: razorpay_payment_id,
      payload: {
        order_number: orderNumber,
        amount: pack.amount,
        payment_id: razorpay_payment_id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderNumber,
        orderId: orderNumber,
        order: data,
      },
      { headers: apiNoStoreHeaders() }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    console.error("VERIFY PAYMENT ERROR:", message);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: apiNoStoreHeaders() }
    );
  }
}
