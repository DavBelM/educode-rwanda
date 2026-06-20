-- RAG knowledge base migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Required before Phase 3 (embedding insert) can run.

-- ── 1. Enable pgvector ────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS vector;

-- ── 2. knowledge_chunks table ─────────────────────────────────────────────────
CREATE TABLE public.knowledge_chunks (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  content     TEXT        NOT NULL,
  embedding   vector(3072) NOT NULL,             -- Gemini gemini-embedding-001
  source      TEXT        NOT NULL CHECK (source IN ('mdn', 'lesson')),
  topic       TEXT        NOT NULL,             -- e.g. 'arrow_functions', 'async_await'
  title       TEXT        NOT NULL,             -- e.g. 'MDN: Arrow function expressions'
  url         TEXT,                             -- MDN URL for CC BY-SA attribution; NULL for lessons
  chunk_index INTEGER     NOT NULL,             -- position within source doc (for debugging)
  token_count INTEGER,                          -- approximate, for monitoring
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Indexes ────────────────────────────────────────────────────────────────
-- No vector index at this scale — exact cosine search is fast and more accurate.
-- pgvector ivfflat/hnsw both cap at 2,000 dims; add hnsw when corpus grows past ~5,000 chunks.

-- topic filter index for future scoped retrieval
CREATE INDEX knowledge_chunks_topic_idx
  ON public.knowledge_chunks (topic);

-- ── 4. Row Level Security ────────────────────────────────────────────────────
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Knowledge base is read-only reference content — all authenticated users can read
CREATE POLICY "chunks_select"
  ON public.knowledge_chunks FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert/update/delete (used by embedding scripts)
CREATE POLICY "chunks_service_write"
  ON public.knowledge_chunks FOR ALL
  TO service_role
  USING (true);

-- ── 5. Similarity search function ────────────────────────────────────────────
-- Returns top-K chunks above a similarity threshold.
-- Threshold is intentionally not hardcoded here — caller passes it in
-- so we can tune it empirically after Phase 3 calibration.
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
    id,
    content,
    title,
    url,
    source,
    topic,
    1 - (embedding <=> query_embedding) AS similarity
  FROM  public.knowledge_chunks
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Grant execute to authenticated users (called from /api/ai via service key)
GRANT EXECUTE ON FUNCTION match_chunks TO authenticated;
GRANT EXECUTE ON FUNCTION match_chunks TO service_role;
