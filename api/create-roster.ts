import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function generateUsername(fullName: string): string {
  const parts = fullName.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'student';
  if (parts.length === 1) return parts[0];
  return `${parts[0]}.${parts[parts.length - 1][0]}`;
}

function generatePassword(): string {
  // Avoids confusable characters: 0/o, 1/l/i
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = 'edu';
  for (let i = 0; i < 5; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  const anonKey     = process.env.VITE_SUPABASE_ANON_KEY ?? '';
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Server misconfiguration' });

  // Verify caller identity
  const userClient = createClient(supabaseUrl, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: { user: caller }, error: authErr } = await userClient.auth.getUser(token);
  if (authErr || !caller) return res.status(401).json({ error: 'Invalid or expired session' });

  const callerType = caller.user_metadata?.user_type as string | undefined;
  if (callerType !== 'teacher' && callerType !== 'school_admin') {
    return res.status(403).json({ error: 'Only teachers and school admins can create student rosters' });
  }

  const { class_id, students } = req.body ?? {};
  if (!class_id || typeof class_id !== 'string') return res.status(400).json({ error: 'class_id is required' });
  if (!Array.isArray(students) || students.length === 0) return res.status(400).json({ error: 'students array is required' });
  if (students.length > 60) return res.status(400).json({ error: 'Max 60 students per request' });

  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // Look up class and verify ownership
  const { data: cls } = await admin.from('classes').select('id, name, teacher_id, school_id, cohort_tag').eq('id', class_id).single();
  if (!cls) return res.status(404).json({ error: 'Class not found' });

  if (callerType === 'teacher' && cls.teacher_id !== caller.id) {
    return res.status(403).json({ error: 'You do not own this class' });
  }
  if (callerType === 'school_admin') {
    const { data: cp } = await admin.from('profiles').select('school_id').eq('id', caller.id).single();
    if (!cp || cp.school_id !== cls.school_id) {
      return res.status(403).json({ error: 'This class does not belong to your school' });
    }
  }

  const results: Array<{ name: string; login_email: string; initial_password: string; error?: string }> = [];
  const usedUsernames = new Set<string>();

  for (const student of students) {
    const name = (typeof student?.name === 'string' ? student.name : '').trim();
    if (!name || name.length < 2) {
      results.push({ name: name || '(blank)', login_email: '', initial_password: '', error: 'Name too short' });
      continue;
    }

    // Generate a unique username within this batch
    let base = generateUsername(name);
    let username = base;
    let counter = 1;
    while (usedUsernames.has(username)) username = `${base}${counter++}`;
    usedUsernames.add(username);

    const rand = Math.floor(Math.random() * 90 + 10); // 10–99
    const loginEmail = `${username}${rand}@student.educode.rw`;
    const initialPassword = generatePassword();

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: loginEmail,
      password: initialPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        user_type: 'student',
        preferred_language: 'en',
        needs_password_change: true,
      },
    });

    if (createErr || !created.user) {
      results.push({ name, login_email: loginEmail, initial_password: initialPassword, error: createErr?.message ?? 'Could not create account' });
      continue;
    }

    const { error: enrollErr } = await admin.rpc('enroll_new_student', {
      p_user_id:    created.user.id,
      p_full_name:  name,
      p_email:      loginEmail,
      p_class_id:   cls.id,
      p_school_id:  cls.school_id ?? null,
      p_cohort_tag: cls.cohort_tag ?? null,
    });

    if (enrollErr) {
      await admin.auth.admin.deleteUser(created.user.id);
      results.push({ name, login_email: loginEmail, initial_password: initialPassword, error: 'Enrollment failed — retrying will create a new account' });
      continue;
    }

    results.push({ name, login_email: loginEmail, initial_password: initialPassword });
  }

  return res.status(200).json({ class_name: cls.name, results });
}

export const config = { maxDuration: 60 };
