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
  total_marks: number;
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
  marks_earned: number | null;
  submitted_at: string;
  profiles?: { full_name: string };
}

export interface LeaderboardEntry {
  student_id: string;
  full_name: string;
  total_marks_earned: number;
  total_marks_possible: number;
  percentage: number;
  submissions_graded: number;
  rank: number;
}

export interface StudentGrade {
  assignment_id: string;
  marks_earned: number | null;
  total_marks: number;
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
  totalMarks: number;
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
      total_marks: params.totalMarks,
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

// ─── Grading ──────────────────────────────────────────────────────────────────

export async function gradeSubmission(submissionId: string, marksEarned: number): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('student_submissions')
    .update({ marks_earned: marksEarned, graded_by: user.id, graded_at: new Date().toISOString() })
    .eq('id', submissionId);

  if (error) return { error: error.message };
  return { error: null };
}

// Returns each assignment's grade for the current student
export async function getStudentGrades(): Promise<StudentGrade[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('student_submissions')
    .select('assignment_id, marks_earned, assignments(total_marks)')
    .eq('student_id', user.id);

  return (data ?? []).map((row: { assignment_id: string; marks_earned: number | null; assignments: unknown }) => {
    const asgn = (Array.isArray(row.assignments) ? row.assignments[0] : row.assignments) as { total_marks: number } | null;
    return {
      assignment_id: row.assignment_id,
      marks_earned: row.marks_earned,
      total_marks: asgn?.total_marks ?? 10,
    };
  });
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  title_kin: string | null;
  description: string | null;
  description_kin: string | null;
  difficulty: string;
  topic: string;
  estimated_hours: number;
  is_published: boolean;
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  title_kin: string | null;
  order_index: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  title_kin: string | null;
  content: string | null;
  content_kin: string | null;
  lesson_type: 'reading' | 'coding' | 'quiz';
  exercise_data: {
    starter_code?: string;
    instructions?: string;
    hint?: string;
    questions?: Array<{ id: string; text: string; options: string[]; correct: number }>;
  } | null;
  order_index: number;
  xp_reward: number;
}

export async function getCourses(): Promise<Course[]> {
  const { data } = await supabase.from('courses').select('*').eq('is_published', true).order('created_at');
  return data ?? [];
}

export async function getCourseDetail(courseId: string): Promise<{ course: Course | null; modules: CourseModule[] }> {
  const { data: course } = await supabase.from('courses').select('*').eq('id', courseId).single();
  const { data: modules } = await supabase.from('course_modules').select('*').eq('course_id', courseId).order('order_index');
  if (!modules?.length) return { course: course ?? null, modules: [] };

  const { data: lessons } = await supabase
    .from('course_lessons').select('*')
    .in('module_id', modules.map(m => m.id))
    .order('order_index');

  const modulesWithLessons: CourseModule[] = modules.map(m => ({
    ...m,
    lessons: (lessons ?? []).filter(l => l.module_id === m.id),
  }));
  return { course: course ?? null, modules: modulesWithLessons };
}

export async function getCompletedLessonIds(courseId: string): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', courseId);
  if (!modules?.length) return new Set();
  const { data: lessons } = await supabase.from('course_lessons').select('id').in('module_id', modules.map(m => m.id));
  if (!lessons?.length) return new Set();
  const { data } = await supabase
    .from('student_lesson_progress').select('lesson_id')
    .eq('student_id', user.id)
    .in('lesson_id', lessons.map(l => l.id));
  return new Set((data ?? []).map(r => r.lesson_id));
}

export async function completeLesson(lessonId: string, score?: number): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase.from('student_lesson_progress')
    .upsert({ student_id: user.id, lesson_id: lessonId, score: score ?? null, completed_at: new Date().toISOString() });
  if (error) return { error: error.message };
  return { error: null };
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export async function recordDailyLogin(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const today = new Date().toISOString().split('T')[0];
  await supabase.from('daily_logins').upsert({ student_id: user.id, login_date: today });
}

export async function getStreak(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  const { data } = await supabase
    .from('daily_logins').select('login_date')
    .eq('student_id', user.id)
    .order('login_date', { ascending: false })
    .limit(60);
  if (!data?.length) return 0;
  const dates = new Set(data.map(r => r.login_date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const s = d.toISOString().split('T')[0];
    if (dates.has(s)) streak++;
    else break;
  }
  return streak;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export async function getClassLeaderboard(classId: string): Promise<LeaderboardEntry[]> {
  // Get all students in the class
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id, profiles(full_name)')
    .eq('class_id', classId);

  if (!enrollments || enrollments.length === 0) return [];

  // Get all graded submissions for assignments in this class
  const { data: submissions } = await supabase
    .from('student_submissions')
    .select('student_id, marks_earned, assignments(total_marks, class_id)')
    .not('marks_earned', 'is', null)
    .eq('assignments.class_id', classId);

  // Aggregate marks per student
  const studentMap: Record<string, { full_name: string; earned: number; possible: number; graded: number }> = {};

  for (const enr of enrollments) {
    const rawProfile = enr.profiles;
    const profile = (Array.isArray(rawProfile) ? rawProfile[0] : rawProfile) as { full_name: string } | null;
    studentMap[enr.student_id] = {
      full_name: profile?.full_name ?? 'Student',
      earned: 0,
      possible: 0,
      graded: 0,
    };
  }

  for (const sub of submissions ?? []) {
    const rawAsgn = sub.assignments;
    const asgn = (Array.isArray(rawAsgn) ? rawAsgn[0] : rawAsgn) as { total_marks: number; class_id: string } | null;
    if (!asgn || asgn.class_id !== classId) continue;
    if (!studentMap[sub.student_id]) continue;
    studentMap[sub.student_id].earned += sub.marks_earned ?? 0;
    studentMap[sub.student_id].possible += asgn.total_marks;
    studentMap[sub.student_id].graded += 1;
  }

  // Build entries and rank — primary: total marks earned, tiebreak: percentage
  const entries = Object.entries(studentMap).map(([student_id, s]) => ({
    student_id,
    full_name: s.full_name,
    total_marks_earned: s.earned,
    total_marks_possible: s.possible,
    percentage: s.possible > 0 ? Math.round((s.earned / s.possible) * 100) : 0,
    submissions_graded: s.graded,
    rank: 0,
  }));

  entries.sort((a, b) => {
    if (b.total_marks_earned !== a.total_marks_earned) return b.total_marks_earned - a.total_marks_earned;
    return b.percentage - a.percentage;
  });

  // Assign ranks (same marks + same % = same rank)
  let currentRank = 1;
  for (let i = 0; i < entries.length; i++) {
    if (i > 0 &&
      entries[i].total_marks_earned === entries[i - 1].total_marks_earned &&
      entries[i].percentage === entries[i - 1].percentage) {
      entries[i].rank = entries[i - 1].rank;
    } else {
      entries[i].rank = currentRank;
    }
    currentRank++;
  }

  return entries;
}
