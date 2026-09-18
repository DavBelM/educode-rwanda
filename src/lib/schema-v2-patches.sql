-- =============================================
-- EduCode Rwanda — Schema Patches v2
-- Run these in Supabase SQL Editor (in order)
-- =============================================

-- ─── 1. Add RQF level to quiz_sets ───────────────────────────────────────────
-- rqf_level: 1-3 = existing RTB curriculum, 4-5 = upcoming levels
ALTER TABLE public.quiz_sets
  ADD COLUMN IF NOT EXISTS rqf_level INTEGER NOT NULL DEFAULT 1
  CHECK (rqf_level BETWEEN 1 AND 5);

-- ─── 2. Persist AI assessments ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_assessments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  teacher_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  class_id    UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  assessment  TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.student_assessments ENABLE ROW LEVEL SECURITY;

-- Students can read their own assessments
CREATE POLICY "student_assessments_own_read"
  ON public.student_assessments FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers can insert and read assessments for students in their classes
CREATE POLICY "student_assessments_teacher_insert"
  ON public.student_assessments FOR INSERT
  WITH CHECK (
    auth.uid() = teacher_id
    AND EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      JOIN public.classes c ON c.id = ce.class_id
      WHERE c.teacher_id = auth.uid()
        AND ce.student_id = student_assessments.student_id
    )
  );

CREATE POLICY "student_assessments_teacher_read"
  ON public.student_assessments FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      JOIN public.classes c ON c.id = ce.class_id
      WHERE c.teacher_id = auth.uid()
        AND ce.student_id = student_assessments.student_id
    )
  );

-- School admin can read assessments for students in their school
CREATE POLICY "student_assessments_school_admin_read"
  ON public.student_assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.user_type IN ('school_admin', 'super_admin')
    )
  );

-- ─── 3. Teacher RLS on quiz_sessions ─────────────────────────────────────────
-- Teachers can read sessions for students enrolled in their classes
CREATE POLICY "quiz_sessions_teacher_read"
  ON public.quiz_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      JOIN public.classes c ON c.id = ce.class_id
      WHERE c.teacher_id = auth.uid()
        AND ce.student_id = quiz_sessions.student_id
    )
  );

-- School admin can read all sessions in their school
CREATE POLICY "quiz_sessions_school_admin_read"
  ON public.quiz_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.user_type IN ('school_admin', 'super_admin')
    )
  );

-- ─── 4. Teacher RLS on quiz_attempts ─────────────────────────────────────────
CREATE POLICY "quiz_attempts_teacher_read"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      JOIN public.classes c ON c.id = ce.class_id
      WHERE c.teacher_id = auth.uid()
        AND ce.student_id = quiz_attempts.student_id
    )
  );

CREATE POLICY "quiz_attempts_school_admin_read"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.user_type IN ('school_admin', 'super_admin')
    )
  );

-- ─── 5. Teacher/admin can read quiz_set_progress ──────────────────────────────
CREATE POLICY "quiz_set_progress_teacher_read"
  ON public.quiz_set_progress FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      JOIN public.classes c ON c.id = ce.class_id
      WHERE c.teacher_id = auth.uid()
        AND ce.student_id = quiz_set_progress.student_id
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.user_type IN ('school_admin', 'super_admin')
    )
  );

-- ─── 6. Admin access to pilot survey responses ────────────────────────────────
-- Allow school_admin and super_admin to read all survey responses
CREATE POLICY "pilot_survey_admin_read"
  ON public.pilot_survey_responses FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.user_type IN ('school_admin', 'super_admin')
    )
  );

-- ─── 7. Per-class challenge progress view (for analytics) ─────────────────────
-- A helper view that counts passed/attempted challenges per student per class
CREATE OR REPLACE VIEW public.class_challenge_summary AS
SELECT
  ce.class_id,
  ce.student_id,
  COALESCE(SUM(CASE WHEN qa.passed THEN 1 ELSE 0 END), 0) AS challenges_passed,
  COALESCE(COUNT(qa.id), 0) AS challenges_attempted
FROM public.class_enrollments ce
LEFT JOIN public.quiz_sessions qs ON qs.student_id = ce.student_id AND qs.class_id = ce.class_id
LEFT JOIN public.quiz_attempts qa ON qa.session_id = qs.id
GROUP BY ce.class_id, ce.student_id;
