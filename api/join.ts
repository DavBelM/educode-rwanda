import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function generateUsername(fullName: string): string {
  const parts = fullName.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  if (parts.length === 0) return `student${Math.floor(Math.random() * 9999)}`;
  if (parts.length === 1) return parts[0];
  return `${parts[0]}.${parts[parts.length - 1][0]}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { join_code, full_name, password, email } = req.body ?? {};

  if (!join_code || typeof join_code !== 'string') return res.status(400).json({ error: 'join_code is required' });
  if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) return res.status(400).json({ error: 'full_name must be at least 2 characters' });
  if (!password || typeof password !== 'string' || password.length < 6) return res.status(400).json({ error: 'password must be at least 6 characters' });

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Server misconfiguration' });

  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // 1. Look up the class by join code
  const { data: cls, error: clsErr } = await admin
    .from('classes')
    .select('id, name, school_id, cohort_tag')
    .eq('invite_code', join_code.toUpperCase().trim())
    .maybeSingle();

  if (clsErr || !cls) return res.status(404).json({ error: 'Class not found — check the code and try again' });

  // 2. Resolve school_id (from class, or null if class has none)
  const school_id: string | null = cls.school_id ?? null;

  // 3. Build login email
  const username  = generateUsername(full_name.trim());
  const loginEmail = email?.trim() || `${username}.${Math.floor(Math.random() * 99)}@student.educode.rw`;

  // 4. Create the auth user (no email confirmation — confirmed: true)
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: loginEmail,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: full_name.trim(),
      user_type: 'student',
      preferred_language: 'en',
    },
  });

  if (createErr || !created.user) {
    const msg = createErr?.message ?? 'Could not create account';
    if (msg.includes('already registered')) return res.status(409).json({ error: 'That email is already in use — try a different one' });
    return res.status(500).json({ error: msg });
  }

  const userId = created.user.id;

  // 5. Insert profile + enrollment atomically via the security-definer function
  const { error: enrollErr } = await admin.rpc('enroll_new_student', {
    p_user_id:    userId,
    p_full_name:  full_name.trim(),
    p_email:      loginEmail,
    p_class_id:   cls.id,
    p_school_id:  school_id,
    p_cohort_tag: cls.cohort_tag ?? null,
  });

  if (enrollErr) {
    // Clean up the orphaned auth user so the student can retry
    await admin.auth.admin.deleteUser(userId);
    console.error('[join] enroll_new_student failed:', enrollErr.message);
    return res.status(500).json({ error: 'Could not complete enrollment — please try again' });
  }

  return res.status(200).json({
    message: 'Account created',
    class_name: cls.name,
    login_email: loginEmail,
    username,
  });
}

export const config = { maxDuration: 20 };
