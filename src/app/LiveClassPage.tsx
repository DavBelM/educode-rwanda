import { useState, useEffect } from 'react';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Play, StopCircle, Users, Loader, CheckCircle, Code } from 'lucide-react';

interface Props { language: 'EN' | 'KIN' }

interface LiveSession {
  id: string;
  session_code: string;
  status: 'waiting' | 'active' | 'ended';
  active_challenge_id: string | null;
  set_id: string | null;
}

interface Challenge { id: string; title: string; order_index: number; }
interface QuizSet { id: string; title: string; }

function randomCode() {
  return Math.random().toString(36).toUpperCase().slice(2, 8);
}

// ── Teacher side ──────────────────────────────────────────────────────────────

function TeacherLiveClass({ isKin }: { isKin: boolean }) {
  const { user } = useAuth();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [sets, setSets] = useState<QuizSet[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase.from('quiz_sets').select('id, title').order('rqf_level').order('order_index').then(({ data }) => setSets(data ?? []));
    // Check for existing active session
    if (user) {
      supabase.from('live_sessions').select('*').eq('teacher_id', user.id).neq('status', 'ended').maybeSingle().then(({ data }) => {
        if (data) { setSession(data as LiveSession); setSelectedSet(data.set_id ?? ''); }
      });
    }
  }, [user]);

  useEffect(() => {
    if (!selectedSet) return;
    supabase.from('quiz_challenges').select('id, title, order_index').eq('set_id', selectedSet).order('order_index').then(({ data }) => setChallenges(data ?? []));
  }, [selectedSet]);

  useEffect(() => {
    if (!session) return;
    // Realtime participant count
    const channel = supabase
      .channel(`live-session-${session.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_session_participants', filter: `session_id=eq.${session.id}` },
        () => {
          supabase.from('live_session_participants').select('id', { count: 'exact' }).eq('session_id', session.id).then(({ count }) => setParticipantCount(count ?? 0));
        })
      .subscribe();
    supabase.from('live_session_participants').select('id', { count: 'exact' }).eq('session_id', session.id).then(({ count }) => setParticipantCount(count ?? 0));
    return () => { supabase.removeChannel(channel); };
  }, [session]);

  const createSession = async () => {
    if (!user || !selectedSet) return;
    setCreating(true);
    const code = randomCode();
    const { data, error } = await supabase.from('live_sessions').insert({
      session_code: code,
      teacher_id: user.id,
      set_id: selectedSet,
      status: 'waiting',
    }).select('*').single();
    if (!error && data) setSession(data as LiveSession);
    setCreating(false);
  };

  const setChallenge = async (challengeId: string) => {
    if (!session) return;
    setLoading(true);
    await supabase.from('live_sessions').update({ active_challenge_id: challengeId, status: 'active', started_at: new Date().toISOString() }).eq('id', session.id);
    setSession(s => s ? { ...s, active_challenge_id: challengeId, status: 'active' } : s);
    setLoading(false);
  };

  const endSession = async () => {
    if (!session) return;
    await supabase.from('live_sessions').update({ status: 'ended', ended_at: new Date().toISOString() }).eq('id', session.id);
    setSession(null);
  };

  if (!session) {
    return (
      <div className="card pad-lg" style={{ maxWidth: 480 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          {isKin ? 'Tangira Inyigisho Nzima' : 'Start Live Class'}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          {isKin ? 'Abanyeshuri bose bazahuza na challenge imwe.' : 'Students join your session code and tackle challenges in sync.'}
        </p>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
          {isKin ? 'Hitamo Quiz Set' : 'Select challenge set'}
        </label>
        <select
          value={selectedSet}
          onChange={e => setSelectedSet(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, fontSize: 13, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', marginBottom: 16 }}
        >
          <option value="">— Select set —</option>
          {sets.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <button
          className="btn btn-primary"
          onClick={createSession}
          disabled={!selectedSet || creating}
          style={{ width: '100%' }}
        >
          {creating ? <Loader size={14} className="animate-spin" /> : <Play size={14} />}
          {isKin ? 'Tangira Isomo' : 'Create session'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      {/* Session header */}
      <div className="card pad-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>{isKin ? 'Kode y\'Inyigisho' : 'Session code'}</p>
          <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text)', fontFamily: 'ui-monospace, monospace' }}>
            {session.session_code}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
            {isKin ? 'Abanyeshuri:' : 'Students joined:'} <strong style={{ color: 'var(--text)' }}>{participantCount}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
            padding: '4px 10px', borderRadius: 99,
            background: session.status === 'active' ? '#9eaa8420' : 'var(--surface-2)',
            color: session.status === 'active' ? '#9eaa84' : 'var(--text-3)',
            border: `1px solid ${session.status === 'active' ? '#9eaa8460' : 'var(--line)'}`,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            {session.status === 'waiting' ? (isKin ? 'Gutegereza' : 'Waiting') : (isKin ? 'Irakora' : 'Live')}
          </span>
          <button className="btn btn-secondary sm" onClick={endSession}>
            <StopCircle size={13} /> {isKin ? 'Rangiza' : 'End'}
          </button>
        </div>
      </div>

      {/* Challenge selector */}
      <div className="card pad-lg">
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          {isKin ? 'Hitamo challenge yitabiriwe n\'abanyeshuri' : 'Push a challenge to all students'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading && <Loader size={16} style={{ color: 'var(--text-3)', animation: 'spin 1s linear infinite' }} />}
          {challenges.map(ch => (
            <button
              key={ch.id}
              onClick={() => setChallenge(ch.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                background: session.active_challenge_id === ch.id ? '#9eaa8420' : 'var(--surface-2)',
                border: `1.5px solid ${session.active_challenge_id === ch.id ? '#9eaa8460' : 'var(--line)'}`,
                color: 'var(--text)', fontSize: 13, fontWeight: session.active_challenge_id === ch.id ? 700 : 500,
              }}
            >
              <span>{ch.order_index}. {ch.title}</span>
              {session.active_challenge_id === ch.id && <CheckCircle size={14} style={{ color: '#9eaa84' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="card pad-sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Users size={14} style={{ color: 'var(--text-3)' }} />
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
          {participantCount} {isKin ? 'abanyeshuri binjiye' : `student${participantCount !== 1 ? 's' : ''} in session`}
        </p>
      </div>
    </div>
  );
}

// ── Student side ──────────────────────────────────────────────────────────────

function StudentLiveClass({ isKin, onGoToChallenge }: { isKin: boolean; onGoToChallenge: (setId: string, challengeId: string) => void }) {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [session, setSession] = useState<LiveSession | null>(null);
  const [error, setError] = useState('');

  // Once joined, listen for challenge pushes via Realtime
  useEffect(() => {
    if (!session) return;
    const channel = supabase
      .channel(`live-class-student-${session.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_sessions', filter: `id=eq.${session.id}` },
        (payload) => {
          const updated = payload.new as LiveSession;
          setSession(updated);
          if (updated.active_challenge_id && updated.set_id) {
            onGoToChallenge(updated.set_id, updated.active_challenge_id);
          }
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session, onGoToChallenge]);

  const joinSession = async () => {
    if (!user || !code.trim()) return;
    setJoining(true);
    setError('');
    const { data } = await supabase.from('live_sessions').select('*').eq('session_code', code.trim().toUpperCase()).neq('status', 'ended').maybeSingle();
    if (!data) { setError(isKin ? 'Kode ntiyabonetse. Reba neza.' : 'Session not found. Check the code.'); setJoining(false); return; }
    await supabase.from('live_session_participants').upsert({ session_id: data.id, student_id: user.id }, { onConflict: 'session_id,student_id' });
    setSession(data as LiveSession);
    setJoining(false);
  };

  if (session) {
    return (
      <div className="card pad-lg" style={{ maxWidth: 420, textAlign: 'center' }}>
        <CheckCircle size={32} style={{ color: '#9eaa84', margin: '0 auto 12px' }} />
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          {isKin ? 'Winjiye mu inyigisho!' : 'You\'re in the session!'}
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
          {isKin
            ? 'Tegereza umwarimu akubahirize challenge. Izagutereka mu buryo bwa otomatike.'
            : 'Wait for your teacher to push a challenge. It will open automatically.'}
        </p>
        <div style={{
          marginTop: 16, padding: '10px 16px', borderRadius: 8, background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
        }}>
          <Code size={14} style={{ color: 'var(--text-3)' }} />
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {session.status === 'waiting' ? (isKin ? 'Gutegereza umwarimu...' : 'Waiting for teacher…') : (isKin ? 'Inyigisho irakomeza' : 'Session is active')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card pad-lg" style={{ maxWidth: 420 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        {isKin ? 'Injira mu Nyigisho Nzima' : 'Join Live Class'}
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
        {isKin ? 'Shyira kode watangiwe n\'umwarimu wawe.' : 'Enter the 6-character code from your teacher.'}
      </p>
      <input
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase().slice(0, 6))}
        placeholder="ABC123"
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 20, fontWeight: 700,
          letterSpacing: '0.15em', textAlign: 'center', fontFamily: 'ui-monospace, monospace',
          border: '1.5px solid var(--line)', background: 'var(--surface)', color: 'var(--text)',
          marginBottom: 12, boxSizing: 'border-box',
        }}
        onKeyDown={e => e.key === 'Enter' && joinSession()}
      />
      {error && <p style={{ fontSize: 12, color: 'var(--error)', marginBottom: 10 }}>{error}</p>}
      <button
        className="btn btn-primary"
        onClick={joinSession}
        disabled={joining || code.length < 4}
        style={{ width: '100%' }}
      >
        {joining ? <Loader size={14} className="animate-spin" /> : <Users size={14} />}
        {isKin ? 'Injira' : 'Join session'}
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LiveClassPage({ language }: Props) {
  usePageTitle('Live Class · EduCode Rwanda');
  const { profile } = useAuth();
  const isKin = language === 'KIN';
  const isTeacher = profile?.user_type === 'teacher';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <AppNav />
      <div className="wrap page">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', marginBottom: 6 }}>
            {isKin ? 'Inyigisho Nzima' : 'Live Class Mode'}
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
            {isTeacher
              ? (isKin ? 'Rema isomo — abanyeshuri bose bazakora challenge imwe mu gihe kimwe.' : 'Create a session — all students work on the same challenge in real time.')
              : (isKin ? 'Shyira kode y\'isomo ngo uhuze n\'umwarimu wawe.' : 'Enter your teacher\'s session code to join their live class.')}
          </p>
        </div>

        {isTeacher
          ? <TeacherLiveClass isKin={isKin} />
          : <StudentLiveClass isKin={isKin} onGoToChallenge={(setId, challengeId) => {
              window.location.href = `/challenges/${setId}?challenge=${challengeId}`;
            }} />}
      </div>
    </div>
  );
}
