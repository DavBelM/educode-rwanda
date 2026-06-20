import { useState, useEffect, useRef } from 'react';
import { getRecentPeerActivity, type PeerActivity } from '../../lib/quiz-db';

interface Props {
  classId: string;
  language: 'EN' | 'KIN';
}

function timeAgo(isoStr: string, isKin: boolean): string {
  const diffMs = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return isKin ? 'Nonaha' : 'Just now';
  if (mins < 60) return isKin ? `Iminota ${mins} ishize` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return isKin ? `Amasaha ${hrs} ashize` : `${hrs}h ago`;
}

function eventLabel(eventType: PeerActivity['event_type'], title: string, isKin: boolean): string {
  if (eventType === 'set_completed') {
    return isKin
      ? `yarangije umutwe wa "${title}"`
      : `completed set "${title}"`;
  }
  return isKin
    ? `yarangije challenge "${title}"`
    : `completed "${title}"`;
}

export function PeerActivityFeed({ classId, language }: Props) {
  const isKin = language === 'KIN';
  const [activities, setActivities] = useState<PeerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async () => {
    const data = await getRecentPeerActivity(classId);
    setActivities(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 30_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  return (
    <section className="card pad-lg rise-4">
      <div className="card-head">
        <h3 className="card-title">{isKin ? 'Ibikorwa by\'inshuti' : 'Class activity'}</h3>
        <span className="pill">
          <span className="dot" style={{ background: 'var(--text-2)' }}></span>
          {isKin ? 'Amasaha 24' : '24h'}
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <div style={{ width: 16, height: 16, border: '2px solid var(--line)', borderTopColor: 'var(--text-2)', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : activities.length === 0 ? (
        <p style={{ fontSize: 16, color: 'var(--text-3)', paddingTop: 8 }}>
          {isKin ? 'Nta bikorwa mu masaha 24. Jya mbere!' : 'No activity in the last 24 hours. Go first!'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {activities.map((a, i) => (
            <div
              key={`${a.codename}-${a.created_at}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '9px 0',
                borderBottom: i < activities.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              {/* Avatar dot */}
              <span style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-2)',
                flexShrink: 0,
                marginTop: 1,
              }}>
                {a.codename.charAt(0)}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 600 }}>{a.codename}</span>
                  {' '}
                  <span style={{ color: 'var(--text-2)' }}>{eventLabel(a.event_type, a.title, isKin)}</span>
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>
                  {timeAgo(a.created_at, isKin)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
