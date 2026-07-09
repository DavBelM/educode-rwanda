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
  duration_minutes: number | null;
  exam_mode: boolean;
  weight_pct: number;
  is_published: boolean;
  grades_released: boolean;
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
  teacher_feedback: string | null;
  tab_switches: number;
  paste_count: number;
  fullscreen_exits: number;
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
  teacher_feedback: string | null;
}

// ─── Classes ──────────────────────────────────────────────────────────────────

function generateInviteCode(): string {
  // Avoids visually ambiguous chars: 0/O, 1/I
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function createClass(name: string, subject: string): Promise<{ data: Class | null; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  // Generate a unique invite code — retry if collision (extremely unlikely)
  let invite_code = generateInviteCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from('classes').select('id').eq('invite_code', invite_code).maybeSingle();
    if (!existing) break;
    invite_code = generateInviteCode();
  }

  const { data, error } = await supabase
    .from('classes')
    .insert({ name, subject, teacher_id: user.id, invite_code })
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

  // Backfill invite codes for any existing class that doesn't have one
  const missing = (data ?? []).filter(c => !c.invite_code);
  if (missing.length > 0) {
    await Promise.all(missing.map(async c => {
      const code = generateInviteCode();
      await supabase.from('classes').update({ invite_code: code }).eq('id', c.id);
      c.invite_code = code;
    }));
  }

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
  examMode?: boolean;
  durationMinutes?: number;
  weightPct?: number;
}): Promise<{ data: Assignment | null; error: string | null }> {
  const authError = await assertTeacherOwnsClass(params.classId);
  if (authError) return { data: null, error: authError };
  const uid = await currentUserId();

  const { data, error } = await supabase
    .from('assignments')
    .insert({
      class_id: params.classId,
      teacher_id: uid,
      title: params.title,
      title_kin: params.titleKin,
      description: params.description,
      description_kin: params.descriptionKin,
      assignment_type: params.assignmentType,
      difficulty: params.difficulty,
      total_marks: params.totalMarks,
      questions: params.questions ?? null,
      due_date: params.dueDate ?? null,
      exam_mode: params.examMode ?? false,
      duration_minutes: params.durationMinutes ?? null,
      weight_pct: params.weightPct ?? 100,
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

export interface SubmissionViolations {
  tabSwitches?: number;
  pasteCount?: number;
  fullscreenExits?: number;
}

export async function submitCodingAssignment(params: {
  assignmentId: string;
  codeSubmitted: string;
  violations?: SubmissionViolations;
}): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('student_submissions')
    .insert({
      student_id: user.id,
      assignment_id: params.assignmentId,
      code_submitted: params.codeSubmitted,
      text_answers: null,
      tab_switches: params.violations?.tabSwitches ?? 0,
      paste_count: params.violations?.pasteCount ?? 0,
      fullscreen_exits: params.violations?.fullscreenExits ?? 0,
    });

  if (error) {
    if (error.code === '23505') return { error: 'already_submitted' };
    return { error: error.message };
  }
  return { error: null };
}

export async function submitTheoreticalAssignment(params: {
  assignmentId: string;
  textAnswers: Array<{ question_id: string; answer: string }>;
  violations?: SubmissionViolations;
}): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('student_submissions')
    .insert({
      student_id: user.id,
      assignment_id: params.assignmentId,
      code_submitted: '',
      text_answers: params.textAnswers,
      tab_switches: params.violations?.tabSwitches ?? 0,
      paste_count: params.violations?.pasteCount ?? 0,
      fullscreen_exits: params.violations?.fullscreenExits ?? 0,
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

// ─── Ownership helpers (never exported — called internally) ───────────────────

async function currentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

async function assertTeacherOwnsClass(classId: string): Promise<string | null> {
  const uid = await currentUserId();
  if (!uid) return 'Not authenticated';
  const { data } = await supabase.from('classes').select('teacher_id').eq('id', classId).single();
  if (!data || data.teacher_id !== uid) return 'Unauthorized';
  return null;
}

async function assertTeacherOwnsAssignment(assignmentId: string): Promise<{ classId: string | null; error: string | null }> {
  const uid = await currentUserId();
  if (!uid) return { classId: null, error: 'Not authenticated' };
  const { data } = await supabase.from('assignments').select('class_id, classes(teacher_id)').eq('id', assignmentId).single();
  const cls = (Array.isArray(data?.classes) ? data?.classes[0] : data?.classes) as { teacher_id: string } | null;
  if (!data || cls?.teacher_id !== uid) return { classId: null, error: 'Unauthorized' };
  return { classId: data.class_id, error: null };
}

async function assertSchoolAdminOwnsSchool(schoolId: string): Promise<string | null> {
  const uid = await currentUserId();
  if (!uid) return 'Not authenticated';
  const { data } = await supabase.from('profiles').select('school_id, user_type').eq('id', uid).single();
  if (!data || data.school_id !== schoolId || data.user_type !== 'school_admin') return 'Unauthorized';
  return null;
}

// ─── Submissions ───────────────────────────────────────────────────────────────

export async function getAssignmentSubmissions(assignmentId: string): Promise<{ data: Submission[]; error: string | null }> {
  const { error: authError } = await assertTeacherOwnsAssignment(assignmentId);
  if (authError) return { data: [], error: authError };

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

export async function gradeSubmission(submissionId: string, marksEarned: number, feedback?: string): Promise<{ error: string | null }> {
  const uid = await currentUserId();
  if (!uid) return { error: 'Not authenticated' };

  const { data: sub } = await supabase.from('student_submissions').select('assignment_id').eq('id', submissionId).single();
  if (!sub) return { error: 'Submission not found' };
  const { error: authError } = await assertTeacherOwnsAssignment(sub.assignment_id);
  if (authError) return { error: authError };

  const { error } = await supabase
    .from('student_submissions')
    .update({
      marks_earned: marksEarned,
      teacher_feedback: feedback ?? null,
      graded_by: uid,
      graded_at: new Date().toISOString(),
    })
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
    .select('assignment_id, marks_earned, teacher_feedback, assignments(total_marks)')
    .eq('student_id', user.id);

  return (data ?? []).map((row: { assignment_id: string; marks_earned: number | null; teacher_feedback: string | null; assignments: unknown }) => {
    const asgn = (Array.isArray(row.assignments) ? row.assignments[0] : row.assignments) as { total_marks: number } | null;
    return {
      assignment_id: row.assignment_id,
      marks_earned: row.marks_earned,
      teacher_feedback: row.teacher_feedback ?? null,
      total_marks: asgn?.total_marks ?? 10,
    };
  });
}

export interface StudentResult {
  assignment_id: string;
  title: string;
  title_kin: string | null;
  assignment_type: 'coding' | 'theoretical';
  difficulty: string;
  total_marks: number;
  submitted: boolean;
  submitted_at: string | null;
  marks_earned: number | null;
  teacher_feedback: string | null;
}

export async function getStudentResults(): Promise<StudentResult[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Must filter by enrolled class IDs — querying all assignments is blocked by RLS
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('class_id')
    .eq('student_id', user.id);

  const classIds = (enrollments ?? []).map((e: { class_id: string }) => e.class_id);
  if (classIds.length === 0) return [];

  const [{ data: assignments }, { data: submissions }] = await Promise.all([
    supabase
      .from('assignments')
      .select('*')
      .in('class_id', classIds)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('student_submissions')
      .select('assignment_id, marks_earned, teacher_feedback, submitted_at')
      .eq('student_id', user.id),
  ]);

  const subMap = new Map<string, { marks_earned: number | null; teacher_feedback: string | null; submitted_at: string }>();
  for (const s of submissions ?? []) {
    subMap.set(s.assignment_id, { marks_earned: s.marks_earned, teacher_feedback: s.teacher_feedback, submitted_at: s.submitted_at });
  }

  return (assignments ?? []).map((a: Pick<Assignment, 'id' | 'title' | 'title_kin' | 'assignment_type' | 'difficulty' | 'total_marks' | 'class_id'>) => {
    const sub = subMap.get(a.id) ?? null;
    return {
      assignment_id: a.id,
      title: a.title,
      title_kin: a.title_kin,
      assignment_type: a.assignment_type,
      difficulty: a.difficulty,
      total_marks: a.total_marks,
      submitted: !!sub,
      submitted_at: sub?.submitted_at ?? null,
      marks_earned: sub?.marks_earned ?? null,
      teacher_feedback: sub?.teacher_feedback ?? null,
    };
  });
}

export async function releaseGrades(assignmentId: string): Promise<{ error: string | null }> {
  const { error: authError } = await assertTeacherOwnsAssignment(assignmentId);
  if (authError) return { error: authError };

  const { error } = await supabase
    .from('assignments')
    .update({ grades_released: true })
    .eq('id', assignmentId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function getNewGradeCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const seen: string[] = JSON.parse(localStorage.getItem(`educode_seen_grades_${user.id}`) ?? '[]');

  const { data } = await supabase
    .from('student_submissions')
    .select('assignment_id')
    .eq('student_id', user.id)
    .not('marks_earned', 'is', null);

  const newGrades = (data ?? []).filter((s: { assignment_id: string }) => !seen.includes(s.assignment_id));
  return newGrades.length;
}

// ─── Self-Learner ─────────────────────────────────────────────────────────────

export interface CourseProgress {
  course_id: string;
  title: string;
  title_kin: string | null;
  difficulty: string;
  total_lessons: number;
  completed_lessons: number;
  pct: number;
}

export async function getLessonProgress(): Promise<{ completed: number; total: number; pct: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { completed: 0, total: 0, pct: 0 };

  const courses = await getCourses();
  if (!courses.length) return { completed: 0, total: 0, pct: 0 };

  const courseDetails = await Promise.all(courses.map(c => getCourseDetail(c.id)));
  const allLessonIds = courseDetails.flatMap(({ modules }) => modules.flatMap(m => m.lessons.map(l => l.id)));
  if (!allLessonIds.length) return { completed: 0, total: 0, pct: 0 };

  const { data: progressRows } = await supabase
    .from('student_lesson_progress')
    .select('lesson_id')
    .eq('student_id', user.id)
    .in('lesson_id', allLessonIds);

  const completed = new Set((progressRows ?? []).map((r: { lesson_id: string }) => r.lesson_id)).size;
  const total = allLessonIds.length;
  return { completed, total, pct: Math.round((completed / total) * 100) };
}

export async function getCourseProgressList(): Promise<CourseProgress[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const courses = await getCourses();
  if (!courses.length) return [];

  // Fetch all modules + lessons in parallel
  const courseDetails = await Promise.all(courses.map(c => getCourseDetail(c.id)));

  // All lesson ids across all courses
  const allLessonIds = courseDetails.flatMap(({ modules }) => modules.flatMap(m => m.lessons.map(l => l.id)));

  const { data: progressRows } = allLessonIds.length > 0
    ? await supabase.from('student_lesson_progress').select('lesson_id').eq('student_id', user.id).in('lesson_id', allLessonIds)
    : { data: [] };

  const completedSet = new Set((progressRows ?? []).map((r: { lesson_id: string }) => r.lesson_id));

  return courses.map((c, i) => {
    const lessons = courseDetails[i].modules.flatMap(m => m.lessons);
    const completed = lessons.filter(l => completedSet.has(l.id)).length;
    return {
      course_id: c.id,
      title: c.title,
      title_kin: c.title_kin,
      difficulty: c.difficulty,
      total_lessons: lessons.length,
      completed_lessons: completed,
      pct: lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0,
    };
  });
}

export async function getSelfLearnerStats(): Promise<{
  streak: number;
  courseProgress: CourseProgress[];
  totalCompleted: number;
  totalLessons: number;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { streak: 0, courseProgress: [], totalCompleted: 0, totalLessons: 0 };

  const [courseProgress, streak] = await Promise.all([getCourseProgressList(), getStreak()]);

  const totalCompleted = courseProgress.reduce((s, c) => s + c.completed_lessons, 0);
  const totalLessons   = courseProgress.reduce((s, c) => s + c.total_lessons, 0);

  return { streak, courseProgress, totalCompleted, totalLessons };
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
    hints?: string[];
    tests?: Array<{ description: string; expectedOutput: string }>;
    solution?: string;
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

export async function getResumeLesson(): Promise<{
  lesson: CourseLesson;
  courseTitle: string;
  allLessons: CourseLesson[];
} | null> {
  const courses = await getCourses();
  for (const course of courses) {
    const { modules } = await getCourseDetail(course.id);
    const allLessons = modules.flatMap(m => m.lessons);
    if (allLessons.length === 0) continue;
    const completedIds = await getCompletedLessonIds(course.id);
    const nextLesson = allLessons.find(l => !completedIds.has(l.id));
    if (nextLesson) {
      return { lesson: nextLesson, courseTitle: course.title, allLessons };
    }
  }
  return null;
}

// ─── Announcements ────────────────────────────────────────────────────────────

export interface Announcement {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
  classes?: { name: string };
}

export async function createAnnouncement(params: {
  classId: string;
  title: string;
  body: string;
  pinned?: boolean;
}): Promise<{ data: Announcement | null; error: string | null }> {
  const authError = await assertTeacherOwnsClass(params.classId);
  if (authError) return { data: null, error: authError };
  const uid = await currentUserId();

  const { data, error } = await supabase
    .from('announcements')
    .insert({
      class_id: params.classId,
      teacher_id: uid,
      title: params.title,
      body: params.body,
      pinned: params.pinned ?? false,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getClassAnnouncements(classId: string): Promise<{ data: Announcement[]; error: string | null }> {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('class_id', classId)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getStudentAnnouncements(): Promise<{ data: Announcement[]; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Not authenticated' };

  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('class_id')
    .eq('student_id', user.id);

  if (!enrollments || enrollments.length === 0) return { data: [], error: null };

  const classIds = enrollments.map((e: { class_id: string }) => e.class_id);

  const { data, error } = await supabase
    .from('announcements')
    .select('*, classes(name)')
    .in('class_id', classIds)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function deleteAnnouncement(id: string): Promise<{ error: string | null }> {
  const uid = await currentUserId();
  if (!uid) return { error: 'Not authenticated' };
  const { data: ann } = await supabase.from('announcements').select('teacher_id').eq('id', id).single();
  if (!ann || ann.teacher_id !== uid) return { error: 'Unauthorized' };

  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export async function completeLesson(
  lessonId: string,
  score?: number,
  xpOverride?: number
): Promise<{ error: string | null; xpAwarded: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated', xpAwarded: 0 };

  // Check if already completed so we don't double-award XP
  const { data: existing } = await supabase
    .from('student_lesson_progress')
    .select('id')
    .eq('student_id', user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  const alreadyCompleted = !!existing;

  const { error } = await supabase.from('student_lesson_progress')
    .upsert({
      student_id: user.id,
      lesson_id: lessonId,
      score: score ?? null,
      completed_at: new Date().toISOString(),
    });

  if (error) return { error: error.message, xpAwarded: 0 };

  // Award XP only on first completion; xpOverride=0 means solution was used
  if (!alreadyCompleted && xpOverride !== 0) {
    const { data: lessonRow } = await supabase
      .from('course_lessons')
      .select('xp_reward')
      .eq('id', lessonId)
      .single();

    const xpToAward = xpOverride ?? lessonRow?.xp_reward ?? 0;

    if (xpToAward > 0) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('xp_points')
        .eq('id', user.id)
        .single();

      await supabase
        .from('profiles')
        .update({ xp_points: (prof?.xp_points ?? 0) + xpToAward })
        .eq('id', user.id);
    }

    return { error: null, xpAwarded: xpToAward };
  }

  return { error: null, xpAwarded: 0 };
}

export async function getProfileXP(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  const { data } = await supabase
    .from('profiles')
    .select('xp_points')
    .eq('id', user.id)
    .single();
  return data?.xp_points ?? 0;
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

// ─── Class Analytics ──────────────────────────────────────────────────────────

export interface ClassGradeRow {
  student_name: string;
  assignment_title: string;
  assignment_type: string;
  marks_earned: number | null;
  total_marks: number;
  score_pct: number | null;
  weight_pct: number;
  weighted_score: number | null;
  submitted: boolean;
  submitted_at: string | null;
  teacher_feedback: string | null;
}

export async function getClassGradesExport(classId: string): Promise<ClassGradeRow[]> {
  const authError = await assertTeacherOwnsClass(classId);
  if (authError) return [];

  const [{ data: enrollments }, { data: assignments }] = await Promise.all([
    supabase.from('class_enrollments').select('student_id, profiles(full_name)').eq('class_id', classId),
    supabase.from('assignments').select('id, title, assignment_type, total_marks, weight_pct').eq('class_id', classId).order('created_at', { ascending: true }),
  ]);

  const assignmentIds = (assignments ?? []).map((a: { id: string }) => a.id);
  const { data: submissions } = assignmentIds.length > 0
    ? await supabase.from('student_submissions').select('student_id, assignment_id, marks_earned, submitted_at, teacher_feedback').in('assignment_id', assignmentIds)
    : { data: [] };

  const rows: ClassGradeRow[] = [];
  for (const e of enrollments ?? []) {
    const p = (Array.isArray(e.profiles) ? e.profiles[0] : e.profiles) as { full_name: string } | null;
    const studentName = p?.full_name ?? 'Unknown';
    for (const a of assignments ?? []) {
      const sub = (submissions ?? []).find((s: { student_id: string; assignment_id: string }) => s.student_id === e.student_id && s.assignment_id === a.id);
      const marksEarned = sub?.marks_earned ?? null;
      const scorePct = marksEarned !== null ? Math.round((marksEarned / a.total_marks) * 100) : null;
      const weightPct = a.weight_pct ?? 100;
      rows.push({
        student_name: studentName,
        assignment_title: a.title,
        assignment_type: a.assignment_type,
        marks_earned: marksEarned,
        total_marks: a.total_marks,
        score_pct: scorePct,
        weight_pct: weightPct,
        weighted_score: scorePct !== null ? Math.round((scorePct * weightPct) / 100) : null,
        submitted: !!sub,
        submitted_at: sub?.submitted_at ?? null,
        teacher_feedback: sub?.teacher_feedback ?? null,
      });
    }
  }
  return rows.sort((a, b) => a.student_name.localeCompare(b.student_name) || a.assignment_title.localeCompare(b.assignment_title));
}

export interface AssignmentAnalytics {
  id: string;
  title: string;
  title_kin: string | null;
  assignment_type: 'coding' | 'theoretical';
  total_marks: number;
  submitted_count: number;
  graded_count: number;
  missing_students: string[];
  avg_score: number | null;
  avg_pct: number | null;
  top_score: number | null;
  low_score: number | null;
  dist: { label: string; count: number; color: string }[];
}

export interface ClassAnalytics {
  total_students: number;
  assignments: AssignmentAnalytics[];
  class_avg_pct: number | null;
  overall_submission_rate: number | null;
}

export async function getClassAnalytics(classId: string): Promise<ClassAnalytics> {
  const authError = await assertTeacherOwnsClass(classId);
  if (authError) return { total_students: 0, assignments: [], class_avg_pct: null, overall_submission_rate: null };

  const [{ data: enrollments }, { data: assignments }, { data: submissions }] = await Promise.all([
    supabase.from('class_enrollments').select('student_id, profiles(full_name)').eq('class_id', classId),
    supabase.from('assignments').select('id, title, title_kin, assignment_type, total_marks').eq('class_id', classId).order('created_at', { ascending: false }),
    supabase.from('student_submissions').select('student_id, assignment_id, marks_earned').in(
      'assignment_id',
      ((await supabase.from('assignments').select('id').eq('class_id', classId)).data ?? []).map((a: { id: string }) => a.id)
    ),
  ]);

  const studentNames: Record<string, string> = {};
  for (const e of enrollments ?? []) {
    const p = (Array.isArray(e.profiles) ? e.profiles[0] : e.profiles) as { full_name: string } | null;
    studentNames[e.student_id] = p?.full_name ?? 'Student';
  }

  const totalStudents = Object.keys(studentNames).length;

  const assignmentList = (assignments ?? []) as Assignment[];
  const subList = submissions ?? [];

  const analyticsRows: AssignmentAnalytics[] = assignmentList.map(a => {
    const asgSubs = subList.filter(s => s.assignment_id === a.id);
    const gradedSubs = asgSubs.filter(s => s.marks_earned !== null);
    const submittedIds = new Set(asgSubs.map(s => s.student_id));
    const missing = Object.entries(studentNames)
      .filter(([id]) => !submittedIds.has(id))
      .map(([, name]) => name)
      .sort();

    const scores = gradedSubs.map(s => s.marks_earned as number);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    const avgPct = avgScore !== null ? Math.round((avgScore / a.total_marks) * 100) : null;

    // Score distribution buckets
    const buckets = [0, 0, 0, 0]; // 0-49%, 50-69%, 70-89%, 90-100%
    for (const s of scores) {
      const pct = (s / a.total_marks) * 100;
      if (pct >= 90) buckets[3]++;
      else if (pct >= 70) buckets[2]++;
      else if (pct >= 50) buckets[1]++;
      else buckets[0]++;
    }

    return {
      id: a.id,
      title: a.title,
      title_kin: a.title_kin,
      assignment_type: a.assignment_type,
      total_marks: a.total_marks,
      submitted_count: asgSubs.length,
      graded_count: gradedSubs.length,
      missing_students: missing,
      avg_score: avgScore !== null ? Math.round(avgScore * 10) / 10 : null,
      avg_pct: avgPct,
      top_score: scores.length > 0 ? Math.max(...scores) : null,
      low_score: scores.length > 0 ? Math.min(...scores) : null,
      dist: [
        { label: '0–49%', count: buckets[0], color: 'var(--error)' },
        { label: '50–69%', count: buckets[1], color: '#cda86a' },
        { label: '70–89%', count: buckets[2], color: 'rgba(158,170,132,0.6)' },
        { label: '90–100%', count: buckets[3], color: '#9eaa84' },
      ],
    };
  });

  const allGraded = analyticsRows.filter(a => a.avg_pct !== null);
  const classAvgPct = allGraded.length > 0
    ? Math.round(allGraded.reduce((s, a) => s + (a.avg_pct ?? 0), 0) / allGraded.length)
    : null;

  const totalPossibleSubs = assignmentList.length * totalStudents;
  const totalActualSubs = analyticsRows.reduce((s, a) => s + a.submitted_count, 0);
  const overallSubmissionRate = totalPossibleSubs > 0
    ? Math.round((totalActualSubs / totalPossibleSubs) * 100)
    : null;

  return { total_students: totalStudents, assignments: analyticsRows, class_avg_pct: classAvgPct, overall_submission_rate: overallSubmissionRate };
}

// ─── Class Roster ─────────────────────────────────────────────────────────────

export interface RosterStudent {
  student_id: string;
  full_name: string;
  username: string;
  progress_pct: number;
  current_module: string;
  last_active: string | null;
  status: 'on-track' | 'behind' | 'needs-help';
  challenges_passed: number;
  challenges_attempted: number;
  ai_interactions: number;
}

function usernameFromName(name: string): string {
  const parts = name.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'student';
  if (parts.length === 1) return parts[0];
  return `${parts[0]}.${parts[parts.length - 1][0]}`;
}

export async function getClassRoster(classId: string): Promise<RosterStudent[]> {
  const authError = await assertTeacherOwnsClass(classId);
  if (authError) return [];

  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id, profiles(full_name)')
    .eq('class_id', classId);

  if (!enrollments?.length) return [];

  const courses = await getCourses();
  const courseDetails = await Promise.all(courses.map(c => getCourseDetail(c.id)));
  const orderedLessons = courseDetails.flatMap(({ modules }) =>
    modules.flatMap(m => m.lessons.map(l => ({ lessonId: l.id, moduleTitle: m.title })))
  );
  const allLessonIds = orderedLessons.map(l => l.lessonId);
  const studentIds = enrollments.map((e: { student_id: string }) => e.student_id);

  const { data: progressRows } = allLessonIds.length > 0
    ? await supabase.from('student_lesson_progress')
        .select('student_id, lesson_id, completed_at')
        .in('student_id', studentIds)
        .in('lesson_id', allLessonIds)
    : { data: [] };

  // Also fetch challenge attempts + AI interactions for full activity picture
  const [{ data: challengeRows }, { data: interactionRows }] = await Promise.all([
    supabase.from('quiz_attempts').select('student_id, passed, completed_at').in('student_id', studentIds),
    supabase.from('ai_interactions').select('student_id, created_at').in('student_id', studentIds),
  ]);

  return enrollments.map((e: { student_id: string; profiles: unknown }) => {
    const p = (Array.isArray(e.profiles) ? e.profiles[0] : e.profiles) as { full_name: string } | null;
    const fullName = p?.full_name ?? 'Student';

    const myProgress = (progressRows ?? []).filter((r: { student_id: string }) => r.student_id === e.student_id);
    const completedSet = new Set(myProgress.map((r: { lesson_id: string }) => r.lesson_id));
    const pct = orderedLessons.length > 0 ? Math.round((completedSet.size / orderedLessons.length) * 100) : 0;

    const nextLesson = orderedLessons.find(l => !completedSet.has(l.lessonId));
    const currentModule = nextLesson?.moduleTitle ?? orderedLessons[orderedLessons.length - 1]?.moduleTitle ?? '—';

    const lessonLastActive = myProgress.reduce<string | null>((latest, r: { completed_at: string | null }) => {
      if (!r.completed_at) return latest;
      return !latest || r.completed_at > latest ? r.completed_at : latest;
    }, null);

    const myChallenges = (challengeRows ?? []).filter((r: { student_id: string }) => r.student_id === e.student_id);
    const challengeLastActive = myChallenges.reduce<string | null>((latest, r: { completed_at: string | null }) => {
      if (!r.completed_at) return latest;
      return !latest || r.completed_at > latest ? r.completed_at : latest;
    }, null);

    const myInteractions = (interactionRows ?? []).filter((r: { student_id: string }) => r.student_id === e.student_id);
    const interactionLastActive = myInteractions.reduce<string | null>((latest, r: { created_at: string }) => {
      return !latest || r.created_at > latest ? r.created_at : latest;
    }, null);

    // Use the most recent activity across lessons, challenges, AND Mwarimu conversations
    const lastActive = [lessonLastActive, challengeLastActive, interactionLastActive].filter(Boolean).sort().pop() ?? null;

    const challengesPassed = myChallenges.filter((r: { passed: boolean }) => r.passed).length;
    const challengesAttempted = myChallenges.length;

    const daysSinceActive = lastActive ? (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24) : Infinity;
    const status: RosterStudent['status'] = daysSinceActive > 5 ? 'behind' : pct < 50 && challengesPassed === 0 ? 'needs-help' : 'on-track';

    return {
      student_id: e.student_id,
      full_name: fullName,
      username: usernameFromName(fullName),
      progress_pct: pct,
      current_module: currentModule,
      last_active: lastActive,
      status,
      challenges_passed: challengesPassed,
      challenges_attempted: challengesAttempted,
      ai_interactions: myInteractions.length,
    };
  }).sort((a, b) => b.progress_pct - a.progress_pct);
}

export async function getClassPendingReviewCount(classId: string): Promise<number> {
  const { data: assignments } = await supabase.from('assignments').select('id').eq('class_id', classId);
  const ids = (assignments ?? []).map((a: { id: string }) => a.id);
  if (!ids.length) return 0;

  const { count } = await supabase
    .from('student_submissions')
    .select('*', { count: 'exact', head: true })
    .in('assignment_id', ids)
    .is('marks_earned', null);

  return count ?? 0;
}

// ─── School Admin ─────────────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  location: string | null;
  contact_email: string;
  school_code: string;
  created_at: string;
}

export interface SchoolTeacher {
  id: string;
  full_name: string;
  email: string;
  class_count: number;
  student_count: number;
  assignment_count: number;
  last_seen: string | null;
}

export interface SchoolStudent {
  id: string;
  full_name: string;
  class_names: string[];
  avg_score_pct: number | null;
  last_seen: string | null;
  days_inactive: number;
}

export interface SchoolOverview {
  teacher_count: number;
  student_count: number;
  class_count: number;
  avg_score_pct: number | null;
  active_this_week: number;
}

export interface SchoolAnnouncement {
  id: string;
  school_id: string;
  admin_id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
}

export async function createSchool(params: {
  name: string;
  location: string;
  contactEmail: string;
}): Promise<{ data: School | null; error: string | null }> {
  const { data, error } = await supabase
    .from('schools')
    .insert({ name: params.name, location: params.location || null, contact_email: params.contactEmail })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function linkProfileToSchool(userId: string, schoolId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('profiles').update({ school_id: schoolId }).eq('id', userId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function getMySchool(): Promise<School | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('school_id').eq('id', user.id).single();
  if (!profile?.school_id) return null;
  const { data: school } = await supabase.from('schools').select('*').eq('id', profile.school_id).single();
  return school ?? null;
}

export async function getSchoolOverview(schoolId: string): Promise<SchoolOverview> {
  const authError = await assertSchoolAdminOwnsSchool(schoolId);
  if (authError) return { teacher_count: 0, student_count: 0, class_count: 0, avg_score_pct: null, active_this_week: 0 };

  const { data: teachers } = await supabase.from('profiles').select('id').eq('school_id', schoolId).eq('user_type', 'teacher');
  const teacherIds = (teachers ?? []).map((t: { id: string }) => t.id);
  if (teacherIds.length === 0) return { teacher_count: 0, student_count: 0, class_count: 0, avg_score_pct: null, active_this_week: 0 };

  const { data: classes } = await supabase.from('classes').select('id').in('teacher_id', teacherIds);
  const classIds = (classes ?? []).map((c: { id: string }) => c.id);
  if (classIds.length === 0) return { teacher_count: teacherIds.length, student_count: 0, class_count: 0, avg_score_pct: null, active_this_week: 0 };

  const { data: enrollments } = await supabase.from('class_enrollments').select('student_id').in('class_id', classIds);
  const studentIds = [...new Set((enrollments ?? []).map((e: { student_id: string }) => e.student_id))];

  const { data: assignments } = await supabase.from('assignments').select('id, total_marks').in('class_id', classIds);
  const assignmentIds = (assignments ?? []).map((a: { id: string }) => a.id);

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [{ data: submissions }, { data: recentLogins }] = await Promise.all([
    assignmentIds.length > 0
      ? supabase.from('student_submissions').select('marks_earned, assignment_id').in('assignment_id', assignmentIds).not('marks_earned', 'is', null)
      : { data: [] },
    studentIds.length > 0
      ? supabase.from('daily_logins').select('student_id').in('student_id', studentIds).gte('login_date', weekAgo)
      : { data: [] },
  ]);

  const asgMarkMap = Object.fromEntries((assignments ?? []).map((a: { id: string; total_marks: number }) => [a.id, a.total_marks]));
  let earned = 0, possible = 0;
  for (const s of submissions ?? []) {
    if (s.marks_earned !== null) { earned += s.marks_earned; possible += asgMarkMap[s.assignment_id] ?? 0; }
  }

  return {
    teacher_count: teacherIds.length,
    student_count: studentIds.length,
    class_count: classIds.length,
    avg_score_pct: possible > 0 ? Math.round((earned / possible) * 100) : null,
    active_this_week: new Set((recentLogins ?? []).map((l: { student_id: string }) => l.student_id)).size,
  };
}

export async function getSchoolTeachers(schoolId: string): Promise<SchoolTeacher[]> {
  const authError = await assertSchoolAdminOwnsSchool(schoolId);
  if (authError) return [];

  const { data: teachers } = await supabase.from('profiles').select('id, full_name, email').eq('school_id', schoolId).eq('user_type', 'teacher');
  if (!teachers?.length) return [];
  const ids = (teachers as Array<{ id: string; full_name: string; email: string }>).map(t => t.id);

  const { data: classes } = await supabase.from('classes').select('id, teacher_id').in('teacher_id', ids);
  const classIds = (classes ?? []).map((c: { id: string }) => c.id);

  const [{ data: enrollments }, { data: assignments }, { data: loginRows }] = await Promise.all([
    classIds.length > 0
      ? supabase.from('class_enrollments').select('class_id, student_id').in('class_id', classIds)
      : { data: [] },
    supabase.from('assignments').select('teacher_id').in('teacher_id', ids),
    supabase.from('daily_logins').select('student_id, login_date').in('student_id', ids).order('login_date', { ascending: false }),
  ]);

  const classToTeacher: Record<string, string> = {};
  const classCountMap: Record<string, number> = {};
  for (const c of classes ?? []) {
    classToTeacher[c.id] = c.teacher_id;
    classCountMap[c.teacher_id] = (classCountMap[c.teacher_id] ?? 0) + 1;
  }

  const studentPerTeacher: Record<string, Set<string>> = {};
  for (const e of enrollments ?? []) {
    const tid = classToTeacher[e.class_id];
    if (tid) (studentPerTeacher[tid] ??= new Set()).add(e.student_id);
  }

  const asgCountMap: Record<string, number> = {};
  for (const a of assignments ?? []) asgCountMap[a.teacher_id] = (asgCountMap[a.teacher_id] ?? 0) + 1;

  const lastSeenMap: Record<string, string> = {};
  for (const l of loginRows ?? []) if (!lastSeenMap[l.student_id]) lastSeenMap[l.student_id] = l.login_date;

  return (teachers as Array<{ id: string; full_name: string; email: string }>).map(t => ({
    id: t.id, full_name: t.full_name, email: t.email,
    class_count: classCountMap[t.id] ?? 0,
    student_count: studentPerTeacher[t.id]?.size ?? 0,
    assignment_count: asgCountMap[t.id] ?? 0,
    last_seen: lastSeenMap[t.id] ?? null,
  }));
}

export async function getSchoolStudents(schoolId: string): Promise<SchoolStudent[]> {
  const authError = await assertSchoolAdminOwnsSchool(schoolId);
  if (authError) return [];

  const { data: teachers } = await supabase.from('profiles').select('id').eq('school_id', schoolId).eq('user_type', 'teacher');
  if (!teachers?.length) return [];
  const teacherIds = (teachers as Array<{ id: string }>).map(t => t.id);

  const { data: classes } = await supabase.from('classes').select('id, name').in('teacher_id', teacherIds);
  if (!classes?.length) return [];
  const classIds = (classes as Array<{ id: string; name: string }>).map(c => c.id);

  const { data: enrollments } = await supabase.from('class_enrollments').select('student_id, class_id').in('class_id', classIds);
  if (!enrollments?.length) return [];
  const studentIds = [...new Set((enrollments as Array<{ student_id: string }>).map(e => e.student_id))];

  const { data: assignments } = await supabase.from('assignments').select('id, total_marks').in('class_id', classIds);
  const assignmentIds = (assignments ?? []).map((a: { id: string }) => a.id);

  const [{ data: studentProfiles }, { data: submissions }, { data: loginRows }] = await Promise.all([
    supabase.from('profiles').select('id, full_name').in('id', studentIds),
    assignmentIds.length > 0
      ? supabase.from('student_submissions').select('student_id, assignment_id, marks_earned').in('student_id', studentIds).in('assignment_id', assignmentIds).not('marks_earned', 'is', null)
      : { data: [] },
    supabase.from('daily_logins').select('student_id, login_date').in('student_id', studentIds).order('login_date', { ascending: false }),
  ]);

  const classNameMap = Object.fromEntries((classes as Array<{ id: string; name: string }>).map(c => [c.id, c.name]));
  const studentClassMap: Record<string, string[]> = {};
  for (const e of enrollments as Array<{ student_id: string; class_id: string }>) {
    (studentClassMap[e.student_id] ??= []).push(classNameMap[e.class_id] ?? '');
  }

  const asgMarkMap = Object.fromEntries((assignments ?? []).map((a: { id: string; total_marks: number }) => [a.id, a.total_marks]));
  const scoreMap: Record<string, { earned: number; possible: number }> = {};
  for (const s of submissions ?? []) {
    (scoreMap[s.student_id] ??= { earned: 0, possible: 0 });
    scoreMap[s.student_id].earned += s.marks_earned;
    scoreMap[s.student_id].possible += asgMarkMap[s.assignment_id] ?? 0;
  }

  const lastSeenMap: Record<string, string> = {};
  for (const l of loginRows ?? []) if (!lastSeenMap[l.student_id]) lastSeenMap[l.student_id] = l.login_date;

  const today = new Date().toISOString().split('T')[0];
  return (studentProfiles ?? []).map((p: { id: string; full_name: string }) => {
    const lastSeen = lastSeenMap[p.id] ?? null;
    const daysInactive = lastSeen
      ? Math.max(0, Math.floor((new Date(today).getTime() - new Date(lastSeen).getTime()) / 86400000))
      : 999;
    const sc = scoreMap[p.id];
    return {
      id: p.id, full_name: p.full_name,
      class_names: studentClassMap[p.id] ?? [],
      avg_score_pct: sc && sc.possible > 0 ? Math.round((sc.earned / sc.possible) * 100) : null,
      last_seen: lastSeen,
      days_inactive: daysInactive,
    };
  }).sort((a, b) => b.days_inactive - a.days_inactive);
}

export async function addTeacherToSchool(schoolId: string, teacherEmail: string): Promise<{ error: string | null }> {
  const authError = await assertSchoolAdminOwnsSchool(schoolId);
  if (authError) return { error: authError };

  const { data, error } = await supabase
    .from('profiles').update({ school_id: schoolId })
    .eq('email', teacherEmail).eq('user_type', 'teacher')
    .select('id').single();
  if (error || !data) return { error: 'Teacher not found. Make sure they have signed up as a teacher first.' };
  return { error: null };
}

export async function removeTeacherFromSchool(teacherId: string): Promise<{ error: string | null }> {
  const uid = await currentUserId();
  if (!uid) return { error: 'Not authenticated' };
  const { data: prof } = await supabase.from('profiles').select('school_id').eq('id', teacherId).single();
  if (!prof?.school_id) return { error: 'Teacher not found' };
  const authError = await assertSchoolAdminOwnsSchool(prof.school_id);
  if (authError) return { error: authError };

  const { error } = await supabase.from('profiles').update({ school_id: null }).eq('id', teacherId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function createSchoolAnnouncement(params: {
  schoolId: string; title: string; body: string; pinned?: boolean;
}): Promise<{ data: SchoolAnnouncement | null; error: string | null }> {
  const authError = await assertSchoolAdminOwnsSchool(params.schoolId);
  if (authError) return { data: null, error: authError };
  const uid = await currentUserId();

  const { data, error } = await supabase.from('school_announcements')
    .insert({ school_id: params.schoolId, admin_id: uid, title: params.title, body: params.body, pinned: params.pinned ?? false })
    .select().single();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getSchoolAnnouncements(schoolId: string): Promise<SchoolAnnouncement[]> {
  const { data } = await supabase.from('school_announcements').select('*').eq('school_id', schoolId)
    .order('pinned', { ascending: false }).order('created_at', { ascending: false });
  return data ?? [];
}

export async function deleteSchoolAnnouncement(id: string): Promise<{ error: string | null }> {
  const { data: ann } = await supabase.from('school_announcements').select('school_id').eq('id', id).single();
  if (!ann) return { error: 'Not found' };
  const authError = await assertSchoolAdminOwnsSchool(ann.school_id);
  if (authError) return { error: authError };

  const { error } = await supabase.from('school_announcements').delete().eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Teacher: class ratings summary ───────────────────────────────────────────

export interface ClassRatingsSummary {
  totalResponses: number;
  avgDifficulty: number | null;
  mwarimuUsedPct: number | null;
  mwarimuHelpedPct: number | null;
  kinPct: number | null;
  lessonCount: number;
  challengeCount: number;
}

export async function getClassRatingsSummary(classId: string): Promise<ClassRatingsSummary | null> {
  const authError = await assertTeacherOwnsClass(classId);
  if (authError) return null;

  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', classId);
  if (!enrollments?.length) return { totalResponses: 0, avgDifficulty: null, mwarimuUsedPct: null, mwarimuHelpedPct: null, kinPct: null, lessonCount: 0, challengeCount: 0 };

  const studentIds = enrollments.map((e: { student_id: string }) => e.student_id);

  const { data: ratings } = await supabase
    .from('ratings')
    .select('difficulty, used_mwarimu, mwarimu_helped, language, content_type')
    .in('student_id', studentIds);

  if (!ratings?.length) return { totalResponses: 0, avgDifficulty: null, mwarimuUsedPct: null, mwarimuHelpedPct: null, kinPct: null, lessonCount: 0, challengeCount: 0 };

  const total = ratings.length;
  const avgDifficulty = Math.round((ratings.reduce((s, r) => s + r.difficulty, 0) / total) * 10) / 10;
  const usedMwarimu = ratings.filter(r => r.used_mwarimu).length;
  const mwarimuHelped = ratings.filter(r => r.mwarimu_helped === true).length;
  const kinCount = ratings.filter(r => r.language === 'KIN').length;
  const lessonCount = ratings.filter(r => r.content_type === 'lesson').length;
  const challengeCount = ratings.filter(r => r.content_type === 'challenge').length;

  return {
    totalResponses: total,
    avgDifficulty,
    mwarimuUsedPct: total > 0 ? Math.round((usedMwarimu / total) * 100) : null,
    mwarimuHelpedPct: usedMwarimu > 0 ? Math.round((mwarimuHelped / usedMwarimu) * 100) : null,
    kinPct: total > 0 ? Math.round((kinCount / total) * 100) : null,
    lessonCount,
    challengeCount,
  };
}

// ── Teacher: per-student AI profile ──────────────────────────────────────────

export interface StudentAIProfile {
  totalInteractions: number;
  weekInteractions: number;
  challengeInteractions: number;
  topErrors: Array<{ type: string; count: number }>;
  recentQuestions: Array<{ question: string; created_at: string; in_challenge: boolean }>;
  languageSplit: { en: number; kin: number };
}

export async function getStudentAIProfile(
  studentId: string,
  classId: string
): Promise<StudentAIProfile | null> {
  // Only the teacher who owns this class may access student AI data
  const authError = await assertTeacherOwnsClass(classId);
  if (authError) return null;

  // Confirm student is actually enrolled in this class
  const { data: enrollment } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', classId)
    .eq('student_id', studentId)
    .single();
  if (!enrollment) return null;

  const { data: interactions } = await supabase
    .from('ai_interactions')
    .select('question, language, challenge_id, created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (!interactions) return {
    totalInteractions: 0, weekInteractions: 0, challengeInteractions: 0,
    topErrors: [], recentQuestions: [], languageSplit: { en: 0, kin: 0 },
  };

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const weekInteractions = interactions.filter(i => i.created_at >= weekAgo).length;
  const challengeInteractions = interactions.filter(i => !!i.challenge_id).length;

  // Tally error types from the question text
  const errorCounts: Record<string, number> = {};
  const ERROR_TYPES = ['TypeError', 'ReferenceError', 'SyntaxError', 'RangeError'];
  for (const i of interactions) {
    for (const t of ERROR_TYPES) {
      if (i.question.includes(t)) errorCounts[t] = (errorCounts[t] ?? 0) + 1;
    }
  }
  const topErrors = Object.entries(errorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([type, count]) => ({ type, count }));

  // Filter out auto-feedback messages (those are not the student's own questions)
  const studentQuestions = interactions.filter(
    i => !i.question.startsWith('My code has an error') &&
         !i.question.startsWith('I ran my code') &&
         !i.question.startsWith('[CHALLENGE MODE')
  );
  const recentQuestions = studentQuestions.slice(0, 6).map(i => ({
    question: i.question.replace(/^\[INSTRUCTION[^\]]*\]\n\n/, '').slice(0, 140),
    created_at: i.created_at,
    in_challenge: !!i.challenge_id,
  }));

  const en = interactions.filter(i => i.language === 'EN').length;
  const kin = interactions.filter(i => i.language === 'KIN').length;

  return {
    totalInteractions: interactions.length,
    weekInteractions,
    challengeInteractions,
    topErrors,
    recentQuestions,
    languageSplit: { en, kin },
  };
}

// ── Account deletion request ──────────────────────────────────────────────────
// Deactivates the account immediately (student can no longer use the platform)
// but preserves data so teachers retain academic records during the pilot.
// Mitali processes actual data deletion manually after the pilot ends.

export async function requestAccountDeletion(): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase
    .from('profiles')
    .update({ is_deactivated: true, deletion_requested_at: new Date().toISOString() })
    .eq('id', user.id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Pilot survey ──────────────────────────────────────────────────────────────

export async function hasPilotSurveyResponse(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('pilot_survey_responses')
    .select('id')
    .eq('student_id', user.id)
    .maybeSingle();
  return !!data;
}

export async function submitPilotSurvey(response: {
  overall_rating: number | null;
  helped_learning: number | null;
  mwarimu_helpfulness: string | null;
  language_preference: string | null;
  ease_of_use: number | null;
  liked_most: string;
  would_change: string;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('pilot_survey_responses').insert({ student_id: user.id, ...response });
}

// ─── Mwarimu accuracy evaluations (teacher) ───────────────────────────────────

export interface MwarimuEvaluation {
  id: string;
  error_input: string;
  code_context: string | null;
  ai_response: string;
  rating: 'accurate' | 'partially_accurate' | 'inaccurate';
  notes: string | null;
  created_at: string;
}

export async function saveMwarimuEvaluation(params: {
  error_input: string;
  code_context: string;
  ai_response: string;
  rating: 'accurate' | 'partially_accurate' | 'inaccurate';
  notes: string;
}): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase.from('mwarimu_evaluations').insert({
    teacher_id: user.id,
    ...params,
    code_context: params.code_context || null,
    notes: params.notes || null,
  });
  return { error: error?.message ?? null };
}

export async function getMwarimuEvaluations(): Promise<MwarimuEvaluation[]> {
  const { data } = await supabase
    .from('mwarimu_evaluations')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getMwarimuEvalSummary(): Promise<{
  total: number;
  accurate: number;
  partially: number;
  inaccurate: number;
  accuracyPct: number | null;
}> {
  const evals = await getMwarimuEvaluations();
  const total = evals.length;
  const accurate = evals.filter(e => e.rating === 'accurate').length;
  const partially = evals.filter(e => e.rating === 'partially_accurate').length;
  const inaccurate = evals.filter(e => e.rating === 'inaccurate').length;
  const accuracyPct = total > 0 ? Math.round(((accurate + partially * 0.5) / total) * 100) : null;
  return { total, accurate, partially, inaccurate, accuracyPct };
}
