-- =============================================
-- EduCode Rwanda — Database Schema
-- Reflects actual Supabase production state
-- Last updated: 2026-06-17
-- =============================================

-- ─── TABLES ───────────────────────────────────────────────────────────────────

-- Extends auth.users; auto-created by trigger on signup
CREATE TABLE public.profiles (
  id                UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  user_type         TEXT NOT NULL CHECK (user_type IN ('student', 'teacher', 'self_learner', 'school_admin')),
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'kin', 'both')),
  xp_points         INTEGER DEFAULT 0,
  streak_days       INTEGER DEFAULT 0,
  school_id         UUID REFERENCES public.schools(id),
  last_active       TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.schools (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  location      TEXT,
  contact_email TEXT NOT NULL,
  school_code   TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.classes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id  UUID REFERENCES public.profiles(id) NOT NULL,
  name        TEXT NOT NULL,
  subject     TEXT DEFAULT 'JavaScript',
  invite_code TEXT UNIQUE NOT NULL DEFAULT UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 6)),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.class_enrollments (
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id   UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, class_id)
);

CREATE TABLE public.assignments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id         UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id       UUID REFERENCES public.profiles(id) NOT NULL,
  title            TEXT NOT NULL,
  title_kin        TEXT,
  description      TEXT,
  description_kin  TEXT,
  assignment_type  TEXT NOT NULL CHECK (assignment_type IN ('coding', 'theoretical')),
  difficulty       TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  total_marks      INTEGER NOT NULL DEFAULT 100,
  weight_pct       INTEGER DEFAULT 100,
  questions        JSONB,
  due_date         TIMESTAMPTZ,
  is_published     BOOLEAN DEFAULT TRUE,
  exam_mode        BOOLEAN DEFAULT FALSE,
  duration_minutes INTEGER,
  grades_released  BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.student_submissions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id       UUID REFERENCES public.profiles(id) NOT NULL,
  assignment_id    UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  code_submitted   TEXT,
  text_answers     JSONB,
  marks_earned     INTEGER,
  teacher_feedback TEXT,
  graded_by        UUID REFERENCES public.profiles(id),
  graded_at        TIMESTAMPTZ,
  violations       JSONB,
  submitted_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.announcements (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id   UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  pinned     BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.courses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  title_kin   TEXT,
  description TEXT,
  difficulty  TEXT DEFAULT 'beginner',
  is_published BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.course_modules (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id   UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  title_kin   TEXT,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.course_lessons (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id   UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  title_kin   TEXT,
  content     JSONB,
  order_index INTEGER NOT NULL,
  xp_reward   INTEGER DEFAULT 10,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.course_exercises (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id   UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  title_kin   TEXT,
  description TEXT,
  starter_code TEXT,
  order_index INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.student_lesson_progress (
  student_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id    UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score        INTEGER,
  PRIMARY KEY (student_id, lesson_id)
);

CREATE TABLE public.exercise_progress (
  student_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id  UUID REFERENCES public.course_exercises(id) ON DELETE CASCADE,
  status       TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_code    TEXT,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (student_id, exercise_id)
);

CREATE TABLE public.daily_logins (
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  login_date DATE NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (student_id, login_date)
);

CREATE TABLE public.school_announcements (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id  UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  admin_id   UUID REFERENCES public.profiles(id) NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  pinned     BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, user_type, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE public.profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_exercises       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logins           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_announcements   ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Authenticated users can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- schools
CREATE POLICY "school_insert"
  ON public.schools FOR INSERT
  WITH CHECK (true);  -- open: school is created before auth user in signup flow

CREATE POLICY "school_select"
  ON public.schools FOR SELECT
  USING (id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "School admins can update schools"
  ON public.schools FOR UPDATE
  USING (id IN (
    SELECT school_id FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'school_admin'
  ));

-- classes
CREATE POLICY "Authenticated users can look up classes"
  ON public.classes FOR SELECT
  USING (auth.uid() IS NOT NULL);  -- needed for invite-code join flow

CREATE POLICY "Teachers can create classes"
  ON public.classes FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- class_enrollments
CREATE POLICY "Students can join classes"
  ON public.class_enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own enrollments"
  ON public.class_enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view class enrollments"
  ON public.class_enrollments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = class_enrollments.class_id AND c.teacher_id = auth.uid()
  ));

-- assignments
CREATE POLICY "Students can view class assignments"
  ON public.assignments FOR SELECT
  USING (
    is_published = TRUE AND EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      WHERE ce.class_id = assignments.class_id AND ce.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view own assignments"
  ON public.assignments FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own assignments"
  ON public.assignments FOR UPDATE
  USING (auth.uid() = teacher_id);

-- student_submissions
CREATE POLICY "Students can insert own submissions"
  ON public.student_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own submissions"
  ON public.student_submissions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view class submissions"
  ON public.student_submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.classes c ON a.class_id = c.id
    WHERE a.id = student_submissions.assignment_id
      AND c.teacher_id = auth.uid()
  ));

CREATE POLICY "Teachers can grade submissions"
  ON public.student_submissions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.classes c ON a.class_id = c.id
    WHERE a.id = student_submissions.assignment_id
      AND c.teacher_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.classes c ON a.class_id = c.id
    WHERE a.id = student_submissions.assignment_id
      AND c.teacher_id = auth.uid()
  ));

-- announcements
CREATE POLICY "Students read class announcements"
  ON public.announcements FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.class_enrollments
    WHERE class_id = announcements.class_id AND student_id = auth.uid()
  ));

CREATE POLICY "Teachers manage own announcements"
  ON public.announcements FOR ALL
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- courses / modules / lessons / exercises (public course content)
CREATE POLICY "courses_select"
  ON public.courses FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "modules_select"
  ON public.course_modules FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "lessons_select"
  ON public.course_lessons FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view published exercises"
  ON public.course_exercises FOR SELECT
  USING (TRUE);

-- student_lesson_progress
CREATE POLICY "progress_all"
  ON public.student_lesson_progress FOR ALL
  USING (auth.uid() = student_id);

-- exercise_progress
CREATE POLICY "Students can manage own progress"
  ON public.exercise_progress FOR ALL
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- daily_logins
CREATE POLICY "logins_all"
  ON public.daily_logins FOR ALL
  USING (auth.uid() = student_id);

-- school_announcements
CREATE POLICY "School members can view announcements"
  ON public.school_announcements FOR SELECT
  USING (school_id IN (SELECT school_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "School admins can manage announcements"
  ON public.school_announcements FOR ALL
  USING (school_id IN (
    SELECT school_id FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'school_admin'
  ))
  WITH CHECK (school_id IN (
    SELECT school_id FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'school_admin'
  ));
