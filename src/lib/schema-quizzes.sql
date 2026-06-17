-- =============================================
-- EduCode Rwanda — Challenge Mode Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- ─── TABLES ───────────────────────────────────────────────────────────────────

CREATE TABLE public.quiz_sets (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  title_kin   TEXT,
  description TEXT,
  description_kin TEXT,
  order_index INTEGER NOT NULL UNIQUE,
  xp_reward   INTEGER NOT NULL DEFAULT 50,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.quiz_challenges (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  set_id          UUID REFERENCES public.quiz_sets(id) ON DELETE CASCADE NOT NULL,
  title           TEXT NOT NULL,
  title_kin       TEXT,
  description     TEXT NOT NULL,
  description_kin TEXT,
  challenge_type  TEXT NOT NULL CHECK (challenge_type IN ('fix_bug', 'complete_code', 'write_scratch')),
  difficulty      TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  starter_js      TEXT NOT NULL DEFAULT '',
  starter_html    TEXT NOT NULL DEFAULT '',
  test_cases      JSONB NOT NULL DEFAULT '[]',
  xp_reward       INTEGER NOT NULL DEFAULT 10,
  order_index     INTEGER NOT NULL,
  hint            TEXT,
  hint_kin        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (set_id, order_index)
);

-- One row per student per set session (multiple sessions allowed)
CREATE TABLE public.quiz_sessions (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id           UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  set_id               UUID REFERENCES public.quiz_sets(id) ON DELETE CASCADE NOT NULL,
  class_id             UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  started_at           TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at         TIMESTAMPTZ,
  xp_earned            INTEGER DEFAULT 0,
  challenges_passed    INTEGER DEFAULT 0,
  challenges_attempted INTEGER DEFAULT 0
);

-- One row per challenge attempt (final result per challenge per session)
CREATE TABLE public.quiz_attempts (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id          UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  student_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id        UUID REFERENCES public.quiz_challenges(id) ON DELETE CASCADE NOT NULL,
  started_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at        TIMESTAMPTZ,
  passed              BOOLEAN DEFAULT FALSE,
  attempts_count      INTEGER DEFAULT 1,
  hint_used           BOOLEAN DEFAULT FALSE,
  time_taken_seconds  INTEGER,
  final_code          TEXT,
  error_log           JSONB DEFAULT '[]',
  xp_earned           INTEGER DEFAULT 0,
  UNIQUE (session_id, challenge_id)
);

-- Tracks which sets a student has fully completed (for sequential unlock)
CREATE TABLE public.quiz_set_progress (
  student_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  set_id       UUID REFERENCES public.quiz_sets(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  best_xp      INTEGER DEFAULT 0,
  PRIMARY KEY (student_id, set_id)
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE public.quiz_sets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_challenges   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_set_progress ENABLE ROW LEVEL SECURITY;

-- quiz_sets: any authenticated user can read
CREATE POLICY "quiz_sets_select"
  ON public.quiz_sets FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- quiz_challenges: any authenticated user can read
CREATE POLICY "quiz_challenges_select"
  ON public.quiz_challenges FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- quiz_sessions: students manage their own
CREATE POLICY "quiz_sessions_insert"
  ON public.quiz_sessions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "quiz_sessions_select"
  ON public.quiz_sessions FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "quiz_sessions_update"
  ON public.quiz_sessions FOR UPDATE
  USING (auth.uid() = student_id);

-- quiz_attempts: students manage their own
CREATE POLICY "quiz_attempts_insert"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "quiz_attempts_select"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "quiz_attempts_update"
  ON public.quiz_attempts FOR UPDATE
  USING (auth.uid() = student_id);

-- quiz_set_progress: students manage their own
CREATE POLICY "quiz_set_progress_all"
  ON public.quiz_set_progress FOR ALL
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);
