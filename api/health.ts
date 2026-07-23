import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return res.status(200).json({ ok: false, error: 'GEMINI_API_KEY not set in Vercel env' });
  }

  // Fetch the list of available models from Google
  let availableModels: string[] = [];
  try {
    const modelsRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}&pageSize=50`,
      { signal: AbortSignal.timeout(8_000) }
    );
    const modelsJson = await modelsRes.json();
    if (Array.isArray(modelsJson.models)) {
      availableModels = (modelsJson.models as { name: string }[])
        .map(m => m.name.replace('models/', ''))
        .filter(n => n.startsWith('gemini'));
    }
  } catch { /* ignore */ }

  // Test the model currently in use
  const MODEL = 'gemini-1.5-flash';
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with exactly: OK' }] }],
          generationConfig: { maxOutputTokens: 10, temperature: 0 },
        }),
        signal: AbortSignal.timeout(10_000),
      }
    );

    const rawBody = await geminiRes.text();
    let json: Record<string, unknown> = {};
    try { json = JSON.parse(rawBody); } catch { /* non-JSON */ }

    if (!geminiRes.ok) {
      return res.status(200).json({
        ok: false,
        modelTested: MODEL,
        httpStatus: geminiRes.status,
        error: json.error ?? rawBody.slice(0, 200),
        availableModels,
      });
    }

    const text = (json.candidates as { content: { parts: { text: string }[] } }[] | undefined)
      ?.[0]?.content?.parts?.[0]?.text ?? '';

    return res.status(200).json({
      ok: true,
      modelTested: MODEL,
      reply: text.trim(),
      availableModels,
    });
  } catch (err: unknown) {
    return res.status(200).json({
      ok: false,
      modelTested: MODEL,
      error: err instanceof Error ? err.message : String(err),
      availableModels,
    });
  }
}
