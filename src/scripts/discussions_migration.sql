-- Challenge discussion threads (gated by completion)
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.challenge_discussions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.quiz_challenges(id) ON DELETE CASCADE,
  author_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id    UUID REFERENCES public.challenge_discussions(id) ON DELETE CASCADE,
  body         TEXT NOT NULL CHECK (length(body) > 0 AND length(body) <= 1000),
  is_flagged   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenge_discussions ENABLE ROW LEVEL SECURITY;

-- Only students who have passed the challenge can see or post in it
CREATE POLICY "discussions_read_if_passed"
  ON public.challenge_discussions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.student_id = auth.uid()
        AND qa.challenge_id = challenge_discussions.challenge_id
        AND qa.passed = TRUE
    )
  );

CREATE POLICY "discussions_insert_if_passed"
  ON public.challenge_discussions FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.student_id = auth.uid()
        AND qa.challenge_id = challenge_discussions.challenge_id
        AND qa.passed = TRUE
    )
  );

-- Authors can delete their own posts
CREATE POLICY "discussions_delete_own"
  ON public.challenge_discussions FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Index for fast challenge-level queries
CREATE INDEX IF NOT EXISTS challenge_discussions_challenge_idx
  ON public.challenge_discussions (challenge_id, created_at ASC);

-- Expose author display name (codename) view so real names stay hidden
-- We join with student_codenames to show anonymous codename
CREATE OR REPLACE VIEW public.challenge_discussion_posts AS
  SELECT
    cd.id,
    cd.challenge_id,
    cd.parent_id,
    cd.body,
    cd.created_at,
    cd.is_flagged,
    (cd.author_id = auth.uid()) AS is_mine,
    COALESCE(sc.codename, 'Anonymous') AS author_codename
  FROM public.challenge_discussions cd
  LEFT JOIN public.student_codenames sc ON sc.student_id = cd.author_id;
