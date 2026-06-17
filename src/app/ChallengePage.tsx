import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Play, CheckCircle, Star, ChevronRight, Zap } from 'lucide-react';
import { getQuizSets, getStudentSetProgress, type QuizSet } from '../lib/quiz-db';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
}

const SET_COLORS = [
  { bg: '#3b82f6', soft: 'rgba(59,130,246,0.12)' },
  { bg: '#8b5cf6', soft: 'rgba(139,92,246,0.12)' },
  { bg: '#10b981', soft: 'rgba(16,185,129,0.12)' },
  { bg: '#f59e0b', soft: 'rgba(245,158,11,0.12)' },
  { bg: '#ef4444', soft: 'rgba(239,68,68,0.12)' },
];

const TYPE_ICONS: Record<string, string> = {
  1: '📦', 2: '🔧', 3: '🔄', 4: '✨', 5: '🌐',
};

export default function ChallengePage({ language }: Props) {
  usePageTitle('Challenge Mode · EduCode');
  const navigate = useNavigate();
  const isKin = language === 'KIN';

  const [sets, setSets] = useState<QuizSet[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getQuizSets(), getStudentSetProgress()]).then(([s, p]) => {
      setSets(s);
      setCompleted(p);
      setLoading(false);
    });
  }, []);

  const isUnlocked = (set: QuizSet) => {
    if (set.order_index === 1) return true;
    const prev = sets.find(s => s.order_index === set.order_index - 1);
    return prev ? !!completed[prev.id] : false;
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <AppNav />
        <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
          <div className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{ borderColor: 'var(--line-strong)', borderTopColor: 'var(--text-2)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNav />

      <div className="wrap page" style={{ maxWidth: '860px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>⚡</div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text)', lineHeight: 1.2 }}>
                {isKin ? 'Imikino yo Gukora' : 'Challenge Mode'}
              </h1>
              <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
                {isKin ? 'Menya JavaScript unyuze muri challenge' : 'Master JavaScript one challenge at a time'}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 flex-wrap" style={{ fontSize: 13, color: 'var(--text-3)' }}>
            <span className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              {isKin ? 'Gusana ikosa' : 'Fix the bug'}
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
              {isKin ? 'Uzuza kode' : 'Complete the code'}
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block' }} />
              {isKin ? 'Andika uhereye zero' : 'Write from scratch'}
            </span>
          </div>
        </div>

        {/* Set cards */}
        <div className="stack" style={{ ['--gap' as string]: '16px' }}>
          {sets.map((set, idx) => {
            const unlocked = isUnlocked(set);
            const done = !!completed[set.id];
            const color = SET_COLORS[idx % SET_COLORS.length];

            return (
              <div
                key={set.id}
                className="card"
                style={{
                  opacity: unlocked ? 1 : 0.55,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  border: done ? '1.5px solid #10b981' : '1px solid var(--line)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => unlocked && navigate(`/challenges/${set.id}`)}
                onMouseEnter={e => {
                  if (!unlocked) return;
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = '';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                }}
              >
                {/* Accent stripe */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
                  background: color.bg, borderRadius: '8px 0 0 8px',
                }} />

                <div className="flex items-center gap-4" style={{ paddingLeft: 12 }}>
                  {/* Set number + icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: color.soft,
                    border: `1.5px solid ${color.bg}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, position: 'relative',
                  }}>
                    {TYPE_ICONS[set.order_index] ?? '⭐'}
                    {done && (
                      <div style={{
                        position: 'absolute', bottom: -4, right: -4,
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#10b981', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CheckCircle size={12} color="#fff" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                        color: color.bg, textTransform: 'uppercase',
                      }}>
                        {isKin ? `Urwego ${set.order_index}` : `Set ${set.order_index}`}
                      </span>
                      {done && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: '#10b981',
                          background: 'rgba(16,185,129,0.12)', padding: '1px 8px', borderRadius: 20,
                        }}>
                          {isKin ? 'Byarangiye' : 'Completed'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--text)', fontSize: 16, lineHeight: 1.3 }}>
                      {isKin && set.title_kin ? set.title_kin : set.title}
                    </h3>
                    <p style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.5 }}>
                      {isKin && set.description_kin ? set.description_kin : set.description}
                    </p>
                  </div>

                  {/* Right: XP + action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 pill" style={{
                      background: color.soft, borderColor: `${color.bg}40`,
                      color: color.bg, fontWeight: 700,
                    }}>
                      <Star size={12} fill="currentColor" />
                      {set.xp_reward} XP
                    </div>
                    <div style={{ color: 'var(--text-3)', fontSize: 12 }}>
                      6 {isKin ? 'challenge' : 'challenges'}
                    </div>
                    {unlocked ? (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: 13, gap: 6 }}
                        onClick={e => { e.stopPropagation(); navigate(`/challenges/${set.id}`); }}
                      >
                        {done ? (isKin ? 'Subiramo' : 'Play again') : (isKin ? 'Tangira' : 'Start')}
                        {done ? <ChevronRight size={14} /> : <Play size={13} fill="currentColor" />}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5" style={{ color: 'var(--text-3)', fontSize: 13 }}>
                        <Lock size={14} />
                        {isKin ? 'Gufungura' : 'Locked'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="flex items-center gap-2 mt-8" style={{
          padding: '12px 16px', borderRadius: 'var(--radius)',
          background: 'var(--surface-2)', border: '1px solid var(--line)',
        }}>
          <Zap size={15} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>
            {isKin
              ? 'Rangiza set imwe kugira ngo ufungure ikurikiraho. XP wabonye igaragarira ku dashboard yawe.'
              : 'Complete a set to unlock the next one. XP you earn appears on your dashboard.'}
          </p>
        </div>
      </div>
    </div>
  );
}
