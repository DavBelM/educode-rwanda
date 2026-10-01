-- Badges & Achievements system
-- Run in Supabase SQL Editor

-- ── Badge definitions ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.badges (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  name_kin    TEXT,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'award',
  xp_required INT  DEFAULT 0,
  category    TEXT NOT NULL DEFAULT 'general'
);

INSERT INTO public.badges (id, name, name_kin, description, icon, xp_required, category) VALUES
  ('first_challenge',   'First Challenge',     'Challenge ya Mbere',    'Completed your first challenge',                        'zap',    0,    'milestone'),
  ('bug_slayer',        'Bug Slayer',          'Umukozi wa Bug',        'Fixed 5 fix_bug challenges',                             'bug',    0,    'skill'),
  ('scratch_master',    'Scratch Master',      'Inzobere',              'Wrote 5 solutions from scratch',                         'code',   0,    'skill'),
  ('speed_run',         'Speed Run',           'Vuba',                  'Solved a challenge in under 60 seconds',                 'zap',    0,    'performance'),
  ('first_try',         'First Try',           'Inshuro ya Mbere',      'Solved a challenge on the first attempt',                'star',   0,    'performance'),
  ('streak_3',          'On a Roll',           'Iminsi 3',              'Completed challenges 3 days in a row',                   'flame',  0,    'streak'),
  ('level3_complete',   'L3 Graduate',         'Byanzwe L3',            'Completed all RQF Level 3 challenge sets',               'graduation', 0, 'milestone'),
  ('level4_complete',   'L4 Graduate',         'Byanzwe L4',            'Completed all RQF Level 4 challenge sets',               'graduation', 0, 'milestone'),
  ('level5_complete',   'L5 Graduate',         'Byanzwe L5',            'Completed all RQF Level 5 challenge sets',               'trophy',  0, 'milestone'),
  ('xp_100',            '100 XP Club',         'Amatsinda 100',         'Earned 100 XP from challenges',                         'star',   100, 'xp'),
  ('xp_500',            '500 XP Club',         'Amatsinda 500',         'Earned 500 XP from challenges',                         'star',   500, 'xp'),
  ('xp_1000',           'Challenge Elite',     'Inzobere Nkuru',        'Earned 1000 XP from challenges',                        'crown', 1000, 'xp'),
  ('no_hint',           'Self-Sufficient',     'Ntabarika',             'Solved 10 challenges without using any hints',           'shield',  0,  'skill'),
  ('set_perfect',       'Perfect Set',         'Set Nziza',             'Passed all challenges in a set on first attempt',        'check',   0,  'performance')
ON CONFLICT (id) DO NOTHING;

-- ── Student earned badges ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_badges (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id   TEXT NOT NULL REFERENCES public.badges(id),
  earned_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, badge_id)
);

ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- Students read their own badges
CREATE POLICY "student_badges_read_own"
  ON public.student_badges FOR SELECT
  TO authenticated USING (student_id = auth.uid());

-- System can insert (we'll use service role from edge functions, or allow authenticated)
CREATE POLICY "student_badges_insert_own"
  ON public.student_badges FOR INSERT
  TO authenticated WITH CHECK (student_id = auth.uid());

-- All authenticated can read badge definitions
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_read_all"
  ON public.badges FOR SELECT TO authenticated USING (true);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS student_badges_student_idx ON public.student_badges (student_id, earned_at DESC);
