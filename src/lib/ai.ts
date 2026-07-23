
const SYSTEM_PROMPT_EN =
  'You are EduCode AI, a coding tutor for Rwandan TVET students. ' +
  'You MUST respond in English only. Do not use Kinyarwanda. ' +
  'Rules: (1) Maximum 2-3 sentences. (2) Only explain what is wrong and how to fix it. ' +
  '(3) Do NOT use emojis. (4) Do not add extra advice beyond the specific error shown.';

const SYSTEM_PROMPT_KIN =
  'Uri EduCode AI, umwarimu wa coding ku banyeshuri ba TVET mu Rwanda. ' +
  'UGOMBA gusubiza mu Kinyarwanda gusa. Ntukoreshe Icyongereza keretse kuri code. ' +
  'Amabwiriza: (1) Mirongo 2-3 gusa. (2) Sobanura gusa ikosa no kuryosha. ' +
  '(3) Ntukoreshe emojis. (4) Ntongere andi makuru atarebana n\'ikosa ryerekanywe.';

// ── Mock responses (used when Space is unreachable) ───────────────────────────
const MOCK_EN: Record<string, string> = {
  ReferenceError: "You're using a variable that hasn't been declared yet. Make sure you declare it with `let` or `const` before using it. Check the line number in the error — that's where the problem is.",
  TypeError: "You're calling something as a function or accessing a property on a value that doesn't support it. Double-check the type of your variable before using it.",
  SyntaxError: "There's a writing mistake in your code — a missing bracket, parenthesis, or quote. Read the error line carefully and look for what's missing.",
  success: "Your code ran without errors — great work! Look at the output and make sure it matches what you expected. If something looks off, trace through your logic step by step.",
  generic: "Read the error message carefully — it tells you exactly what went wrong and on which line. Start there and work backwards through your code.",
};

const MOCK_KIN: Record<string, string> = {
  ReferenceError: "Uragerageza gukoresha variable utigeze uyishyiraho. Genzura ko wayanditse `let` cyangwa `const` mbere yo kuyikoresha. Reba inzitizi yatanzwe n'ikosa — ni aho ikibazo kiri.",
  TypeError: "Uragerageza guhamagara ikintu nk'imisebenzi cyangwa kugera ku kintu kidafite iyo mirimo. Genzura ubwoko bw'agaciro ko ari cyo ukeneye mbere yo kuyakoresha.",
  SyntaxError: "Hari ikosa mu kwandika kode yawe — habura udukubo, inzitizi, cyangwa utwugarizo. Soma inzitizi y'ikosa neza kandi usangire ikibuze.",
  success: "Kode yawe yakoze nta makosa — akazi keza! Reba ibisubizo maze urebe niba bigereranya ibyo wifuzaga. Niba habaho ikintu kitari cyo, subiramo gahoro ubishakishe.",
  generic: "Soma ubutumwa bw'ikosa neza — bukubwira ikibazo n'inzitizi. Tangira aho maze usubire inyuma mu kode yawe.",
};

const TUTOR_MOCK_EN = [
  "Good question! Look at the instructions again carefully — what output is expected? Try tracing through your code line by line to see what value each variable holds.",
  "You're on the right track! Check that your variable names match exactly — JavaScript is case-sensitive. Also make sure you're using `console.log()` to see your output.",
  "Think about the structure first: what do you need to declare? What calculation do you need to do? What do you need to display? Try tackling it one step at a time.",
];

const TUTOR_MOCK_KIN = [
  "Ikibazo cyiza! Subiramo amabwiriza neza — ni ikihe gisubizo gitegerezwa? Gerageza gusubiramo kode yawe umurongo ku murongo urebe agaciro ka buri variable.",
  "Uri inzira nziza! Genzura ko amazina y'amagarama yanyu yingana neza — JavaScript ireba uburyo wandikiye. Kandi genzura ko ukoresha `console.log()` kugirango ubone ibisubizo.",
  "Tekereza imiterere mbere: ni iki ugomba gushyiraho? Gerageza gukemura intambwe imwe imwe.",
];

function getMockResponse(error: string | null, language: 'EN' | 'KIN'): string {
  const map = language === 'KIN' ? MOCK_KIN : MOCK_EN;
  if (!error) return map.success;
  if (error.includes('ReferenceError')) return map.ReferenceError;
  if (error.includes('TypeError')) return map.TypeError;
  if (error.includes('SyntaxError')) return map.SyntaxError;
  return map.generic;
}

// ── Warm up the Space (fire-and-forget, called when workspace opens) ──────────
export function warmUpSpace(): void {
  fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'ping' }),
  }).catch(() => {});
}

