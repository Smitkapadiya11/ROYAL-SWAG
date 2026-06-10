import { NextResponse } from "next/server";
import {
  getIdempotentResponse,
  storeIdempotentResponse,
  writeAuditLog,
} from "@/lib/audit-log";
import { apiNoStoreHeaders, hashIp, readJsonBody, sanitizeString } from "@/lib/api-security";
import { getRazorpayClient } from "@/lib/razorpay";
import { isAllowedCheckoutAmount } from "@/lib/product-price";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CustomerData = {
  fullName?: string;
  full_name?: string;
  phone: string;
  email?: string;
  addressLine1?: string;
  line1?: string;
  addressLine2?: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipHash = hashIp(ip);

    if (!rateLimit(`create-order:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429, headers: apiNoStoreHeaders() }
      );
    }

    const idempotencyKey =
      req.headers.get("idempotency-key") ||
      req.headers.get("x-idempotency-key") ||
      undefined;

    if (idempotencyKey) {
      const cached = await getIdempotentResponse<Record<string, unknown>>(
        idempotencyKey
      );
      if (cached) {
        return NextResponse.json(cached, { headers: apiNoStoreHeaders() });
      }
    }

    const parsed = await readJsonBody(req);
    if (parsed.error) return parsed.error;
    const body = parsed.data as Record<string, unknown>;
    const {
      amount,
      currency = "INR",
      receipt,
      packId = "progress",
      customerData,
    } = body as {
      amount?: number;
      currency?: string;
      receipt?: string;
      packId?: string;
      customerData?: CustomerData;
    };

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!isAllowedCheckoutAmount(amount)) {
      return NextResponse.json(
        { error: "Amount does not match configured product price" },
        { status: 400 }
      );
    }

    const cd = customerData as CustomerData | undefined;
    const fullName = sanitizeString(cd?.fullName || cd?.full_name, 120) || "";
    const addressLine1 =
      sanitizeString(cd?.addressLine1 || cd?.line1, 300) || "";

    if (!fullName || !cd?.phone || !addressLine1 || !cd?.city || !cd?.pincode) {
      return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
    }

    const phoneDigits = cd.phone.replace(/\D/g, "").slice(-10);
    if (phoneDigits.length !== 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    if (!/^\d{6}$/.test(cd.pincode)) {
      return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rs_${Date.now()}`,
      notes: {
        packId,
        customerData: JSON.stringify({
          fullName,
          phone: phoneDigits,
          email: cd.email || "",
          addressLine1,
          addressLine2: cd.addressLine2 || cd.line2 || "",
          city: cd.city,
          state: cd.state || "India",
          pincode: cd.pincode,
        }),
      },
    });

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      return NextResponse.json({ error: "Razorpay key not configured" }, { status: 500 });
    }

    const response = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
      keyId,
    };

    await writeAuditLog({
      event_type: "create_order",
      ip_hash: ipHash,
      payload: {
        orderId: order.id,
        amount,
        packId,
        phone: phoneDigits,
      },
    });

    if (idempotencyKey) {
      await storeIdempotentResponse(
        idempotencyKey,
        "create_order",
        response,
        ipHash
      );
    }

    return NextResponse.json(response, { headers: apiNoStoreHeaders() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    console.error("[create-order]", message);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: apiNoStoreHeaders() }
    );
  }
}
