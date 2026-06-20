import { useState, useEffect } from 'react';
import { getClassXPLeaderboard, type XPLeaderboardEntry } from '../../lib/quiz-db';
import { Loader } from 'lucide-react';

interface Props {
  classId: string;
  language: 'EN' | 'KIN';
}

export function XPLeaderboard({ classId, language }: Props) {
  const isKin = language === 'KIN';
  const [entries, setEntries] = useState<XPLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getClassXPLeaderboard(classId).then(data => {
      if (!cancelled) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [classId]);

  return (
    <section className="card pad-lg rise-4">
      <div className="card-head">
        <h3 className="card-title">{isKin ? 'Ikigereranyo cya XP' : 'XP Leaderboard'}</h3>
        <span className="pill">
          <span className="dot"></span>
          {isKin ? 'Isomo ryawe' : 'Your class'}
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'center' }}>
          <Loader size={18} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-2)' }} />
        </div>
      ) : entries.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--text-3)', paddingTop: 8 }}>
          {isKin ? 'Ntamuntu warangije challenge. Uba uwa mbere!' : 'No one has completed a challenge yet. Be the first!'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          {entries.map(e => (
            <div
              key={e.codename}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                background: e.isMe ? 'var(--surface-2)' : 'transparent',
                border: e.isMe ? '1px solid var(--line-strong)' : '1px solid transparent',
              }}
            >
              {/* Rank badge */}
              <span style={{
                minWidth: 26,
                height: 26,
                borderRadius: 6,
                background: e.rank <= 3 ? 'var(--text)' : 'var(--surface-2)',
                color: e.rank <= 3 ? 'var(--bg)' : 'var(--text-2)',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {e.rank <= 3 ? ['1', '2', '3'][e.rank - 1] : e.showRank ? `#${e.rank}` : `T${e.topPct}%`}
              </span>

              {/* Name + set */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: e.isMe ? 600 : 400, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {e.codename}
                  {e.isMe && (
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 400 }}>
                      {isKin ? '(Wowe)' : '(you)'}
                    </span>
                  )}
                </div>
                {e.currentSet && (
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.currentSet}
                  </div>
                )}
              </div>

              {/* XP */}
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', flexShrink: 0 }}>
                {e.xp} XP
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
