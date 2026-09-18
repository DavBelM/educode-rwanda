import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, ChevronRight, BookOpen } from 'lucide-react';
import { getQuizSets, getStudentSetProgress, getStudentSetPassedCounts, type QuizSet } from '../lib/quiz-db';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
}

const LEVEL_COLORS: Record<number, string> = {
  1: '#7eb8cf', 2: '#9eaa84', 3: '#cda86a', 4: '#c084fc', 5: '#f87171',
};
const LEVEL_LABELS: Record<number, { en: string; kin: string }> = {
  1: { en: 'RQF Level 1', kin: 'Urwego 1' },
  2: { en: 'RQF Level 2', kin: 'Urwego 2' },
  3: { en: 'RQF Level 3', kin: 'Urwego 3' },
  4: { en: 'RQF Level 4', kin: 'Urwego 4' },
  5: { en: 'RQF Level 5', kin: 'Urwego 5' },
};

function LevelBadge({ level, isKin }: { level: number; isKin: boolean }) {
  const color = LEVEL_COLORS[level] ?? 'var(--text-3)';
  const label = (LEVEL_LABELS[level] ?? { en: `Level ${level}`, kin: `Urwego ${level}` })[isKin ? 'kin' : 'en'];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      color, background: `${color}18`, border: `1px solid ${color}40`,
      padding: '2px 8px', borderRadius: 99,
    }}>{label}</span>
  );
}

