-- Customer session analytics (journey + dashboard)
CREATE TABLE IF NOT EXISTS public.customer_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  visitor_id UUID NOT NULL,
  page TEXT NOT NULL DEFAULT '/',
  event TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  city TEXT,
  device TEXT NOT NULL DEFAULT 'desktop' CHECK (device IN ('mobile', 'desktop')),
  source TEXT DEFAULT 'direct',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customer_events_timestamp_idx ON public.customer_events (timestamp DESC);
CREATE INDEX IF NOT EXISTS customer_events_session_idx ON public.customer_events (session_id);
CREATE INDEX IF NOT EXISTS customer_events_visitor_idx ON public.customer_events (visitor_id);
CREATE INDEX IF NOT EXISTS customer_events_event_idx ON public.customer_events (event);
CREATE INDEX IF NOT EXISTS customer_events_page_idx ON public.customer_events (page);
CREATE INDEX IF NOT EXISTS customer_events_source_idx ON public.customer_events (source);
CREATE INDEX IF NOT EXISTS customer_events_device_idx ON public.customer_events (device);

ALTER TABLE public.customer_events ENABLE ROW LEVEL SECURITY;
