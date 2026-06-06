-- Remove abandoned orders created before payment verification (payment_id held Razorpay order id)
DELETE FROM public.orders
WHERE payment_id IS NULL
   OR trim(payment_id) = ''
   OR payment_id LIKE 'order_%';

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS orders_razorpay_order_id_key
  ON public.orders (razorpay_order_id)
  WHERE razorpay_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_id_key
  ON public.orders (payment_id)
  WHERE payment_id IS NOT NULL;

ALTER TABLE public.orders
  ALTER COLUMN payment_id SET NOT NULL;
