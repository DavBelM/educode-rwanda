import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;

const SYSTEM_PROMPT = `You are Mwarimu, an adaptive learning advisor for EduCode Rwanda — a JavaScript coding platform for Rwandan TVET students.

Given a student's recent activity (completed challenge sets, XP earned, quiz scores, idle time), recommend exactly 3 specific next actions in JSON format. Be specific, actionable, and encouraging.

Rules:
1. Respond ONLY with valid JSON — no markdown fences, no explanation text
2. Format: {"recommendations": [{"title": "...", "reason": "...", "type": "challenge|lesson|review|practice"}]}
3. Each title: 5–10 words, specific to the data given
4. Each reason: 1 sentence, motivating
5. Types: "challenge" (do a new challenge set), "lesson" (study a lesson), "review" (revisit a weak area), "practice" (free practice)`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return res.status(500).json({ error: 'AI not configured' });

  const { studentData } = req.body ?? {};
  if (!studentData) return res.status(400).json({ error: 'studentData is required' });

  const prompt = `Student activity summary:\n${JSON.stringify(studentData, null, 2)}\n\nProvide 3 personalized study recommendations.`;

  try {
    const response = await fetch(GEMINI_URL(geminiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Recommend] Gemini error:', err);
      return res.status(502).json({ error: 'AI request failed' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip markdown fences if present
    const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (e) {
    console.error('[Recommend] parse error:', e);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
}

export const config = { maxDuration: 30 };
