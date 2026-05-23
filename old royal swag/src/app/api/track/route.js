import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req) {
  try {
    const body = await req.json();
    const { event_name, session_id, data } = body;

    // Capture location data from Vercel headers
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const ip = req.headers.get('x-forwarded-for') || 'Unknown';

    // Insert into Supabase (silently fail if it errors to not break UI)
    if (supabase) {
      await supabase.from('events').insert([
        {
          event_name,
          session_id,
          data,
          city,
          country,
          ip_address: ip,
          created_at: new Date().toISOString()
        }
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 });
  }
}
