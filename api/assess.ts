import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_MODEL = 'gemini-3.7-flash';

function buildStudentPromptEN(d: StudentData): string {
  const errorSummary = d.topErrors.length > 0
    ? d.topErrors.map(e => `${e.type} (${e.count}×)`).join(', ')
    : 'no specific error pattern';
  const total = d.languageSplit.en + d.languageSplit.kin;
  const kinPct = total > 0 ? Math.round((d.languageSplit.kin / total) * 100) : 0;
  const challengePct = d.challenges_attempted > 0
    ? Math.round((d.challenges_passed / d.challenges_attempted) * 100) : null;
  const recentQs = d.recentQuestions.slice(0, 3).map(q => `"${q.question}"`).join('; ');

  return [
    'You are an educational AI assistant helping a Rwandan TVET teacher understand a student\'s learning status.',
    'Write a 3-4 sentence assessment of this student. Do NOT list the numbers — synthesize them into a narrative.',
    'Focus on observations: what the student understands, what they struggle with, and how engaged they are.',
    'Do NOT include recommendations, directives, or sentences telling the teacher what to do.',
    '',
    `Student: ${d.name}`,
    `Course progress: ${d.progress_pct}% of lessons completed, current module: ${d.current_module}`,
    `Challenges: ${d.challenges_passed}/${d.challenges_attempted} passed${challengePct !== null ? ` (${challengePct}%)` : ''}`,
    `Last active: ${d.last_active ?? 'never'}  |  Status: ${d.status}`,
    `Mwarimu interactions: ${d.totalInteractions} total, ${d.weekInteractions} this week, ${d.challengeInteractions} during challenges`,
    `Most common errors: ${errorSummary}`,
    `Language: ${kinPct}% Kinyarwanda, ${100 - kinPct}% English`,
    `Recent questions: ${recentQs || 'none recorded'}`,
  ].join('\n');
}

function buildClassPromptEN(d: ClassData): string {
  const challengePct = d.totalChallengesAttempted > 0
    ? Math.round((d.totalChallengesPassed / d.totalChallengesAttempted) * 100) : null;

  return [
    'You are an educational AI assistant helping a Rwandan TVET teacher understand their entire class.',
    'Write a 4-5 sentence summary. Synthesize the data — do not just list the numbers.',
    'Cover: overall progress trend, most common struggle, engagement level, one recommendation for next week.',
    '',
    `Class: ${d.className}  |  Students: ${d.studentCount}`,
    `Average course progress: ${d.avgProgress}%`,
    `Challenges: ${d.totalChallengesPassed}/${d.totalChallengesAttempted} passed${challengePct !== null ? ` (${challengePct}%)` : ''}`,
    `Status breakdown: ${d.studentsOnTrack} on track, ${d.studentsBehind} behind, ${d.studentsNeedHelp} need help`,
    `Average Mwarimu interactions per student: ${d.avgInteractionsPerStudent}`,
    `Kinyarwanda usage: ${d.kinUsagePct}%`,
  ].join('\n');
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 800, temperature: 0.4 },
      }),
      signal: AbortSignal.timeout(15_000),
    }
  );
  const json = await response.json();
  if (json.error) throw new Error(json.error.message ?? String(json.error.code));
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text?.trim()) throw new Error('Empty response from Gemini');
  return text.trim();
}

interface StudentData {
  name: string; progress_pct: number; current_module: string;
  challenges_passed: number; challenges_attempted: number;
  status: string; last_active: string | null;
  totalInteractions: number; weekInteractions: number; challengeInteractions: number;
  topErrors: Array<{ type: string; count: number }>;
  recentQuestions: Array<{ question: string; in_challenge: boolean }>;
  languageSplit: { en: number; kin: number };
}

interface ClassData {
  className: string; studentCount: number; avgProgress: number;
  totalChallengesPassed: number; totalChallengesAttempted: number;
  studentsOnTrack: number; studentsBehind: number; studentsNeedHelp: number;
  commonErrors: Array<{ type: string; count: number }>;
  avgInteractionsPerStudent: number; kinUsagePct: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, data, language = 'EN' } = req.body ?? {};
  if (!type || !data) return res.status(400).json({ error: 'type and data are required' });

  const isKin = language === 'KIN';
  const apiKey = process.env.GEMINI_API_KEY;

  let prompt = '';
  if (type === 'student') {
    prompt = buildStudentPromptEN(data as StudentData);
  } else if (type === 'class') {
    prompt = buildClassPromptEN(data as ClassData);
  } else {
    return res.status(400).json({ error: 'type must be "student" or "class"' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const finalPrompt = isKin ? [
      'Uri umufasha w\'uburezi w\'AI. Gufasha umwarimu w\'ishuri rya TVET mu Rwanda.',
      'Andika imirongo 3-4 isuzuma ry\'umunyeshuri ukurikije amakuru akurikira.',
      'Isuzuma rigomba: ibyo asobanukirwa, ikibazo akunda guhurana nacyo, uburyo yitabiriye, inama ku mwarimu.',
      '',
      prompt,
    ].join('\n') : prompt;

    const assessment = await callGemini(finalPrompt, apiKey);
    console.log(`[EduCode Assess] Gemini primary (${assessment.length} chars)`);
    return res.status(200).json({ assessment, source: 'gemini' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EduCode Assess] Gemini error:', msg);
    return res.status(502).json({ error: msg });
  }
}

export const config = { maxDuration: 30 };
