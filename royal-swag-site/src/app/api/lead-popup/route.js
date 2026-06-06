import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && serviceKey) {
      const sb = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      await sb.from('leads').insert([{ email, source: 'popup', created_at: new Date().toISOString() }]);
    }

    // Resend placeholder — add API key to .env.local when ready
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from: 'noreply@royalswag.in', to: email, subject: '...' });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
