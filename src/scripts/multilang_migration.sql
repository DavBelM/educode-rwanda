-- Multi-language challenge support (Python + SQL)
-- Run in Supabase SQL Editor

-- Add language column to quiz_challenges
ALTER TABLE public.quiz_challenges
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'javascript'
    CHECK (language IN ('javascript', 'python', 'sql'));

-- Add sql_schema column: holds CREATE TABLE + seed INSERT SQL for SQL challenges
ALTER TABLE public.quiz_challenges
  ADD COLUMN IF NOT EXISTS sql_schema TEXT;

-- Index for filtering by language
CREATE INDEX IF NOT EXISTS quiz_challenges_language_idx
  ON public.quiz_challenges (language);

-- Example Python challenge seed (replace set_id with a real UUID):
-- INSERT INTO public.quiz_challenges (
--   set_id, language, title, title_kin, description, description_kin,
--   starter_js, test_cases, difficulty, xp_reward, order_index, is_visible
-- ) VALUES (
--   '00000000-0300-0000-0000-000000000001',
--   'python',
--   'Write a function that adds two numbers',
--   'Andika function yo guteranya inomero ebyiri',
--   'Create a Python function called add(a, b) that returns a + b.',
--   'Kora function ya Python itwa add(a, b) isubiza a + b.',
--   E'def add(a, b):\n    # Andika code yawe hano\n    pass',
--   '[{"assertion":"add(2,3)==5","description":"add(2,3) should return 5"},{"assertion":"add(-1,1)==0","description":"add(-1,1) should return 0"}]',
--   'easy', 10, 1, true
-- );

-- Example SQL challenge seed:
-- INSERT INTO public.quiz_challenges (
--   set_id, language, title, description, starter_js, sql_schema, test_cases,
--   difficulty, xp_reward, order_index, is_visible
-- ) VALUES (
--   '00000000-0300-0000-0000-000000000001',
--   'sql',
--   'Select all students from the database',
--   'Write a SQL query to select all rows from the students table.',
--   'SELECT -- write your query here',
--   E'CREATE TABLE students (id INTEGER, name TEXT, grade INTEGER);\nINSERT INTO students VALUES (1,''Alice'',90),(2,''Bob'',75),(3,''Carol'',88);',
--   '[{"assertion":"SELECT COUNT(*) > 0 AS ok FROM __result__","description":"Query must return at least one row"},{"assertion":"SELECT COUNT(*) = 3 AS ok FROM __result__","description":"Should return all 3 students"}]',
--   'easy', 10, 2, true
-- );
