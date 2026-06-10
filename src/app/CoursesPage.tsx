import { useState, useEffect } from 'react';
import { AppNav } from './components/AppNav';
import {
  getCourses, getCourseDetail, getCompletedLessonIds, getCourseProgressList,
  type Course, type CourseModule, type CourseLesson, type CourseProgress,
} from '../lib/db';
import { CheckCircle, Clock, BookOpen, Code2, HelpCircle, Zap } from 'lucide-react';

interface Props {
  language: 'EN' | 'KIN';
  onLanguageChange?: (l: 'EN' | 'KIN') => void;
  onBack: () => void;
  onOpenLesson: (lesson: CourseLesson, courseTitle: string, allLessons: CourseLesson[]) => void;
}

// ─── Course Catalog ───────────────────────────────────────────────────────────

type CourseStatus = 'locked' | 'not-started' | 'in-progress' | 'completed';

function CourseCatalog({ courses, progress, language, onSelect }: {
  courses: Course[];
  progress: CourseProgress[];
  language: 'EN' | 'KIN';
  onSelect: (c: Course) => void;
}) {
  const isKin = language === 'KIN';
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'not-started' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const progressById = new Map(progress.map(p => [p.course_id, p]));

  const items = courses.map((c, i) => {
    const pct = progressById.get(c.id)?.pct ?? 0;
    const totalLessons = progressById.get(c.id)?.total_lessons ?? 0;
    const prevPct = i === 0 ? 100 : (progressById.get(courses[i - 1].id)?.pct ?? 0);
    const status: CourseStatus = prevPct < 100 ? 'locked'
      : pct === 100 ? 'completed'
      : pct > 0 ? 'in-progress'
      : 'not-started';
    return { course: c, pct, totalLessons, status, prevTitle: courses[i - 1] ? (isKin && courses[i - 1].title_kin ? courses[i - 1].title_kin! : courses[i - 1].title) : null };
  });

  const filtered = items.filter(({ course: c, status }) => {
    const title = isKin && c.title_kin ? c.title_kin : c.title;
    if (search && !title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'all') return true;
    if (filter === 'not-started') return status === 'not-started' || status === 'locked';
    return status === filter;
  });

  const STATUS_LABEL: Record<CourseStatus, string> = {
    locked: isKin ? 'Birafunze' : 'Locked',
    'not-started': isKin ? 'Ntibiratangira' : 'Not started',
    'in-progress': isKin ? 'Biragenda' : 'In progress',
    completed: isKin ? 'Byarangiye' : 'Completed',
  };

  return (
    <>
      <div className="phead rise">
        <h1>{isKin ? 'Amasomo' : 'Courses'}</h1>
        <p>
          {isKin
            ? 'Inzira kuva kuri variable yawe ya mbere kugeza kuri porogaramu ikora.'
            : 'A path from your first variable to a working program. Complete a course to unlock the next.'}
        </p>
      </div>

      <div className="toolbar rise-2">
        <div className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isKin ? 'Shakisha amasomo' : 'Search courses'}
          />
        </div>
        <div className="filters">
          {(['all', 'in-progress', 'not-started', 'completed'] as const).map(f => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
              {f === 'all' ? (isKin ? 'Yose' : 'All')
                : f === 'in-progress' ? (isKin ? 'Biragenda' : 'In progress')
                : f === 'not-started' ? (isKin ? 'Bitangiye' : 'Not started')
                : (isKin ? 'Byarangiye' : 'Completed')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-3)', fontSize: 15 }}>
            {isKin ? 'Nta masomo arabonetse.' : 'No courses found.'}
          </p>
        </div>
      ) : (
        <div className="courses rise-2">
          {filtered.map(({ course: c, pct, totalLessons, status, prevTitle }, i) => {
            const title = isKin && c.title_kin ? c.title_kin : c.title;
            const desc  = isKin && c.description_kin ? c.description_kin : c.description;
            const locked = status === 'locked';
            return (
              <a
                key={c.id}
                className="card course card-link"
                onClick={() => onSelect(c)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onSelect(c)}
              >
                <div className="ctop">
                  <span className="cnum">{String(i + 1).padStart(2, '0')}</span>
                  {status === 'completed' ? (
                    <span className="pill solid"><span className="dot"></span>{STATUS_LABEL.completed}</span>
                  ) : status === 'in-progress' ? (
                    <span className="pill"><span className="dot"></span>{STATUS_LABEL['in-progress']}</span>
                  ) : (
                    <span className="pill">{STATUS_LABEL[status]}</span>
                  )}
                </div>
                <h3>{title}</h3>
                <p className="cdesc">{desc}</p>
                <div className="cmeta">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 5h16M4 12h16M4 19h10"/></svg>
                    {totalLessons} {isKin ? 'amasomo' : 'lessons'}
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2v20M2 12h20"/></svg>
                    {c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1)}
                  </span>
                </div>
                <div className="cprog">
                  {locked ? (
                    <div className="pl"><span>{prevTitle ? (isKin ? `Maze "${prevTitle}" kugirango ufungure` : `Complete "${prevTitle}" to unlock`) : STATUS_LABEL.locked}</span></div>
                  ) : status === 'not-started' ? (
                    <div className="pl"><span>{STATUS_LABEL['not-started']}</span></div>
                  ) : (
                    <div className="pl"><span>{isKin ? 'Aho ugeze' : 'Progress'}</span><span>{pct}%</span></div>
                  )}
                  <div className="bar on-card"><i style={{ width: `${locked ? 0 : pct}%` }}></i></div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Course Detail ────────────────────────────────────────────────────────────

function CourseDetail({ course, language, onBack, onOpenLesson }: {
  course: Course;
  language: 'EN' | 'KIN';
  onBack: () => void;
  onOpenLesson: (lesson: CourseLesson, allLessons: CourseLesson[]) => void;
}) {
  const isKin = language === 'KIN';
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCourseDetail(course.id), getCompletedLessonIds(course.id)]).then(
      ([{ modules: mods }, ids]) => { setModules(mods); setCompletedIds(ids); setLoading(false); }
    );
  }, [course.id]);

  const allLessons = modules.flatMap(m => m.lessons);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter(l => completedIds.has(l.id)).length;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const courseTitle = isKin && course.title_kin ? course.title_kin : course.title;
  const courseDesc  = isKin && course.description_kin ? course.description_kin : course.description;

  const LESSON_ICON: Record<string, JSX.Element> = {
    reading: <BookOpen size={13} />,
    coding:  <Code2 size={13} />,
    quiz:    <HelpCircle size={13} />,
  };

  return (
    <>
      <div className="crumb rise">
        <a onClick={onBack} style={{ cursor: 'pointer' }}>{isKin ? 'Amasomo' : 'Courses'}</a>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m9 6 6 6-6 6"/></svg>
        <span style={{ color: 'var(--text-2)' }}>{courseTitle}</span>
      </div>

      <div className="chead rise-2">
        <div>
          <p className="eyebrow">
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </p>
          <h1>{courseTitle}</h1>
          <p className="lede">{courseDesc}</p>
          <div className="chead-actions">
            <button className="btn btn-primary" onClick={() => {
              const next = allLessons.find(l => !completedIds.has(l.id));
              if (next) onOpenLesson(next, allLessons);
            }}>
              {isKin ? 'Subira aho wahagaritse' : 'Resume · Continue'}
            </button>
          </div>
          <div className="chead-meta">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 5h16M4 12h16M4 19h10"/></svg>
              {totalLessons} {isKin ? 'amasomo' : 'lessons'}
            </span>
            {course.estimated_hours && (
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                ~{course.estimated_hours}h
              </span>
            )}
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              {completedCount} {isKin ? 'byarangiye' : 'done'}
            </span>
          </div>
        </div>

        <aside className="card pad-lg sidecard">
          <div className="row between" style={{ marginBottom: 14 }}>
            <span className="card-title">{isKin ? 'Aho ugeze' : 'Your progress'}</span>
            <span className="dim mono" style={{ fontSize: 13 }}>{pct}%</span>
          </div>
          <div className="bar on-card"><i style={{ width: `${pct}%` }}></i></div>
          <div style={{ marginTop: 8 }}></div>
          <div className="scrow"><span className="k">{isKin ? 'Amasomo yarangiye' : 'Lessons completed'}</span><span className="v">{completedCount} / {totalLessons}</span></div>
          <div className="scrow"><span className="k">{isKin ? 'Ingorane' : 'Difficulty'}</span><span className="v">{course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}</span></div>
        </aside>
      </div>

      {loading ? (
        <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'center' }}>
          <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
          </svg>
        </div>
      ) : (
        <div className="modules rise-3">
          {modules.map((mod, mi) => {
            const modTitle = isKin && mod.title_kin ? mod.title_kin : mod.title;
            const modDone = mod.lessons.length > 0 && mod.lessons.every(l => completedIds.has(l.id));
            return (
              <section key={mod.id} className="module">
                <div className="mhead">
                  <div className="mt">
                    <span className="mnum">{String(mi + 1).padStart(2, '0')}</span>
                    <h3>{modTitle}</h3>
                  </div>
                  <span className="mc">
                    {mod.lessons.length} {isKin ? 'amasomo' : 'lessons'}
                    {modDone && ` · ${isKin ? 'byarangiye' : 'complete'}`}
                  </span>
                </div>
                <div className="card lessons pad-sm" style={{ padding: 0 }}>
                  {mod.lessons.map(lesson => {
                    const lessonTitle = isKin && lesson.title_kin ? lesson.title_kin : lesson.title;
                    const done = completedIds.has(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className="lesson clickable"
                        onClick={() => onOpenLesson(lesson, allLessons)}
                      >
                        <span className={`lstat ${done ? 'done' : 'cur'}`}>
                          {done ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                              <circle cx="12" cy="12" r="9"/>
                            </svg>
                          )}
                        </span>
                        <div className="lbody">
                          <div className={`lt${done ? ' dim' : ''}`}>{lessonTitle}</div>
                          <div className="lmeta">
                            <span className="ltype">{lesson.lesson_type}</span>
                            {lesson.xp_reward > 0 && (
                              <><span>·</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Zap size={11} />{lesson.xp_reward} XP</span></>
                            )}
                          </div>
                        </div>
                        <span className="lright">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16">
                            <path d="m9 6 6 6-6 6"/>
                          </svg>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function CoursesPage({ language, onBack, onOpenLesson }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCourses(), getCourseProgressList()]).then(([data, prog]) => {
      setCourses(data);
      setProgress(prog);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppNav />

      <main className="wrap page">
        {loading ? (
          <div style={{ padding: '96px 0', display: 'flex', justifyContent: 'center' }}>
            <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
              <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
            </svg>
          </div>
        ) : selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            language={language}
            onBack={() => setSelectedCourse(null)}
            onOpenLesson={(lesson, allLessons) => onOpenLesson(lesson, selectedCourse.title, allLessons)}
          />
        ) : (
          <CourseCatalog
            courses={courses}
            progress={progress}
            language={language}
            onSelect={setSelectedCourse}
          />
        )}
      </main>
    </div>
  );
}
