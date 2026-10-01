import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, ChevronRight, BookOpen, PlayCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getQuizSets, getStudentSetProgress, getStudentSetPassedCounts, type QuizSet } from '../lib/quiz-db';
import { getStudentClasses } from '../lib/db';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
}

const LEVEL_COLORS: Record<number, string> = {
  3: '#cda86a', 4: '#c084fc', 5: '#f87171',
};

const MODULE_NAMES: Record<string, { en: string; kin: string }> = {
  SWDPR301: { en: 'Project Requirement Analysis',    kin: 'Isesengura ry\'Ibisabwa by\'Umushinga' },
  SWDVF301: { en: 'Vue JS Framework',                kin: 'Framework ya Vue JS' },
  GENGD301: { en: 'Basic Graphic Design',            kin: 'Ishusho Nyamukuru' },
  GENBN401: { en: 'Basics of Networking',            kin: 'Ibingingo by\'Itumanahane' },
  SWDBD401: { en: 'Backend Application Development', kin: 'Guteza Imbere Seriveri' },
  SWDBS401: { en: 'Backend System Design',           kin: 'Igenamigambi rya Seriveri' },
  SWDDA401: { en: 'Data Structures & Algorithms',    kin: 'Imiterere y\'Amakuru na Algoriti' },
  SWDPP401: { en: 'PHP Programming',                 kin: 'Porogaramu ya PHP' },
  SWDWS401: { en: 'Windows Server Administration',   kin: 'Imiyoborere ya Windows Server' },
  GENPP501: { en: 'Python Programming',              kin: 'Porogaramu ya Python' },
  SWDFB501: { en: 'Blockchain Application',          kin: 'Gukoresha Blockchain' },
  SWDDT501: { en: 'DevOps Techniques',               kin: 'Ubuhanga bwa DevOps' },
  SWDFA501: { en: 'Frontend with React.js',          kin: 'Imbonezamubano na React.js' },
  SWDMA501: { en: 'Mobile App Development',          kin: 'Gukora Porogaramu za Telefone' },
  NITML501: { en: 'Machine Learning',                kin: 'Kwiga kwa Mashini' },
  SWDND501: { en: 'NoSQL Database Development',      kin: 'Gukora Bazeyi ya NoSQL' },
  GENQA501: { en: 'Quality Assurance',               kin: 'Imikoreshereze y\'Ubuzimagatozi' },
  __js__:   { en: 'JavaScript Fundamentals',         kin: 'Ibingingo bya JavaScript' },
};

// Parse module code from set title: "SWDVF301: Topic" → "SWDVF301"
function getModuleCode(title: string): string {
  const match = title.match(/^([A-Z]{2,8}\d{3,4}):/);
  return match ? match[1] : '__js__';
}

// Parse numeric level from class level string: "Level 3", "L3", "3" → 3
function parseClassLevel(level: string | null): number | null {
  if (!level) return null;
  const match = level.match(/\d+/);
  return match ? Number(match[0]) : null;
}

interface CourseGroup {
  code: string;
  sets: QuizSet[];
  totalSets: number;
  completedSets: number;
  inProgressSets: number;
  level: number;
}

