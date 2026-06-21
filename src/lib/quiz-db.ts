import { supabase } from './supabase';

// ── Codename pool ─────────────────────────────────────────────────────────────
const ANIMALS = [
  'Eagle', 'Tiger', 'Hawk', 'Lion', 'Wolf', 'Bear', 'Fox', 'Shark',
  'Raven', 'Crane', 'Owl', 'Deer', 'Lynx', 'Falcon', 'Otter', 'Cobra',
  'Finch', 'Drake', 'Viper', 'Manta', 'Panda', 'Bison', 'Rhino', 'Gecko',
  'Moose', 'Kite', 'Heron', 'Ibis', 'Lark', 'Swift',
];

function randomCodename(): string {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 100–999
  return `${animal}-${num}`;
}

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

// ── Codenames ─────────────────────────────────────────────────────────────────

export async function getOrCreateMyCodename(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Check if already assigned
  const { data: existing } = await supabase
    .from('student_codenames')
    .select('codename')
    .eq('student_id', user.id)
    .maybeSingle();

  if (existing?.codename) return existing.codename;

  // Try up to 8 times to get a unique codename
  for (let i = 0; i < 8; i++) {
    const codename = randomCodename();
    const { error } = await supabase
      .from('student_codenames')
      .insert({ student_id: user.id, codename });
    if (!error) return codename;
    // unique constraint violation → try again
    if (!error.message.includes('unique') && !error.message.includes('duplicate')) break;
  }
  return null;
}

// ── XP Leaderboard ────────────────────────────────────────────────────────────

export interface XPLeaderboardEntry {
  codename: string;
  xp: number;
  currentSet: string | null;
  rank: number;
  isMe: boolean;
  showRank: boolean; // false for bottom half → show "Top X%" instead
  topPct: number;    // e.g. 72 means "Top 72%"
}

export async function getClassXPLeaderboard(classId: string): Promise<XPLeaderboardEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // 1. All enrolled students + their XP
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id, profiles(xp_points)')
    .eq('class_id', classId);
  if (!enrollments?.length) return [];

  const studentIds = enrollments.map((e: { student_id: string }) => e.student_id);

  // 2. Codenames for those students
  const { data: codenames } = await supabase
    .from('student_codenames')
    .select('student_id, codename')
    .in('student_id', studentIds);

  const codenameMap = new Map<string, string>(
    (codenames ?? []).map((c: { student_id: string; codename: string }) => [c.student_id, c.codename])
  );

  // 3. Latest quiz session per student (for "current set" display)
  const { data: sessions } = await supabase
    .from('quiz_sessions')
    .select('student_id, set_id, started_at, quiz_sets(title)')
    .in('student_id', studentIds)
    .order('started_at', { ascending: false });

  const latestSetByStudent = new Map<string, string>();
  for (const s of sessions ?? []) {
    if (!latestSetByStudent.has(s.student_id)) {
      const setTitle = (Array.isArray(s.quiz_sets) ? s.quiz_sets[0] : s.quiz_sets) as { title: string } | null;
      latestSetByStudent.set(s.student_id, setTitle?.title ?? '');
    }
  }

  // 4. Build entries (only students with a codename appear)
  const entries: Omit<XPLeaderboardEntry, 'rank' | 'showRank' | 'topPct'>[] = [];
  for (const enr of enrollments) {
    const codename = codenameMap.get(enr.student_id);
    if (!codename) continue; // hasn't started yet
    const prof = (Array.isArray(enr.profiles) ? enr.profiles[0] : enr.profiles) as { xp_points: number } | null;
    entries.push({
      codename,
      xp: prof?.xp_points ?? 0,
      currentSet: latestSetByStudent.get(enr.student_id) ?? null,
      isMe: enr.student_id === user.id,
    });
  }

  // 5. Sort by XP descending, assign ranks
  entries.sort((a, b) => b.xp - a.xp);
  const total = entries.length;

  return entries.map((e, i) => {
    const rank = i + 1;
    const topPct = Math.round((rank / total) * 100);
    // Show exact rank for top 50%, else show percentile
    const showRank = rank <= Math.ceil(total / 2);
    return { ...e, rank, showRank, topPct };
  });
}

// ── Peer Activity Feed ────────────────────────────────────────────────────────

export interface PeerActivity {
  codename: string;
  event_type: 'challenge_completed' | 'set_completed';
  title: string;
  created_at: string;
}

export async function postPeerActivity(
  classId: string,
  codename: string,
  eventType: 'challenge_completed' | 'set_completed',
  title: string,
): Promise<void> {
  await supabase.from('peer_activity_feed').insert({
    class_id: classId,
    codename,
    event_type: eventType,
    title,
  });
}

export async function getRecentPeerActivity(
  classId: string,
  limit = 12,
): Promise<PeerActivity[]> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from('peer_activity_feed')
    .select('codename, event_type, title, created_at')
    .eq('class_id', classId)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as PeerActivity[];
}

// ── AI Interaction Logging ────────────────────────────────────────────────────

export async function logAIInteraction(params: {
  question: string;
  response: string;
  language: 'EN' | 'KIN';
  sessionId?: string | null;
  challengeId?: string | null;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('ai_interactions').insert({
    student_id:   user.id,
    session_id:   params.sessionId   ?? null,
    challenge_id: params.challengeId ?? null,
    question:     params.question,
    response:     params.response,
    language:     params.language,
  });
}

// ── Pilot survey / ratings ────────────────────────────────────────────────────

export async function submitRating(params: {
  contentType: 'lesson' | 'challenge';
  contentId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  mwarimuHelped: boolean | null;
  usedMwarimu: boolean;
  language: 'EN' | 'KIN';
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  // Errors are swallowed — a failed rating must never block the student
  try {
    await supabase.from('ratings').insert({
      student_id:     user.id,
      content_type:   params.contentType,
      content_id:     params.contentId,
      difficulty:     params.difficulty,
      mwarimu_helped: params.usedMwarimu ? params.mwarimuHelped : null,
      used_mwarimu:   params.usedMwarimu,
      language:       params.language,
    });
  } catch { /* rating failure must never block the student */ }
}

export async function getMwarimuWeekCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('ai_interactions')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .gte('created_at', weekAgo);

  return count ?? 0;
}
