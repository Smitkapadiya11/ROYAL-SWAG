-- Unified lung-test leads + extend lung_test_leads for 7-question quiz

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('mild', 'moderate', 'high')),
  answers JSONB NOT NULL DEFAULT '{}',
  matched_herbs TEXT[] DEFAULT '{}',
  source_page TEXT,
  converted BOOLEAN NOT NULL DEFAULT false,
  converted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role leads" ON public.leads;
CREATE POLICY "Allow all for service role leads" ON public.leads
  FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.lung_test_leads
  ADD COLUMN IF NOT EXISTS mucus BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS worsened BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS matched_herbs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source_page TEXT;
