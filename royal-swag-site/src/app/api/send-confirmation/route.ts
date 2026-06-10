import { NextResponse } from "next/server";
import { sendOrderConfirmationEmailResend } from "@/lib/send-confirmation-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const ok = await sendOrderConfirmationEmailResend({
      orderNumber: body.orderNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      amount: body.amount,
      productName: body.productName,
      addressLine1: body.addressLine1,
      city: body.city,
      pincode: body.pincode,
    });

    if (!ok) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    console.error("[send-confirmation]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
