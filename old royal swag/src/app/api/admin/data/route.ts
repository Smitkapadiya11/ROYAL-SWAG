import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ orders: [], lungTests: [] })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    const [ordersRes, lungRes] = await Promise.all([
      supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(500),
      supabaseAdmin.from('lung_test_results').select('*').order('created_at', { ascending: false }).limit(500),
    ])

    return NextResponse.json({
      orders: ordersRes.data || [],
      lungTests: lungRes.data || [],
    })
  } catch (error) {
    console.error('Admin data error:', error)
    return NextResponse.json({ orders: [], lungTests: [] })
  }
}
