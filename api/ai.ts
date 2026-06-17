import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@gradio/client';

const HF_SPACE = 'DavBelaa/educode-rwanda-ai';

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
  if (!checkRateLimit(ip, 5)) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });

  const { message, systemPrompt } = req.body ?? {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const client = await Client.connect(HF_SPACE);
    const result = await client.predict('/chat', {
      message: String(message),
      param_2: String(systemPrompt ?? ''),
    });

    const text = (result.data as unknown[])?.[0];
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(502).json({ error: 'Empty response from model' });
    }

    return res.status(200).json({ text });
  } catch (err: unknown) {
    const msg = err instanceof Error
      ? err.message
      : typeof err === 'object'
        ? JSON.stringify(err)
        : String(err);
    console.error('[EduCode AI] Space error:', msg);
    return res.status(502).json({ error: msg });
  }
}

// Allow up to 5 minutes for ZeroGPU cold start + inference
export const config = {
  maxDuration: 300,
};