// ── Call our Vercel proxy → HuggingFace Space ─────────────────────────────────
// systemPrompt is now built server-side with RAG context; the parameter is kept
// for call-site compatibility but is no longer sent to the server.
async function callSpace(message: string, _systemPrompt?: string): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal: AbortSignal.timeout(300_000),
  });

  if (!response.ok) throw new Error(`API returned ${response.status}`);
  const json = await response.json();
  if (typeof json.text === 'string' && json.text.trim()) return json.text;
  throw new Error('Empty response from model');
}

// ── Public functions ──────────────────────────────────────────────────────────

export async function getAIFeedback(
  code: string,
  error: string | null,
  language: 'EN' | 'KIN'
): Promise<string> {
  const question = error
    ? `This code has an error. Explain what is wrong and how to fix it:\n\`\`\`javascript\n${code}\n\`\`\`\nError: ${error}`
    : `Review this code and suggest any improvements:\n\`\`\`javascript\n${code}\n\`\`\``;

  let raw: string;
  try {
    raw = await callSpace(question, SYSTEM_PROMPT_EN);
  } catch {
    await new Promise(r => setTimeout(r, 800));
    return getMockResponse(error, language);
  }

  // Model always responds in Kinyarwanda — use Gemini to deliver correct language
  if (language === 'EN') {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw, targetLanguage: 'EN' }),
        signal: AbortSignal.timeout(30_000),
      });
      const json = await response.json();
      if (typeof json.text === 'string' && json.text.trim()) return json.text;
    } catch { /* fall through to raw */ }
  }

  return raw;
}

export async function translateToKinyarwanda(text: string): Promise<string> {
  const attempt = async () => {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage: 'KIN' }),
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status === 429) throw Object.assign(new Error('rate-limited'), { retryable: true });
    if (!response.ok) throw new Error(`translate ${response.status}`);
    const json = await response.json();
    if (typeof json.text === 'string' && json.text.trim()) return json.text;
    throw new Error('empty-response');
  };

  try {
    return await attempt();
  } catch (err: unknown) {
    const e = err as { retryable?: boolean };
    if (e.retryable) {
      await new Promise(r => setTimeout(r, 2000));
      try { return await attempt(); } catch { /* fall through */ }
    }
    // Signal failure with a sentinel so the UI can show an error state
    throw err;
  }
}

