import { supabase } from './supabase';

export interface QuizSet {
  id: string;
  title: string;
  title_kin: string | null;
  description: string | null;
  description_kin: string | null;
  order_index: number;
  xp_reward: number;
}

export interface QuizChallenge {
  id: string;
  set_id: string;
  title: string;
  title_kin: string | null;
  description: string;
  description_kin: string | null;
  challenge_type: 'fix_bug' | 'complete_code' | 'write_scratch';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  starter_js: string;
  starter_html: string;
  test_cases: Array<{ assertion: string; description: string; description_kin?: string | null }>;
  xp_reward: number;
  order_index: number;
  hint: string | null;
  hint_kin: string | null;
}

export interface QuizSession {
  id: string;
  student_id: string;
  set_id: string;
  started_at: string;
  completed_at: string | null;
  xp_earned: number;
  challenges_passed: number;
  challenges_attempted: number;
}

export interface ErrorLogEntry {
  timestamp: string;
  attempt: number;
  error: string | null;
  tests_passed: number;
  total_tests: number;
}

export async function getQuizSets(): Promise<QuizSet[]> {
  const { data, error } = await supabase
    .from('quiz_sets')
    .select('*')
    .order('order_index');
  if (error) return [];
  return data ?? [];
}

export async function getSetChallenges(setId: string): Promise<QuizChallenge[]> {
  const { data, error } = await supabase
    .from('quiz_challenges')
    .select('*')
    .eq('set_id', setId)
    .order('order_index');
  if (error) return [];
  return data ?? [];
}

export async function getStudentSetProgress(): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from('quiz_set_progress')
    .select('set_id');
  if (error) return {};
  return Object.fromEntries((data ?? []).map(r => [r.set_id, true]));
}

export async function startQuizSession(
  setId: string,
  classId?: string
): Promise<{ data: QuizSession | null; error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('quiz_sessions')
    .insert({
      student_id: user.id,
      set_id: setId,
      class_id: classId ?? null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as QuizSession, error: null };
}

export async function upsertQuizAttempt(params: {
  sessionId: string;
  challengeId: string;
  passed: boolean;
  attemptsCount: number;
  hintUsed: boolean;
  timeTakenSeconds: number;
  finalCode: string;
  errorLog: ErrorLogEntry[];
  xpEarned: number;
}): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('quiz_attempts')
    .upsert({
      session_id: params.sessionId,
      student_id: user.id,
      challenge_id: params.challengeId,
      completed_at: new Date().toISOString(),
      passed: params.passed,
      attempts_count: params.attemptsCount,
      hint_used: params.hintUsed,
      time_taken_seconds: params.timeTakenSeconds,
      final_code: params.finalCode,
      error_log: params.errorLog,
      xp_earned: params.xpEarned,
    }, { onConflict: 'session_id,challenge_id' });

  if (error) return { error: error.message };
  return { error: null };
}

export async function completeQuizSession(
  sessionId: string,
  xpEarned: number,
  challengesPassed: number,
  challengesAttempted: number
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('quiz_sessions')
    .update({
      completed_at: new Date().toISOString(),
      xp_earned: xpEarned,
      challenges_passed: challengesPassed,
      challenges_attempted: challengesAttempted,
    })
    .eq('id', sessionId);

  if (error) return { error: error.message };
  return { error: null };
}

export async function markSetCompleted(
  setId: string,
  xpEarned: number
): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('quiz_set_progress')
    .upsert({
      student_id: user.id,
      set_id: setId,
      completed_at: new Date().toISOString(),
      best_xp: xpEarned,
    }, { onConflict: 'student_id,set_id' });

  if (error) return { error: error.message };
  return { error: null };
}

export async function awardXp(amount: number): Promise<void> {
  if (amount <= 0) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: prof } = await supabase
    .from('profiles').select('xp_points').eq('id', user.id).single();
  await supabase
    .from('profiles')
    .update({ xp_points: (prof?.xp_points ?? 0) + amount })
    .eq('id', user.id);
}
