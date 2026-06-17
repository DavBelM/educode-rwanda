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
    ? `Translate the following to English. Keep code terms (variable names, function names, keywords like const/let/var/function) in English as-is. If it is already in English, return it unchanged:\n\n${text}`
    : `Translate the following JavaScript error explanation to Kinyarwanda. Keep code terms (variable names, function names, keywords like const/let/var) in English. Only translate the explanation text:\n\n${text}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.1 },
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
