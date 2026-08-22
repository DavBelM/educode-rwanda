-- Brief 4: Identity & onboarding
-- Run once in Supabase SQL editor.

-- ── 1. Add super_admin to profiles.user_type ──────────────────────────────────
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (user_type IN ('student','teacher','self_learner','school_admin','super_admin'));

-- ── 2. Add level, cohort_tag, school_id to classes ───────────────────────────
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS level      TEXT;
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS cohort_tag TEXT;
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS school_id  UUID REFERENCES public.schools(id);

-- ── 3. RLS: super_admin reads everything in the key tables ────────────────────
-- Profiles
CREATE POLICY "super_admin reads all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_type = 'super_admin')
  );

-- Schools
CREATE POLICY "super_admin reads all schools"
  ON public.schools FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_type = 'super_admin')
  );

CREATE POLICY "super_admin inserts schools"
  ON public.schools FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_type = 'super_admin')
  );

-- Classes
CREATE POLICY "super_admin reads all classes"
  ON public.classes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_type = 'super_admin')
  );

-- Learning events (already has INSERT-only for students; add super_admin read)
CREATE POLICY "super_admin reads all learning_events"
  ON public.learning_events FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.user_type = 'super_admin')
  );

-- ── 4. Helper: create_student_account ────────────────────────────────────────
-- Called by api/join.ts via the service-role client — NOT exposed to the browser.
-- Inserts a pre-validated profile and enrollment row.
-- Auth user creation itself happens in the API function using admin.createUser().
CREATE OR REPLACE FUNCTION public.enroll_new_student(
  p_user_id    UUID,
  p_full_name  TEXT,
  p_email      TEXT,
  p_class_id   UUID,
  p_school_id  UUID,
  p_cohort_tag TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles(id, full_name, email, user_type, preferred_language, school_id)
  VALUES (p_user_id, p_full_name, p_email, 'student', 'en', p_school_id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.class_enrollments(student_id, class_id)
  VALUES (p_user_id, p_class_id)
  ON CONFLICT DO NOTHING;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enroll_new_student FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.enroll_new_student TO service_role;
