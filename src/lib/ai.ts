// @ts-ignore — Vite provides import.meta.env at runtime
const HF_SPACE_URL: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_HF_SPACE_URL)
  ?? 'https://davbelaa-educode-rwanda-ai.hf.space';

const SYSTEM_PROMPT =
  'You are EduCode AI, a bilingual coding tutor for Rwandan TVET students. ' +
  'When the user writes in Kinyarwanda, respond in Kinyarwanda. ' +
  'When they write in English, respond in English. ' +
  'Be concise, encouraging, and explain errors simply.';

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

// ── Call Gradio Space API ─────────────────────────────────────────────────────
async function callSpace(message: string, systemPrompt: string): Promise<string> {
  const response = await fetch(`${HF_SPACE_URL}/run/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [message, [], systemPrompt],
    }),
  });

  if (!response.ok) throw new Error(`Space returned ${response.status}`);
  const json = await response.json();
  // Gradio returns { data: [response_text, updated_history] }
  const result = json?.data?.[0];
  if (typeof result !== 'string' || !result.trim()) throw new Error('Empty response');
  return result;
}

// ── Public functions ──────────────────────────────────────────────────────────

export async function getAIFeedback(
  code: string,
  error: string | null,
  language: 'EN' | 'KIN'
): Promise<string> {
  const question =
    language === 'KIN'
      ? (error
          ? `Muri iyi code hari ikosa, nsobanurire:\n\`\`\`javascript\n${code}\n\`\`\`\nIkosa: ${error}`
          : `Reba iyi code unsobanurire niba hari ibintu bishobora kongerwa:\n\`\`\`javascript\n${code}\n\`\`\``)
      : (error
          ? `This code has an error. Explain what is wrong and how to fix it:\n\`\`\`javascript\n${code}\n\`\`\`\nError: ${error}`
          : `Review this code and suggest any improvements:\n\`\`\`javascript\n${code}\n\`\`\``);

  try {
    return await callSpace(question, SYSTEM_PROMPT);
  } catch {
    await new Promise(r => setTimeout(r, 800));
    return getMockResponse(error, language);
  }
}

export async function getLessonAIHelp(
  question: string,
  code: string,
  instructions: string,
  language: 'EN' | 'KIN'
): Promise<string> {
  const context = language === 'KIN'
    ? `Iri somo rigira aya mabwiriza:\n${instructions}\n\nCode y'umunyeshuri ubu:\n\`\`\`javascript\n${code}\n\`\`\`\n\nUmunyeshuri arabaza: ${question}`
    : `This lesson has these instructions:\n${instructions}\n\nStudent's current code:\n\`\`\`javascript\n${code}\n\`\`\`\n\nStudent asks: ${question}`;

  const tutorPrompt = SYSTEM_PROMPT +
    ' The student is working on a course lesson. Guide them with hints — do not give the full solution directly.';

  try {
    return await callSpace(context, tutorPrompt);
  } catch {
    await new Promise(r => setTimeout(r, 800));
    const pool = language === 'KIN' ? TUTOR_MOCK_KIN : TUTOR_MOCK_EN;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}
