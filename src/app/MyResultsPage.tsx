import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Code2, CheckCircle, Clock, MessageSquare, TrendingUp, Bell } from 'lucide-react';
import { getStudentResults, type StudentResult } from '../lib/db';

interface Props {
  language: 'EN' | 'KIN';
  onBack: () => void;
}

type Filter = 'all' | 'graded' | 'pending' | 'not-submitted';

const difficultyStyle: Record<string, { bg: string; text: string; border: string }> = {
  beginner:     { bg: 'rgba(0,212,170,0.1)',  text: '#00d4aa', border: 'rgba(0,212,170,0.2)' },
  intermediate: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  advanced:     { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
};

export default function MyResultsPage({ language, onBack }: Props) {
  const isKin = language === 'KIN';
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [seenGrades, setSeenGrades] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('educode_seen_grades');
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
    localStorage.setItem('educode_seen_grades', JSON.stringify([...updated]));
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
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', background: 'var(--ec-bg)' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 px-6 py-5 flex items-center justify-between"
        style={{ background: 'var(--ec-bg-a95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--ec-b1)' }}>
        <button onClick={onBack}
          className="flex items-center gap-2 font-medium transition-colors"
          style={{ color: 'var(--ec-text-4)', fontSize: '15px' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ec-text-1)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ec-text-4)')}>
          <ArrowLeft size={18} />
          {isKin ? 'Subira inyuma' : 'Back'}
        </button>
        <h1 className="font-bold" style={{ color: 'var(--ec-text-1)', fontSize: '18px' }}>
          {isKin ? 'Amanota Yanjye' : 'My Results'}
        </h1>
        <div className="w-16" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Summary card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold mb-1" style={{ color: 'var(--ec-text-1)' }}>{results.length}</p>
              <p className="text-sm" style={{ color: 'var(--ec-text-6)' }}>{isKin ? 'Imikoro yose hamwe' : 'Total assignments'}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1" style={{ color: '#00d4aa' }}>{submitted.length}</p>
              <p className="text-sm" style={{ color: 'var(--ec-text-6)' }}>{isKin ? 'Byatanzwe' : 'Submitted'}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-1" style={{ color: '#f59e0b' }}>
                {pct !== null ? `${pct}%` : '—'}
              </p>
              <p className="text-sm" style={{ color: 'var(--ec-text-6)' }}>{isKin ? 'Ikigereranyo cy\'amanota' : 'Average score'}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold mb-1"
                style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', fontSize: '14px' }}>
                <TrendingUp size={14} />
                {level}
              </div>
              <p className="text-sm" style={{ color: 'var(--ec-text-6)' }}>{isKin ? 'Urwego' : 'Level'}</p>
            </div>
          </div>

          {totalPossible > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--ec-text-6)' }}>
                <span>{isKin ? 'Amanota yose hamwe' : 'Overall score'}</span>
                <span style={{ color: 'var(--ec-text-1)', fontWeight: 600 }}>{totalEarned} / {totalPossible}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--ec-b1)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: pct! >= 70 ? '#00d4aa' : pct! >= 50 ? '#f59e0b' : '#ef4444' }} />
              </div>
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                fontSize: '14px',
                background: filter === f.key ? 'rgba(0,212,170,0.12)' : 'var(--ec-b3)',
                color: filter === f.key ? '#00d4aa' : 'var(--ec-text-6)',
                border: filter === f.key ? '1px solid rgba(0,212,170,0.25)' : '1px solid var(--ec-b1)',
              }}>
              {f.label}
              <span className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: 'var(--ec-b2)', color: 'var(--ec-text-4)' }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Results list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#00d4aa', borderTopColor: 'transparent' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl py-16 text-center" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
            <p style={{ color: 'var(--ec-text-6)', fontSize: '15px' }}>
              {isKin ? 'Nta bisubizo birahagaragara.' : 'Nothing here yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(r => {
              const diff = difficultyStyle[r.difficulty] ?? difficultyStyle.beginner;
              const scoreColor = r.marks_earned === null ? 'var(--ec-text-6)'
                : (r.marks_earned / r.total_marks) >= 0.7 ? '#00d4aa'
                : (r.marks_earned / r.total_marks) >= 0.5 ? '#f59e0b'
                : '#ef4444';
              const isNew = r.marks_earned !== null && !seenGrades.has(r.assignment_id);

              return (
                <div key={r.assignment_id} className="rounded-2xl p-6"
                  style={{
                    background: 'var(--ec-surface)',
                    border: isNew ? '1px solid rgba(0,212,170,0.3)' : '1px solid var(--ec-b1)',
                  }}>

                  {/* New grade banner */}
                  {isNew && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
                      <Bell size={13} style={{ color: '#00d4aa' }} />
                      <span style={{ color: '#00d4aa', fontSize: '13px', fontWeight: 600 }}>
                        {isKin ? 'Amanota mashya yasohotse!' : 'New grade released!'}
                      </span>
                    </div>
                  )}

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {r.assignment_type === 'coding'
                          ? <Code2 size={16} style={{ color: '#00d4aa', flexShrink: 0 }} />
                          : <BookOpen size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />}
                        <p className="font-semibold truncate" style={{ color: 'var(--ec-text-1)', fontSize: '16px' }}>
                          {isKin && r.title_kin ? r.title_kin : r.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}`, fontSize: '13px' }}>
                          {r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}
                        </span>
                        {r.submitted_at && (
                          <span className="flex items-center gap-1" style={{ color: 'var(--ec-text-7)', fontSize: '13px' }}>
                            <Clock size={12} />
                            {new Date(r.submitted_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="shrink-0 text-right">
                      {!r.submitted ? (
                        <span className="px-3 py-1.5 rounded-full font-semibold"
                          style={{ background: 'var(--ec-b3)', color: 'var(--ec-text-7)', border: '1px solid var(--ec-b1)', fontSize: '13px' }}>
                          {isKin ? 'Bitaratanzwe' : 'Not submitted'}
                        </span>
                      ) : r.marks_earned === null ? (
                        <span className="px-3 py-1.5 rounded-full font-semibold"
                          style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', fontSize: '13px' }}>
                          {isKin ? 'Bitegereje amanota' : 'Awaiting grade'}
                        </span>
                      ) : (
                        <div>
                          <p className="text-3xl font-bold" style={{ color: scoreColor }}>
                            {r.marks_earned}<span className="text-base font-medium" style={{ color: 'var(--ec-text-6)' }}>/{r.total_marks}</span>
                          </p>
                          <p className="font-semibold" style={{ color: scoreColor, fontSize: '15px' }}>
                            {Math.round((r.marks_earned / r.total_marks) * 100)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score bar for graded */}
                  {r.marks_earned !== null && (
                    <div className="mb-4">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--ec-b1)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.round((r.marks_earned / r.total_marks) * 100)}%`, background: scoreColor }} />
                      </div>
                    </div>
                  )}

                  {/* Teacher feedback */}
                  {r.teacher_feedback && (
                    <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
                      <MessageSquare size={15} className="shrink-0 mt-0.5" style={{ color: '#8b5cf6' }} />
                      <div>
                        <p className="font-semibold mb-1" style={{ color: '#8b5cf6', fontSize: '13px' }}>
                          {isKin ? 'Ibitekerezo by\'umwarimu' : 'Teacher feedback'}
                        </p>
                        <p className="leading-relaxed" style={{ color: 'var(--ec-text-4)', fontSize: '14px' }}>{r.teacher_feedback}</p>
                      </div>
                    </div>
                  )}

                  {r.submitted && r.marks_earned !== null && (
                    <div className="flex items-center gap-2 mt-3">
                      <CheckCircle size={14} style={{ color: '#00d4aa' }} />
                      <span style={{ color: 'var(--ec-text-7)', fontSize: '13px' }}>
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
