-- Mwarimu accuracy evaluation table
-- Run this in Supabase SQL Editor before using the Teacher Evaluation feature

CREATE TABLE IF NOT EXISTS public.mwarimu_evaluations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  error_input   TEXT NOT NULL,
  code_context  TEXT,
  ai_response   TEXT NOT NULL,
  rating        TEXT NOT NULL CHECK (rating IN ('accurate', 'partially_accurate', 'inaccurate')),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mwarimu_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage their own evaluations"
  ON public.mwarimu_evaluations
  FOR ALL
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());
