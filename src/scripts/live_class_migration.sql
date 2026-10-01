-- Live class / synchronized challenge mode
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.live_sessions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_code VARCHAR(6)   NOT NULL UNIQUE,
  teacher_id   UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id     UUID         REFERENCES public.classes(id) ON DELETE SET NULL,
  set_id       UUID         REFERENCES public.quiz_sets(id) ON DELETE SET NULL,
  active_challenge_id UUID  REFERENCES public.quiz_challenges(id) ON DELETE SET NULL,
  status       TEXT         NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
  started_at   TIMESTAMPTZ,
  ended_at     TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- Teachers manage their own sessions
CREATE POLICY "live_session_teacher_all"
  ON public.live_sessions FOR ALL TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- Students can read active sessions (to join by code)
CREATE POLICY "live_session_student_read"
  ON public.live_sessions FOR SELECT TO authenticated
  USING (status != 'ended');

-- Track which students have joined a live session
CREATE TABLE IF NOT EXISTS public.live_session_participants (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id   UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, student_id)
);

ALTER TABLE public.live_session_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "live_participants_insert_own"
  ON public.live_session_participants FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "live_participants_select_teacher"
  ON public.live_session_participants FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.live_sessions ls
      WHERE ls.id = session_id AND ls.teacher_id = auth.uid()
    )
    OR student_id = auth.uid()
  );

-- Enable Realtime on live_sessions so students get push updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sessions;
