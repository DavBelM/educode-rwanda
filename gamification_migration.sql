-- Gamification tables: codenames, peer activity feed, AI interaction log
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ── 1. student_codenames ──────────────────────────────────────────────────────
-- Each student gets one anonymous codename (e.g. "Eagle-23") used in leaderboards
-- and the peer activity feed. Never shows real names.

CREATE TABLE IF NOT EXISTS public.student_codenames (
  student_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  codename   TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.student_codenames ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read codenames (needed for class leaderboard)
CREATE POLICY "codenames_read"
  ON public.student_codenames FOR SELECT
  TO authenticated USING (true);

-- Students can only insert their own codename
CREATE POLICY "codenames_insert_own"
  ON public.student_codenames FOR INSERT
  TO authenticated WITH CHECK (student_id = auth.uid());


-- ── 2. peer_activity_feed ─────────────────────────────────────────────────────
-- Real-time anonymized feed: "Eagle-23 just completed 'Arrow Functions'"
-- Events expire after 24 hours via application-level filtering.

CREATE TABLE IF NOT EXISTS public.peer_activity_feed (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id   UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  codename   TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('challenge_completed', 'set_completed')),
  title      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.peer_activity_feed ENABLE ROW LEVEL SECURITY;

-- Students in the class can read their class feed
CREATE POLICY "feed_read_class_members"
  ON public.peer_activity_feed FOR SELECT
  TO authenticated
  USING (
    class_id IN (
      SELECT class_id FROM public.class_enrollments WHERE student_id = auth.uid()
    )
  );

-- Any enrolled student can post to the feed (app validates class membership)
CREATE POLICY "feed_insert_authenticated"
  ON public.peer_activity_feed FOR INSERT
  TO authenticated WITH CHECK (true);

-- Index for efficient recent-feed queries
CREATE INDEX IF NOT EXISTS peer_activity_feed_class_created_idx
  ON public.peer_activity_feed (class_id, created_at DESC);


-- ── 3. ai_interactions ───────────────────────────────────────────────────────
-- Logs every Mwarimu conversation turn for research + teacher analytics.
-- Captures what the student asked, what Mwarimu answered, and which RAG
-- chunks were retrieved (with similarity scores).

CREATE TABLE IF NOT EXISTS public.ai_interactions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id   UUID REFERENCES public.quiz_sessions(id) ON DELETE SET NULL,
  challenge_id UUID REFERENCES public.quiz_challenges(id) ON DELETE SET NULL,
  question     TEXT NOT NULL,
  response     TEXT NOT NULL,
  rag_chunks   JSONB,     -- [{title, similarity, content_preview}]
  language     TEXT NOT NULL DEFAULT 'EN',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Students can read and write their own interactions
CREATE POLICY "ai_interactions_own_read"
  ON public.ai_interactions FOR SELECT
  TO authenticated USING (student_id = auth.uid());

CREATE POLICY "ai_interactions_own_insert"
  ON public.ai_interactions FOR INSERT
  TO authenticated WITH CHECK (student_id = auth.uid());

-- Service role can read all (for teacher analytics)
CREATE POLICY "ai_interactions_service_all"
  ON public.ai_interactions FOR ALL
  TO service_role USING (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS ai_interactions_student_created_idx
  ON public.ai_interactions (student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ai_interactions_session_idx
  ON public.ai_interactions (session_id);
