-- Add video lesson support to quiz_sets
-- Run in Supabase SQL Editor

ALTER TABLE public.quiz_sets
  ADD COLUMN IF NOT EXISTS video_url       TEXT,
  ADD COLUMN IF NOT EXISTS video_title     TEXT,
  ADD COLUMN IF NOT EXISTS video_title_kin TEXT;

-- Example: update a set with a video
-- UPDATE public.quiz_sets
--   SET video_url = 'https://youtu.be/XXXXXXXXXXX',
--       video_title = 'Introduction to Vue Components',
--       video_title_kin = 'Intangiriro ya Vue Components'
--   WHERE id = '00000000-0300-0000-0000-000000000010';
