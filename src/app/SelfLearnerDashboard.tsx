import { useState, useEffect } from 'react';
import { Code2, BookOpen, Zap, Flame, ChevronRight, Loader, Bot, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { getSelfLearnerStats, getResumeLesson, type CourseProgress, type CourseLesson } from '../lib/db';

interface Props {
  language: 'EN' | 'KIN';
  onLanguageChange: (l: 'EN' | 'KIN') => void;
  onStartCoding: () => void;
  onOpenCourses: () => void;
  onContinueLearning: () => void;
  onOpenLesson: (lesson: CourseLesson, courseTitle: string, allLessons: CourseLesson[]) => void;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000];
const LEVEL_NAMES = ['Beginner', 'Explorer', 'Coder', 'Builder', 'Hacker', 'Engineer', 'Architect', 'Master'];

function getLevel(xp: number) {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i;
    else break;
  }
  const next = LEVEL_THRESHOLDS[level + 1] ?? LEVEL_THRESHOLDS[level];
  const prev = LEVEL_THRESHOLDS[level];
  const pct = next > prev ? Math.round(((xp - prev) / (next - prev)) * 100) : 100;
  return { level: level + 1, name: LEVEL_NAMES[level], xpToNext: next - xp, pct };
}

function DifficultyBadge({ difficulty, isKin }: { difficulty: string; isKin: boolean }) {
  const map: Record<string, { label: string; labelKin: string; color: string; bg: string }> = {
    beginner:     { label: 'Beginner',     labelKin: 'Intangiriro', color: '#00d4aa', bg: 'rgba(0,212,170,0.1)' },
    intermediate: { label: 'Intermediate', labelKin: 'Hagati',      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    advanced:     { label: 'Advanced',     labelKin: 'Inzobere',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  };
  const d = map[difficulty] ?? map.beginner;
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: d.bg, color: d.color }}>
      {isKin ? d.labelKin : d.label}
    </span>
  );
}