export default function ChallengePage({ language }: Props) {
  usePageTitle('Challenge Mode · EduCode');
  const navigate = useNavigate();
  const isKin = language === 'KIN';

  const [sets, setSets] = useState<QuizSet[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [passedCounts, setPassedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<number>(3);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getQuizSets(),
      getStudentSetProgress(),
      getStudentSetPassedCounts(),
      getStudentClasses(),
    ]).then(([s, p, counts, classResult]) => {
      setSets(s);
      setCompleted(p);
      setPassedCounts(counts);

      // Default level filter to student's enrolled class level
      const firstClass = classResult.data?.[0];
      const detected = parseClassLevel(firstClass?.level ?? null);
      if (detected && s.some(set => set.rqf_level === detected)) {
        setLevelFilter(detected);
      } else {
        // Fall back to lowest level present in data
        const levels = [...new Set(s.map(x => x.rqf_level))].sort();
        if (levels.length > 0) setLevelFilter(levels[0]);
      }

      setLoading(false);
    });
  }, []);

  // Unlock: sequential within each level by order_index
  const isUnlocked = (set: QuizSet) => {
    const sameLevelSets = sets
      .filter(s => s.rqf_level === set.rqf_level)
      .sort((a, b) => a.order_index - b.order_index);
    const myIdx = sameLevelSets.findIndex(s => s.id === set.id);
    if (myIdx <= 0) return true;
    return !!completed[sameLevelSets[myIdx - 1].id];
  };

  const availableLevels = [...new Set(sets.map(s => s.rqf_level))].sort();
  const levelSets = sets.filter(s => s.rqf_level === levelFilter);

  // Group into course cards
  const courseMap = levelSets.reduce<Record<string, QuizSet[]>>((acc, s) => {
    const code = getModuleCode(s.title);
    (acc[code] ??= []).push(s);
    return acc;
  }, {});

  const courses: CourseGroup[] = Object.entries(courseMap).map(([code, courseSets]) => ({
    code,
    sets: courseSets.sort((a, b) => a.order_index - b.order_index),
    totalSets: courseSets.length,
    completedSets: courseSets.filter(s => completed[s.id]).length,
    inProgressSets: courseSets.filter(s => !completed[s.id] && (passedCounts[s.id] ?? 0) > 0).length,
    level: levelFilter,
  }));

  const color = LEVEL_COLORS[levelFilter] ?? 'var(--text-2)';

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <AppNav />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ width: 32, height: 32, border: '2px solid var(--line-strong)', borderTopColor: 'var(--text-2)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  // ── DRILL-DOWN: sets within a course ──────────────────────────────────────────
  if (selectedCourse) {
    const course = courses.find(c => c.code === selectedCourse);
    const name = MODULE_NAMES[selectedCourse];
    if (!course) { setSelectedCourse(null); return null; }

    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <AppNav />
        <div className="wrap page">

          {/* Back + course header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button
              className="iconbtn"
              onClick={() => setSelectedCourse(null)}
              aria-label="Back to courses"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                  padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase',
                  background: `${color}18`, color, border: `1px solid ${color}40`,
                }}>{selectedCourse === '__js__' ? 'L3' : selectedCourse}</span>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                  {isKin ? (name?.kin ?? selectedCourse) : (name?.en ?? selectedCourse)}
                </h1>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>
                {course.completedSets}/{course.totalSets} {isKin ? 'byarangiye' : 'sets completed'}
              </p>
            </div>
          </div>

          {/* Sets list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {course.sets.map(set => {
              const unlocked = isUnlocked(set);
              const done = !!completed[set.id];
              const passed = passedCounts[set.id] ?? 0;
              const inProgress = !done && passed > 0 && unlocked;

              return (
                <div
                  key={set.id}
                  className="card pad-lg"
                  style={{
                    opacity: unlocked ? 1 : 0.45,
                    cursor: unlocked ? 'pointer' : 'default',
                    borderLeft: done ? `3px solid ${color}` : undefined,
                    transition: 'opacity 0.15s',
                  }}
                  onClick={() => unlocked && navigate(`/challenges/${set.id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: done ? `${color}15` : 'var(--surface-2)',
                      border: `1px solid ${done ? `${color}50` : 'var(--line)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 700,
                      color: done ? color : 'var(--text-2)',
                    }}>
                      {done
                        ? <CheckCircle2 size={18} style={{ color }} />
                        : String(set.order_index).padStart(2, '0')}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                          {isKin && set.title_kin
                            ? set.title_kin
                            : set.title.replace(/^[A-Z]{2,8}\d{3,4}:\s*/, '')}
                        </h3>
                        {done && (
                          <span className="pill" style={{ fontSize: 11 }}>
                            ✓ {isKin ? 'Byarangiye' : 'Done'}
                          </span>
                        )}
                        {inProgress && (
                          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
                            {passed} {isKin ? 'byarangiye' : 'passed'}
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.5, marginBottom: 4 }}>
                        {isKin && set.description_kin ? set.description_kin : set.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{set.xp_reward} XP</span>
                        {set.video_url && (
                          <a
                            href={set.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              fontSize: 11, color: 'var(--text-3)', textDecoration: 'none',
                              padding: '2px 8px', borderRadius: 99,
                              background: 'var(--surface-2)', border: '1px solid var(--line)',
                            }}
                          >
                            <PlayCircle size={10} />
                            {isKin ? (set.video_title_kin ?? set.video_title ?? 'Vide') : (set.video_title ?? 'Watch intro')}
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ color: 'var(--text-3)', flexShrink: 0 }}>
                      {unlocked ? <ChevronRight size={18} /> : <Lock size={16} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── COURSE CARDS VIEW ─────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <AppNav />
      <div className="wrap page">

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', marginBottom: 6 }}>
            {isKin ? 'Imikino yo Gukora' : 'Challenge Mode'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 15 }}>
            {isKin
              ? 'Hitamo isomo ry\'amasomo maze utangire imikino.'
              : 'Pick a course and tackle its challenges one set at a time.'}
          </p>
        </div>

        {/* Level tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {availableLevels.map(lvl => {
            const lvlColor = LEVEL_COLORS[lvl] ?? 'var(--text-3)';
            const active = levelFilter === lvl;
            return (
              <button
                key={lvl}
                onClick={() => { setLevelFilter(lvl); setSelectedCourse(null); }}
                style={{
                  padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: `1.5px solid ${active ? lvlColor : 'var(--line)'}`,
                  background: active ? `${lvlColor}20` : 'var(--surface)',
                  color: active ? lvlColor : 'var(--text-2)',
                  transition: 'all 0.15s',
                }}
              >
                {isKin ? `Urwego ${lvl}` : `RQF Level ${lvl}`}
              </button>
            );
          })}
        </div>

        {/* Course cards grid */}
        {courses.length === 0 ? (
          <div className="card pad-lg" style={{ textAlign: 'center', padding: '40px 24px', border: '1.5px dashed var(--line)' }}>
            <p style={{ fontSize: 13.5, color: 'var(--text-3)' }}>
              {isKin ? 'Nta mwanya uhari kuri urwego rwo.' : 'No challenges available for this level yet.'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 14,
          }}>
            {courses.map(course => {
              const name = MODULE_NAMES[course.code];
              const pct = course.totalSets > 0
                ? Math.round((course.completedSets / course.totalSets) * 100)
                : 0;
              const allDone = course.completedSets === course.totalSets;

              return (
                <div
                  key={course.code}
                  className="card"
                  style={{
                    padding: '18px 20px',
                    cursor: 'pointer',
                    borderLeft: allDone ? `3px solid ${color}` : undefined,
                    transition: 'opacity 0.15s',
                  }}
                  onClick={() => setSelectedCourse(course.code)}
                >
                  {/* Module code badge + done check */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                      padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase',
                      background: `${color}18`, color, border: `1px solid ${color}35`,
                    }}>
                      {course.code === '__js__' ? 'JS FUND' : course.code}
                    </span>
                    {allDone && <CheckCircle2 size={16} style={{ color }} />}
                  </div>

                  {/* Course name */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: `${color}12`, border: `1px solid ${color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <BookOpen size={15} style={{ color }} />
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>
                      {isKin ? (name?.kin ?? course.code) : (name?.en ?? course.code)}
                    </h3>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, fontSize: 12, color: 'var(--text-3)' }}>
                    <span>{course.totalSets} {isKin ? 'imikino' : 'sets'}</span>
                    {course.inProgressSets > 0 && (
                      <span style={{ color: '#f59e0b' }}>
                        {course.inProgressSets} {isKin ? 'biragenda' : 'in progress'}
                      </span>
                    )}
                    {allDone && (
                      <span style={{ color }}>
                        {isKin ? 'Byarangiye!' : 'Complete!'}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 4, borderRadius: 99, background: 'var(--line)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${pct}%`,
                      background: allDone ? color : `${color}80`,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5, textAlign: 'right' }}>
                    {pct}%
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 32 }}>
          {isKin
            ? 'XP wabonye igaragarira ku dashboard yawe.'
            : 'XP you earn appears on your dashboard leaderboard.'}
        </p>
      </div>
    </div>
  );
}
