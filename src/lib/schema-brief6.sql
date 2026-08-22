-- Brief 6: School leads table for "Contact us for schools" inbound enquiries.
-- Run once in Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.school_leads (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name  TEXT        NOT NULL,
  contact_name TEXT        NOT NULL,
  role         TEXT,
  email        TEXT,
  phone        TEXT,
  message      TEXT,
  followed_up  BOOLEAN     DEFAULT false NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.school_leads ENABLE ROW LEVEL SECURITY;

-- Public insert is blocked; only the service role key (api/submit-lead.ts) can insert.
-- No permissive INSERT policy means all non-service-role inserts are denied.

-- Super admin can read and update all leads.
CREATE POLICY "super_admin_select_leads"
  ON public.school_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'super_admin'
    )
  );

CREATE POLICY "super_admin_update_leads"
  ON public.school_leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'super_admin'
    )
  );
