import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Lightbulb, Play, CheckCircle2, XCircle, Circle,
  Trophy, RotateCcw, ChevronRight, Bot,
} from 'lucide-react';
import { CodeEditor } from './components/CodeEditor';
import { MwarimuPanel } from './components/MwarimuPanel';
import { runQuizTests, type TestResult } from '../lib/quiz-executor';
import {
  getSetChallenges, getQuizSets, startQuizSession, upsertQuizAttempt,
  completeQuizSession, markSetCompleted, awardXp,
  getOrCreateMyCodename, postPeerActivity,
  type QuizSet, type QuizChallenge, type ErrorLogEntry,
} from '../lib/quiz-db';
import { getStudentClasses } from '../lib/db';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
}

type Phase = 'loading' | 'running' | 'success' | 'complete';

function renderDescription(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{
          background: 'var(--surface-2)', border: '1px solid var(--line)',
          padding: '1px 5px', borderRadius: 4, fontFamily: 'var(--mono)',
          fontSize: '0.88em', color: 'var(--text)',
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part === '\n') return <br key={i} />;
    return <span key={i}>{part}</span>;
  });
}

const TYPE_LABEL: Record<string, { en: string; kin: string }> = {
  fix_bug:       { en: 'Fix the Bug',        kin: 'Gusana Ikosa'          },
  complete_code: { en: 'Complete the Code',  kin: 'Uzuza Kode'            },
  write_scratch: { en: 'Write from Scratch', kin: 'Andika Uhereye Ibanze' },
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

  const [attemptCount, setAttemptCount] = useState(0);
  const [challengeStartMs, setChallengeStartMs] = useState(Date.now());
  const errorLogRef = useRef<ErrorLogEntry[]>([]);
  const sessionIdRef = useRef<string | null>(null);

  const [xpEarned, setXpEarned] = useState(0);
  const [passedCount, setPassedCount] = useState(0);

  const [rightTab, setRightTab] = useState<'challenge' | 'mwarimu'>('challenge');
  const [mwarimuLang, setMwarimuLang] = useState<'EN' | 'KIN'>(language);
  const [mwarimuDot, setMwarimuDot] = useState(false);
  const [mwarimuCount, setMwarimuCount] = useState(0);

  const classIdRef = useRef<string | null>(null);
  const codenameRef = useRef<string | null>(null);
  const tabSwitchesRef = useRef(0);
  const [tabWarning, setTabWarning] = useState(false);

  usePageTitle(set ? `${set.title} · EduCode` : 'Challenge · EduCode');

  // Tab visibility tracking — log switches, show soft warning on return
  useEffect(() => {
    if (phase !== 'running') return;
    const onVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchesRef.current++;
      } else {
        setTabWarning(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [phase]);

  useEffect(() => {
    if (!tabWarning) return;
    const timer = setTimeout(() => setTabWarning(false), 7000);
    return () => clearTimeout(timer);
  }, [tabWarning]);

  useEffect(() => {
    if (!setId) return;
    Promise.all([
      getQuizSets(),
      getSetChallenges(setId),
      getStudentClasses(),
      getOrCreateMyCodename(),
    ]).then(([allSets, chs, { data: classes }, codename]) => {
      const found = allSets.find(s => s.id === setId) ?? null;
      setSet(found);
      setChallenges(chs);
      classIdRef.current = classes?.[0]?.id ?? null;
      codenameRef.current = codename;
      // Start session after we have class_id
      return startQuizSession(setId, classIdRef.current ?? undefined)
        .then(session => {
          if (session.data) sessionIdRef.current = session.data.id;
          if (chs.length > 0) {
            setJsCode(chs[0].starter_js);
            setHtmlCode(chs[0].starter_html);
          }
          setPhase('running');
          setChallengeStartMs(Date.now());
        });
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
    setRightTab('challenge');
    setMwarimuDot(false);
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

    if (rightTab !== 'mwarimu') setMwarimuDot(true);

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
    if (attempts === 1) xp = Math.round(xp * 1.5);
    else if (attempts > 3) xp = Math.round(xp * 0.7);
    if (usedHint) xp = Math.round(xp * 0.75); // 25% reduction — keeps hints affordable
    return xp;
  };

  const handleNext = async () => {
    // Post peer activity for completed challenge
    if (challenge && classIdRef.current && codenameRef.current) {
      postPeerActivity(
        classIdRef.current, codenameRef.current,
        'challenge_completed', challenge.title,
      );
    }

    const nextIdx = idx + 1;
    if (nextIdx >= challenges.length) {
      const total = xpEarned;
      if (sessionIdRef.current && set) {
        await completeQuizSession(sessionIdRef.current, total, passedCount, challenges.length);
        if (passedCount === challenges.length) {
          await markSetCompleted(set.id, total);
          // Post set completion to peer feed
          if (classIdRef.current && codenameRef.current) {
            postPeerActivity(
              classIdRef.current, codenameRef.current,
              'set_completed', set.title,
            );
          }
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

  // ── SESSION COMPLETE ───────────────────────────────────────────────────────
  if (phase === 'complete') {
    const allDone = passedCount === challenges.length;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'var(--bg)' }}>
        <div className="card" style={{
          maxWidth: 480, width: '100%', textAlign: 'center', padding: '40px 32px',
        }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            {allDone
              ? (isKin ? 'Set Yarangiye!' : 'Set Complete!')
              : (isKin ? 'Imikino Yarangiye' : 'Session Finished')}
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: 16, marginBottom: 32 }}>
            {isKin
              ? `Warangije challenge ${passedCount} muri ${challenges.length} neza.`
              : `You passed ${passedCount} out of ${challenges.length} challenges.`}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div style={{
              padding: '16px', borderRadius: 'var(--radius)',
              background: 'var(--surface-2)', border: '1px solid var(--line)',
              textAlign: 'center',
            }}>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                {xpEarned}
              </p>
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>XP {isKin ? 'wabonanye' : 'earned'}</p>
            </div>
            <div style={{
              padding: '16px', borderRadius: 'var(--radius)',
              background: 'var(--surface-2)', border: '1px solid var(--line)',
              textAlign: 'center',
            }}>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                {passedCount}/{challenges.length}
              </p>
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>{isKin ? 'Byaranguye' : 'Passed'}</p>
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

  // ── MAIN RUNNER ────────────────────────────────────────────────────────────
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
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-3)', fontSize: 14 }}>{isKin && set.title_kin ? set.title_kin : set.title}</span>
            <span style={{ color: 'var(--line-strong)' }}>›</span>
            <span className="font-semibold" style={{ color: 'var(--text)', fontSize: 14 }}>
              {isKin && challenge.title_kin ? challenge.title_kin : challenge.title}
            </span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {challenges.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 20 : 8, height: 8,
              borderRadius: 4,
              background: i < idx ? 'var(--text-2)' : i === idx ? 'var(--text)' : 'var(--line-strong)',
              transition: 'width 0.3s, background 0.3s',
            }} />
          ))}
        </div>

        {/* XP counter */}
        <span className="pill" style={{ fontWeight: 500, fontSize: 14 }}>
          {xpEarned} XP
        </span>

        <span style={{ color: 'var(--text-3)', fontSize: 14 }}>
          {idx + 1}/{challenges.length}
        </span>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT: Code editor */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 60%', borderRight: '1px solid var(--line)', overflow: 'hidden' }}>

          {/* complete_code instruction banner */}
          {challenge.challenge_type === 'complete_code' && (
            <div style={{
              padding: '9px 16px', flexShrink: 0,
              background: 'var(--surface-2)',
              borderBottom: '1px solid var(--line)',
              borderLeft: '3px solid var(--line-strong)',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 14, color: 'var(--text-2)',
            }}>
              <span>
                {isKin ? (
                  <>Hindura buri{' '}
                    <code style={{ background: 'var(--surface)', border: '1px solid var(--line-strong)', padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: '0.9em', color: 'var(--text)', fontWeight: 600 }}>____</code>
                    {' '}ukoreshe kode yawe, hanyuma kanda <strong style={{ color: 'var(--text)' }}>Run</strong>.</>
                ) : (
                  <>Replace each{' '}
                    <code style={{ background: 'var(--surface)', border: '1px solid var(--line-strong)', padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: '0.9em', color: 'var(--text)', fontWeight: 600 }}>____</code>
                    {' '}with your code, then click <strong style={{ color: 'var(--text)' }}>Run</strong>.</>
                )}
              </span>
            </div>
          )}

          {/* DOM HTML notice */}
          {challenge.starter_html && challenge.challenge_type !== 'complete_code' && (
            <div style={{
              padding: '9px 16px', flexShrink: 0,
              background: 'var(--surface-2)',
              borderBottom: '1px solid var(--line)',
              borderLeft: '3px solid var(--line-strong)',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 14, color: 'var(--text-2)',
            }}>
              <span>
                {isKin
                  ? <>Iyi challenge ikoresha <strong style={{ color: 'var(--text)' }}>HTML</strong>. Kanda tab ya <strong style={{ color: 'var(--text)' }}>HTML</strong> haruguru kugira ngo urebe urupapuro.</>
                  : <>This challenge controls a webpage. Click the <strong style={{ color: 'var(--text)' }}>HTML tab</strong> above to see the page your code will change.</>}
              </span>
            </div>
          )}

          {/* complete_code + has HTML */}
          {challenge.challenge_type === 'complete_code' && challenge.starter_html && (
            <div style={{
              padding: '9px 16px', flexShrink: 0,
              background: 'var(--surface-2)',
              borderBottom: '1px solid var(--line)',
              borderLeft: '3px solid var(--line-strong)',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 14, color: 'var(--text-2)',
            }}>
              <span>
                {isKin
                  ? <>Iyi challenge ikoresha <strong style={{ color: 'var(--text)' }}>HTML</strong>. Kanda tab ya <strong style={{ color: 'var(--text)' }}>HTML</strong> haruguru kugira ngo urebe urupapuro.</>
                  : <>This challenge also has HTML. Click the <strong style={{ color: 'var(--text)' }}>HTML tab</strong> above to see the page structure.</>}
              </span>
            </div>
          )}

          <CodeEditor
            jsCode={jsCode}
            htmlCode={htmlCode}
            onJsChange={setJsCode}
            onHtmlChange={setHtmlCode}
            language={language}
            blockPaste
          />

          {tabWarning && (
            <div style={{
              padding: '9px 14px', flexShrink: 0,
              background: 'var(--surface-2)',
              borderTop: '1px solid var(--line)',
              borderLeft: '3px solid var(--text-3)',
              display: 'flex', alignItems: 'flex-start', gap: 8,
              fontSize: 13, color: 'var(--text-2)', lineHeight: 1.45,
            }}>
              <span style={{ flex: 1 }}>
                {isKin
                  ? 'Twabonye wasimbuye ibikari. Gerageza gukemura ikibazo wabikoze — nibyo bigufasha kwiga.'
                  : "We noticed you switched tabs. If you're checking for the answer, you'll learn less — try to work it out yourself first."}
              </span>
              <button
                onClick={() => setTabWarning(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', flexShrink: 0, fontSize: 16, lineHeight: 1, padding: '0 2px' }}
                aria-label="Dismiss"
              >×</button>
            </div>
          )}

          {/* Run bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderTop: '1px solid var(--line)',
            background: 'var(--surface-2)', flexShrink: 0,
          }}>
            {runtimeError && (
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-2)', fontFamily: 'var(--mono)' }} className="truncate">
                {runtimeError.replace(/^Error:\s*/, '')}
              </span>
            )}
            {!runtimeError && output && (
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--mono)' }} className="truncate">
                {output.split('\n')[0]}
              </span>
            )}
            {!runtimeError && !output && <span style={{ flex: 1 }} />}

            <button
              className="btn btn-primary"
              style={{ gap: 6, padding: '6px 16px', fontSize: 14, flexShrink: 0 }}
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

        {/* RIGHT: Tabbed panel */}
        <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Tab bar */}
          <div style={{
            display: 'flex', borderBottom: '1px solid var(--line)',
            background: 'var(--surface-2)', flexShrink: 0,
          }}>
            {(['challenge', 'mwarimu'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setRightTab(tab); if (tab === 'mwarimu') setMwarimuDot(false); }}
                style={{
                  flex: 1, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 6, fontSize: 14, fontWeight: rightTab === tab ? 600 : 400,
                  color: rightTab === tab ? 'var(--text)' : 'var(--text-3)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: rightTab === tab ? '2px solid var(--text-2)' : '2px solid transparent',
                  position: 'relative', transition: 'color 0.15s',
                }}
              >
                {tab === 'mwarimu' && <Bot size={14} />}
                {tab === 'challenge' ? 'Challenge' : (isKin ? 'Baza Mwarimu' : 'Ask Mwarimu')}
                {tab === 'mwarimu' && mwarimuDot && (
                  <span style={{
                    position: 'absolute', top: 8, right: 12,
                    width: 7, height: 7, borderRadius: '50%', background: 'var(--text-2)',
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Mwarimu panel */}
          <div style={{ display: rightTab === 'mwarimu' ? 'flex' : 'none', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
            {challenge && (
              <MwarimuPanel
                code={jsCode}
                error={runtimeError}
                runCount={attemptCount}
                instructions={challenge.description}
                language={mwarimuLang}
                onLanguageChange={setMwarimuLang}
                examMode={false}
                sessionId={sessionIdRef.current}
                challengeId={challenge.id}
                onInteractionLogged={() => setMwarimuCount(c => c + 1)}
              />
            )}
          </div>

          {/* Challenge card */}
          <div style={{
            display: rightTab === 'challenge' ? 'block' : 'none',
            padding: '16px', borderBottom: '1px solid var(--line)',
            overflowY: 'auto', maxHeight: '55%', flexShrink: 0,
          }}>
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="pill" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isKin ? typeInfo.kin : typeInfo.en}
              </span>
              <span className="pill" style={{ fontSize: 12 }}>
                {challenge.difficulty}
              </span>
              {attemptCount > 0 && (
                <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  <RotateCcw size={10} />
                  {attemptCount}×
                </span>
              )}
            </div>

            {/* Title */}
            <h2 style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
              {isKin && challenge.title_kin ? challenge.title_kin : challenge.title}
            </h2>

            {/* Description */}
            <div style={{ color: 'var(--text-2)', fontSize: 15, lineHeight: 1.65 }}>
              {renderDescription(isKin && challenge.description_kin ? challenge.description_kin : challenge.description)}
            </div>

            {/* Hint */}
            {challenge.hint && (
              <div style={{ marginTop: 12 }}>
                {showHint ? (
                  <div style={{
                    padding: '10px 14px', borderRadius: 'var(--radius)',
                    background: 'var(--surface-2)', border: '1px solid var(--line)',
                    fontSize: 14, color: 'var(--text-2)', lineHeight: 1.55,
                  }}>
                    <div className="flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--text-3)', fontWeight: 600, fontSize: 13 }}>
                      <Lightbulb size={13} />
                      {isKin ? 'Ikimenyetso' : 'Hint'}
                    </div>
                    {isKin && challenge.hint_kin ? challenge.hint_kin : challenge.hint}
                  </div>
                ) : (
                  <button
                    style={{
                      background: 'none', border: '1px dashed var(--line-strong)',
                      borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                      color: 'var(--text-3)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                    }}
                    onClick={() => { setShowHint(true); setHintUsed(true); }}
                  >
                    <Lightbulb size={13} />
                    {isKin ? 'Reba ikimenyetso (XP iza guke)' : 'Show hint (costs a little XP)'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Test results panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: 'var(--text-3)', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {isKin ? 'Ibigeragezo' : 'Tests'}
              </span>
              {results.length > 0 && (
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>
                  {passedTests}/{totalTests}
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div style={{ padding: '20px 0' }}>
                {challenge.test_cases.map((tc, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <Circle size={14} style={{ color: 'var(--line-strong)', flexShrink: 0, marginTop: 1 }} />
                    <span style={{ color: 'var(--text-3)', fontSize: 14 }}>
                      {isKin && tc.description_kin ? tc.description_kin : tc.description}
                    </span>
                  </div>
                ))}
                <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 16, fontStyle: 'italic' }}>
                  {isKin ? 'Kanda "Gukomeza" kugenzura kode yawe.' : 'Click "Run" to check your code.'}
                </p>
              </div>
            ) : (
              <div>
                {runtimeError && (
                  <div style={{
                    padding: '10px 12px', borderRadius: 8, marginBottom: 12,
                    background: 'var(--surface-2)', border: '1px solid var(--line-strong)',
                    fontSize: 13, color: 'var(--text-2)', fontFamily: 'var(--mono)',
                  }}>
                    {runtimeError}
                  </div>
                )}
                {results.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2.5">
                    {r.passed
                      ? <CheckCircle2 size={15} style={{ color: 'var(--text)', flexShrink: 0, marginTop: 1 }} />
                      : <XCircle size={15} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 1 }} />
                    }
                    <div>
                      <span style={{ color: r.passed ? 'var(--text)' : 'var(--text-2)', fontSize: 14 }}>
                        {isKin && challenge.test_cases[i]?.description_kin
                          ? challenge.test_cases[i].description_kin
                          : r.description}
                      </span>
                      {r.error && (
                        <div style={{ color: 'var(--text-3)', fontSize: 12, fontFamily: 'var(--mono)', marginTop: 2 }}>
                          {r.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {results.some(r => !r.passed) && attemptCount >= 2 && rightTab !== 'mwarimu' && (
                  <button
                    onClick={() => { setRightTab('mwarimu'); setMwarimuDot(false); }}
                    style={{
                      marginTop: 14, width: '100%',
                      padding: '9px 14px',
                      background: 'none',
                      border: '1px dashed var(--line-strong)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: 13, color: 'var(--text-2)',
                    }}
                  >
                    <Bot size={14} />
                    {isKin ? 'Ntibishoboka? Baza Mwarimu' : 'Stuck? Ask Mwarimu'}
                  </button>
                )}
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
            `}</style>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h3 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
                {attemptCount === 1
                  ? (isKin ? 'Ushobora cyane!' : 'Perfect first try!')
                  : (isKin ? 'Byarangiye neza!' : 'Challenge passed!')}
              </h3>
              <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
                {isKin
                  ? `Wagerageje inshuro ${attemptCount}${hintUsed ? ', wikoreye ikimenyetso' : ''}`
                  : `${attemptCount} attempt${attemptCount > 1 ? 's' : ''}${hintUsed ? ', hint used' : ''}`}
              </p>
            </div>

            {/* XP earned */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '14px',
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 12, marginBottom: 20,
            }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>
                +{computeXp(challenge.xp_reward, attemptCount, hintUsed)} XP
              </span>
              {xpEarned > 0 && (
                <span style={{ color: 'var(--text-3)', fontSize: 14 }}>
                  ({isKin ? 'Igiteranyo' : 'Total'}: {xpEarned})
                </span>
              )}
            </div>

            {/* Test summary */}
            <div className="flex items-center gap-2 justify-center mb-6" style={{ fontSize: 14, color: 'var(--text-2)' }}>
              <CheckCircle2 size={15} style={{ color: 'var(--text-2)' }} />
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
