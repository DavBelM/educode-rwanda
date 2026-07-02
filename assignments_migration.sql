-- Run this in the Supabase SQL editor to add columns that are missing from the
-- production assignments table.  All statements use IF NOT EXISTS / safe defaults
-- so they are safe to re-run.

ALTER TABLE public.assignments
  ADD COLUMN IF NOT EXISTS title_kin        TEXT,
  ADD COLUMN IF NOT EXISTS description_kin  TEXT,
  ADD COLUMN IF NOT EXISTS assignment_type  TEXT NOT NULL DEFAULT 'coding'
    CHECK (assignment_type IN ('coding', 'theoretical')),
  ADD COLUMN IF NOT EXISTS difficulty       TEXT NOT NULL DEFAULT 'beginner'
    CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS total_marks      INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS weight_pct       INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS questions        JSONB,
  ADD COLUMN IF NOT EXISTS due_date         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS exam_mode        BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS grades_released  BOOLEAN DEFAULT FALSE;

-- student_submissions: add grading + anti-cheat columns if missing
ALTER TABLE public.student_submissions
  ADD COLUMN IF NOT EXISTS graded_by        UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS graded_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tab_switches     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paste_count      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fullscreen_exits INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS text_answers     JSONB;
