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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'unknown');
  if (!checkRateLimit(ip, 10)) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });

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
        'You are translating an AI coding tutor response from English to Kinyarwanda.',
        'The audience is Rwandan TVET secondary-school students (ages 16–21) learning JavaScript for the first time.',
        '',
        'Rules:',
        '1. Translate the explanation text naturally into Kinyarwanda that a teenage student would understand.',
        '2. Do NOT translate or modify code blocks (text inside triple backticks ```). Leave them exactly as they appear.',
        '3. Do NOT translate JavaScript keywords, identifiers, or syntax: const, let, var, function, if, else, return, console.log, true, false, null, undefined, etc.',
        '4. Keep inline code wrapped in backticks (e.g. `const`) in English.',
        '5. Preserve all markdown formatting exactly: **bold**, `inline code`, bullet points (- or *), numbered lists.',
        '6. Technical terms with no clear Kinyarwanda equivalent (like "variable", "function", "error", "assignment") can be kept in English or briefly explained in parentheses.',
        '7. Keep the same warm, patient, encouraging tone as the original. Never sound formal or robotic.',
        '8. Do not add any introduction or explanation of what you are doing — output only the translated text.',
        '',
        'Text to translate:',
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
          generationConfig: { maxOutputTokens: 500, temperature: 0.1 },
        }),
      }
    );

    const json = await response.json();
    const translated = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!translated?.trim()) return res.status(502).json({ error: 'Empty response from Gemini' });
    return res.status(200).json({ text: translated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EduCode Translate] Error:', msg);
    return res.status(502).json({ error: msg });
  }
}

export const config = { maxDuration: 30 };
