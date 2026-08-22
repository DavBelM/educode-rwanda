import { supabase } from './supabase';

// ── Cohort tag ────────────────────────────────────────────────────────────────
// Fallback used only when no class is present (self-learner sessions).
// For class students the cohort_tag is read from classes.cohort_tag at emit time.
export const COHORT_TAG = 'intango_t1_2026';

// ── Types ─────────────────────────────────────────────────────────────────────

export type LearningEventType =
  | 'login'
  | 'lesson_start' | 'lesson_complete'
  | 'exercise_attempt'
  | 'challenge_attempt'
  | 'assessment_submit'
  | 'submission_graded'
  | 'ai_question_asked'
  | 'session_start' | 'session_end';

export type EntityType = 'lesson' | 'exercise' | 'challenge' | 'assessment' | 'ai_chat' | 'session';
export type Outcome    = 'start' | 'complete' | 'pass' | 'fail' | 'submit';

export interface EmitParams {
  event_type:      LearningEventType;
  entity_type?:    EntityType;
  entity_id?:      string;
  outcome?:        Outcome;
  attempt_number?: number;
  score?:          number;
  language_mode?:  'en' | 'kin';
  class_id?:       string | null;
  school_id?:      string | null;
  metadata?:       Record<string, unknown>;
}

// ── Session caches (reset on page reload, which is fine) ──────────────────────

let _cachedSchoolId: string | null | undefined = undefined;
const _competencyCache = new Map<string, string | null>();
const _cohortTagCache  = new Map<string, string | null>(); // class_id → cohort_tag

async function resolveSchoolId(userId: string): Promise<string | null> {
  if (_cachedSchoolId !== undefined) return _cachedSchoolId;
  const { data } = await supabase
    .from('profiles')
    .select('school_id')
    .eq('id', userId)
    .single();
  _cachedSchoolId = data?.school_id ?? null;
  return _cachedSchoolId;
}

async function resolveCohortTag(classId: string): Promise<string | null> {
  if (_cohortTagCache.has(classId)) return _cohortTagCache.get(classId)!;
  const { data } = await supabase.from('classes').select('cohort_tag').eq('id', classId).single();
  const tag = (data?.cohort_tag as string | null) ?? null;
  _cohortTagCache.set(classId, tag);
  return tag;
}

async function resolveCompetencyCode(lessonId: string): Promise<string | null> {
  if (_competencyCache.has(lessonId)) return _competencyCache.get(lessonId)!;
  const { data } = await supabase
    .from('course_lessons')
    .select('course_modules(competency_code)')
    .eq('id', lessonId)
    .single();
  const mod = data?.course_modules as { competency_code: string | null } | null;
  const code = mod?.competency_code ?? null;
  _competencyCache.set(lessonId, code);
  return code;
}

// ── Main emitter ──────────────────────────────────────────────────────────────
// Fire-and-forget: never throws, never blocks a student action.

export function emitEvent(params: EmitParams): void {
  _emit(params).catch(() => {});
}

async function _emit(params: EmitParams): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const school_id = params.school_id !== undefined
    ? params.school_id
    : await resolveSchoolId(user.id);

  // Resolve cohort_tag from the class when available; fall back to the constant
  // for self-learner sessions that have no class_id.
  const cohort_tag = params.class_id
    ? (await resolveCohortTag(params.class_id)) ?? COHORT_TAG
    : COHORT_TAG;

  let competency_code: string | null = null;
  if (params.entity_type === 'lesson' && params.entity_id) {
    competency_code = await resolveCompetencyCode(params.entity_id);
  }

  await supabase.from('learning_events').insert({
    student_id:      user.id,
    class_id:        params.class_id  ?? null,
    school_id,
    cohort_tag,
    event_type:      params.event_type,
    entity_type:     params.entity_type    ?? null,
    entity_id:       params.entity_id      ?? null,
    competency_code,
    outcome:         params.outcome         ?? null,
    attempt_number:  params.attempt_number  ?? null,
    score:           params.score           ?? null,
    language_mode:   params.language_mode   ?? 'en',
    metadata:        params.metadata        ?? {},
  });
}
