import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Code2, CheckCircle, Clock, MessageSquare, TrendingUp } from 'lucide-react';
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

  useEffect(() => {
    getStudentResults().then(data => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  // ── Summary stats ──────────────────────────────────────────────────────────
  const submitted = results.filter(r => r.submitted);
  const graded = results.filter(r => r.marks_earned !== null);
  const totalEarned = graded.reduce((s, r) => s + (r.marks_earned ?? 0), 0);
  const totalPossible = graded.reduce((s, r) => s + r.total_marks, 0);
  const pct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : null;

  const level = (() => {
    if (totalEarned >= 100) return isKin ? 'Inzobere' : 'Advanced';
    if (totalEarned >= 50)  return isKin ? 'Hagati II' : 'Intermediate II';
    if (totalEarned >= 25)  return isKin ? 'Hagati I'  : 'Intermediate I';
    if (totalEarned >= 10)  return isKin ? 'Intangiriro II' : 'Beginner II';
    return isKin ? 'Intangiriro I' : 'Beginner I';
  })();

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = results.filter(r => {
    if (filter === 'graded')       return r.marks_earned !== null;
    if (filter === 'pending')      return r.submitted && r.marks_earned === null;
    if (filter === 'not-submitted') return !r.submitted;
    return true;
  });

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all',           label: isKin ? 'Byose'          : 'All',           count: results.length },
    { key: 'graded',        label: isKin ? 'Byongeweho'     : 'Graded',        count: graded.length },
    { key: 'pending',       label: isKin ? 'Bitegereje'     : 'Awaiting grade', count: submitted.length - graded.length },
    { key: 'not-submitted', label: isKin ? 'Bitaratanzwe'   : 'Not submitted',  count: results.length - submitted.length },
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', background: '#0d0f14' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(13,15,20,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: '#94a3b8' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
          <ArrowLeft size={16} />
          {isKin ? 'Subira Inyuma' : 'Back'}
        </button>
        <h1 className="text-sm font-bold" style={{ color: '#f1f5f9' }}>
          {isKin ? 'Amanota Yanjye' : 'My Results'}
        </h1>
        <div className="w-16" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* ── Summary card ── */}
        <div className="rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>{results.length}</p>
              <p className="text-xs mt-1" style={{ color: '#475569' }}>{isKin ? 'Imishinga yose' : 'Total assignments'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#00d4aa' }}>{submitted.length}</p>
              <p className="text-xs mt-1" style={{ color: '#475569' }}>{isKin ? 'Byatanzwe' : 'Submitted'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                {pct !== null ? `${pct}%` : '—'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#475569' }}>{isKin ? 'Ikigero cy\'amanota' : 'Average score'}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
                <TrendingUp size={11} />
                {level}
              </div>
              <p className="text-xs mt-1" style={{ color: '#475569' }}>{isKin ? 'Urwego' : 'Level'}</p>
            </div>
          </div>

          {/* Score bar */}
          {totalPossible > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: '#475569' }}>
                <span>{isKin ? 'Amanota yose' : 'Overall score'}</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{totalEarned} / {totalPossible}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: pct! >= 70 ? '#00d4aa' : pct! >= 50 ? '#f59e0b' : '#ef4444' }} />
              </div>
            </div>
          )}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: filter === f.key ? 'rgba(0,212,170,0.12)' : 'rgba(255,255,255,0.04)',
                color: filter === f.key ? '#00d4aa' : '#475569',
                border: filter === f.key ? '1px solid rgba(0,212,170,0.25)' : '1px solid rgba(255,255,255,0.06)',
              }}>
              {f.label}
              <span className="px-1.5 py-0.5 rounded-full text-xs"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Results list ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#00d4aa', borderTopColor: 'transparent' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl py-16 text-center" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: '#475569' }}>
              {isKin ? 'Nta bisubizo bihari.' : 'Nothing here yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => {
              const diff = difficultyStyle[r.difficulty] ?? difficultyStyle.beginner;
              const scoreColor = r.marks_earned === null ? '#475569'
                : (r.marks_earned / r.total_marks) >= 0.7 ? '#00d4aa'
                : (r.marks_earned / r.total_marks) >= 0.5 ? '#f59e0b'
                : '#ef4444';

              return (
                <div key={r.assignment_id} className="rounded-2xl p-5"
                  style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {r.assignment_type === 'coding'
                          ? <Code2 size={13} style={{ color: '#00d4aa', flexShrink: 0 }} />
                          : <BookOpen size={13} style={{ color: '#8b5cf6', flexShrink: 0 }} />}
                        <p className="text-sm font-semibold truncate" style={{ color: '#f1f5f9' }}>
                          {isKin && r.title_kin ? r.title_kin : r.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
                          {r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)}
                        </span>
                        {r.submitted_at && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#334155' }}>
                            <Clock size={10} />
                            {new Date(r.submitted_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className="shrink-0 text-right">
                      {!r.submitted ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(255,255,255,0.04)', color: '#334155', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {isKin ? 'Bitaratanzwe' : 'Not submitted'}
                        </span>
                      ) : r.marks_earned === null ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                          {isKin ? 'Bitegereje' : 'Awaiting grade'}
                        </span>
                      ) : (
                        <div>
                          <p className="text-xl font-bold" style={{ color: scoreColor }}>
                            {r.marks_earned}<span className="text-sm font-medium" style={{ color: '#475569' }}>/{r.total_marks}</span>
                          </p>
                          <p className="text-xs" style={{ color: scoreColor }}>
                            {Math.round((r.marks_earned / r.total_marks) * 100)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teacher feedback */}
                  {r.teacher_feedback && (
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mt-2"
                      style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
                      <MessageSquare size={13} className="shrink-0 mt-0.5" style={{ color: '#8b5cf6' }} />
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: '#8b5cf6' }}>
                          {isKin ? 'Igitekerezo cy\'umwarimu' : 'Teacher feedback'}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{r.teacher_feedback}</p>
                      </div>
                    </div>
                  )}

                  {/* Submitted state indicator */}
                  {r.submitted && r.marks_earned !== null && (
                    <div className="flex items-center gap-1.5 mt-3">
                      <CheckCircle size={12} style={{ color: '#00d4aa' }} />
                      <span className="text-xs" style={{ color: '#334155' }}>
                        {isKin ? 'Byakongeweho amanota' : 'Graded'}
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
