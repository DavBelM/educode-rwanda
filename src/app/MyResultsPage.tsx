import { useState, useEffect } from 'react';
import { BookOpen, Code2, CheckCircle, Clock, MessageSquare, TrendingUp, Bell } from 'lucide-react';
import { getStudentResults, type StudentResult } from '../lib/db';
import { usePageTitle } from '../hooks/usePageTitle';
import { AppNav } from './components/AppNav';
import { useAuth } from '../lib/auth';

interface Props {
  language: 'EN' | 'KIN';
  onBack: () => void;
}

type Filter = 'all' | 'graded' | 'pending' | 'not-submitted';

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

  useEffect(() => {
    getStudentResults().then(data => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  // Mark all graded results as seen when page opens
  useEffect(() => {
    if (results.length === 0) return;
    const newGraded = results
      .filter(r => r.marks_earned !== null)
      .map(r => r.assignment_id);
    const updated = new Set([...seenGrades, ...newGraded]);
    setSeenGrades(updated);
    localStorage.setItem(seenKey, JSON.stringify([...updated]));
  }, [results]);

  const submitted = results.filter(r => r.submitted);
  const graded = results.filter(r => r.marks_earned !== null);
  const totalEarned = graded.reduce((s, r) => s + (r.marks_earned ?? 0), 0);
  const totalPossible = graded.reduce((s, r) => s + r.total_marks, 0);
  const pct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : null;

  const level = (() => {
    if (totalEarned >= 100) return isKin ? 'Urwego rwo hejuru' : 'Advanced';
    if (totalEarned >= 50)  return isKin ? 'Urwego ruringaniye II' : 'Intermediate II';
    if (totalEarned >= 25)  return isKin ? 'Urwego ruringaniye I'  : 'Intermediate I';
    if (totalEarned >= 10)  return isKin ? 'Urwego rw\'atangira II' : 'Beginner II';
    return isKin ? 'Urwego rw\'atangira I' : 'Beginner I';
  })();

  const filtered = results.filter(r => {
    if (filter === 'graded')        return r.marks_earned !== null;
    if (filter === 'pending')       return r.submitted && r.marks_earned === null;
    if (filter === 'not-submitted') return !r.submitted;
    return true;
  });

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all',           label: isKin ? 'Byose'        : 'All',            count: results.length },
    { key: 'graded',        label: isKin ? 'Byahawe amanota'   : 'Graded',         count: graded.length },
    { key: 'pending',       label: isKin ? 'Bitegereje amanota'   : 'Awaiting grade', count: submitted.length - graded.length },
    { key: 'not-submitted', label: isKin ? 'Bitaratanzwe' : 'Not submitted',  count: results.length - submitted.length },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNav />

      <div className="wrap page stack" style={{ ['--gap' as string]: '24px', maxWidth: '760px' }}>

        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          {isKin ? 'Amanota Yanjye' : 'My Results'}
        </h1>

        {/* Summary card */}
        <div className="card pad-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>{results.length}</p>
              <p className="text-sm dim">{isKin ? 'Imikoro yose hamwe' : 'Total assignments'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>{submitted.length}</p>
              <p className="text-sm dim">{isKin ? 'Byatanzwe' : 'Submitted'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                {pct !== null ? `${pct}%` : '—'}
              </p>
              <p className="text-sm dim">{isKin ? 'Ikigereranyo cy\'amanota' : 'Average score'}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 pill solid mb-1">
                <TrendingUp size={13} />
                {level}
              </div>
              <p className="text-sm dim">{isKin ? 'Urwego' : 'Level'}</p>
            </div>
          </div>

          {totalPossible > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2 dim">
                <span>{isKin ? 'Amanota yose hamwe' : 'Overall score'}</span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>{totalEarned} / {totalPossible}</span>
              </div>
              <div className="bar">
                <i style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>

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
          <div className="stack" style={{ ['--gap' as string]: '16px' }}>
            {filtered.map(r => {
              const scorePct = r.marks_earned !== null ? Math.round((r.marks_earned / r.total_marks) * 100) : null;
              const isNew = r.marks_earned !== null && !seenGrades.has(r.assignment_id);

              return (
                <div key={r.assignment_id} className="card" style={isNew ? { border: '1px solid var(--accent)' } : undefined}>

                  {/* New grade banner */}
                  {isNew && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-1.5" style={{ borderRadius: 'var(--radius-sm)', background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
                      <Bell size={13} style={{ color: 'var(--text)' }} />
                      <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: 600 }}>
                        {isKin ? 'Amanota mashya yasohotse!' : 'New grade released!'}
                      </span>
                    </div>
                  )}

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {r.assignment_type === 'coding'
                          ? <Code2 size={16} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
                          : <BookOpen size={16} style={{ color: 'var(--text-2)', flexShrink: 0 }} />}
                        <p className="font-semibold truncate" style={{ color: 'var(--text)', fontSize: '16px' }}>
                          {isKin && r.title_kin ? r.title_kin : r.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="pill">
                          {r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}
                        </span>
                        {r.submitted_at && (
                          <span className="flex items-center gap-1 dim" style={{ fontSize: '13px' }}>
                            <Clock size={12} />
                            {new Date(r.submitted_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="shrink-0 text-right">
                      {!r.submitted ? (
                        <span className="pill">
                          {isKin ? 'Bitaratanzwe' : 'Not submitted'}
                        </span>
                      ) : r.marks_earned === null ? (
                        <span className="pill">
                          {isKin ? 'Bitegereje amanota' : 'Awaiting grade'}
                        </span>
                      ) : (
                        <div>
                          <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                            {r.marks_earned}<span className="text-base font-medium dim">/{r.total_marks}</span>
                          </p>
                          <p className="font-semibold" style={{ color: 'var(--text-2)', fontSize: '15px' }}>
                            {scorePct}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score bar for graded */}
                  {scorePct !== null && (
                    <div className="mb-4">
                      <div className="bar">
                        <i style={{ width: `${scorePct}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Teacher feedback */}
                  {r.teacher_feedback && (
                    <div className="flex items-start gap-3 px-4 py-3" style={{ borderRadius: 'var(--radius)', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                      <MessageSquare size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--text-2)' }} />
                      <div>
                        <p className="font-semibold mb-1" style={{ color: 'var(--text)', fontSize: '13px' }}>
                          {isKin ? 'Ibitekerezo by\'umwarimu' : 'Teacher feedback'}
                        </p>
                        <p className="leading-relaxed" style={{ color: 'var(--text-2)', fontSize: '14px' }}>{r.teacher_feedback}</p>
                      </div>
                    </div>
                  )}

                  {r.submitted && r.marks_earned !== null && (
                    <div className="flex items-center gap-2 mt-3">
                      <CheckCircle size={14} style={{ color: 'var(--text-2)' }} />
                      <span className="dim" style={{ fontSize: '13px' }}>
                        {isKin ? 'Byahawe amanota' : 'Graded'}
                      </span>
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
