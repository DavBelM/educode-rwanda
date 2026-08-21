import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@gradio/client';

// ── Model config ──────────────────────────────────────────────────────────────
// gemini-3.7-flash: stable, strongest on code reasoning, no deprecation date.
// gemini-embedding-001: not deprecated, leave unchanged (changing it invalidates
// all stored 3072-dim vectors in knowledge_chunks and forces a full re-embed).
const GEMINI_MODEL = 'gemini-3.7-flash';
const EMBED_MODEL  = 'gemini-embedding-001';
const EMBED_URL    = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`;
const GEMINI_URL   = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;

// ── HuggingFace Space — emergency fallback only, default OFF ──────────────────
// To enable: set USE_SPACE=true in Vercel env vars (emergency rollback).
// HF_SPACE_URL can point to v1 or v2 Space.
const USE_SPACE = process.env.USE_SPACE === 'true';
const HF_SPACE  = process.env.HF_SPACE_URL ?? 'DavBelaa/educode-rwanda-mwarimu-v2';

// ── Mwarimu system prompt — primary teaching voice ────────────────────────────
// Implicit context caching is automatic on gemini-3.7-flash (Gemini 2.5+).
// The system prompt is under the 4096-token explicit cache threshold, so we
// rely on implicit caching: the same bytes repeated across requests are cached
// automatically with no extra code required.
const MWARIMU_SYSTEM = [
  'You are Mwarimu, the AI coding tutor inside EduCode Rwanda — a JavaScript learning platform for Rwandan TVET secondary-school students (ages 16–21, many coding for the first time).',
  '',
  'Your job is to guide students to understanding, not to give them answers.',
  '',
  'Teaching rules:',
  '1. NEVER write or reveal the complete working solution. If a student asks for "the answer" or "the code", redirect: ask them what they think the next step is.',
  '2. Give ONE specific hint OR ask ONE guiding question per response — not both.',
  '3. When a student is stuck, start with the smallest possible step. Break the problem down.',
  '4. Be warm, patient, and encouraging. Acknowledge progress. These students are beginners in a second or third language.',
  '5. Use plain language. Explain any term you introduce.',
  '6. Always respond in English.',
  '',
  'For code errors: identify the error type, explain in plain language what it means, point to the line or pattern causing it, then ask one guiding question.',
  'For concept questions: explain clearly with a short example (but not the solution to the exercise), then invite the student to try.',
  'Length: 2–4 sentences for simple questions; up to 8 sentences for explanations. Never produce a complete code solution.',
].join('\n');

// ── Application-level Q&A cache (shared across students per function instance) ─
// Normalized exact-match only — no semantic matching to avoid false cache hits.
// TTL: 30 min. Evicts stale entries when size exceeds 500.
interface CacheEntry { text: string; cachedAt: number; }
const QA_CACHE = new Map<string, CacheEntry>();
const QA_TTL_MS = 30 * 60 * 1_000;

function normalizeQ(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ').slice(0, 500);
}
function hashQ(q: string): string {
  let h = 0;
  for (const c of q) h = (Math.imul(31, h) + c.charCodeAt(0)) >>> 0;
  return h.toString(36);
}
function cacheGet(raw: string): string | null {
  const entry = QA_CACHE.get(hashQ(normalizeQ(raw)));
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > QA_TTL_MS) { QA_CACHE.delete(hashQ(normalizeQ(raw))); return null; }
  return entry.text;
}
function cacheSet(raw: string, text: string): void {
  if (QA_CACHE.size > 500) {
    const cutoff = Date.now() - QA_TTL_MS;
    for (const [k, v] of QA_CACHE) if (v.cachedAt < cutoff) QA_CACHE.delete(k);
  }
  QA_CACHE.set(hashQ(normalizeQ(raw)), { text, cachedAt: Date.now() });
}

// ── Rate limiter (per-IP, in-memory, resets on cold start) ────────────────────
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
    body: JSON.stringify({ model: `models/${EMBED_MODEL}`, content: { parts: [{ text }] } }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Gemini embed ${res.status}`);
  const json = await res.json();
  return json.embedding.values as number[];
}

interface Chunk { content: string; title: string; url: string | null; similarity: number; }

