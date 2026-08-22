import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Verify the caller is a super_admin
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const callerToken = authHeader.slice(7);

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Server misconfiguration' });

  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // Validate caller's session and check super_admin role
  const { data: { user: caller } } = await admin.auth.getUser(callerToken);
  if (!caller) return res.status(401).json({ error: 'Invalid session' });
  const { data: callerProfile } = await admin.from('profiles').select('user_type').eq('id', caller.id).single();
  if (callerProfile?.user_type !== 'super_admin') return res.status(403).json({ error: 'Forbidden — super_admin only' });

  const { school_id, full_name, email, password } = req.body ?? {};
  if (!school_id || !full_name || !email || !password) return res.status(400).json({ error: 'school_id, full_name, email, and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'password must be at least 6 characters' });

  // Create auth user
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, user_type: 'school_admin', preferred_language: 'en' },
  });

  if (createErr || !created.user) {
    return res.status(500).json({ error: createErr?.message ?? 'Could not create account' });
  }

  // Insert profile
  const { error: profileErr } = await admin.from('profiles').insert({
    id: created.user.id,
    full_name,
    email,
    user_type: 'school_admin',
    preferred_language: 'en',
    school_id,
  });

  if (profileErr) {
    await admin.auth.admin.deleteUser(created.user.id);
    return res.status(500).json({ error: profileErr.message });
  }

  return res.status(200).json({ message: 'School admin created', user_id: created.user.id });
}

export const config = { maxDuration: 15 };
