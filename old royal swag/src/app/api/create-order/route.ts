import { NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay";

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
    const body = await req.json();
    const {
      amount,
      currency = "INR",
      packId = "progress",
      customerData,
    } = body as {
      amount?: number;
      currency?: string;
      packId?: string;
      customerData?: CustomerData;
    };

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const cd = customerData;
    const fullName = cd?.fullName || cd?.full_name || "";
    const addressLine1 = cd?.addressLine1 || cd?.line1 || "";

    if (!fullName || !cd?.phone || !addressLine1 || !cd?.city || !cd?.state || !cd?.pincode) {
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
      receipt: `rs_${Date.now()}`,
      notes: {
        packId,
        customerData: JSON.stringify({
          fullName,
          phone: phoneDigits,
          email: cd.email || "",
          addressLine1,
          addressLine2: cd.addressLine2 || cd.line2 || "",
          city: cd.city,
          state: cd.state,
          pincode: cd.pincode,
        }),
      },
    });

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      return NextResponse.json({ error: "Razorpay key not configured" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    console.error("[create-order]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
