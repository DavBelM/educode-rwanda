import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { school_name, contact_name, role, email, phone, message } = req.body ?? {};

  if (!school_name || typeof school_name !== 'string' || school_name.trim().length < 2)
    return res.status(400).json({ error: 'school_name is required' });
  if (!contact_name || typeof contact_name !== 'string' || contact_name.trim().length < 2)
    return res.status(400).json({ error: 'contact_name is required' });
  if (!email && !phone)
    return res.status(400).json({ error: 'Provide at least an email or phone number so we can reach you' });

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Server misconfiguration' });

  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const { error } = await admin.from('school_leads').insert({
    school_name: school_name.trim(),
    contact_name: contact_name.trim(),
    role: (typeof role === 'string' ? role.trim() : null) || null,
    email: (typeof email === 'string' ? email.trim() : null) || null,
    phone: (typeof phone === 'string' ? phone.trim() : null) || null,
    message: (typeof message === 'string' ? message.trim() : null) || null,
  });

  if (error) {
    console.error('[submit-lead]', error.message);
    return res.status(500).json({ error: 'Could not save your enquiry — please email belamitali@gmail.com directly.' });
  }

  return res.status(200).json({ message: 'Enquiry received' });
}

export const config = { maxDuration: 10 };
