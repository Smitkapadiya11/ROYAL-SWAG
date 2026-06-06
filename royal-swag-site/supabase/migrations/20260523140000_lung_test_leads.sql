-- Lung test lead capture (symptom quiz + breath hold)
CREATE TABLE IF NOT EXISTS public.lung_test_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city BOOLEAN NOT NULL DEFAULT false,
  smoke BOOLEAN NOT NULL DEFAULT false,
  cough BOOLEAN NOT NULL DEFAULT false,
  breathless BOOLEAN NOT NULL DEFAULT false,
  dust BOOLEAN NOT NULL DEFAULT false,
  breath_hold_seconds NUMERIC(6, 2),
  score INTEGER NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Mild', 'Moderate', 'High')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lung_test_leads_created_at_idx ON public.lung_test_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS lung_test_leads_email_idx ON public.lung_test_leads (email);

ALTER TABLE public.lung_test_leads ENABLE ROW LEVEL SECURITY;
