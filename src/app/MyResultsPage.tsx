import { useState, useEffect } from 'react';
import { BookOpen, Code2, CheckCircle, Clock, MessageSquare, TrendingUp, Bell, AlertTriangle, ChevronRight } from 'lucide-react';
import { getStudentResults, markGradesSeen, type StudentResult } from '../lib/db';
import { usePageTitle } from '../hooks/usePageTitle';
import { AppNav } from './components/AppNav';
import { useAuth } from '../lib/auth';

interface Props {
  language: 'EN' | 'KIN';
  onBack: () => void;
}

type Filter = 'all' | 'graded' | 'pending' | 'not-submitted';

function scoreColor(pct: number): string {
  if (pct >= 75) return 'var(--color-green, #22c55e)';
  if (pct >= 50) return 'var(--color-yellow, #eab308)';
  return 'var(--color-red, #ef4444)';
}

function dueDateLabel(due: string | null | undefined, submitted: boolean, isKin: boolean) {
  if (!due || submitted) return null;
  const d = new Date(due);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: isKin ? 'Igihe cyarangiye' : 'Overdue', color: '#ef4444', urgent: true };
  if (diffDays === 0) return { text: isKin ? 'Igihe ni uyu munsi' : 'Due today', color: '#f97316', urgent: true };
  if (diffDays === 1) return { text: isKin ? 'Ejo hashize' : 'Due tomorrow', color: '#eab308', urgent: false };
  return { text: isKin ? `Igihe: ${d.toLocaleDateString()}` : `Due ${d.toLocaleDateString()}`, color: 'var(--text-2)', urgent: false };
}

