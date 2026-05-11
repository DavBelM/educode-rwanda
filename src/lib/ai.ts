const HF_API_URL = import.meta.env.VITE_HF_API_URL ?? null;

const SYSTEM_PROMPT =
  'You are EduCode AI, a bilingual coding tutor for Rwandan TVET students. ' +
  'When the user writes in Kinyarwanda, respond in Kinyarwanda. ' +
  'When they write in English, respond in English. ' +
  'Be concise, encouraging, and explain errors simply.';

// Mock responses shown before the real model is deployed
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

function getMockResponse(error: string | null, language: 'EN' | 'KIN'): string {
  const map = language === 'KIN' ? MOCK_KIN : MOCK_EN;
  if (!error) return map.success;
  if (error.includes('ReferenceError')) return map.ReferenceError;
  if (error.includes('TypeError')) return map.TypeError;
  if (error.includes('SyntaxError')) return map.SyntaxError;
  return map.generic;
}

export async function getAIFeedback(
  code: string,
  error: string | null,
  language: 'EN' | 'KIN'
): Promise<string> {
  if (!HF_API_URL) {
    // Simulate a short network delay so the loading state is visible
    await new Promise(r => setTimeout(r, 1200));
    return getMockResponse(error, language);
  }

  const question =
    language === 'KIN'
      ? (error
          ? `Muri iyi code hari ikosa, nsobanurire:\n\`\`\`javascript\n${code}\n\`\`\`\nIkosa: ${error}`
          : `Reba iyi code unsobanurire niba hari ibintu bishobora kongerwa:\n\`\`\`javascript\n${code}\n\`\`\``)
      : (error
          ? `This code has an error. Explain what is wrong and how to fix it:\n\`\`\`javascript\n${code}\n\`\`\`\nError: ${error}`
          : `Review this code and suggest any improvements:\n\`\`\`javascript\n${code}\n\`\`\``);

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: question },
      ],
      max_tokens: 300,
      temperature: 0.3,
    }),
  });

  if (!response.ok) return getMockResponse(error, language);

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? getMockResponse(error, language);
}
