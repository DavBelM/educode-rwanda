import { useState, useEffect } from 'react';
import { ArrowLeft, Code2, Clock, Lightbulb, Trophy, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { AppNav } from './components/AppNav';
import { getMySubmissions, type MySubmission } from '../lib/quiz-db';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
  onBack: () => void;
}

const LEVEL_COLORS: Record<number, string> = {
  1: '#6366f1', 2: '#0ea5e9', 3: '#10b981', 4: '#f59e0b', 5: '#ef4444',
};

function timeFmt(sec: number | null): string {
  if (!sec) return '—';
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

export default function SolutionsPage({ language, onBack }: Props) {
  usePageTitle('My Solutions · EduCode');
  const isKin = language === 'KIN';
  const [submissions, setSubmissions] = useState<MySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getMySubmissions().then(data => {
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

  const filtered = submissions.filter(s => {
    const matchLevel = levelFilter === 'all' || s.rqf_level === levelFilter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || s.challenge_title.toLowerCase().includes(q)
      || s.set_title.toLowerCase().includes(q);
    return matchLevel && matchSearch;
  });

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppNav language={language} onLanguageChange={() => {}} />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 16px 60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button className="iconbtn" onClick={onBack} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
              {isKin ? 'Ibisubizo Byanjye' : 'My Solutions'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>
              {isKin ? 'Kode zawe zashyize mu mbere' : 'Your accepted code from completed challenges'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-3)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder={isKin ? 'Shakisha...' : 'Search challenges...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: 32, paddingRight: 12, height: 36,
                background: 'var(--surface-2)', border: '1px solid var(--line)',
                borderRadius: 8, fontSize: 14, color: 'var(--text)',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 3, 4, 5] as const).map(lv => (
              <button
                key={lv}
                onClick={() => setLevelFilter(lv)}
                style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: levelFilter === lv ? 'var(--text-2)' : 'var(--surface-2)',
                  color: levelFilter === lv ? 'var(--bg)' : 'var(--text-3)',
                  border: '1px solid var(--line)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {lv === 'all' ? (isKin ? 'Byose' : 'All') : `L${lv}`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="w-7 h-7 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--line-strong)', borderTopColor: 'var(--text-2)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)' }}>
            <Code2 size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: 15 }}>
              {submissions.length === 0
                ? (isKin ? 'Nta challenge warangirije kugeza ubu.' : 'No completed challenges yet. Start solving!')
                : (isKin ? 'Nta bisubizo bisangiwe na filter yawe.' : 'No solutions match your filter.')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(s => {
              const isOpen = expanded === s.challenge_id;
              const levelColor = LEVEL_COLORS[s.rqf_level] ?? '#888';
              const dateStr = new Date(s.completed_at).toLocaleDateString();

              return (
                <div
                  key={s.challenge_id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    transition: 'border-color 0.15s',
                  }}
                >
                  {/* Row header */}
                  <button
                    onClick={() => toggle(s.challenge_id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    {/* Level dot */}
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: levelColor, flexShrink: 0,
                    }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }} className="truncate">
                        {isKin && s.challenge_title_kin ? s.challenge_title_kin : s.challenge_title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                        {isKin && s.set_title_kin ? s.set_title_kin : s.set_title} · L{s.rqf_level}
                      </div>
                    </div>

                    {/* Meta chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-3)' }}>
                        <Trophy size={11} />
                        {s.xp_earned} XP
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-3)' }}>
                        <Clock size={11} />
                        {timeFmt(s.time_taken_seconds)}
                      </span>
                      {s.hint_used && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-3)' }}>
                          <Lightbulb size={11} />
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{dateStr}</span>
                      {isOpen
                        ? <ChevronDown size={14} style={{ color: 'var(--text-3)' }} />
                        : <ChevronRight size={14} style={{ color: 'var(--text-3)' }} />
                      }
                    </div>
                  </button>

                  {/* Code viewer */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--line)' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 16px',
                        background: 'var(--surface-2)',
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {isKin ? 'Kode Yawe' : 'Your Solution'}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                          {s.attempts_count} {isKin ? 'igerageze' : `attempt${s.attempts_count !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                      <pre style={{
                        margin: 0,
                        padding: '16px',
                        overflow: 'auto',
                        maxHeight: 400,
                        fontSize: 13,
                        lineHeight: 1.6,
                        fontFamily: 'var(--mono)',
                        color: 'var(--text)',
                        background: 'var(--surface)',
                        whiteSpace: 'pre',
                        tabSize: 2,
                      }}>
                        {s.final_code}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats footer */}
        {!loading && submissions.length > 0 && (
          <div style={{
            marginTop: 24, padding: '14px 20px',
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            borderRadius: 10,
            display: 'flex', gap: 24, flexWrap: 'wrap',
            fontSize: 13, color: 'var(--text-3)',
          }}>
            <span>
              <strong style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{submissions.length}</strong>
              {' '}{isKin ? 'challenge zashyize mu mbere' : 'challenges solved'}
            </span>
            <span>
              <strong style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {submissions.reduce((s, r) => s + r.xp_earned, 0)}
              </strong>
              {' '}XP {isKin ? 'wabonye' : 'earned'}
            </span>
            <span>
              <strong style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(submissions.reduce((s, r) => s + r.attempts_count, 0) / submissions.length * 10) / 10}
              </strong>
              {' '}{isKin ? 'igerageze ryavg.' : 'avg. attempts'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
