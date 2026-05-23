-- Site analytics events (admin command center + live feed)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  session_id TEXT,
  page TEXT,
  city TEXT,
  country TEXT,
  ip_address TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_created_at_idx ON public.events (created_at DESC);
CREATE INDEX IF NOT EXISTS events_session_id_idx ON public.events (session_id);
CREATE INDEX IF NOT EXISTS events_event_name_idx ON public.events (event_name);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Inserts happen via server API (service role). No public policies required.
