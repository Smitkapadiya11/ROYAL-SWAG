import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function GET() {
  try {
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
