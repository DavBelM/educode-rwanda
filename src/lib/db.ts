import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Class {
  id: string;
  name: string;
  subject: string;
  invite_code: string;
  teacher_id: string;
  created_at: string;
}

export interface Question {
  id: string;
  text: string;
  text_kin: string;
}

export interface Assignment {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  title_kin: string | null;
  description: string | null;
  description_kin: string | null;
  assignment_type: 'coding' | 'theoretical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[] | null;
  due_date: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Submission {
  id: string;
  student_id: string;
  assignment_id: string;
  code_submitted: string;
  text_answers: Array<{ question_id: string; answer: string }> | null;
  tests_passed: number;
  tests_total: number;
  submitted_at: string;
  profiles?: { full_name: string };
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function createClass(name: string, subject: string): Promise<{ data: Class | null; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('classes')
    .insert({ name, subject, teacher_id: user.id })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getTeacherClasses(): Promise<{ data: Class[]; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getClassWithInviteCode(inviteCode: string): Promise<{ data: Class | null; error: string | null }> {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('invite_code', inviteCode.toUpperCase())
    .single();

  if (error) return { data: null, error: 'Class not found' };
  return { data, error: null };
}

export async function joinClass(classId: string): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('class_enrollments')
    .insert({ student_id: user.id, class_id: classId });

  if (error) {
    if (error.code === '23505') return { error: 'already_enrolled' };
    return { error: error.message };
  }
  return { error: null };
}

export async function getStudentClasses(): Promise<{ data: Class[]; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('class_enrollments')
    .select('classes(*)')
    .eq('student_id', user.id);

  if (error) return { data: [], error: error.message };
  const classes = (data ?? []).map((row: { classes: Class | Class[] }) =>
    Array.isArray(row.classes) ? row.classes[0] : row.classes
  ).filter(Boolean) as Class[];
  return { data: classes, error: null };
}

export async function getClassStudentCount(classId: string): Promise<number> {
  const { count } = await supabase
    .from('class_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('class_id', classId);
  return count ?? 0;
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export async function createAssignment(params: {
  classId: string;
  title: string;
  titleKin: string;
  description: string;
  descriptionKin: string;
  assignmentType: 'coding' | 'theoretical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions?: Question[];
  dueDate?: string;
}): Promise<{ data: Assignment | null; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('assignments')
    .insert({
      class_id: params.classId,
      teacher_id: user.id,
      title: params.title,
      title_kin: params.titleKin,
      description: params.description,
      description_kin: params.descriptionKin,
      assignment_type: params.assignmentType,
      difficulty: params.difficulty,
      questions: params.questions ?? null,
      due_date: params.dueDate ?? null,
      is_published: true,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getClassAssignments(classId: string): Promise<{ data: Assignment[]; error: string | null }> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('class_id', classId)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getStudentAssignments(): Promise<{ data: Assignment[]; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  // Get all class IDs the student is enrolled in
  const { data: enrollments, error: enrollError } = await supabase
    .from('class_enrollments')
    .select('class_id')
    .eq('student_id', user.id);

  if (enrollError) return { data: [], error: enrollError.message };
  if (!enrollments || enrollments.length === 0) return { data: [], error: null };

  const classIds = enrollments.map((e: { class_id: string }) => e.class_id);

  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .in('class_id', classIds)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function submitTheoreticalAssignment(params: {
  assignmentId: string;
  textAnswers: Array<{ question_id: string; answer: string }>;
}): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('student_submissions')
    .insert({
      student_id: user.id,
      assignment_id: params.assignmentId,
      code_submitted: '', // not applicable for theoretical
      text_answers: params.textAnswers,
    });

  if (error) return { error: error.message };
  return { error: null };
}

export async function getStudentSubmissions(assignmentId: string): Promise<{ submitted: boolean; data: Submission | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { submitted: false, data: null };

  const { data } = await supabase
    .from('student_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('assignment_id', assignmentId)
    .maybeSingle();

  return { submitted: !!data, data: data ?? null };
}

export async function getSubmittedAssignmentIds(): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from('student_submissions')
    .select('assignment_id')
    .eq('student_id', user.id);

  return new Set((data ?? []).map((r: { assignment_id: string }) => r.assignment_id));
}

export async function getAssignmentSubmissions(assignmentId: string): Promise<{ data: Submission[]; error: string | null }> {
  const { data, error } = await supabase
    .from('student_submissions')
    .select('*, profiles(full_name)')
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getAssignmentSubmissionCounts(assignmentIds: string[]): Promise<Record<string, number>> {
  if (assignmentIds.length === 0) return {};
  const { data } = await supabase
    .from('student_submissions')
    .select('assignment_id')
    .in('assignment_id', assignmentIds);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.assignment_id] = (counts[row.assignment_id] ?? 0) + 1;
  }
  return counts;
}
