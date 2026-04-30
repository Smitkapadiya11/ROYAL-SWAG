import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "@/lib/googleSheets";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, email } = body;

    if (!name || !mobile || !email) {
      return NextResponse.json(
        { error: "Name, mobile, and email are required" },
        { status: 400 }
      );
    }

    const mobileClean = String(mobile).replace(/\D/g, "").slice(-10);
    if (mobileClean.length !== 10) {
      return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
    }

    await appendToSheet("LungTest", {
      name: String(name).trim(),
      mobile: mobileClean,
      email: String(email).trim().toLowerCase(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("track-lungtest error:", error);
    return NextResponse.json({ error: "Failed to save lung test lead" }, { status: 500 });
  }
}
