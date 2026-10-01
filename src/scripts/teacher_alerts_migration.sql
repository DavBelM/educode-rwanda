-- Teacher performance alert system
-- Run in Supabase SQL Editor

-- Stores persistent alert records (dismissed or acknowledged)
CREATE TABLE IF NOT EXISTS public.teacher_alert_dismissals (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type   TEXT NOT NULL, -- 'inactive_7', 'inactive_14', 'never_logged_in'
  dismissed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (teacher_id, student_id, alert_type)
);

ALTER TABLE public.teacher_alert_dismissals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dismissals_teacher_own"
  ON public.teacher_alert_dismissals
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- View: teacher sees their classes' at-risk students dynamically
-- Uses quiz_attempts last_seen and auth.users last_sign_in_at
CREATE OR REPLACE VIEW public.teacher_student_alerts AS
SELECT
  cl.teacher_id,
  sp.id            AS student_id,
  sp.full_name,
  cl.id            AS class_id,
  cl.name          AS class_name,
  COALESCE(
    EXTRACT(DAY FROM NOW() - MAX(qa.completed_at))::int,
    999
  )                AS days_since_attempt,
  CASE
    WHEN MAX(qa.completed_at) IS NULL THEN 'never_logged_in'
    WHEN EXTRACT(DAY FROM NOW() - MAX(qa.completed_at)) >= 14 THEN 'inactive_14'
    WHEN EXTRACT(DAY FROM NOW() - MAX(qa.completed_at)) >= 7  THEN 'inactive_7'
    ELSE 'ok'
  END              AS alert_type
FROM public.classes cl
JOIN public.class_enrollments ce ON ce.class_id = cl.id
JOIN public.student_profiles sp  ON sp.id = ce.student_id
LEFT JOIN public.quiz_attempts qa ON qa.student_id = sp.id
WHERE cl.teacher_id = auth.uid()
GROUP BY cl.teacher_id, sp.id, sp.full_name, cl.id, cl.name
HAVING
  MAX(qa.completed_at) IS NULL
  OR EXTRACT(DAY FROM NOW() - MAX(qa.completed_at)) >= 7;

-- Function teachers call to get their alert count (excluding dismissed)
CREATE OR REPLACE FUNCTION public.get_teacher_alert_count()
RETURNS INT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::int
  FROM public.teacher_student_alerts tsa
  WHERE tsa.alert_type != 'ok'
    AND NOT EXISTS (
      SELECT 1 FROM public.teacher_alert_dismissals tad
      WHERE tad.teacher_id = auth.uid()
        AND tad.student_id = tsa.student_id
        AND tad.alert_type = tsa.alert_type
        AND tad.dismissed_at > NOW() - INTERVAL '7 days'
    );
$$;