export default function SelfLearnerDashboard({ language, onLanguageChange, onStartCoding, onOpenCourses, onContinueLearning, onOpenLesson }: Props) {
  const { profile } = useAuth();
  const isKin = language === 'KIN';
  const firstName = (profile?.full_name ?? '').split(' ')[0] || 'Learner';

  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [resumeLoading, setResumeLoading] = useState(false);

  const xp = profile?.xp_points ?? 0;
  const lvl = getLevel(xp);

  useEffect(() => {
    getSelfLearnerStats().then(s => {
      setStreak(s.streak);
      setCourseProgress(s.courseProgress);
      setTotalCompleted(s.totalCompleted);
      setTotalLessons(s.totalLessons);
      setLoading(false);
    });
  }, []);

  const handleContinue = async () => {
    setResumeLoading(true);
    const resume = await getResumeLesson();
    setResumeLoading(false);
    if (resume) onOpenLesson(resume.lesson, resume.courseTitle, resume.allLessons);
    else onOpenCourses();
  };

  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const inProgress = courseProgress.filter(c => c.pct > 0 && c.pct < 100);
  const notStarted  = courseProgress.filter(c => c.pct === 0);
  const completed   = courseProgress.filter(c => c.pct === 100 && c.total_lessons > 0);

  return (
    <div className="min-h-screen" style={{ background: '#0d0f14', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#13161e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇷🇼</span>
            <span className="text-base font-bold" style={{ color: '#f1f5f9' }}>EduCode Rwanda</span>
          </div>
          <div className="flex items-center gap-3">
            {/* XP + Level */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <Star size={13} style={{ color: '#8b5cf6' }} />
              <span className="text-xs font-bold" style={{ color: '#8b5cf6' }}>
                {isKin ? `Urwego ${lvl.level}` : `Level ${lvl.level}`} · {xp} XP
              </span>
            </div>
            {/* Streak */}
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <Flame size={13} style={{ color: '#f59e0b' }} />
                <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>{streak}</span>
              </div>
            )}
            {/* Language toggle */}
            <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {(['EN', 'KIN'] as const).map(l => (
                <button key={l} onClick={() => onLanguageChange(l)}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
                  style={{ background: language === l ? 'rgba(0,212,170,0.15)' : 'transparent', color: language === l ? '#00d4aa' : '#475569' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Welcome + Level bar */}
        <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>
                {isKin ? `Murakaza neza, ${firstName}! 👋` : `Welcome back, ${firstName}! 👋`}
              </h1>
              <p className="text-sm" style={{ color: '#64748b' }}>
                {isKin ? 'Komeza kwiga. Buri isomo riyongera ubuhanga bwawe.' : 'Keep learning. Every lesson adds to your skills.'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold mb-1" style={{ color: '#475569' }}>
                {isKin ? `Urwego ${lvl.level} — ${lvl.name}` : `Level ${lvl.level} — ${lvl.name}`}
              </p>
              <p className="text-xs" style={{ color: '#334155' }}>
                {lvl.xpToNext > 0
                  ? (isKin ? `${lvl.xpToNext} XP kugera urwego urukurikira` : `${lvl.xpToNext} XP to next level`)
                  : (isKin ? 'Urwego rwa nyuma!' : 'Max level!')}
              </p>
              <div className="w-40 h-1.5 rounded-full mt-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${lvl.pct}%`, background: 'linear-gradient(90deg,#00d4aa,#8b5cf6)' }} />
              </div>
            </div>
          </div>

          {/* Overall progress */}
          {!loading && totalLessons > 0 && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex justify-between text-xs mb-2" style={{ color: '#475569' }}>
                <span>{isKin ? 'Iterambere ryawe hose' : 'Overall progress'}</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{totalCompleted} / {totalLessons} {isKin ? 'amasomo' : 'lessons'} ({overallPct}%)</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg,#00d4aa,#8b5cf6)' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: <Zap size={20} style={{ color: '#00d4aa' }} />,
              bg: 'rgba(0,212,170,0.08)',
              border: 'rgba(0,212,170,0.2)',
              title: isKin ? 'Komeza Kwiga' : 'Continue Learning',
              sub: isKin ? 'Subira aho wahagaritsemo' : 'Pick up where you left off',
              onClick: handleContinue,
              loading: resumeLoading,
              primary: true,
            },
            {
              icon: <Code2 size={20} style={{ color: '#8b5cf6' }} />,
              bg: 'rgba(139,92,246,0.08)',
              border: 'rgba(139,92,246,0.2)',
              title: isKin ? 'Kora Code' : 'Free Coding',
              sub: isKin ? 'Fungura workspace ubure imishinga' : 'Open the editor, no assignment needed',
              onClick: onStartCoding,
              loading: false,
              primary: false,
            },
            {
              icon: <BookOpen size={20} style={{ color: '#f59e0b' }} />,
              bg: 'rgba(245,158,11,0.08)',
              border: 'rgba(245,158,11,0.2)',
              title: isKin ? 'Amasomo' : 'Browse Courses',
              sub: isKin ? 'Reba amasomo yose' : 'See all available courses',
              onClick: onOpenCourses,
              loading: false,
              primary: false,
            },
          ].map(a => (
            <button
              key={a.title}
              onClick={a.onClick}
              disabled={a.loading}
              className="rounded-2xl p-4 text-left transition-all flex flex-col gap-3"
              style={{ background: a.bg, border: `1px solid ${a.border}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
              <div className="flex items-center justify-between">
                {a.loading ? <Loader size={20} className="animate-spin" style={{ color: '#00d4aa' }} /> : a.icon}
                {a.primary && <ArrowRight size={14} style={{ color: '#00d4aa' }} />}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#f1f5f9' }}>{a.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{a.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* AI Tutor banner */}
        <div className="rounded-2xl p-5 flex items-center justify-between gap-4"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.18)' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(139,92,246,0.15)' }}>
              <Bot size={20} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#f1f5f9' }}>
                {isKin ? 'Mwarimu wa AI' : 'Your AI Tutor'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                {isKin
                  ? 'Iyo ukoze code, AI ikwereka amakosa no kusobanura. Fungura workspace uyigerageze.'
                  : 'When you write code, the AI explains your errors and guides you. Open the workspace to try it.'}
              </p>
            </div>
          </div>
          <button
            onClick={onStartCoding}
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.25)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.25)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.15)'; }}>
            {isKin ? 'Gerageza →' : 'Try it →'}
          </button>
        </div>

        {/* Course progress */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size={22} className="animate-spin" style={{ color: '#00d4aa' }} />
          </div>
        ) : courseProgress.length === 0 ? (
          <div className="text-center py-12 rounded-2xl" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <BookOpen size={32} style={{ color: '#1e293b', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: '#475569' }}>
              {isKin ? 'Nta masomo arahari.' : 'No courses available yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* In progress */}
            {inProgress.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#475569' }}>
                  {isKin ? 'Ugifite mu nzira' : 'In Progress'}
                </h2>
                <div className="space-y-2">
                  {inProgress.map(c => <CourseCard key={c.course_id} course={c} isKin={isKin} onOpen={onOpenCourses} />)}
                </div>
              </section>
            )}

            {/* Not started */}
            {notStarted.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#475569' }}>
                  {isKin ? 'Utanabona' : 'Not Started'}
                </h2>
                <div className="space-y-2">
                  {notStarted.map(c => <CourseCard key={c.course_id} course={c} isKin={isKin} onOpen={onOpenCourses} />)}
                </div>
              </section>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#475569' }}>
                  {isKin ? 'Warangije' : 'Completed'}
                </h2>
                <div className="space-y-2">
                  {completed.map(c => <CourseCard key={c.course_id} course={c} isKin={isKin} onOpen={onOpenCourses} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function CourseCard({ course, isKin, onOpen }: { course: CourseProgress; isKin: boolean; onOpen: () => void }) {
  const barColor = course.pct === 100 ? '#00d4aa' : course.pct > 0 ? '#8b5cf6' : 'rgba(255,255,255,0.1)';
  return (
    <button
      onClick={onOpen}
      className="w-full rounded-2xl p-4 text-left transition-all flex items-center gap-4"
      style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}>
      {/* Completion ring */}
      <div className="relative w-11 h-11 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15" fill="none" stroke={course.pct === 100 ? '#00d4aa' : '#8b5cf6'}
            strokeWidth="3" strokeDasharray={`${(course.pct / 100) * 94.2} 94.2`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: course.pct === 100 ? '#00d4aa' : '#8b5cf6' }}>
          {course.pct === 100 ? '✓' : `${course.pct}%`}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold truncate" style={{ color: '#f1f5f9' }}>
            {isKin && course.title_kin ? course.title_kin : course.title}
          </p>
          <DifficultyBadge difficulty={course.difficulty} isKin={isKin} />
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${course.pct}%`, background: barColor }} />
        </div>
        <p className="text-xs mt-1" style={{ color: '#475569' }}>
          {course.completed_lessons} / {course.total_lessons} {isKin ? 'amasomo' : 'lessons'}
        </p>
      </div>

      <ChevronRight size={16} style={{ color: '#334155', flexShrink: 0 }} />
    </button>
  );
}
