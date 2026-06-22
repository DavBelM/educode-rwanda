import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  const { type, data, language = 'EN' } = req.body ?? {};
  if (!type || !data) return res.status(400).json({ error: 'type and data are required' });

  const isKin = language === 'KIN';
  let prompt = '';

  if (type === 'student') {
    const d = data as {
      name: string;
      progress_pct: number;
      current_module: string;
      challenges_passed: number;
      challenges_attempted: number;
      status: string;
      last_active: string | null;
      totalInteractions: number;
      weekInteractions: number;
      challengeInteractions: number;
      topErrors: Array<{ type: string; count: number }>;
      recentQuestions: Array<{ question: string; in_challenge: boolean }>;
      languageSplit: { en: number; kin: number };
    };

    const errorSummary = d.topErrors.length > 0
      ? d.topErrors.map(e => `${e.type} (${e.count}×)`).join(', ')
      : 'no specific error pattern detected';

    const total = d.languageSplit.en + d.languageSplit.kin;
    const kinPct = total > 0 ? Math.round((d.languageSplit.kin / total) * 100) : 0;
    const challengePct = d.challenges_attempted > 0
      ? Math.round((d.challenges_passed / d.challenges_attempted) * 100)
      : null;

    const recentQs = d.recentQuestions.slice(0, 3).map(q => `"${q.question}"`).join('; ');

    if (isKin) {
      prompt = [
        'Uri umufasha w\'uburezi w\'AI. Gufasha umwarimu w\'ishuri rya TVET mu Rwanda gusobanukirwa aho umunyeshuri ari.',
        'Andika isuzuma ry\'imirongo 3-4 kubyerekeye umunyeshuri ukurikije amakuru akurikira.',
        '',
        `Izina ry'umunyeshuri: ${d.name}`,
        `Aho agejeje mu masomo: ${d.progress_pct}%`,
        `Igice agezeho: ${d.current_module}`,
        `Ibigeragezo yapitiye: ${d.challenges_passed}/${d.challenges_attempted}${challengePct !== null ? ` (${challengePct}%)` : ''}`,
        `Igihe yagaragaye bwa nyuma: ${d.last_active ?? 'ntabwo yigeze areba'}`,
        `Imiterere: ${d.status}`,
        `Ibibazo yabajije Mwarimu byose: ${d.totalInteractions} (${d.weekInteractions} iki cyumweru)`,
        `Amakosa akunze kugaragara: ${errorSummary}`,
        `Ururimi: ${kinPct}% Kinyarwanda, ${100 - kinPct}% Icyongereza`,
        `Ibibazo byahise: ${recentQs || 'nta bibazo'}`,
        '',
        'Isuzuma rigomba:',
        '1. Ibyo umunyeshuri asobanukirwa cyangwa akora neza',
        '2. Ikibazo akunda guhurana nacyo',
        '3. Uburyo yitabiriye amasomo (akora cyangwa oya)',
        '4. Inama imwe nyamukuru ku mwarimu',
        '',
        'Koresha ururimi rw\'umwarimu nyamara ubone ubwuzu. Ntuzivuge amazina y\'amakosa ya code nk\'ibisubizo — sobanura ibisobanuro.',
      ].join('\n');
    } else {
      prompt = [
        'You are an educational AI assistant helping a Rwandan TVET teacher understand a student\'s learning status.',
        'Write a 3-4 sentence assessment of this student based on the data below.',
        'The teacher is a non-technical educator — avoid jargon. Focus on what\'s actionable.',
        '',
        `Student name: ${d.name}`,
        `Course progress: ${d.progress_pct}% of lessons completed`,
        `Current module: ${d.current_module}`,
        `Challenges: ${d.challenges_passed} passed out of ${d.challenges_attempted} attempted${challengePct !== null ? ` (${challengePct}% pass rate)` : ''}`,
        `Last active: ${d.last_active ?? 'never'}`,
        `Overall status: ${d.status}`,
        `Mwarimu AI interactions: ${d.totalInteractions} total (${d.weekInteractions} this week, ${d.challengeInteractions} during challenges)`,
        `Most common errors: ${errorSummary}`,
        `Language preference: ${kinPct}% Kinyarwanda, ${100 - kinPct}% English`,
        `Sample recent questions: ${recentQs || 'none recorded'}`,
        '',
        'Your assessment should cover:',
        '1. What the student seems to understand or do well',
        '2. What they are struggling with (based on errors and questions)',
        '3. How engaged they are (based on interaction frequency and recency)',
        '4. One specific recommendation for the teacher',
        '',
        'Use professional but warm language. Do not just list the numbers — synthesize them into a narrative.',
      ].join('\n');
    }
  } else if (type === 'class') {
    const d = data as {
      className: string;
      studentCount: number;
      avgProgress: number;
      totalChallengesPassed: number;
      totalChallengesAttempted: number;
      studentsOnTrack: number;
      studentsBehind: number;
      studentsNeedHelp: number;
      commonErrors: Array<{ type: string; count: number }>;
      avgInteractionsPerStudent: number;
      kinUsagePct: number;
    };

    const errorSummary = d.commonErrors.length > 0
      ? d.commonErrors.map(e => `${e.type} (${e.count}×)`).join(', ')
      : 'no clear pattern';
    const challengePct = d.totalChallengesAttempted > 0
      ? Math.round((d.totalChallengesPassed / d.totalChallengesAttempted) * 100)
      : null;

    if (isKin) {
      prompt = [
        'Uri umufasha w\'uburezi w\'AI. Gufasha umwarimu w\'ishuri rya TVET mu Rwanda gusobanukirwa aho ishuri ari muri rusange.',
        'Andika imirongo 4-5 isuzuma ry\'itorero ryose ushingiye ku makuru akurikira.',
        '',
        `Izina ry'itorero: ${d.className}`,
        `Umubare w'abanyeshuri: ${d.studentCount}`,
        `Aho bagejeje mu masomo (hagati): ${d.avgProgress}%`,
        `Ibigeragezo: ${d.totalChallengesPassed} byapitiye kuri ${d.totalChallengesAttempted}${challengePct !== null ? ` (${challengePct}%)` : ''}`,
        `Imiterere y'abanyeshuri: ${d.studentsOnTrack} ku inzira nziza, ${d.studentsBehind} barasigaye inyuma, ${d.studentsNeedHelp} bakeneye ubufasha`,
        `Amakosa akunze kugaragara mu itorero: ${errorSummary}`,
        `Ibibazo hagati ku munyeshuri: ${d.avgInteractionsPerStudent}`,
        `Gukoresha Kinyarwanda: ${d.kinUsagePct}%`,
        '',
        'Isuzuma rigomba:',
        '1. Inzira rusange y\'itorero',
        '2. Ikibazo gikomeye itorero ryose riguhura nacyo',
        '3. Icyo umwarimu akwiye gutekereza cyangwa gukora iki cyumweru',
        '4. Ikintu kimwe cyiza cyagaragaye',
      ].join('\n');
    } else {
      prompt = [
        'You are an educational AI assistant helping a Rwandan TVET teacher understand their entire class\'s learning status.',
        'Write a 4-5 sentence class summary based on the data below. Be direct and actionable — the teacher has limited time.',
        '',
        `Class: ${d.className}`,
        `Students: ${d.studentCount}`,
        `Average course progress: ${d.avgProgress}%`,
        `Challenges: ${d.totalChallengesPassed} passed out of ${d.totalChallengesAttempted}${challengePct !== null ? ` (${challengePct}% pass rate)` : ''}`,
        `Student status breakdown: ${d.studentsOnTrack} on track, ${d.studentsBehind} behind, ${d.studentsNeedHelp} need help`,
        `Most common errors across class: ${errorSummary}`,
        `Average Mwarimu interactions per student: ${d.avgInteractionsPerStudent}`,
        `Kinyarwanda usage rate: ${d.kinUsagePct}%`,
        '',
        'Your summary should cover:',
        '1. The class\'s overall progress trend',
        '2. The most common technical struggle across the class (based on error types)',
        '3. Engagement level — are students using the AI tool, which language do they prefer',
        '4. One concrete suggestion for next week\'s focus',
        '',
        'Synthesize the data into a narrative. Do not just list numbers — give the teacher insight they couldn\'t get from looking at a spreadsheet.',
      ].join('\n');
    }
  } else {
    return res.status(400).json({ error: 'type must be "student" or "class"' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.4 },
        }),
      }
    );

    const json = await response.json();
    const candidate = json.candidates?.[0];
    const assessment = candidate?.content?.parts?.[0]?.text;

    if (!assessment?.trim()) {
      console.error('[EduCode Assess] Empty Gemini response:', JSON.stringify(json).slice(0, 300));
      return res.status(502).json({ error: 'Could not generate assessment' });
    }

    return res.status(200).json({ assessment: assessment.trim() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EduCode Assess] Error:', msg);
    return res.status(502).json({ error: msg });
  }
}

export const config = { maxDuration: 30 };
