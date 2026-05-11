import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Code2, HelpCircle, CheckCircle, Clock, ChevronRight, Zap } from 'lucide-react';
import {
  getCourses, getCourseDetail, getCompletedLessonIds,
  type Course, type CourseModule, type CourseLesson,
} from '../lib/db';

interface Props {
  language: 'EN' | 'KIN';
  onBack: () => void;
  onOpenLesson: (lesson: CourseLesson, courseTitle: string, allLessons: CourseLesson[]) => void;
}

const LESSON_TYPE = {
  reading: { icon: <BookOpen size={13} />, label: 'Reading',  bg: 'rgba(14,165,233,0.1)',  text: '#0ea5e9', border: 'rgba(14,165,233,0.2)' },
  coding:  { icon: <Code2 size={13} />,    label: 'Coding',   bg: 'rgba(0,212,170,0.1)',   text: '#00d4aa', border: 'rgba(0,212,170,0.2)' },
  quiz:    { icon: <HelpCircle size={13} />,label: 'Quiz',    bg: 'rgba(139,92,246,0.1)',  text: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
};

const DIFF_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  beginner:     { bg: 'rgba(0,212,170,0.1)',  text: '#00d4aa', border: 'rgba(0,212,170,0.2)' },
  intermediate: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  advanced:     { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
};

// ─── Course Catalog ───────────────────────────────────────────────────────────

function CourseCatalog({ courses, language, onSelect }: {
  courses: Course[];
  language: 'EN' | 'KIN';
  onSelect: (c: Course) => void;
}) {
  const isKin = language === 'KIN';

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>
        {isKin ? 'Amasomo' : 'Courses'}
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
        {isKin
          ? 'Amasomo wigenga — iga ku muvuduko wawe, nta shuri ukeneye.'
          : 'Self-paced courses — learn at your own speed, no class needed.'}
      </p>

      {courses.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm" style={{ color: 'var(--ec-text-6)' }}>No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => {
            const diff = DIFF_STYLE[c.difficulty] ?? DIFF_STYLE.beginner;
            const title = isKin && c.title_kin ? c.title_kin : c.title;
            const desc  = isKin && c.description_kin ? c.description_kin : c.description;
            return (
              <div
                key={c.id}
                onClick={() => onSelect(c)}
                className="rounded-2xl p-6 cursor-pointer transition-all"
                style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(0,212,170,0.2)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 24px rgba(0,212,170,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--ec-b1)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.15)' }}>
                  <Code2 size={26} style={{ color: '#00d4aa' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>{title}</h3>
                <p className="text-base mb-4" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {desc}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full text-sm font-semibold"
                    style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
                    {c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
                    <Clock size={13} /> {c.estimated_hours}h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
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

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-base mb-6 transition-all"
        style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--ec-text-4)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--ec-text-6)')}>
        <ArrowLeft size={18} /> {isKin ? 'Garuka ku Masomo' : 'Back to Courses'}
      </button>

      {/* Course header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>{courseTitle}</h2>
        <p className="text-base mb-4" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
          {isKin && course.description_kin ? course.description_kin : course.description}
        </p>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-base font-semibold" style={{ color: '#00d4aa', fontFamily: 'Inter, sans-serif' }}>
            {completedCount}/{totalLessons} {isKin ? 'amasomo' : 'lessons'}
          </span>
          <span className="text-base" style={{ color: 'var(--ec-text-6)' }}>{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--ec-b1)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #00d4aa, #8b5cf6)' }} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#00d4aa', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((mod, mi) => {
            const modTitle = isKin && mod.title_kin ? mod.title_kin : mod.title;
            const modDone = mod.lessons.length > 0 && mod.lessons.every(l => completedIds.has(l.id));
            return (
              <div key={mod.id} className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
                {/* Module header */}
                <div className="px-5 py-4 flex items-center gap-3"
                  style={{ borderBottom: '1px solid var(--ec-b3)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ background: modDone ? 'rgba(0,212,170,0.15)' : 'var(--ec-b5)',
                      color: modDone ? '#00d4aa' : 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
                    {mi + 1}
                  </div>
                  <h3 className="flex-1 text-base font-semibold" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>
                    {modTitle}
                  </h3>
                  {modDone && <CheckCircle size={16} style={{ color: '#00d4aa' }} />}
                </div>
                {/* Lessons */}
                <div>
                  {mod.lessons.map((lesson, li) => {
                    const lessonTitle = isKin && lesson.title_kin ? lesson.title_kin : lesson.title;
                    const done = completedIds.has(lesson.id);
                    const lt = LESSON_TYPE[lesson.lesson_type];
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onOpenLesson(lesson, allLessons)}
                        className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-all"
                        style={{ borderTop: li > 0 ? '1px solid var(--ec-b3)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                      >
                        <div className="w-5 flex-shrink-0">
                          {done
                            ? <CheckCircle size={16} style={{ color: '#00d4aa' }} />
                            : <div className="w-4 h-4 rounded-full border" style={{ borderColor: 'var(--ec-b7)' }} />
                          }
                        </div>
                        <span className="flex-1 text-base" style={{ color: done ? 'var(--ec-text-5)' : 'var(--ec-text-3)', fontFamily: 'Inter, sans-serif' }}>
                          {lessonTitle}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm"
                            style={{ background: lt.bg, color: lt.text, border: `1px solid ${lt.border}` }}>
                            {lt.icon} {lt.label}
                          </span>
                          <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--ec-text-6)' }}>
                            <Zap size={12} style={{ color: '#f59e0b' }} />{lesson.xp_reward}
                          </span>
                          <ChevronRight size={16} style={{ color: 'var(--ec-text-7)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function CoursesPage({ language, onBack, onOpenLesson }: Props) {
  const isKin = language === 'KIN';
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses().then(data => { setCourses(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--ec-bg)', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div className="border-b px-6 py-4 flex items-center gap-3"
        style={{ background: 'var(--ec-surface)', borderColor: 'var(--ec-b1)' }}>
        <button onClick={onBack} className="flex items-center gap-2 text-base transition-all"
          style={{ color: 'var(--ec-text-6)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ec-text-4)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ec-text-6)')}>
          <ArrowLeft size={18} /> {isKin ? 'Dashboard' : 'Dashboard'}
        </button>
        <span style={{ color: 'var(--ec-b2)' }}>|</span>
        <span className="flex items-center gap-2 text-base font-semibold" style={{ color: 'var(--ec-text-1)' }}>
          <BookOpen size={16} style={{ color: '#00d4aa' }} />
          {isKin ? 'Amasomo' : 'Courses'}
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#00d4aa', borderTopColor: 'transparent' }} />
          </div>
        ) : selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            language={language}
            onBack={() => setSelectedCourse(null)}
            onOpenLesson={(lesson, allLessons) => onOpenLesson(lesson, selectedCourse.title, allLessons)}
          />
        ) : (
          <CourseCatalog courses={courses} language={language} onSelect={setSelectedCourse} />
        )}
      </div>
    </div>
  );
}
