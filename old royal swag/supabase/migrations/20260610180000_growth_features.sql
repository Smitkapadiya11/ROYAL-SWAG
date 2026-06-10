-- Sprint 3/4: popup leads, nurture tracking, referrals, wallets

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'lung_test',
  ADD COLUMN IF NOT EXISTS page_path TEXT,
  ADD COLUMN IF NOT EXISTS nurture_day INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nurture_emails_sent JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.leads
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN score DROP NOT NULL,
  ALTER COLUMN risk_level DROP NOT NULL,
  ALTER COLUMN answers DROP NOT NULL;

CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads (source);
CREATE INDEX IF NOT EXISTS leads_nurture_idx ON public.leads (created_at, converted);

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  referrer_name TEXT NOT NULL,
  referrer_phone TEXT NOT NULL,
  code TEXT NOT NULL,
  referred_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'paid')),
  reward_amount INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS referrals_code_idx ON public.referrals (code);
CREATE UNIQUE INDEX IF NOT EXISTS referrals_referred_order_unique
  ON public.referrals (referred_order_id)
  WHERE referred_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS referrals_referrer_phone_idx ON public.referrals (referrer_phone);

CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_code TEXT NOT NULL,
  referrer_phone TEXT NOT NULL UNIQUE,
  balance_paise INTEGER NOT NULL DEFAULT 0,
  referral_shares INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role referrals" ON public.referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service role wallets" ON public.wallets FOR ALL USING (true) WITH CHECK (true);