export default function MyResultsPage({ language }: Props) {
  usePageTitle('My Results · EduCode');
  const isKin = language === 'KIN';
  const { profile } = useAuth();
  const seenKey = `educode_seen_grades_${profile?.id ?? 'anon'}`;
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [seenGrades, setSeenGrades] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(`educode_seen_grades_${profile?.id ?? 'anon'}`);
    return new Set(saved ? JSON.parse(saved) : []);
  });
  const [returnedOpen, setReturnedOpen] = useState(true);

  useEffect(() => {
    getStudentResults().then(data => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  // Mark all graded results as seen when page opens
  useEffect(() => {
    if (results.length === 0) return;
    const gradedIds = results.filter(r => r.marks_earned !== null).map(r => r.assignment_id);
    const updated = new Set([...seenGrades, ...gradedIds]);
    setSeenGrades(updated);
    localStorage.setItem(seenKey, JSON.stringify([...updated]));
    if (profile?.id && gradedIds.length > 0) {
      markGradesSeen(gradedIds, profile.id);
    }
  }, [results]);

  const submitted = results.filter(r => r.submitted);
  const graded = results.filter(r => r.marks_earned !== null);
  const pending = submitted.filter(r => r.marks_earned === null);
  const notSubmitted = results.filter(r => !r.submitted);
  const newlyReturned = graded.filter(r => !seenGrades.has(r.assignment_id) || true).slice(0, 3); // show top 3 graded
  const totalEarned = graded.reduce((s, r) => s + (r.marks_earned ?? 0), 0);
  const totalPossible = graded.reduce((s, r) => s + r.total_marks, 0);
  const pct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : null;
  const overdue = notSubmitted.filter(r => r.due_date && new Date(r.due_date) < new Date());

  const level = (() => {
    if (pct === null) return isKin ? 'Ntamanota arahari' : 'No grades yet';
    if (pct >= 90) return isKin ? 'Icyamamare' : 'Distinction';
    if (pct >= 75) return isKin ? 'Biratsinze' : 'Pass with Merit';
    if (pct >= 50) return isKin ? 'Byarangiye' : 'Pass';
    return isKin ? 'Bikenewe gusubiramo' : 'Needs improvement';
  })();

  const filtered = results.filter(r => {
    if (filter === 'graded')        return r.marks_earned !== null;
    if (filter === 'pending')       return r.submitted && r.marks_earned === null;
    if (filter === 'not-submitted') return !r.submitted;
    return true;
  }).sort((a, b) => {
    // Overdue not-submitted first, then by due_date, then graded
    const aOver = !a.submitted && !!a.due_date && new Date(a.due_date) < new Date();
    const bOver = !b.submitted && !!b.due_date && new Date(b.due_date) < new Date();
    if (aOver && !bOver) return -1;
    if (!aOver && bOver) return 1;
    const aDate = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const bDate = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    return aDate - bDate;
  });

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all',           label: isKin ? 'Byose'              : 'All',            count: results.length },
    { key: 'graded',        label: isKin ? 'Byahawe amanota'   : 'Graded',         count: graded.length },
    { key: 'pending',       label: isKin ? 'Bitegereje'        : 'Awaiting grade', count: pending.length },
    { key: 'not-submitted', label: isKin ? 'Bitaratanzwe'      : 'Not submitted',  count: notSubmitted.length },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNav />

      <div className="wrap page stack" style={{ ['--gap' as string]: '24px' }}>

        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          {isKin ? 'Amanota Yanjye' : 'My Results'}
        </h1>

        {/* Overdue alert */}
        {overdue.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
            <AlertTriangle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p style={{ color: '#991b1b', fontSize: '14px', fontWeight: 500 }}>
              {isKin
                ? `${overdue.length} ikigo ${overdue.length > 1 ? 'cy' : 'c'}y'imirimo yatashye — tanga vuba!`
                : `${overdue.length} assignment${overdue.length > 1 ? 's are' : ' is'} overdue — submit as soon as possible.`}
            </p>
          </div>
        )}

        {/* Summary card */}
        <div className="card pad-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>{results.length}</p>
              <p className="text-sm dim">{isKin ? 'Imikoro yose' : 'Total assignments'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>{submitted.length}</p>
              <p className="text-sm dim">{isKin ? 'Byatanzwe' : 'Submitted'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1" style={{
                color: pct !== null ? scoreColor(pct) : 'var(--text)'
              }}>
                {pct !== null ? `${pct}%` : '—'}
              </p>
              <p className="text-sm dim">{isKin ? 'Ikigereranyo' : 'Average score'}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 pill solid mb-1">
                <TrendingUp size={13} />
                {level}
              </div>
              <p className="text-sm dim">{isKin ? 'Urwego' : 'Standing'}</p>
            </div>
          </div>

          {totalPossible > 0 && pct !== null && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="dim">{isKin ? 'Amanota yose hamwe' : 'Overall score'}</span>
                <span style={{ color: scoreColor(pct), fontWeight: 600 }}>{totalEarned} / {totalPossible}</span>
              </div>
              <div className="bar">
                <i style={{ width: `${pct}%`, background: scoreColor(pct) }} />
              </div>
            </div>
          )}
        </div>

        {/* Recently returned work */}
        {graded.length > 0 && (
          <div className="card">
            <button
              onClick={() => setReturnedOpen(o => !o)}
              className="flex items-center justify-between w-full px-4 py-3"
              style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text)' }}
            >
              <div className="flex items-center gap-2">
                <Bell size={15} style={{ color: 'var(--text-2)' }} />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  {isKin ? 'Imirimo yasubijwe' : 'Returned work'}
                </span>
                <span className="pill solid" style={{ fontSize: '12px', padding: '1px 8px' }}>{graded.length}</span>
              </div>
              <ChevronRight size={15} style={{ transform: returnedOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-2)' }} />
            </button>

            {returnedOpen && (
              <div style={{ borderTop: '1px solid var(--line)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {graded.slice(0, 5).map(r => {
                  const sp = r.total_marks > 0 && r.marks_earned !== null ? Math.round((r.marks_earned / r.total_marks) * 100) : null;
                  return (
                    <div key={r.assignment_id} className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: sp !== null ? `${scoreColor(sp)}22` : 'var(--surface-2)' }}>
                        <CheckCircle size={16} style={{ color: sp !== null ? scoreColor(sp) : 'var(--text-2)' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate" style={{ color: 'var(--text)', fontSize: '14px' }}>
                          {isKin && r.title_kin ? r.title_kin : r.title}
                        </p>
                        {r.teacher_feedback && (
                          <p className="truncate dim" style={{ fontSize: '12px', maxWidth: '340px' }}>
                            {r.teacher_feedback}
                          </p>
                        )}
                      </div>
                      {sp !== null && (
                        <span style={{ fontWeight: 700, color: scoreColor(sp), fontSize: '15px', flexShrink: 0 }}>{sp}%</span>
                      )}
                    </div>
                  );
                })}
                {graded.length > 5 && (
                  <button onClick={() => setFilter('graded')} style={{ fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}>
                    {isKin ? `Reba ibindi ${graded.length - 5}...` : `View ${graded.length - 5} more graded...`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`pill${filter === f.key ? ' solid' : ''}`}
              style={{ cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, gap: '8px' }}>
              {f.label}
              <span className="dot" />
              {f.count}
            </button>
          ))}
        </div>

        {/* Results list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--line-strong)', borderTopColor: 'var(--text-2)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card pad-lg text-center">
            <p className="text-sm dim">
              {isKin ? 'Nta bisubizo birahagaragara.' : 'Nothing here yet.'}
            </p>
          </div>
        ) : (
          <div className="stack" style={{ ['--gap' as string]: '12px' }}>
            {filtered.map(r => {
              const scorePct = r.marks_earned !== null && r.total_marks > 0
                ? Math.round((r.marks_earned / r.total_marks) * 100)
                : null;
              const due = dueDateLabel(r.due_date, r.submitted, isKin);
              const isOverdue = due?.urgent && !r.submitted && !!r.due_date && new Date(r.due_date) < new Date();

              let leftBorder = 'transparent';
              if (isOverdue) leftBorder = '#ef4444';
              else if (due?.urgent) leftBorder = '#f97316';
              else if (r.marks_earned !== null) leftBorder = '#22c55e';

              return (
                <div key={r.assignment_id} className="card"
                  style={{ borderLeft: `3px solid ${leftBorder}`, paddingLeft: '16px' }}>

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {r.assignment_type === 'coding'
                          ? <Code2 size={15} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
                          : <BookOpen size={15} style={{ color: 'var(--text-2)', flexShrink: 0 }} />}
                        <p className="font-semibold" style={{ color: 'var(--text)', fontSize: '15px', lineHeight: 1.3 }}>
                          {isKin && r.title_kin ? r.title_kin : r.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="pill">
                          {r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}
                        </span>

                        {due && (
                          <span className="flex items-center gap-1" style={{ fontSize: '12px', color: due.color, fontWeight: due.urgent ? 600 : 400 }}>
                            {isOverdue && <AlertTriangle size={11} />}
                            <Clock size={11} />
                            {due.text}
                          </span>
                        )}

                        {r.submitted_at && (
                          <span className="flex items-center gap-1 dim" style={{ fontSize: '12px' }}>
                            <CheckCircle size={11} />
                            {isKin ? 'Yatanzwe' : 'Submitted'} {new Date(r.submitted_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="shrink-0 text-right">
                      {!r.submitted ? (
                        <span className="pill" style={isOverdue ? { color: '#ef4444', borderColor: '#fca5a5' } : undefined}>
                          {isKin ? 'Bitaratanzwe' : 'Not submitted'}
                        </span>
                      ) : r.marks_earned === null ? (
                        <div className="text-right">
                          <span className="pill">{isKin ? 'Bitegereje' : 'Awaiting grade'}</span>
                          {!r.grades_released && (
                            <p className="dim mt-1" style={{ fontSize: '11px' }}>
                              {isKin ? 'Amanota ntiyasohowe' : 'Grades not released yet'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold" style={{ color: scorePct !== null ? scoreColor(scorePct) : 'var(--text)' }}>
                            {r.marks_earned}
                            <span className="text-sm font-medium dim">/{r.total_marks}</span>
                          </p>
                          {scorePct !== null && (
                            <p className="font-semibold" style={{ color: scoreColor(scorePct), fontSize: '13px' }}>
                              {scorePct}%
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score bar for graded */}
                  {scorePct !== null && (
                    <div className="mb-3">
                      <div className="bar">
                        <i style={{ width: `${scorePct}%`, background: scoreColor(scorePct) }} />
                      </div>
                    </div>
                  )}

                  {/* Teacher feedback */}
                  {r.teacher_feedback && (
                    <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                      <MessageSquare size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--text-2)' }} />
                      <div>
                        <p className="font-semibold mb-0.5" style={{ color: 'var(--text)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {isKin ? 'Ibitekerezo by\'umwarimu' : 'Teacher feedback'}
                        </p>
                        <p className="leading-relaxed" style={{ color: 'var(--text-2)', fontSize: '13px' }}>{r.teacher_feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
