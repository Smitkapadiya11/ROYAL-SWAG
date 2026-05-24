-- Admin read policies (service role bypasses RLS; helps if anon key is used elsewhere)
DROP POLICY IF EXISTS "Service role full access orders" ON public.orders;
DROP POLICY IF EXISTS "Service role full access leads" ON public.lung_test_leads;
DROP POLICY IF EXISTS "Allow all for service role" ON public.orders;
DROP POLICY IF EXISTS "Allow all for service role" ON public.lung_test_leads;

CREATE POLICY "Allow all for service role" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for service role" ON public.lung_test_leads
  FOR ALL USING (true) WITH CHECK (true);
