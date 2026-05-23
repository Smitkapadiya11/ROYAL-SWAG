import { NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CustomerData = {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raw = body as {
      amount?: number;
      packId?: string;
      customerData?: CustomerData & {
        full_name?: string;
        line1?: string;
        line2?: string;
      };
    };
    const { amount, packId = "progress" } = raw;
    const cd = raw.customerData;
    const customerData: CustomerData | undefined = cd
      ? {
          fullName: cd.fullName || cd.full_name || "",
          phone: cd.phone || "",
          email: cd.email,
          addressLine1: cd.addressLine1 || cd.line1 || "",
          addressLine2: cd.addressLine2 || cd.line2,
          city: cd.city || "",
          state: cd.state || "",
          pincode: cd.pincode || "",
        }
      : undefined;

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (
      !customerData?.fullName ||
      !customerData.phone ||
      !customerData.addressLine1 ||
      !customerData.city ||
      !customerData.state ||
      !customerData.pincode
    ) {
      return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
    }

    const phoneDigits = customerData.phone.replace(/\D/g, "").slice(-10);
    if (phoneDigits.length !== 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    if (!/^\d{6}$/.test(customerData.pincode)) {
      return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
    }

    const amountPaise = Math.round(amount * 100);
    const orderNumber =
      "RS" +
      new Date().toISOString().slice(2, 10).replace(/-/g, "") +
      Math.floor(1000 + Math.random() * 9000);

    const rp = getRazorpayClient();
    const razorpayOrder = await rp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: orderNumber,
      notes: {
        packId,
        orderNumber,
      },
    });

    try {
      const { error } = await getSupabaseAdmin().from("orders").insert({
        order_number: orderNumber,
        full_name: customerData.fullName,
        phone: phoneDigits,
        email: customerData.email || null,
        address_line1: customerData.addressLine1,
        address_line2: customerData.addressLine2 || null,
        city: customerData.city,
        state: customerData.state,
        pincode: customerData.pincode,
        pack_type: packId,
        quantity: 1,
        amount: Math.round(amount),
        payment_id: razorpayOrder.id,
        payment_method: "razorpay",
        status: "pending",
      });

      if (error) {
        console.error("[create-order] Supabase insert:", error.message);
      }
    } catch (dbErr) {
      console.error("[create-order] Supabase unavailable:", dbErr);
    }

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      return NextResponse.json({ error: "Razorpay key not configured" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: keyId,
      orderNumber,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    console.error("[create-order]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
