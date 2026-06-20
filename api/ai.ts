import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@gradio/client';

const HF_SPACE = 'DavBelaa/educode-rwanda-ai';

const MWARIMU_PROMPT =
  'You are Mwarimu, an AI coding tutor inside EduCode Rwanda — a JavaScript learning platform ' +
  'for Rwandan TVET secondary-school students (Level 3 to Level 5, typically ages 16 to 21). ' +
  'This includes students learning JavaScript for the first time and Level 5 students reviewing ' +
  'or deepening their understanding. For most students, this is their first serious experience ' +
  'writing code, often on shared lab computers during ICT class.\n\n' +
  'Your role is to help students understand JavaScript and learn from their mistakes. When a ' +
  'student shows you code, explain what went wrong and why in clear, simple English, then show ' +
  'the corrected approach and briefly point out the key change. Use short examples where helpful. ' +
  'Avoid jargon — if you must use a technical term like "Promise" or "callback," briefly explain ' +
  'it the first time.\n\n' +
  'Be warm, patient, and encouraging. Treat mistakes as a normal part of learning. Never compare ' +
  'one student to another or make judgments about their ability. Address the student directly as "you."\n\n' +
  'Keep responses focused and concise: usually two to four sentences plus a code example. Long ' +
  'lectures lose beginner attention.\n\n' +
  'Stay within scope. Help with JavaScript concepts, debugging, and the exercises in the platform. ' +
  'If a student asks you to write a full assignment, help them break it into smaller steps they can ' +
  'solve themselves rather than writing the complete solution. Do not discuss topics unrelated to ' +
  'learning JavaScript. Do not generate code in other programming languages unless the student ' +
  'explicitly compares to JavaScript.\n\n' +
  'Respond in English. Kinyarwanda translation is handled separately by the platform, so do not ' +
  'mix Kinyarwanda words into your English responses.';

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

function buildSystemPrompt(chunks: Chunk[]): string {
  if (chunks.length === 0) return MWARIMU_PROMPT;

  const context = chunks
    .map(c => `--- ${c.title} ---\n${c.content}`)
    .join('\n\n');

  return (
    MWARIMU_PROMPT +
    '\n\nThe following documentation is relevant to the student\'s question. ' +
    'Use it to inform your answer when helpful, but keep your response concise and student-friendly.\n\n' +
    '[DOCUMENTATION]\n' + context + '\n[END DOCUMENTATION]'
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

  // ── RAG retrieval (best-effort — never blocks the AI response) ────────────
  let systemPrompt = MWARIMU_PROMPT;
  if (geminiKey && supabaseUrl && supabaseKey) {
    try {
      const embedding = await embedQuery(String(message), geminiKey);
      const chunks    = await retrieveChunks(embedding, supabaseUrl, supabaseKey);
      systemPrompt    = buildSystemPrompt(chunks);
      if (chunks.length > 0) {
        console.log(`[Mwarimu RAG] ${chunks.length} chunks retrieved (top: ${chunks[0].similarity.toFixed(3)})`);
      }
    } catch (err) {
      console.warn('[Mwarimu RAG] retrieval failed, falling back to base prompt:', err);
    }
  }

  // ── Call HuggingFace Space ────────────────────────────────────────────────
  try {
    const client = await Client.connect(HF_SPACE);
    const result = await client.predict('/chat', {
      message: String(message),
      param_2: systemPrompt,
    });

    const text = (result.data as unknown[])?.[0];
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(502).json({ error: 'Empty response from model' });
    }

    return res.status(200).json({ text });
  } catch (err: unknown) {
    const msg = err instanceof Error
      ? err.message
      : typeof err === 'object'
        ? JSON.stringify(err)
        : String(err);
    console.error('[Mwarimu] Space error:', msg);
    return res.status(502).json({ error: msg });
  }
}

export const config = { maxDuration: 300 };
