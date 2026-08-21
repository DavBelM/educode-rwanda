-- =============================================
-- EduCode Rwanda — Event Tracking Layer
-- Brief 1: Prerequisite migration + learning_events table
-- Run in Supabase SQL Editor (once, in order)
-- =============================================

-- ─── PREREQUISITE: Competency codes on course structure ───────────────────────

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS competency_code TEXT;
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS competency_code TEXT;

-- Backfill course-level code
UPDATE public.courses
SET competency_code = 'SWDJF301'
WHERE title = 'JavaScript Fundamentals';

-- Backfill module sub-codes (order_index is the stable anchor)
UPDATE public.course_modules
SET competency_code = 'SWDJF301-01'
WHERE order_index = 1
  AND course_id = (SELECT id FROM public.courses WHERE title = 'JavaScript Fundamentals');

UPDATE public.course_modules
SET competency_code = 'SWDJF301-02'
WHERE order_index = 2
  AND course_id = (SELECT id FROM public.courses WHERE title = 'JavaScript Fundamentals');

UPDATE public.course_modules
SET competency_code = 'SWDJF301-03'
WHERE order_index = 3
  AND course_id = (SELECT id FROM public.courses WHERE title = 'JavaScript Fundamentals');

-- ─── LEARNING EVENTS TABLE (append-only) ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.learning_events (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  student_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id        UUID        REFERENCES public.classes(id) ON DELETE SET NULL,
  school_id       UUID        REFERENCES public.schools(id) ON DELETE SET NULL,
  cohort_tag      TEXT,
  event_type      TEXT        NOT NULL,
  entity_type     TEXT        CHECK (entity_type IN ('lesson','exercise','challenge','assessment','ai_chat','session')),
  entity_id       UUID,
  competency_code TEXT,
  outcome         TEXT        CHECK (outcome IN ('start','complete','pass','fail','submit')),
  attempt_number  INTEGER,
  score           NUMERIC,
  language_mode   TEXT        NOT NULL DEFAULT 'en' CHECK (language_mode IN ('en','kin')),
  metadata        JSONB       NOT NULL DEFAULT '{}'
);

-- Index for the most common query shapes
CREATE INDEX IF NOT EXISTS idx_le_student   ON public.learning_events (student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_le_class     ON public.learning_events (class_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_le_cohort    ON public.learning_events (cohort_tag, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_le_competency ON public.learning_events (competency_code, outcome);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE public.learning_events ENABLE ROW LEVEL SECURITY;

-- Students INSERT only their own rows; no SELECT/UPDATE/DELETE via student JWT
CREATE POLICY "events_insert_own"
  ON public.learning_events FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students read their own events (for their progress view)
CREATE POLICY "events_select_own"
  ON public.learning_events FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers read events for their classes
CREATE POLICY "events_select_teacher"
  ON public.learning_events FOR SELECT
  USING (
    class_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = learning_events.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- School admins read events for their school
CREATE POLICY "events_select_admin"
  ON public.learning_events FOR SELECT
  USING (
    school_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.school_id = learning_events.school_id
        AND p.user_type = 'school_admin'
    )
  );

-- ─── IMMUTABILITY — hard block at the database level ──────────────────────────
-- RLS alone is not enough: a service_role client bypasses RLS.
-- These triggers fire for EVERY role including postgres and service_role,
-- making the log trustworthy as evidence in front of a board.

CREATE OR REPLACE FUNCTION public.block_learning_events_mutation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RAISE EXCEPTION 'learning_events is append-only: UPDATE and DELETE are permanently disabled.';
END;
$$;

DROP TRIGGER IF EXISTS learning_events_no_update ON public.learning_events;
CREATE TRIGGER learning_events_no_update
  BEFORE UPDATE ON public.learning_events
  FOR EACH ROW EXECUTE FUNCTION public.block_learning_events_mutation();

DROP TRIGGER IF EXISTS learning_events_no_delete ON public.learning_events;
CREATE TRIGGER learning_events_no_delete
  BEFORE DELETE ON public.learning_events
  FOR EACH ROW EXECUTE FUNCTION public.block_learning_events_mutation();

-- ─── EXPORT RPC ───────────────────────────────────────────────────────────────
-- Called via service_role only (server-side export, never from the browser).
-- Enriches competency_code at query time via join for rows that stored null.

CREATE OR REPLACE FUNCTION public.export_events(
  p_cohort_tag TEXT     DEFAULT NULL,
  p_class_id   UUID     DEFAULT NULL,
  p_school_id  UUID     DEFAULT NULL,
  p_start_date DATE     DEFAULT NULL,
  p_end_date   DATE     DEFAULT NULL
)
RETURNS TABLE (
  id              UUID,
  created_at      TIMESTAMPTZ,
  student_id      UUID,
  student_name    TEXT,
  class_id        UUID,
  class_name      TEXT,
  school_id       UUID,
  cohort_tag      TEXT,
  event_type      TEXT,
  entity_type     TEXT,
  entity_id       UUID,
  competency_code TEXT,
  outcome         TEXT,
  attempt_number  INTEGER,
  score           NUMERIC,
  language_mode   TEXT,
  metadata        JSONB
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    e.id,
    e.created_at,
    e.student_id,
    p.full_name                                                     AS student_name,
    e.class_id,
    cls.name                                                        AS class_name,
    e.school_id,
    e.cohort_tag,
    e.event_type,
    e.entity_type,
    e.entity_id,
    -- Use stored code first; fall back to module then course via join
    COALESCE(e.competency_code, cm.competency_code, c.competency_code) AS competency_code,
    e.outcome,
    e.attempt_number,
    e.score,
    e.language_mode,
    e.metadata
  FROM  public.learning_events e
  LEFT  JOIN public.profiles       p   ON p.id   = e.student_id
  LEFT  JOIN public.classes        cls ON cls.id = e.class_id
  LEFT  JOIN public.course_lessons cl  ON cl.id  = e.entity_id AND e.entity_type = 'lesson'
  LEFT  JOIN public.course_modules cm  ON cm.id  = cl.module_id
  LEFT  JOIN public.courses        c   ON c.id   = cm.course_id
  WHERE
    (p_cohort_tag IS NULL OR e.cohort_tag = p_cohort_tag)
    AND (p_class_id   IS NULL OR e.class_id   = p_class_id)
    AND (p_school_id  IS NULL OR e.school_id  = p_school_id)
    AND (p_start_date IS NULL OR e.created_at >= p_start_date::timestamptz)
    AND (p_end_date   IS NULL OR e.created_at <  (p_end_date + INTERVAL '1 day')::timestamptz)
  ORDER BY e.created_at;
$$;

-- Only service_role (server-side) can call the export function
REVOKE EXECUTE ON FUNCTION public.export_events FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.export_events TO service_role;
