-- Patch: recreate knowledge_chunks with vector(3072) for Gemini gemini-embedding-001
-- Run this in Supabase SQL Editor BEFORE running build_knowledge_base.py
-- The table is empty so it is safe to drop and recreate.

DROP TABLE IF EXISTS public.knowledge_chunks CASCADE;  -- CASCADE drops the index too
DROP FUNCTION IF EXISTS match_chunks;

-- Recreate with 3072-dim vectors (Gemini gemini-embedding-001)
CREATE TABLE public.knowledge_chunks (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  content     TEXT        NOT NULL,
  embedding   vector(3072) NOT NULL,             -- Gemini gemini-embedding-001
  source      TEXT        NOT NULL CHECK (source IN ('mdn', 'lesson')),
  topic       TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  url         TEXT,
  chunk_index INTEGER     NOT NULL,
  token_count INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- No vector index at 521 chunks — exact cosine search is fast and more accurate.
-- Add hnsw index when corpus grows past ~5,000 chunks.
CREATE INDEX knowledge_chunks_topic_idx
  ON public.knowledge_chunks (topic);

ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chunks_select"
  ON public.knowledge_chunks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "chunks_service_write"
  ON public.knowledge_chunks FOR ALL
  TO service_role
  USING (true);

CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(3072),
  match_count     int     DEFAULT 5,
  match_threshold float   DEFAULT 0.70
)
RETURNS TABLE (
  id          UUID,
  content     TEXT,
  title       TEXT,
  url         TEXT,
  source      TEXT,
  topic       TEXT,
  similarity  float
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    id, content, title, url, source, topic,
    1 - (embedding <=> query_embedding) AS similarity
  FROM  public.knowledge_chunks
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

GRANT EXECUTE ON FUNCTION match_chunks TO authenticated;
GRANT EXECUTE ON FUNCTION match_chunks TO service_role;
