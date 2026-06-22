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

// Classroom networks share one IP — allow 120/min so a class of 30 isn't rate-limited

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

  const prompt = targetLanguage === 'EN'
    ? [
        'Translate the following AI tutor message to English.',
        'Rules:',
        '1. Keep all code blocks (text inside triple backticks) exactly as they are — do not translate or reformat them.',
        '2. Keep JavaScript keywords and identifiers (const, let, var, function, console.log, etc.) in English.',
        '3. Preserve all markdown formatting: **bold**, `inline code`, bullet points, numbered lists.',
        '4. If the text is already in English, return it unchanged.',
        '5. Match the warm, encouraging tone of a student tutor.',
        '',
        'Text to translate:',
        text,
      ].join('\n')
    : [
        'You are EduCode Mwarimu, an AI coding tutor helping Rwandan TVET secondary-school students (ages 16–21) learn JavaScript for the first time.',
        'Your job: take this AI tutor response and rewrite it as a clear, friendly explanation in Kinyarwanda that a Rwandan teenager can easily understand.',
        'Do NOT just translate word-for-word. Simplify technical language, use relatable examples if needed, and sound like a supportive older sibling, not a textbook.',
        '',
        'Rules:',
        '1. Write natural, conversational Kinyarwanda — avoid overly formal or stiff language.',
        '2. Do NOT translate or modify code blocks (text inside triple backticks ```). Leave them exactly as they appear.',
        '3. Do NOT translate JavaScript keywords or syntax: const, let, var, function, if, else, return, console.log, true, false, null, undefined, etc.',
        '4. Keep inline code wrapped in backticks (e.g. `const`) in English.',
        '5. Preserve markdown formatting: **bold**, `inline code`, bullet points, numbered lists.',
        '6. Technical terms like "variable", "function", "error", "loop" can be kept in English with a brief Kinyarwanda explanation in parentheses on first use.',
        '7. Be warm, encouraging, and never condescending. If the student made an error, help them see it without making them feel bad.',
        '8. Output only the final Kinyarwanda explanation — no preamble, no "here is my translation".',
        '',
        'AI tutor response to adapt:',
        text,
      ].join('\n');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1500, temperature: 0.1 },
        }),
      }
    );

    const json = await response.json();

    // Safety block or quota exhaustion — log and surface the reason
    const candidate = json.candidates?.[0];
    const finishReason = candidate?.finishReason;
    if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
      console.warn('[EduCode Translate] Gemini blocked response:', finishReason, JSON.stringify(json.promptFeedback ?? {}));
      // Return the original text untranslated rather than failing hard
      return res.status(200).json({ text, _blocked: true });
    }

    const translated = candidate?.content?.parts?.[0]?.text;
    if (!translated?.trim()) {
      console.error('[EduCode Translate] Empty Gemini response:', JSON.stringify(json).slice(0, 300));
      return res.status(502).json({ error: 'Empty response from Gemini' });
    }
    return res.status(200).json({ text: translated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EduCode Translate] Error:', msg);
    return res.status(502).json({ error: msg });
  }
}

export const config = { maxDuration: 30 };
