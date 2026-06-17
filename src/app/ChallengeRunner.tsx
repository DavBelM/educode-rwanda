import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Lightbulb, Play, CheckCircle2, XCircle, Circle,
  Star, Trophy, RotateCcw, ChevronRight, Zap, Clock,
} from 'lucide-react';
import { CodeEditor } from './components/CodeEditor';
import { runQuizTests, type TestResult } from '../lib/quiz-executor';
import {
  getSetChallenges, getQuizSets, startQuizSession, upsertQuizAttempt,
  completeQuizSession, markSetCompleted, awardXp,
  type QuizSet, type QuizChallenge, type ErrorLogEntry,
} from '../lib/quiz-db';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
}

type Phase = 'loading' | 'running' | 'success' | 'complete';

const TYPE_LABEL: Record<string, { en: string; kin: string; color: string }> = {
  fix_bug:       { en: 'Fix the Bug',        kin: 'Gusana Ikosa',          color: '#f59e0b' },
  complete_code: { en: 'Complete the Code',  kin: 'Uzuza Kode',            color: '#3b82f6' },
  write_scratch: { en: 'Write from Scratch', kin: 'Andika Uhereye Ibanze', color: '#8b5cf6' },
};

export default function ChallengeRunner({ language }: Props) {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const isKin = language === 'KIN';

  const [set, setSet] = useState<QuizSet | null>(null);
  const [challenges, setChallenges] = useState<QuizChallenge[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');

  const [jsCode, setJsCode] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [output, setOutput] = useState('');
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  // Per-challenge tracking
  const [attemptCount, setAttemptCount] = useState(0);
  const [challengeStartMs, setChallengeStartMs] = useState(Date.now());
  const errorLogRef = useRef<ErrorLogEntry[]>([]);
  const sessionIdRef = useRef<string | null>(null);

  // Session-level totals
  const [xpEarned, setXpEarned] = useState(0);
  const [passedCount, setPassedCount] = useState(0);

  usePageTitle(set ? `${set.title} · EduCode` : 'Challenge · EduCode');

  // Load data and start session
  useEffect(() => {
    if (!setId) return;
    Promise.all([
      getQuizSets(),
      getSetChallenges(setId),
      startQuizSession(setId),
    ]).then(([allSets, chs, session]) => {
      const found = allSets.find(s => s.id === setId) ?? null;
      setSet(found);
      setChallenges(chs);
      if (session.data) sessionIdRef.current = session.data.id;
      if (chs.length > 0) {
        setJsCode(chs[0].starter_js);
        setHtmlCode(chs[0].starter_html);
      }
      setPhase('running');
      setChallengeStartMs(Date.now());
    });
  }, [setId]);

  const challenge = challenges[idx] ?? null;

  const resetForChallenge = useCallback((ch: QuizChallenge) => {
    setJsCode(ch.starter_js);
    setHtmlCode(ch.starter_html);
    setResults([]);
    setOutput('');
    setRuntimeError(null);
    setShowHint(false);
    setHintUsed(false);
    setAttemptCount(0);
    errorLogRef.current = [];
    setChallengeStartMs(Date.now());
  }, []);

  const handleRun = async () => {
    if (!challenge || running) return;
    setRunning(true);
    setResults([]);

    const res = await runQuizTests(jsCode, htmlCode, challenge.test_cases);
    setResults(res.results);
    setOutput(res.output);
    setRuntimeError(res.runtimeError);
    setRunning(false);

    const newCount = attemptCount + 1;
    setAttemptCount(newCount);

    // Append to error log
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      attempt: newCount,
      error: res.runtimeError,
      tests_passed: res.results.filter(r => r.passed).length,
      total_tests: res.results.length,
    };
    errorLogRef.current = [...errorLogRef.current, entry];

    if (res.allPassed) {
      const timeSec = Math.round((Date.now() - challengeStartMs) / 1000);
      const xp = computeXp(challenge.xp_reward, newCount, hintUsed);

      // Save attempt
      if (sessionIdRef.current) {
        await upsertQuizAttempt({
          sessionId: sessionIdRef.current,
          challengeId: challenge.id,
          passed: true,
          attemptsCount: newCount,
          hintUsed,
          timeTakenSeconds: timeSec,
          finalCode: jsCode,
          errorLog: errorLogRef.current,
          xpEarned: xp,
        });
      }

      setXpEarned(prev => prev + xp);
      setPassedCount(prev => prev + 1);
      setPhase('success');
    } else {
      // Save failed attempt (upsert keeps last state)
      if (sessionIdRef.current) {
        await upsertQuizAttempt({
          sessionId: sessionIdRef.current,
          challengeId: challenge.id,
          passed: false,
          attemptsCount: newCount,
          hintUsed,
          timeTakenSeconds: Math.round((Date.now() - challengeStartMs) / 1000),
          finalCode: jsCode,
          errorLog: errorLogRef.current,
          xpEarned: 0,
        });
      }
    }
  };

  const computeXp = (base: number, attempts: number, usedHint: boolean): number => {
    let xp = base;
    if (attempts === 1) xp = Math.round(xp * 1.5); // first try bonus
    else if (attempts <= 3) xp = xp;
    else xp = Math.round(xp * 0.7); // reduced for many attempts
    if (usedHint) xp = Math.round(xp * 0.8);
    return xp;
  };

  const handleNext = async () => {
    const nextIdx = idx + 1;
    if (nextIdx >= challenges.length) {
      // Session complete
      const total = xpEarned;
      if (sessionIdRef.current && set) {
        await completeQuizSession(sessionIdRef.current, total, passedCount, challenges.length);
        if (passedCount === challenges.length) {
          await markSetCompleted(set.id, total);
        }
        await awardXp(total);
      }
      setPhase('complete');
    } else {
      setIdx(nextIdx);
      resetForChallenge(challenges[nextIdx]);
      setPhase('running');
    }
  };

  const handleRestart = () => {
    if (challenges.length === 0) return;
    setIdx(0);
    setXpEarned(0);
    setPassedCount(0);
    resetForChallenge(challenges[0]);
    setPhase('running');
  };

  if (phase === 'loading' || !challenge || !set) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--line-strong)', borderTopColor: 'var(--text-2)' }} />
      </div>
    );
  }

  const typeInfo = TYPE_LABEL[challenge.challenge_type];
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = challenge.test_cases.length;
  const allPassed = results.length > 0 && results.every(r => r.passed);

  // ── SESSION COMPLETE ──────────────────────────────────────────────────────
  if (phase === 'complete') {
    const allDone = passedCount === challenges.length;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'var(--bg)' }}>
        <div className="card" style={{
          maxWidth: 480, width: '100%', textAlign: 'center', padding: '40px 32px',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {allDone ? '🏆' : '🎯'}
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            {allDone
              ? (isKin ? 'Set Yarangiye!' : 'Set Complete!')
              : (isKin ? 'Imikino Yarangiye' : 'Session Finished')}
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-2)', fontSize: 15 }}>
            {isKin
              ? `Warangije challenge ${passedCount} muri ${challenges.length} neza.`
              : `You passed ${passedCount} out of ${challenges.length} challenges.`}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div style={{ textAlign: 'center' }}>
              <p className="text-2xl font-bold mb-1" style={{ color: '#f59e0b' }}>
                ⭐ {xpEarned}
              </p>
              <p style={{ color: 'var(--text-3)', fontSize: 12 }}>XP {isKin ? 'wabonanye' : 'earned'}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>
                {passedCount}/{challenges.length}
              </p>
              <p style={{ color: 'var(--text-3)', fontSize: 12 }}>{isKin ? 'Byaranguye' : 'Passed'}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                {allDone ? '✅' : '🔁'}
              </p>
              <p style={{ color: 'var(--text-3)', fontSize: 12 }}>
                {allDone ? (isKin ? 'Byose' : 'All clear') : (isKin ? 'Subiramo' : 'Try again')}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => navigate('/challenges')}
            >
              <ArrowLeft size={15} />
              {isKin ? 'Garuka' : 'Back to sets'}
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleRestart}
            >
              <RotateCcw size={15} />
              {isKin ? 'Subiramo' : 'Play again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN RUNNER ───────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
        height: 52, borderBottom: '1px solid var(--line)', background: 'var(--surface-2)',
        flexShrink: 0,
      }}>
        <button
          className="iconbtn"
          onClick={() => navigate('/challenges')}
          aria-label="Back to sets"
          style={{ color: 'var(--text-2)' }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-3)', fontSize: 13 }}>{isKin && set.title_kin ? set.title_kin : set.title}</span>
            <span style={{ color: 'var(--line-strong)' }}>›</span>
            <span className="font-semibold" style={{ color: 'var(--text)', fontSize: 13 }}>
              {isKin && challenge.title_kin ? challenge.title_kin : challenge.title}
            </span>
          </div>
        </div>

        {/* Challenge progress dots */}
        <div className="flex items-center gap-1.5">
          {challenges.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 20 : 8, height: 8,
              borderRadius: 4,
              background: i < idx ? '#10b981' : i === idx ? '#3b82f6' : 'var(--line-strong)',
              transition: 'width 0.3s, background 0.3s',
            }} />
          ))}
        </div>

        {/* XP counter */}
        <div className="flex items-center gap-1.5 pill" style={{
          background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.3)',
          color: '#f59e0b', fontWeight: 700, fontSize: 13,
        }}>
          <Star size={12} fill="currentColor" />
          {xpEarned} XP
        </div>

        <span style={{ color: 'var(--text-3)', fontSize: 13 }}>
          {idx + 1}/{challenges.length}
        </span>
      </div>

      {/* Body: editor left + panel right */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT: Code editor */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 60%', borderRight: '1px solid var(--line)', overflow: 'hidden' }}>
          <CodeEditor
            jsCode={jsCode}
            htmlCode={htmlCode}
            onJsChange={setJsCode}
            onHtmlChange={setHtmlCode}
            language={language}
          />

          {/* Run bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderTop: '1px solid var(--line)',
            background: 'var(--surface-2)', flexShrink: 0,
          }}>
            {runtimeError && (
              <span style={{ flex: 1, fontSize: 12, color: '#ef4444', fontFamily: 'monospace' }} className="truncate">
                {runtimeError.replace(/^Error:\s*/, '')}
              </span>
            )}
            {!runtimeError && output && (
              <span style={{ flex: 1, fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace' }} className="truncate">
                {output.split('\n')[0]}
              </span>
            )}
            {!runtimeError && !output && <span style={{ flex: 1 }} />}

            <button
              className="btn btn-primary"
              style={{ gap: 6, padding: '6px 16px', fontSize: 13, flexShrink: 0 }}
              onClick={handleRun}
              disabled={running}
            >
              {running ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
              ) : (
                <Play size={13} fill="currentColor" />
              )}
              {running ? (isKin ? 'Gukora...' : 'Running...') : (isKin ? 'Gukomeza' : 'Run')}
            </button>
          </div>
        </div>

        {/* RIGHT: Challenge info + test results */}
        <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Challenge card */}
          <div style={{
            padding: '16px', borderBottom: '1px solid var(--line)',
            overflowY: 'auto', maxHeight: '55%', flexShrink: 0,
          }}>
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-3">
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                color: typeInfo.color, textTransform: 'uppercase',
                background: `${typeInfo.color}18`, padding: '3px 10px',
                borderRadius: 20, border: `1px solid ${typeInfo.color}30`,
              }}>
                {isKin ? typeInfo.kin : typeInfo.en}
              </span>
              <span className="pill" style={{ fontSize: 11 }}>
                {challenge.difficulty}
              </span>
              {attemptCount > 0 && (
                <span className="flex items-center gap-1" style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  <RotateCcw size={10} />
                  {attemptCount}×
                </span>
              )}
            </div>

            {/* Title */}
            <h2 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>
              {isKin && challenge.title_kin ? challenge.title_kin : challenge.title}
            </h2>

            {/* Description */}
            <div style={{
              color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
            }}>
              {(isKin && challenge.description_kin ? challenge.description_kin : challenge.description)
                .replace(/\*\*(.+?)\*\*/g, '$1')}
            </div>

            {/* Hint */}
            {challenge.hint && (
              <div style={{ marginTop: 12 }}>
                {showHint ? (
                  <div style={{
                    padding: '10px 14px', borderRadius: 'var(--radius)',
                    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                    fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55,
                  }}>
                    <div className="flex items-center gap-1.5 mb-1.5" style={{ color: '#f59e0b', fontWeight: 600, fontSize: 12 }}>
                      <Lightbulb size={13} />
                      {isKin ? 'Ikimenyetso' : 'Hint'}
                    </div>
                    {isKin && challenge.hint_kin ? challenge.hint_kin : challenge.hint}
                  </div>
                ) : (
                  <button
                    style={{
                      background: 'none', border: '1px dashed rgba(245,158,11,0.4)',
                      borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                      color: '#f59e0b', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
                    }}
                    onClick={() => { setShowHint(true); setHintUsed(true); }}
                  >
                    <Lightbulb size={13} />
                    {isKin ? 'Reba ikimenyetso (XP iza guke)' : 'Show hint (reduces XP)'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Test results panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: 'var(--text-3)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {isKin ? 'Ibigeragezo' : 'Tests'}
              </span>
              {results.length > 0 && (
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: allPassed ? '#10b981' : passedTests > 0 ? '#f59e0b' : '#ef4444',
                }}>
                  {passedTests}/{totalTests}
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div style={{ padding: '20px 0' }}>
                {challenge.test_cases.map((tc, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <Circle size={14} style={{ color: 'var(--line-strong)', flexShrink: 0, marginTop: 1 }} />
                    <span style={{ color: 'var(--text-3)', fontSize: 13 }}>
                      {isKin && tc.description_kin ? tc.description_kin : tc.description}
                    </span>
                  </div>
                ))}
                <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 16, fontStyle: 'italic' }}>
                  {isKin ? 'Kanda "Gukomeza" kugenzura kode yawe.' : 'Click "Run" to check your code.'}
                </p>
              </div>
            ) : (
              <div>
                {runtimeError && (
                  <div style={{
                    padding: '10px 12px', borderRadius: 8, marginBottom: 12,
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    fontSize: 12, color: '#ef4444', fontFamily: 'monospace',
                  }}>
                    ❌ {runtimeError}
                  </div>
                )}
                {results.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2.5">
                    {r.passed
                      ? <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }} />
                      : <XCircle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                    }
                    <div>
                      <span style={{ color: r.passed ? '#10b981' : 'var(--text-2)', fontSize: 13 }}>
                        {isKin && challenge.test_cases[i]?.description_kin
                          ? challenge.test_cases[i].description_kin
                          : r.description}
                      </span>
                      {r.error && (
                        <div style={{ color: 'var(--text-3)', fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>
                          {r.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS OVERLAY */}
      {phase === 'success' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          padding: '0 0 32px',
        }}>
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            borderRadius: 20, padding: '32px', maxWidth: 400, width: '100%',
            margin: '0 16px',
            animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(60px); opacity: 0; }
                to   { transform: translateY(0);    opacity: 1; }
              }
              @keyframes pop {
                0%   { transform: scale(0.5); opacity: 0; }
                70%  { transform: scale(1.15); }
                100% { transform: scale(1); opacity: 1; }
              }
            `}</style>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 52, lineHeight: 1, animation: 'pop 0.4s ease 0.1s both' }}>
                {(() => {
                  if (attemptCount === 1) return '🌟';
                  if (attemptCount <= 3) return '✅';
                  return '💪';
                })()}
              </div>
              <h3 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 800, marginTop: 12, marginBottom: 4 }}>
                {attemptCount === 1
                  ? (isKin ? 'Ushobora cyane!' : 'Perfect first try!')
                  : (isKin ? 'Byarangiye neza!' : 'Challenge passed!')}
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14 }}>
                {isKin
                  ? `Wagerageje inshuro ${attemptCount}${hintUsed ? ', wikoreye ikimenyetso' : ''}`
                  : `${attemptCount} attempt${attemptCount > 1 ? 's' : ''}${hintUsed ? ', hint used' : ''}`}
              </p>
            </div>

            {/* XP earned */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '14px',
              background: 'rgba(245,158,11,0.1)', borderRadius: 12,
              marginBottom: 20,
            }}>
              <Star size={20} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>
                +{computeXp(challenge.xp_reward, attemptCount, hintUsed)} XP
              </span>
              {xpEarned > 0 && (
                <span style={{ color: 'var(--text-3)', fontSize: 13 }}>
                  ({isKin ? 'Igiteranyo' : 'Total'}: {xpEarned})
                </span>
              )}
            </div>

            {/* Test summary */}
            <div className="flex items-center gap-2 justify-center mb-6" style={{ fontSize: 13, color: 'var(--text-2)' }}>
              <CheckCircle2 size={15} color="#10b981" />
              {results.length}/{results.length} {isKin ? 'bigeragezo byaranguye' : 'tests passed'}
            </div>

            <div className="flex gap-3">
              {idx < challenges.length - 1 ? (
                <>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => { setPhase('running'); }}
                  >
                    {isKin ? 'Reba ingirakamaro' : 'Review code'}
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, gap: 6 }}
                    onClick={handleNext}
                  >
                    {isKin ? 'Challenge ikurikiraho' : 'Next challenge'}
                    <ChevronRight size={15} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => { setPhase('running'); }}
                  >
                    {isKin ? 'Reba kode' : 'Review code'}
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, gap: 6 }}
                    onClick={handleNext}
                  >
                    <Trophy size={15} />
                    {isKin ? 'Rangiza Set' : 'Finish set'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
