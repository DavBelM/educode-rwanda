-- Brief 3: Teacher dashboard — indexes and RPCs over learning_events
-- Run once in Supabase SQL editor.

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_le_class_time
  ON public.learning_events(class_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_le_student_entity
  ON public.learning_events(student_id, entity_id);

CREATE INDEX IF NOT EXISTS idx_le_cohort
  ON public.learning_events(cohort_tag)
  WHERE cohort_tag IS NOT NULL;

-- ── get_class_live_signals ────────────────────────────────────────────────────
-- Per-student aggregate from learning_events for the dashboard live view.
-- Only returns rows for students who have at least one event in the class.
-- is_stuck = true when a student has 3+ fails on some entity with no pass.
CREATE OR REPLACE FUNCTION public.get_class_live_signals(
  p_class_id   UUID,
  p_cohort_tag TEXT DEFAULT NULL
)
RETURNS TABLE(
  student_id       UUID,
  last_event_at    TIMESTAMPTZ,
  lesson_count     BIGINT,
  challenge_passes BIGINT,
  challenge_fails  BIGINT,
  ai_questions     BIGINT,
  is_stuck         BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    e.student_id,
    MAX(e.created_at)                                                                        AS last_event_at,
    COUNT(*) FILTER (WHERE e.event_type = 'lesson_complete')                                  AS lesson_count,
    COUNT(*) FILTER (WHERE e.entity_type IN ('exercise','challenge') AND e.outcome = 'pass')  AS challenge_passes,
    COUNT(*) FILTER (WHERE e.entity_type IN ('exercise','challenge') AND e.outcome = 'fail')  AS challenge_fails,
    COUNT(*) FILTER (WHERE e.event_type = 'ai_question_asked')                                AS ai_questions,
    EXISTS(
      SELECT 1
      FROM public.learning_events ie
      WHERE ie.student_id  = e.student_id
        AND ie.class_id    = p_class_id
        AND ie.entity_id   IS NOT NULL
        AND ie.outcome     IN ('fail','pass')
        AND (p_cohort_tag IS NULL OR ie.cohort_tag = p_cohort_tag)
      GROUP BY ie.entity_id
      HAVING COUNT(*) FILTER (WHERE ie.outcome = 'fail') >= 3
         AND COUNT(*) FILTER (WHERE ie.outcome = 'pass') = 0
    )                                                                                         AS is_stuck
  FROM public.learning_events e
  WHERE e.class_id = p_class_id
    AND (p_cohort_tag IS NULL OR e.cohort_tag = p_cohort_tag)
  GROUP BY e.student_id
$$;

REVOKE EXECUTE ON FUNCTION public.get_class_live_signals FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_class_live_signals TO authenticated;

-- ── get_student_event_timeline ────────────────────────────────────────────────
-- Most-recent events for one student in a class, for the timeline tab.
CREATE OR REPLACE FUNCTION public.get_student_event_timeline(
  p_student_id UUID,
  p_class_id   UUID,
  p_limit      INT DEFAULT 40
)
RETURNS TABLE(
  id              UUID,
  created_at      TIMESTAMPTZ,
  event_type      TEXT,
  entity_type     TEXT,
  outcome         TEXT,
  attempt_number  INTEGER,
  score           NUMERIC,
  competency_code TEXT,
  language_mode   TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id, created_at, event_type, entity_type, outcome,
         attempt_number, score, competency_code, language_mode
  FROM   public.learning_events
  WHERE  student_id = p_student_id
    AND  class_id   = p_class_id
  ORDER BY created_at DESC
  LIMIT p_limit
$$;

REVOKE EXECUTE ON FUNCTION public.get_student_event_timeline FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_student_event_timeline TO authenticated;

-- ── get_competency_summary ────────────────────────────────────────────────────
-- Per-competency pass rate across the class — drives the "what to reteach" panel.
CREATE OR REPLACE FUNCTION public.get_competency_summary(
  p_class_id   UUID,
  p_cohort_tag TEXT DEFAULT NULL
)
RETURNS TABLE(
  competency_code TEXT,
  attempt_count   BIGINT,
  pass_count      BIGINT,
  pass_rate       NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    competency_code,
    COUNT(*) FILTER (WHERE outcome IN ('pass','fail'))  AS attempt_count,
    COUNT(*) FILTER (WHERE outcome = 'pass')             AS pass_count,
    CASE
      WHEN COUNT(*) FILTER (WHERE outcome IN ('pass','fail')) = 0 THEN 0
      ELSE ROUND(
        100.0 * COUNT(*) FILTER (WHERE outcome = 'pass')
               / COUNT(*) FILTER (WHERE outcome IN ('pass','fail')),
        0
      )
    END                                                  AS pass_rate
  FROM   public.learning_events
  WHERE  class_id        = p_class_id
    AND  competency_code IS NOT NULL
    AND  (p_cohort_tag IS NULL OR cohort_tag = p_cohort_tag)
  GROUP BY competency_code
  ORDER BY competency_code
$$;

REVOKE EXECUTE ON FUNCTION public.get_competency_summary FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_competency_summary TO authenticated;
