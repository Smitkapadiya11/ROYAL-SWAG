import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function normalizeRiskLevel(raw: string | undefined, score: number): string {
  const fallback = score <= 2 ? 'Mild' : score <= 5 ? 'Moderate' : 'High'
  if (!raw || typeof raw !== 'string') return fallback
  const u = raw.trim().toUpperCase()
  if (u === 'HIGH') return 'High'
  if (u === 'MODERATE') return 'Moderate'
  if (u === 'MILD') return 'Mild'
  return raw.trim()
}

export async function POST(req: NextRequest) {
  try {
    console.log('track-lungtest called')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('URL:', supabaseUrl ? 'SET' : 'MISSING')
    console.log('KEY:', supabaseKey ? 'SET' : 'MISSING')

    const body = await req.json()
    console.log('Lung test body:', JSON.stringify(body))

    const { name, mobile, email, risk_level, score, answers } = body

    if (!name || !mobile || !email) {
      return NextResponse.json({ error: 'Name, mobile, email required' }, { status: 400 })
    }

    const mobileClean = String(mobile).replace(/\D/g, '').slice(-10)
    if (mobileClean.length !== 10) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 })
    }

    const scoreNum = score != null ? Number(score) : 0

    if (!supabaseUrl || !supabaseKey) {
      console.error('SUPABASE ENV MISSING')
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    let customerId: string | null = null
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('mobile', mobileClean)
      .maybeSingle()

    if (existing?.id) {
      customerId = existing.id
    } else {
      const { data: created, error: custError } = await supabase
        .from('customers')
        .insert({
          name: String(name).trim(),
          mobile: mobileClean,
          email: String(email).trim().toLowerCase()
        })
        .select('id')
        .maybeSingle()
      if (custError) console.error('Customer error:', custError)
      customerId = created?.id ?? null
    }

    const riskNorm = normalizeRiskLevel(risk_level, scoreNum)

    const { data: result, error: lungError } = await supabase
      .from('lung_test_results')
      .insert({
        customer_id: customerId,
        name: String(name).trim(),
        mobile: mobileClean,
        email: String(email).trim().toLowerCase(),
        risk_level: riskNorm,
        score: Number.isFinite(scoreNum) ? scoreNum : 0,
        answers: answers ?? {},
      })
      .select('id')
      .maybeSingle()

    if (lungError) {
      console.error('Lung test insert error:', JSON.stringify(lungError))
      return NextResponse.json({ error: lungError.message }, { status: 500 })
    }

    console.log('Lung test saved:', result?.id)
    return NextResponse.json({ success: true, resultId: result?.id })

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('FATAL track-lungtest error:', msg)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
