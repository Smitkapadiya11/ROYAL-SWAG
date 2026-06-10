CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_hash TEXT,
  idempotency_key TEXT UNIQUE
);

CREATE INDEX IF NOT EXISTS audit_log_event_type_idx ON public.audit_log (event_type);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON public.audit_log (created_at DESC);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role audit_log" ON public.audit_log FOR ALL USING (true) WITH CHECK (true);
