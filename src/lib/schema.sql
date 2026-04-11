-- =============================================
-- EduCode Rwanda - Database Schema
-- =============================================

-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'teacher', 'self_learner')),
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'kin', 'both')),
  xp_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schools
CREATE TABLE public.schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  school_type TEXT CHECK (school_type IN ('TVET', 'secondary', 'university', 'other')),
  district TEXT,
  contact_person_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'inactive')),
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE public.classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id),
  teacher_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT NOT NULL,
  subject TEXT DEFAULT 'JavaScript',
  invite_code TEXT UNIQUE NOT NULL DEFAULT UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 6)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class Enrollments
CREATE TABLE public.class_enrollments (
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, class_id)
);

-- Assignments
CREATE TABLE public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  title_kin TEXT,
  description TEXT,
  description_kin TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  starter_code TEXT,
  test_cases JSONB,
  due_date TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Submissions (ML Training Data!)
CREATE TABLE public.student_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  assignment_id UUID REFERENCES public.assignments(id),
  code_submitted TEXT NOT NULL,
  code_after_fix TEXT,
  error_type TEXT,
  error_message TEXT,
  error_line INTEGER,
  feedback_given JSONB,
  feedback_language TEXT CHECK (feedback_language IN ('en', 'kin')),
  feedback_helpful BOOLEAN,
  attempt_number INTEGER DEFAULT 1,
  time_to_fix_seconds INTEGER,
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Modules (for self-learner path)
CREATE TABLE public.course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_kin TEXT,
  description TEXT,
  description_kin TEXT,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Exercises (belong to modules)
CREATE TABLE public.course_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_kin TEXT,
  description TEXT,
  description_kin TEXT,
  starter_code TEXT,
  solution_code TEXT,
  test_cases JSONB,
  order_index INTEGER NOT NULL,
  difficulty TEXT DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Exercise Progress (self-learner track)
CREATE TABLE public.exercise_progress (
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.course_exercises(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  last_code TEXT,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (student_id, exercise_id)
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Submissions: students can insert/read their own
CREATE POLICY "Students can insert own submissions"
  ON public.student_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own submissions"
  ON public.student_submissions FOR SELECT
  USING (auth.uid() = student_id);

-- Teachers can view submissions for their classes
CREATE POLICY "Teachers can view class submissions"
  ON public.student_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.classes c ON a.class_id = c.id
      WHERE a.id = student_submissions.assignment_id
      AND c.teacher_id = auth.uid()
    )
  );

-- Course modules and exercises are public (readable by all)
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published modules"
  ON public.course_modules FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Anyone can view published exercises"
  ON public.course_exercises FOR SELECT
  USING (TRUE);

-- Exercise progress: students manage their own
CREATE POLICY "Students can manage own progress"
  ON public.exercise_progress FOR ALL
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================

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
