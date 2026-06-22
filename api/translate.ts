import type { VercelRequest, VercelResponse } from '@vercel/node';

const ipRequests = new Map<string, number[]>();

function checkRateLimit(ip: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const times = (ipRequests.get(ip) ?? []).filter(t => now - t < 60_000);
  if (times.length >= maxPerMinute) return false;
  times.push(now);
  ipRequests.set(ip, times);
  return true;
}

// Heuristic: if > 75% of non-code words are ASCII, the text is already in English
function isLikelyEnglish(text: string): boolean {
  const stripped = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '');
  const words = stripped.split(/\s+/).filter(w => w.length > 1);
  if (words.length < 3) return true;
  const asciiWords = words.filter(w => /^[a-zA-Z0-9.,!?;:'"()\-–—[\]{}<>/@#$%^&*+=|\\~`_*]+$/.test(w));
  return asciiWords.length / words.length > 0.75;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown');
  if (!checkRateLimit(ip, 120)) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });

  const { text, targetLanguage = 'KIN' } = req.body ?? {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  // Skip Gemini entirely if the text is already in English and we want English
  if (targetLanguage === 'EN' && isLikelyEnglish(text)) {
    return res.status(200).json({ text });
  }

  const prompt = targetLanguage === 'EN'
    ? [
        'Translate the following AI tutor message to English.',
        'Rules:',
        '1. Keep all code blocks (text inside triple backticks) exactly as they are.',
        '2. Keep JavaScript keywords and identifiers in English.',
        '3. Preserve all markdown formatting.',
        '4. Match the warm, encouraging tone of a student tutor.',
        '',
        'Text to translate:',
        text,
      ].join('\n')
    : [
        'You are EduCode Mwarimu, an AI coding tutor helping Rwandan TVET secondary-school students (ages 16–21) learn JavaScript for the first time.',
        'Take this AI tutor response and rewrite it as a clear, friendly explanation in Kinyarwanda that a Rwandan teenager can easily understand.',
        'Do NOT translate word-for-word. Simplify technical language and sound like a supportive older sibling, not a textbook.',
        '',
        'Rules:',
        '1. Write natural, conversational Kinyarwanda.',
        '2. Do NOT translate or modify code blocks (text inside triple backticks). Leave them exactly as they appear.',
        '3. Do NOT translate JavaScript keywords: const, let, var, function, if, else, return, console.log, true, false, null, undefined, etc.',
        '4. Keep inline code in backticks in English.',
        '5. Preserve markdown formatting.',
        '6. Technical terms (variable, function, error, loop) can stay in English with a brief Kinyarwanda explanation in parentheses.',
        '7. Be warm and encouraging. Output only the final explanation — no preamble.',
        '',
        'AI tutor response to adapt:',
        text,
      ].join('\n');

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1500, temperature: 0.1 },
        }),
      }
    );

    // v2026-06-22 — if you see this in logs, new code is running
    const rawBody = await geminiRes.text();
    let json: Record<string, unknown>;
    try { json = JSON.parse(rawBody); } catch {
      console.error('[EduCode Translate v2] Non-JSON from Gemini HTTP', geminiRes.status, ':', rawBody.slice(0, 200));
      if (targetLanguage === 'EN') return res.status(200).json({ text });
      return res.status(502).json({ error: `Gemini HTTP ${geminiRes.status}: non-JSON response` });
    }

    if (!geminiRes.ok) {
      console.error('[EduCode Translate v2] Gemini HTTP error', geminiRes.status, ':', rawBody.slice(0, 300));
      if (targetLanguage === 'EN') return res.status(200).json({ text });
      return res.status(502).json({ error: `Gemini HTTP ${geminiRes.status}` });
    }

    // Gemini-level API error (bad key, quota, invalid model, etc.)
    if (json.error) {
      console.error('[EduCode Translate] Gemini API error:', JSON.stringify(json.error));
      // For EN: fall back to original text; for KIN: return 502 so UI shows retry
      if (targetLanguage === 'EN') return res.status(200).json({ text });
      return res.status(502).json({ error: `Gemini error: ${json.error.message ?? json.error.code}` });
    }

    // Prompt blocked before any candidate was generated
    const blockReason = json.promptFeedback?.blockReason;
    if (blockReason) {
      console.warn('[EduCode Translate] Prompt blocked:', blockReason);
      return res.status(200).json({ text, _blocked: true });
    }

    const candidate = json.candidates?.[0];

    // Empty candidates array (quota, safety, or other server-side reason)
    if (!candidate) {
      console.error('[EduCode Translate] No candidates in response:', JSON.stringify(json).slice(0, 400));
      if (targetLanguage === 'EN') return res.status(200).json({ text });
      return res.status(502).json({ error: 'No candidates returned by Gemini' });
    }

    const finishReason = candidate.finishReason;
    // Note: check each reason individually — `=== 'SAFETY' || 'RECITATION'` is always true (bug)
    if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
      console.warn('[EduCode Translate] Content blocked:', finishReason);
      return res.status(200).json({ text, _blocked: true });
    }

    const translated = candidate?.content?.parts?.[0]?.text;
    if (!translated?.trim()) {
      console.error('[EduCode Translate] Empty text in candidate. finishReason:', finishReason, '| Full response:', JSON.stringify(json).slice(0, 500));
      if (targetLanguage === 'EN') return res.status(200).json({ text });
      return res.status(502).json({ error: `Empty translation (finishReason: ${finishReason ?? 'unknown'})` });
    }

    return res.status(200).json({ text: translated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EduCode Translate] Fetch error:', msg);
    if (targetLanguage === 'EN') return res.status(200).json({ text });
    return res.status(502).json({ error: msg });
  }
}

export const config = { maxDuration: 30 };
