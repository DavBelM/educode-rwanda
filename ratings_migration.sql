-- ── ratings table ──────────────────────────────────────────────────────────
-- Stores post-lesson / post-challenge feedback from students.
-- Used by RatingModal (shown after completing a lesson or challenge set).
-- Aggregated in getClassRatingsSummary() for the teacher dashboard pilot card.

CREATE TABLE IF NOT EXISTS ratings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type  text NOT NULL CHECK (content_type IN ('lesson', 'challenge')),
  content_id    text NOT NULL,
  difficulty    smallint NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  used_mwarimu  boolean NOT NULL DEFAULT false,
  mwarimu_helped boolean,                -- NULL when used_mwarimu = false
  language      text NOT NULL CHECK (language IN ('EN', 'KIN')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for fast per-student and per-class aggregation
CREATE INDEX IF NOT EXISTS ratings_student_idx ON ratings (student_id);
CREATE INDEX IF NOT EXISTS ratings_content_idx ON ratings (content_type, content_id);

-- ── RLS ────────────────────────────────────────────────────────────────────────

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Students insert their own ratings
CREATE POLICY "students_insert_own_ratings"
ON ratings FOR INSERT
WITH CHECK (student_id = auth.uid());

-- Students can read their own ratings
CREATE POLICY "students_read_own_ratings"
ON ratings FOR SELECT
USING (student_id = auth.uid());

-- Teachers read ratings of students enrolled in their classes
CREATE POLICY "teachers_read_enrolled_ratings"
ON ratings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM class_enrollments ce
    JOIN classes c ON ce.class_id = c.id
    WHERE ce.student_id = ratings.student_id
      AND c.teacher_id = auth.uid()
  )
);
