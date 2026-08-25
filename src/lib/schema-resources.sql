-- Add resource_url to announcements (optional link attachment)
-- Run in Supabase SQL editor

ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS resource_url TEXT,
  ADD COLUMN IF NOT EXISTS resource_label TEXT;
