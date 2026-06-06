import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, score, breath_seconds, riskLevel } = body;
    
    // Save to Supabase (if available)
    if (supabase) {
      await supabase.from('leads').insert([{
        name: name || 'Anonymous',
        email: email || '',
        phone: phone || '',
        quiz_score: score,
        quiz_answers: { breath_seconds: parseFloat(breath_seconds), risk: riskLevel },
        created_at: new Date().toISOString()
      }]).catch(e => console.error(e));
    }
    
    // Placeholder for Resend API integration
    console.log("Mock Resend API Triggered for:", email, "Risk:", riskLevel);
    // await resend.emails.send({ ... })
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving result:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
