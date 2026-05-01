import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, mobile, email, address, city, pincode, state, package: pkg, amount } = body

    if (!name || !mobile || !email) {
      return NextResponse.json({ error: 'Name, mobile, email required' }, { status: 400 })
    }

    const mobileClean = String(mobile).replace(/\D/g, '').slice(-10)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase env missing')
      return NextResponse.json({ success: true, warning: 'DB not configured' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Upsert customer
    let customerId: string | null = null
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('mobile', mobileClean)
      .maybeSingle()

    if (existing?.id) {
      customerId = existing.id
    } else {
      const { data: created, error: custErr } = await supabase
        .from('customers')
        .insert({ name: name.trim(), mobile: mobileClean, email: email.trim().toLowerCase() })
        .select('id')
        .maybeSingle()
      if (custErr) {
        console.error('Customer insert error:', custErr)
      }
      customerId = created?.id ?? null
    }

    // Save order with full shipping details
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
        amount: amount ? Number(amount) : 349,
        status: 'confirmed',
      })
      .select('id')
      .maybeSingle()

    if (orderError) {
      console.error('Order save error:', orderError)
    }

    // Send WhatsApp confirmation via wa.me link (log for now)
    console.log(`ORDER CONFIRMED — Name: ${name}, Mobile: ${mobileClean}, Package: ${pkg}, Amount: ${amount}, Address: ${address}, ${city}, ${pincode}, ${state}`)

    return NextResponse.json({ success: true, orderId: order?.id })
  } catch (error) {
    console.error('track-order error:', error)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }
}
