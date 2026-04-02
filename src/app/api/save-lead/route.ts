import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SaveLeadBody = {
  name: string;
  email: string;
  phone: string;
  score: number;
  answers: Record<string, boolean>;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<SaveLeadBody>;
    const { name, email, phone, score, answers } = body;

    if (!name || !email || !phone || typeof score !== "number" || !answers) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      // TODO: Configure SUPABASE_SERVICE_ROLE_KEY on Vercel before launch.
      return NextResponse.json({ ok: true, stored: false }, { status: 200 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("leads").insert([
      {
        name,
        email,
        phone,
        quiz_score: score,
        quiz_answers: answers,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase save-lead error:", error.message);
      return NextResponse.json({ ok: true, stored: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true, stored: true }, { status: 200 });
  } catch (err: any) {
    console.error("save-lead error:", err?.message ?? err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

