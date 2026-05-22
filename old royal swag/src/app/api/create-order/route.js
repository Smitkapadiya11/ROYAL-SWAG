import { NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { bundleType, amount, currency = "INR", name } = await req.json();
    
    let orderId = `dummy_order_${Date.now()}`;
    let resAmount = amount;
    
    try {
      const rp = getRazorpayClient();
      const options = {
        amount: amount, 
        currency,
        receipt: `rcpt_${Date.now()}`
      };
      const order = await rp.orders.create(options);
      orderId = order.id;
      resAmount = order.amount;
    } catch (rpErr) {
      console.warn("Razorpay Client Init/Create failed, using dummy order for test mode. Err:", rpErr.message);
    }
    
    // Save to Supabase (non-blocking)
    if (supabase) {
      supabase.from('orders').insert([{
        razorpay_order_id: orderId,
        amount: resAmount,
        bundle_type: bundleType,
        status: 'created'
      }]).then(({ error }) => {
        if (error) console.error("Supabase insert error:", error);
      });
    }
    
    return NextResponse.json({ orderId, amount: resAmount, currency });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