export async function getLessonAIHelp(
  question: string,
  code: string,
  instructions: string,
  language: 'EN' | 'KIN',
  lessonType: 'reading' | 'coding' | 'quiz' = 'coding'
): Promise<string> {
  const isGreeting = /^(hi|hello|hey|thanks|thank you|ok|okay|good|great|bye|goodbye|yo|sup|what's up|salut|bonjour|muraho|mwaramutse)[\s!?.😊👋]*$/i.test(question.trim());

  const codeBlock = !isGreeting && code.trim()
    ? (language === 'KIN'
        ? `\n\nCode y'umunyeshuri ubu:\n\`\`\`javascript\n${code}\n\`\`\``
        : `\n\nStudent's current code:\n\`\`\`javascript\n${code}\n\`\`\``)
    : '';
  const instructionBlock = !isGreeting && instructions.trim()
    ? (language === 'KIN'
        ? `\n\nAmabwiriza y'umurimo: ${instructions}`
        : `\n\nLesson instructions: ${instructions}`)
    : '';

  // Stage-aware constraint — reading gets no restriction, quiz forbids answer reveals,
  // coding forbids giving the full solution.
  const constraintRule = !isGreeting
    ? lessonType === 'reading'
      ? ''
      : lessonType === 'quiz'
      ? (language === 'KIN'
          ? '\n\n[AMABWIRIZA: Ntugaragaze igisubizo cyiza cy\'ikibazo. Sobanura gusa icyo ikibazo kibazo.]'
          : '\n\n[TUTOR RULE: Never reveal or hint at the correct quiz answer. Clarify what the question is asking only.]')
      : (language === 'KIN'
          ? '\n\n[AMABWIRIZA: Ntumuphe igisubizo cyose cya code. Muhe gusa icyifuzo kimwe cyangwa ikibazo kimwe bifasha gutekereza. Ntandike code iriho igisubizo.]'
          : '\n\n[TUTOR RULE: Do NOT write or reveal the complete working solution. Give only 1 hint or 1 guiding question to help the student think it through themselves. Never write the full answer code.]')
    : '';

  const context = language === 'KIN'
    ? `Umunyeshuri arabaza: ${question}${codeBlock}${instructionBlock}${constraintRule}`
    : `Student says: ${question}${codeBlock}${instructionBlock}${constraintRule}`;

  const stageNote = {
    reading: {
      EN: ' The student is reading a lesson. Answer their concept questions fully and clearly — no coding exercise is involved.',
      KIN: " Umunyeshuri asoma isomo. Subiza ibibazo bye ku mibiri y'amasomo neza kandi arangwa.",
    },
    coding: {
      EN: ' The student is solving a coding exercise. Guide with hints only — do not write or reveal the solution.',
      KIN: ' Umunyeshuri akora imyitozo ya code. Muhe gusa icyifuzo — ntandike igisubizo.',
    },
    quiz: {
      EN: ' The student is on a quiz. Clarify what questions are asking only — never reveal or hint at the correct answer.',
      KIN: ' Umunyeshuri akora ikibazo. Sobanura ibibazo gusa — ntugaragaze igisubizo cyiza.',
    },
  }[lessonType];

  const base = language === 'KIN' ? SYSTEM_PROMPT_KIN : SYSTEM_PROMPT_EN;
  const tutorPrompt = base + (language === 'KIN' ? stageNote.KIN : stageNote.EN);

  try {
    return await callSpace(context, tutorPrompt);
  } catch {
    await new Promise(r => setTimeout(r, 800));
    const pool = language === 'KIN' ? TUTOR_MOCK_KIN : TUTOR_MOCK_EN;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

// ── Post-lesson reflection (2 sentences, hard-truncated) ─────────────────────
export async function getLessonReflection(
  lessonTitle: string,
  language: 'EN' | 'KIN'
): Promise<string> {
  const message = language === 'KIN'
    ? `UMURIMO: Andika AMAGAMBI 2 GUSA kuri iri somo: "${lessonTitle}". Igice 1: igitekerezo cy'ingenzi umunyeshuri yize. Igice 2: ikintu kimwe gito cyo kugerageza nyuma. Ntandike code. AMAGAMBI 2 GUSA.`
    : `TASK: Write EXACTLY 2 plain sentences about the lesson "${lessonTitle}". Sentence 1: the key concept the student just practiced. Sentence 2: one small thing to try next. No code blocks. No lists. Plain prose only. 2 SENTENCES MAX.`;

  // Truncate to first 2 sentences, skipping periods inside words like console.log()
  const truncate = (t: string): string => {
    // Match sentence endings: period/!/? that is followed by a space or end-of-string,
    // but NOT preceded by a word character run (avoids console.log, 2.0, etc.)
    const re = /[^!?]*?(?:[A-Z][^.!?]*)?[^.!?]*[.!?](?=\s|$)/g;
    const parts: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(t)) !== null && parts.length < 2) {
      const s = m[0].trim();
      if (s.split(' ').length > 3) parts.push(s); // skip fragments shorter than 4 words
    }
    if (parts.length >= 1) return parts.join(' ').trim();
    // fallback: cap at 280 chars, cut at last space
    const capped = t.slice(0, 280);
    const cut = capped.lastIndexOf(' ');
    return (cut > 100 ? capped.slice(0, cut) : capped).trim();
  };

  try {
    const text = await callSpace(message);
    return truncate(text);
  } catch {
    return language === 'KIN'
      ? `Warangije isomo "${lessonTitle}" neza. Gerageza gukora ibikorwa bishya ukoresha ibyo wize.`
      : `You just practiced the key ideas in "${lessonTitle}". Try applying them to a small problem of your own.`;
  }
}

// ── Mwarimu chat reply (Workspace AI panel) ───────────────────────────────────
export async function getMwarimuReply(
  question: string,
  code: string,
  instructions: string,
  language: 'EN' | 'KIN'
): Promise<string> {
  const raw = await getLessonAIHelp(question, code, instructions, language);

  // Model always responds in Kinyarwanda — use Gemini to deliver English when needed
  if (language === 'EN') {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw, targetLanguage: 'EN' }),
        signal: AbortSignal.timeout(30_000),
      });
      const json = await response.json();
      if (typeof json.text === 'string' && json.text.trim()) return json.text;
    } catch { /* fall through to raw */ }
  }

  return raw;
}

// ── AI assessment (Gemini-powered, teacher-facing) ────────────────────────────

export async function generateStudentAssessment(
  data: object,
  language: 'EN' | 'KIN'
): Promise<string> {
  const response = await fetch('/api/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'student', data, language }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`assess ${response.status}`);
  const json = await response.json();
  if (typeof json.assessment === 'string' && json.assessment.trim()) return json.assessment;
  throw new Error('Empty assessment');
}

export async function generateClassSummary(
  data: object,
  language: 'EN' | 'KIN'
): Promise<string> {
  const response = await fetch('/api/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'class', data, language }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`assess ${response.status}`);
  const json = await response.json();
  if (typeof json.assessment === 'string' && json.assessment.trim()) return json.assessment;
  throw new Error('Empty assessment');
}
