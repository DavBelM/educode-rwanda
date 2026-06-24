import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@gradio/client';

// Default: v2 Space (Qwen2.5-Coder-7B, ZeroGPU, system prompt locked in Space).
// Emergency rollback: set HF_SPACE_URL=DavBelaa/educode-rwanda-ai in Vercel env vars.
const HF_SPACE = process.env.HF_SPACE_URL ?? 'DavBelaa/educode-rwanda-mwarimu-v2';

const EMBED_MODEL  = 'gemini-embedding-001';
const EMBED_URL    = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;

const ipRequests = new Map<string, number[]>();

function checkRateLimit(ip: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const times = (ipRequests.get(ip) ?? []).filter(t => now - t < 60_000);
  if (times.length >= maxPerMinute) return false;
  times.push(now);
  ipRequests.set(ip, times);
  return true;
}

async function embedQuery(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch(`${EMBED_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text }] },
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Gemini embed ${res.status}`);
  const json = await res.json();
  return json.embedding.values as number[];
}

interface Chunk {
  content: string;
  title: string;
  url: string | null;
  similarity: number;
}

async function retrieveChunks(
  embedding: number[],
  supabaseUrl: string,
  supabaseKey: string,
): Promise<Chunk[]> {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/match_chunks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      query_embedding: embedding,
      match_count: 4,
      match_threshold: 0.70,
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Supabase RPC ${res.status}`);
  return res.json() as Promise<Chunk[]>;
}

// RAG context is appended to the user message, not the system prompt.
// The system prompt is locked inside the Space and never sent from here.
function buildUserMessage(message: string, chunks: Chunk[]): string {
  if (chunks.length === 0) return message;

  const context = chunks
    .map(c => `--- ${c.title} ---\n${c.content}`)
    .join('\n\n');

  return (
    message +
    '\n\n[RELEVANT DOCUMENTATION]\n' + context + '\n[END DOCUMENTATION]'
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown');
  if (!checkRateLimit(ip, 5)) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });

  const { message } = req.body ?? {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  const geminiKey   = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  // ── RAG retrieval — context injected into user message, not system prompt ──
  let userMessage = String(message);
  if (geminiKey && supabaseUrl && supabaseKey) {
    try {
      const embedding = await embedQuery(String(message), geminiKey);
      const chunks    = await retrieveChunks(embedding, supabaseUrl, supabaseKey);
      userMessage     = buildUserMessage(String(message), chunks);
      if (chunks.length > 0) {
        console.log(`[Mwarimu RAG] ${chunks.length} chunks retrieved (top: ${chunks[0].similarity.toFixed(3)})`);
      }
    } catch (err) {
      console.warn('[Mwarimu RAG] retrieval failed, continuing without context:', err);
    }
  }

  // ── Try fine-tuned Space first ───────────────────────────────────────────
  try {
    const client = await Client.connect(HF_SPACE, { hf_token: undefined });
    const result = await client.predict('/chat', { message: userMessage });
    const text = (result.data as unknown[])?.[0];
    if (typeof text === 'string' && text.trim()) {
      console.log('[Mwarimu] Served by fine-tuned Space');
      return res.status(200).json({ text });
    }
  } catch (err) {
    console.warn('[Mwarimu] Space unavailable, falling back to Gemini:', err instanceof Error ? err.message : err);
  }

  // ── Gemini fallback ───────────────────────────────────────────────────────
  if (!geminiKey) {
    return res.status(502).json({ error: 'AI tutor is currently unavailable. Please try again in a moment.' });
  }

  try {
    const SYSTEM = [
      'You are Mwarimu, an AI coding tutor built into EduCode Rwanda, a JavaScript learning platform for Rwandan TVET students.',
      'Help students understand JavaScript concepts and debug their code.',
      'Be encouraging, clear, and concise. Use simple language suitable for beginners.',
      'If the student writes in Kinyarwanda, respond in Kinyarwanda. Otherwise respond in English.',
      'Never write complete solutions for them — guide them to find the answer themselves.',
    ].join(' ');

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.4 },
        }),
      }
    );
    const json = await geminiRes.json();
    if (json.error) throw new Error(json.error.message ?? String(json.error.code));
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text?.trim()) throw new Error('Empty response from Gemini');
    console.log('[Mwarimu] Served by Gemini fallback');
    return res.status(200).json({ text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Mwarimu] Gemini fallback error:', msg);
    return res.status(502).json({ error: 'AI tutor is currently unavailable. Please try again in a moment.' });
  }
}

export const config = { maxDuration: 300 };
