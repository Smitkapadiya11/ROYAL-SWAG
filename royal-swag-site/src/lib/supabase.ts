/**
 * Supabase clients for Royal Swag.
 *
 * orders table (public.orders):
 *   id uuid PK, order_number text unique, created_at timestamptz,
 *   full_name, phone, email, address_line1, address_line2,
 *   city, state, pincode, pack_type, quantity, amount,
 *   payment_id, razorpay_order_id, payment_method, status
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *      SUPABASE_SERVICE_ROLE_KEY (server only — use getSupabaseAdmin in API routes)
 */

export { supabase } from "@/lib/supabase/client";
