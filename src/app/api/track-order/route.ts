import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    console.log('track-order called')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('URL:', supabaseUrl ? 'SET' : 'MISSING')
    console.log('KEY:', supabaseKey ? 'SET' : 'MISSING')

    const body = await req.json()
    console.log('Body received:', JSON.stringify(body))

    const { name, mobile, email, address, city, pincode, state, package: pkg, amount } = body

    if (!name || !mobile || !email) {
      return NextResponse.json({ error: 'Name, mobile, email required' }, { status: 400 })
    }

    const mobileClean = String(mobile).replace(/\D/g, '').slice(-10)

    if (!supabaseUrl || !supabaseKey) {
      console.error('SUPABASE ENV MISSING')
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const { data: recentOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('mobile', mobileClean)
      .gte('created_at', tenMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (recentOrder?.id) {
      console.log('Duplicate order prevented for:', mobileClean)
      return NextResponse.json({
        success: true,
        orderId: recentOrder.id,
        duplicate: true,
      })
    }

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
          name: name.trim(),
          mobile: mobileClean,
          email: email.trim().toLowerCase()
        })
        .select('id')
        .maybeSingle()
      if (custError) console.error('Customer error:', custError)
      customerId = created?.id ?? null
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        name: name.trim(),
        mobile: mobileClean,
        email: email.trim().toLowerCase(),
        address: address || '',
        city: city || '',
        pincode: pincode || '',
        state: state || '',
        package: pkg || '1 Pack',
        amount: amount != null && amount !== '' ? Number(amount) : 0,
        status: 'confirmed',
      })
      .select('id')
      .maybeSingle()

    if (orderError) {
      console.error('Order insert error:', JSON.stringify(orderError))
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    console.log('Order saved:', order?.id)
    return NextResponse.json({ success: true, orderId: order?.id })

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('FATAL track-order error:', msg)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
