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

    const {
      name,
      mobile,
      email,
      address,
      city,
      pincode,
      state,
      package: pkg,
      amount,
      payment_id,
    } = body

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

    const paymentId =
      typeof payment_id === 'string' && payment_id.trim() !== ''
        ? payment_id.trim()
        : null

    if (paymentId) {
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('payment_id', paymentId)
        .maybeSingle()

      if (existing?.id) {
        console.log('Duplicate payment prevented:', paymentId)
        return NextResponse.json({
          success: true,
          orderId: existing.id,
          duplicate: true,
        })
      }
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

    const amountNum =
      amount != null && amount !== ''
        ? Number(amount)
        : 0

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
        amount: Number.isFinite(amountNum) ? amountNum : 0,
        status: 'confirmed',
        payment_id: paymentId,
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
