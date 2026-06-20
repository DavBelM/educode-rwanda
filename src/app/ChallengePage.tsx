import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock, ChevronRight } from 'lucide-react';
import { getQuizSets, getStudentSetProgress, type QuizSet } from '../lib/quiz-db';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
}

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

        <div style={{ marginBottom: '32px' }}>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)', marginBottom: 6 }}>
            {isKin ? 'Imikino yo Gukora' : 'Challenge Mode'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 16 }}>
            {isKin
              ? 'Menya JavaScript unyuze muri challenge imwe na imwe. Rangiza set kugira ngo ufungure ikurikiraho.'
              : 'Master JavaScript one challenge at a time. Complete a set to unlock the next.'}
          </p>
        </div>

        <div className="stack" style={{ ['--gap' as string]: '12px' }}>
          {sets.map((set) => {
            const unlocked = isUnlocked(set);
            const done = !!completed[set.id];

            return (
              <div
                key={set.id}
                className="card pad-lg"
                style={{
                  opacity: unlocked ? 1 : 0.4,
                  cursor: unlocked ? 'pointer' : 'default',
                }}
                onClick={() => unlocked && navigate(`/challenges/${set.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 600, color: 'var(--text-2)',
                  }}>
                    {String(set.order_index).padStart(2, '0')}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>
                        {isKin && set.title_kin ? set.title_kin : set.title}
                      </h3>
                      {done && (
                        <span className="pill" style={{ fontSize: 12 }}>
                          {isKin ? 'Byarangiye' : 'Completed'}
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-3)', fontSize: 15, lineHeight: 1.5 }}>
                      {isKin && set.description_kin ? set.description_kin : set.description}
                    </p>
                    <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 6 }}>
                      6 {isKin ? 'challenge' : 'challenges'} · {set.xp_reward} XP
                    </p>
                  </div>

                  <div className="shrink-0" style={{ color: 'var(--text-3)' }}>
                    {unlocked ? <ChevronRight size={18} /> : <Lock size={16} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ color: 'var(--text-3)', fontSize: 15, marginTop: 24 }}>
          {isKin
            ? 'XP wabonye igaragarira ku dashboard yawe.'
            : 'XP you earn appears on your dashboard.'}
        </p>
      </div>
    </div>
  );
}
