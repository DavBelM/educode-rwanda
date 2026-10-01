import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { ArrowLeft, Download, Share2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getQuizSets, hasCompletedSet, getPassedChallengesForSet, getSetChallenges } from '../lib/quiz-db';
import { useAuth } from '../lib/auth';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
}

export default function CertificatePage({ language }: Props) {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isKin = language === 'KIN';

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [setTitle, setSetTitle] = useState('');
  const [rqfLevel, setRqfLevel] = useState(3);
  const [passedCount, setPassedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [completedDate, setCompletedDate] = useState('');
  const [copied, setCopied] = useState(false);

  usePageTitle('Certificate · EduCode');

  useEffect(() => {
    if (!setId) return;
    (async () => {
      const [sets, completed, challenges] = await Promise.all([
        getQuizSets(),
        hasCompletedSet(setId),
        getSetChallenges(setId),
      ]);

      const qs = sets.find(s => s.id === setId);
      if (!qs) { setLoading(false); return; }

      setSetTitle(isKin && qs.title_kin ? qs.title_kin : qs.title);
      setRqfLevel(qs.rqf_level);
      setTotalCount(challenges.length);

      if (completed) {
        const { passedIds } = await getPassedChallengesForSet(challenges.map(c => c.id));
        setPassedCount(passedIds.length);
        setValid(true);
        setCompletedDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
      }

      setLoading(false);
    })();
  }, [setId, isKin]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // fallback: select text
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--line-strong)', borderTopColor: 'var(--text-2)' }} />
      </div>
    );
  }

  if (!valid) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: '40px 32px' }}>
          <p style={{ fontSize: 32, marginBottom: 16 }}>🔒</p>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
            {isKin ? 'Certificate ntiribonetse' : 'Certificate Not Available'}
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 24 }}>
            {isKin
              ? 'Ugomba kurangiza set yose kugirango ubone certificate.'
              : 'Complete all challenges in this set to unlock your certificate.'}
          </p>
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/challenges')}>
            ← {isKin ? 'Garuka ku challenges' : 'Back to challenges'}
          </button>
        </div>
      </div>
    );
  }

  const studentName = profile?.full_name ?? 'Student';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '24px 16px 60px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Back */}
        <button className="iconbtn" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
          <ArrowLeft size={18} />
        </button>

        {/* Certificate card */}
        <div style={{
          background: 'var(--surface)',
          border: '2px solid var(--line-strong)',
          borderRadius: 16,
          padding: '48px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 6,
            background: `linear-gradient(90deg, #6366f1, #3b82f6, #10b981)`,
          }} />

          {/* EduCode logo area */}
          <div style={{ marginBottom: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--text-3)',
            }}>
              EduCode Rwanda
            </span>
          </div>

          <h2 style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--text-2)',
            marginBottom: 28,
          }}>
            {isKin ? 'Icyemezo cy\'irangira' : 'Certificate of Completion'}
          </h2>

          {/* Recipient */}
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 8 }}>
            {isKin ? 'Uyu agenerwa' : 'This is to certify that'}
          </p>
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: 'var(--text)',
            marginBottom: 20, fontFamily: 'Georgia, serif',
          }}>
            {studentName}
          </h1>

          {/* Achievement */}
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 6 }}>
            {isKin ? 'yarangirijwe' : 'has successfully completed'}
          </p>
          <h3 style={{
            fontSize: 20, fontWeight: 700, color: 'var(--text)',
            marginBottom: 6,
          }}>
            {setTitle}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28 }}>
            RTB RQF Level {rqfLevel} · {passedCount} / {totalCount} {isKin ? 'challenges' : 'challenges completed'}
          </p>

          {/* Seal / Check */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
          }}>
            <CheckCircle2 size={28} color="#fff" strokeWidth={2.5} />
          </div>

          {/* Date */}
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>
            {isKin ? 'Itariki:' : 'Issued:'} {completedDate}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace' }}>
            ID: {setId?.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, gap: 8 }}
            onClick={handleCopy}
          >
            <Share2 size={15} />
            {copied
              ? (isKin ? 'Kopiwe!' : 'Copied!')
              : (isKin ? 'Sangira link' : 'Copy link')}
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, gap: 8 }}
            onClick={() => navigate('/challenges')}
          >
            {isKin ? 'Komeza kwiga' : 'Keep learning'}
          </button>
        </div>

        {/* Share URL display */}
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'var(--surface-2)', border: '1px solid var(--line)',
          borderRadius: 8, fontSize: 12, color: 'var(--text-3)',
          fontFamily: 'monospace', wordBreak: 'break-all',
          userSelect: 'all',
        }}>
          {shareUrl}
        </div>
      </div>
    </div>
  );
}
