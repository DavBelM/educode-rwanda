import { useState, useEffect } from 'react';
import { Code2, BookOpen, Zap, ChevronRight, Loader, Bot, ArrowRight, Trophy } from 'lucide-react';
import { AppNav } from './components/AppNav';
import { useAuth } from '../lib/auth';
import { getSelfLearnerStats, getResumeLesson, type CourseProgress, type CourseLesson } from '../lib/db';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
  onLanguageChange: (l: 'EN' | 'KIN') => void;
  onStartCoding: () => void;
  onOpenCourses: () => void;
  onContinueLearning: () => void;
  onOpenChallenges: () => void;
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

export default function SelfLearnerDashboard({ language, onStartCoding, onOpenCourses, onContinueLearning, onOpenChallenges, onOpenLesson }: Props) {
  usePageTitle('Dashboard · EduCode');
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

  const quickActions = [
    {
      icon: <Zap size={18} />,
      title: isKin ? 'Komeza Kwiga' : 'Continue Learning',
      sub: isKin ? 'Komeza aho wari ugeze' : 'Pick up where you left off',
      onClick: handleContinue,
      loading: resumeLoading,
      primary: true,
    },
    {
      icon: <Code2 size={18} />,
      title: isKin ? 'Kwandika Code Wishyuye' : 'Free Coding',
      sub: isKin ? 'Fungura editor, nta mukoro ukenewe.' : 'Open the editor, no assignment needed',
      onClick: onStartCoding,
      loading: false,
      primary: false,
    },
    {
      icon: <BookOpen size={18} />,
      title: isKin ? 'Reba Amasomo' : 'Browse Courses',
      sub: isKin ? 'Reba amasomo yose ahari' : 'See all available courses',
      onClick: onOpenCourses,
      loading: false,
      primary: false,
    },
    {
      icon: <Trophy size={18} />,
      title: isKin ? 'Imikino yo Gukora' : 'Challenges',
      sub: isKin ? 'Gukora challenge, ibe uronka XP' : 'Solve challenges, earn XP',
      onClick: onOpenChallenges,
      loading: false,
      primary: false,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppNav streak={streak} />

      <main className="wrap page">
        {/* Welcome header */}
        <div className="welcome rise">
          <div>
            <h1>
              {isKin ? `Ikaze nanone, ${firstName}! 👋` : `Welcome back, ${firstName}! 👋`}
            </h1>
            <p className="sub">
              {isKin ? 'Komeza wigire. Buri somo rishya ryongera ubumenyi bwawe.' : 'Keep learning. Every lesson adds to your skills.'}
            </p>
          </div>
          <button className="btn btn-primary" onClick={onContinueLearning}>
            {isKin ? 'Komeza isomo' : 'Continue lesson'}
          </button>
        </div>

        <div className="dash">
          {/* LEFT column */}
          <div className="stack" style={{ ['--gap' as string]: '22px' }}>

            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rise-2">
              {quickActions.map(a => (
                <button
                  key={a.title}
                  onClick={a.onClick}
                  disabled={a.loading}
                  className="card pad-lg card-link text-left"
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div className="flex items-center justify-between" style={{ color: 'var(--text)' }}>
                    {a.loading ? <Loader size={18} className="animate-spin" /> : a.icon}
                    {a.primary && <ArrowRight size={14} style={{ color: 'var(--text-3)' }} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{a.title}</p>
                    <p className="text-xs mt-0.5 dim">{a.sub}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Course progress */}
            {loading ? (
              <div className="card pad-lg flex justify-center py-12 rise-2">
                <Loader size={22} className="animate-spin" style={{ color: 'var(--text-2)' }} />
              </div>
            ) : courseProgress.length === 0 ? (
              <div className="card pad-lg text-center py-12 rise-2">
                <BookOpen size={32} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
                <p className="text-sm dim">
                  {isKin ? 'Nta masomo arahari ubu.' : 'No courses available yet.'}
                </p>
              </div>
            ) : (
              <div className="stack" style={{ ['--gap' as string]: '22px' }}>
                {/* In progress */}
                {inProgress.length > 0 && (
                  <section className="card pad-lg lessons rise-2">
                    <div className="card-head">
                      <h3 className="card-title">{isKin ? 'Biracyakorwa' : 'In Progress'}</h3>
                    </div>
                    {inProgress.map(c => <CourseRow key={c.course_id} course={c} isKin={isKin} onOpen={onOpenCourses} />)}
                  </section>
                )}

                {/* Not started */}
                {notStarted.length > 0 && (
                  <section className="card pad-lg lessons rise-3">
                    <div className="card-head">
                      <h3 className="card-title">{isKin ? 'Ntibiratangira' : 'Not Started'}</h3>
                    </div>
                    {notStarted.map(c => <CourseRow key={c.course_id} course={c} isKin={isKin} onOpen={onOpenCourses} />)}
                  </section>
                )}

                {/* Completed */}
                {completed.length > 0 && (
                  <section className="card pad-lg lessons rise-4">
                    <div className="card-head">
                      <h3 className="card-title">{isKin ? 'Byarangiye' : 'Completed'}</h3>
                    </div>
                    {completed.map(c => <CourseRow key={c.course_id} course={c} isKin={isKin} onOpen={onOpenCourses} />)}
                  </section>
                )}
              </div>
            )}
          </div>

          {/* RIGHT sidebar */}
          <aside className="stack" style={{ ['--gap' as string]: '22px' }}>
            {/* XP + Level */}
            <section className="card pad-lg rise-3">
              <div className="level-row">
                <span className="lv">{isKin ? `Urwego ${lvl.level} — ${lvl.name}` : `Level ${lvl.level} — ${lvl.name}`}</span>
                <span className="xp">{xp} XP</span>
              </div>
              <div className="bar on-card">
                <i style={{ width: `${lvl.pct}%` }} />
              </div>
              <p className="dim" style={{ fontSize: 14, marginTop: 10 }}>
                {lvl.xpToNext > 0
                  ? (isKin ? `Hasigaye ${lvl.xpToNext} XP ngo ugere ku rwego rukurikira` : `${lvl.xpToNext} XP to next level`)
                  : (isKin ? 'Wageze ku rwego rwa nyuma!' : 'Max level!')}
              </p>

              {!loading && totalLessons > 0 && (
                <>
                  <div className="flex justify-between text-xs mt-4 mb-1.5 dim">
                    <span>{isKin ? 'Iterambere muri rusange' : 'Overall progress'}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{overallPct}%</span>
                  </div>
                  <div className="bar on-card">
                    <i style={{ width: `${overallPct}%` }} />
                  </div>
                  <p className="dim" style={{ fontSize: 14, marginTop: 6 }}>
                    {totalCompleted} / {totalLessons} {isKin ? 'amasomo yarangiye' : 'lessons completed'}
                  </p>
                </>
              )}
            </section>

            {/* AI Tutor banner */}
            <section className="card pad-lg rise-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="iconbtn" style={{ pointerEvents: 'none' }}>
                  <Bot size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                    {isKin ? 'Mwarimu wawe wa AI' : 'Your AI Tutor'}
                  </p>
                  <p className="text-xs mt-0.5 dim">
                    {isKin
                      ? 'Iyo wanditse code, AI isobanura amakosa yawe ikakuyobora.'
                      : 'When you write code, the AI explains your errors and guides you.'}
                  </p>
                </div>
              </div>
              <button onClick={onStartCoding} className="btn btn-secondary btn-block">
                {isKin ? 'Igerageze →' : 'Try it →'}
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function CourseRow({ course, isKin, onOpen }: { course: CourseProgress; isKin: boolean; onOpen: () => void }) {
  return (
    <div className="lesson clickable" onClick={onOpen}>
      <div className={`lstat ${course.pct === 100 ? 'done' : course.pct > 0 ? 'cur' : 'lock'}`}>
        {course.pct === 100 ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        )}
      </div>
      <div className="lbody">
        <div className="lt">{isKin && course.title_kin ? course.title_kin : course.title}</div>
        <div className="lmeta">
          <span className="ltype">{course.difficulty}</span>
          <span>{course.completed_lessons} / {course.total_lessons} {isKin ? 'amasomo' : 'lessons'}</span>
        </div>
      </div>
      <div className="lright" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {course.pct === 100 ? '✓' : `${course.pct}%`}
        <ChevronRight size={14} />
      </div>
    </div>
  );
}