export default function ChallengePage({ language }: Props) {
  usePageTitle('Challenge Mode · EduCode');
  const navigate = useNavigate();
  const isKin = language === 'KIN';

  const [sets, setSets] = useState<QuizSet[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [passedCounts, setPassedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getQuizSets(), getStudentSetProgress(), getStudentSetPassedCounts()]).then(([s, p, counts]) => {
      setSets(s);
      setCompleted(p);
      setPassedCounts(counts);
      setLoading(false);
    });
  }, []);

  // Unlock logic: within each level, order_index-based sequential unlock
  const isUnlocked = (set: QuizSet) => {
    if (set.order_index === 1) return true;
    // Find the previous set in the same level
    const sameLevelSets = sets.filter(s => s.rqf_level === set.rqf_level).sort((a, b) => a.order_index - b.order_index);
    const myIdx = sameLevelSets.findIndex(s => s.id === set.id);
    if (myIdx <= 0) return true;
    const prev = sameLevelSets[myIdx - 1];
    return !!completed[prev.id];
  };

  const availableLevels = [...new Set(sets.map(s => s.rqf_level ?? 1))].sort();
  const filteredSets = levelFilter === null ? sets : sets.filter(s => (s.rqf_level ?? 1) === levelFilter);

  // Group by level for display
  const grouped = filteredSets.reduce<Record<number, QuizSet[]>>((acc, s) => {
    const lvl = s.rqf_level ?? 1;
    (acc[lvl] ??= []).push(s);
    return acc;
  }, {});

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

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <AppNav />

      <div className="wrap page">

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', marginBottom: 6 }}>
            {isKin ? 'Imikino yo Gukora' : 'Challenge Mode'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 15 }}>
            {isKin
              ? 'Menya JavaScript unyuze muri challenge imwe na imwe. Rangiza set kugira ngo ufungure ikurikiraho.'
              : 'Master JavaScript one challenge at a time. Complete a set to unlock the next one.'}
          </p>
        </div>

        {/* Level filter */}
        {availableLevels.length > 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            <button
              onClick={() => setLevelFilter(null)}
              style={{
                padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: `1.5px solid ${levelFilter === null ? 'var(--text)' : 'var(--line)'}`,
                background: levelFilter === null ? 'var(--text)' : 'var(--surface)',
                color: levelFilter === null ? 'var(--bg)' : 'var(--text-2)',
              }}
            >
              {isKin ? 'Byose' : 'All levels'}
            </button>
            {availableLevels.map(lvl => {
              const color = LEVEL_COLORS[lvl] ?? 'var(--text-3)';
              const label = (LEVEL_LABELS[lvl] ?? { en: `Level ${lvl}`, kin: `Urwego ${lvl}` })[isKin ? 'kin' : 'en'];
              const active = levelFilter === lvl;
              return (
                <button key={lvl} onClick={() => setLevelFilter(lvl)}
                  style={{
                    padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    border: `1.5px solid ${active ? color : 'var(--line)'}`,
                    background: active ? `${color}20` : 'var(--surface)',
                    color: active ? color : 'var(--text-2)',
                  }}
                >{label}</button>
              );
            })}
          </div>
        )}

        {/* Sets grouped by level */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b)).map(([lvl, levelSets]) => {
            const level = Number(lvl);
            const isComingSoon = levelSets.length === 0 || (level >= 4);
            return (
              <div key={lvl}>
                {/* Level header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: `${LEVEL_COLORS[level] ?? 'var(--text-3)'}20`,
                    border: `1.5px solid ${LEVEL_COLORS[level] ?? 'var(--line)'}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BookOpen size={14} style={{ color: LEVEL_COLORS[level] ?? 'var(--text-3)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                      {(LEVEL_LABELS[level] ?? { en: `Level ${level}`, kin: `Urwego ${level}` })[isKin ? 'kin' : 'en']}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      {isComingSoon
                        ? (isKin ? 'Birategerejwe' : 'Coming soon — curriculum being added')
                        : `${levelSets.length} set${levelSets.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>

                {/* Sets in this level */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {levelSets.map((set) => {
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
                          transition: 'opacity 0.15s, border-color 0.15s',
                          borderLeft: done ? `3px solid ${LEVEL_COLORS[level] ?? 'var(--text-3)'}` : undefined,
                        }}
                        onClick={() => unlocked && navigate(`/challenges/${set.id}`)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                            background: done ? `${LEVEL_COLORS[level] ?? 'var(--text-3)'}15` : 'var(--surface-2)',
                            border: `1px solid ${done ? `${LEVEL_COLORS[level] ?? 'var(--line)'}50` : 'var(--line)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 15, fontWeight: 700, color: done ? (LEVEL_COLORS[level] ?? 'var(--text-2)') : 'var(--text-2)',
                          }}>
                            {String(set.order_index).padStart(2, '0')}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                                {isKin && set.title_kin ? set.title_kin : set.title}
                              </h3>
                              <LevelBadge level={level} isKin={isKin} />
                              {done && (
                                <span className="pill" style={{ fontSize: 11 }}>
                                  ✓ {isKin ? 'Byarangiye' : 'Completed'}
                                </span>
                              )}
                              {inProgress && (
                                <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
                                  {passed}/{set.xp_reward > 0 ? '?' : '6'} done
                                </span>
                              )}
                            </div>
                            <p style={{ color: 'var(--text-3)', fontSize: 13.5, lineHeight: 1.5, marginBottom: 4 }}>
                              {isKin && set.description_kin ? set.description_kin : set.description}
                            </p>
                            <p style={{ color: 'var(--text-3)', fontSize: 12 }}>
                              {set.xp_reward} XP
                            </p>
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
            );
          })}

          {/* Level 4 & 5 placeholders if not in data */}
          {[4, 5].filter(lvl => !availableLevels.includes(lvl) && (levelFilter === null || levelFilter === lvl)).map(lvl => (
            <div key={lvl} style={{ opacity: 0.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${LEVEL_COLORS[lvl] ?? 'var(--text-3)'}15`,
                  border: `1.5px solid ${LEVEL_COLORS[lvl] ?? 'var(--line)'}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Lock size={13} style={{ color: LEVEL_COLORS[lvl] ?? 'var(--text-3)' }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    {(LEVEL_LABELS[lvl] ?? { en: `Level ${lvl}`, kin: `Urwego ${lvl}` })[isKin ? 'kin' : 'en']}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {isKin ? 'Birategerejwe — amasomo arateguguwa' : 'Coming soon — curriculum being prepared'}
                  </p>
                </div>
              </div>
              <div className="card pad-lg" style={{ textAlign: 'center', padding: '28px 24px', border: '1.5px dashed var(--line)' }}>
                <p style={{ fontSize: 13.5, color: 'var(--text-3)' }}>
                  {isKin
                    ? `Inyigisho z'Urwego ${lvl} zizashyirwa nyuma. Menya urwego rwo hasi mbere.`
                    : `Level ${lvl} challenges will be available once the curriculum is uploaded. Master the lower levels first.`}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 32 }}>
          {isKin
            ? 'XP wabonye igaragarira ku dashboard yawe.'
            : 'XP you earn appears on your dashboard leaderboard.'}
        </p>
      </div>
    </div>
  );
}