async function retrieveChunks(embedding: number[], supabaseUrl: string, supabaseKey: string): Promise<Chunk[]> {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/match_chunks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    body: JSON.stringify({ query_embedding: embedding, match_count: 4, match_threshold: 0.70 }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Supabase RPC ${res.status}`);
  return res.json() as Promise<Chunk[]>;
}

function buildUserMessage(message: string, chunks: Chunk[]): string {
  if (chunks.length === 0) return message;
  const context = chunks.map(c => `--- ${c.title} ---\n${c.content}`).join('\n\n');
  return message + '\n\n[RELEVANT DOCUMENTATION]\n' + context + '\n[END DOCUMENTATION]';
}

// Rule-based hints — instant last resort, no API call.
function ruleBasedHint(message: string): string | null {
  const refMatch = message.match(/ReferenceError[:\s]+['"]?(\w+)['"]? is not defined/i);
  if (refMatch) return `You used \`${refMatch[1]}\` but it hasn't been declared. Check for a typo — your variable might be spelled differently where you declared it. Make sure it's declared with \`let\`, \`const\`, or \`var\` before this line.`;
  if (/SyntaxError.*string literal contains an unescaped line break/i.test(message)) return "Your string is missing a closing quote. Find the line with a `\"` or `'` that opens a string and make sure it closes on the same line.";
  if (/TypeError.*invalid assignment to const/i.test(message)) return "You declared this variable with `const`, which means it can't be changed after it's set. Change `const` to `let` if you need to update its value later.";
  if (/TypeError.*(\w+) is not a function/i.test(message)) { const m = message.match(/TypeError.*?['"`]?(\w+)['"`]? is not a function/i); return `\`${m?.[1] ?? 'That'}\` is not a function. Check the spelling — you might have a typo in the method name, or the value isn't what you expect it to be.`; }
  if (/SyntaxError.*unexpected (token|end of input)/i.test(message)) return "Syntax error — look for a missing bracket `}`, parenthesis `)`, or quote `\"'` near the line mentioned. Every opening bracket needs a closing one.";
  if (/SyntaxError/i.test(message)) return "There's a syntax error in your code. Check for missing or extra brackets, quotes, or semicolons. The line number in the error message is a good place to start.";
  if (/TypeError/i.test(message)) return "There's a type error — you're using a value in a way that doesn't match its type. Check that the variable has the value you expect before you use it.";
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown');
  if (!checkRateLimit(ip, 60)) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });

  const { message } = req.body ?? {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  const rawMessage = String(message);

  // ── Q&A cache check ───────────────────────────────────────────────────────
  const cached = cacheGet(rawMessage);
  if (cached) {
    console.log('[Mwarimu] Served from Q&A cache');
    return res.status(200).json({ text: cached, source: 'cache' });
  }

  const geminiKey   = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  // ── RAG retrieval ─────────────────────────────────────────────────────────
  let userMessage = rawMessage;
  if (geminiKey && supabaseUrl && supabaseKey) {
    try {
      const embedding = await embedQuery(rawMessage, geminiKey);
      const chunks    = await retrieveChunks(embedding, supabaseUrl, supabaseKey);
      userMessage     = buildUserMessage(rawMessage, chunks);
      if (chunks.length > 0) console.log(`[Mwarimu RAG] ${chunks.length} chunks (top: ${chunks[0].similarity.toFixed(3)})`);
    } catch (err) {
      console.warn('[Mwarimu RAG] retrieval failed, continuing without context:', err);
    }
  }

  // ── Space: emergency fallback only (USE_SPACE=true env var required) ──────
  if (USE_SPACE) {
    try {
      const spaceResult = await Promise.race([
        (async () => {
          const client = await Client.connect(HF_SPACE);
          return await client.predict('/chat', { message: userMessage });
        })(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Space timeout')), 50_000)),
      ]);
      const text = (spaceResult.data as unknown[])?.[0];
      if (typeof text === 'string' && text.trim()) {
        const t = text.trim();
        const looksComplete = /[.!?`]$/.test(t) || t.endsWith('```');
        if (looksComplete) {
          console.log('[Mwarimu] Served by Space (emergency mode)');
          cacheSet(rawMessage, t);
          return res.status(200).json({ text: t, source: 'space' });
        }
      }
    } catch (err) {
      console.warn('[Mwarimu] Space error in emergency mode:', err instanceof Error ? err.message : err);
    }
  }

  // ── Gemini primary ────────────────────────────────────────────────────────
  if (!geminiKey) {
    const hint = ruleBasedHint(rawMessage);
    if (hint) return res.status(200).json({ text: hint, source: 'rule' });
    return res.status(200).json({ text: "Mwarimu is unavailable right now — check back in a moment.", source: 'fallback' });
  }

  try {
    const geminiRes = await fetch(GEMINI_URL(geminiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: MWARIMU_SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.4 },
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const json = await geminiRes.json();

    if (json.error?.status === 'RESOURCE_EXHAUSTED' || geminiRes.status === 429) {
      console.warn('[Mwarimu] Gemini rate limited');
      return res.status(200).json({ text: "Mwarimu is helping many students right now — please try again in a few seconds!", source: 'rate_limited' });
    }

    if (json.error) throw new Error(json.error.message ?? String(json.error.code));
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text?.trim()) throw new Error('Empty Gemini response');

    console.log('[Mwarimu] Served by Gemini primary');
    cacheSet(rawMessage, text);
    return res.status(200).json({ text, source: 'gemini' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Mwarimu] Gemini error:', msg);
    const hint = ruleBasedHint(rawMessage);
    if (hint) return res.status(200).json({ text: hint, source: 'rule' });
    return res.status(200).json({ text: "Mwarimu is a bit busy right now — read the error message carefully and look at which line it points to.", source: 'fallback' });
  }
}

// maxDuration reduced from 300s: Space is out of the hot path.
// Worst case is embed (8s) + RAG (8s) + Gemini (15s) = ~31s, so 60s is comfortable headroom.
export const config = { maxDuration: 60 };
