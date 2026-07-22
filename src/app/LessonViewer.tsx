import { AppNav } from './components/AppNav';
import { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { RatingModal } from './components/RatingModal';
import { Play, CheckCircle, Loader, Zap, BookOpen, Code2, HelpCircle, Monitor, Send, ArrowLeft } from 'lucide-react';
import { completeLesson, type CourseLesson } from '../lib/db';
import { executeCode } from '../lib/code-executor';
import { getLessonAIHelp } from '../lib/ai';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  lesson: CourseLesson;
  courseTitle: string;
  allLessons?: CourseLesson[];
  language: 'EN' | 'KIN';
  nextLesson: CourseLesson | null;
  onBack: () => void;
  onCompleted: (xpEarned: number) => void;
  onNextLesson: (lesson: CourseLesson) => void;
}

// ─── Content Renderer ─────────────────────────────────────────────────────────

function RenderContent({ text }: { text: string }) {
  const segments = text.split(/(```[\w]*\n?[\s\S]*?```)/g);
  return (
    <>
      {segments.map((seg, i) => {
        const codeMatch = seg.match(/^```[\w]*\n?([\s\S]*?)```$/);
        if (codeMatch) {
          return (
            <div key={i} className="code" style={{ margin: '22px 0' }}>
              <pre style={{ fontSize: 13, lineHeight: 1.7 }}>{codeMatch[1].trim()}</pre>
            </div>
          );
        }
        return (
          <div key={i}>
            {seg.split('\n').map((line, li) => {
              if (!line.trim()) return <div key={li} style={{ height: 8 }} />;
              const parts = line.split(/\*\*(.+?)\*\*/g);
              return (
                <p key={li} style={{ fontSize: 16, lineHeight: 1.72, color: 'var(--text)', marginBottom: 18 }}>
                  {parts.map((p, pi) =>
                    pi % 2 === 1
                      ? <strong key={pi} style={{ fontWeight: 500 }}>{p}</strong>
                      : p
                  )}
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

// ─── Reading Lesson ───────────────────────────────────────────────────────────

function ReadingLesson({ lesson, language, onComplete, completing }: {
  lesson: CourseLesson; language: 'EN' | 'KIN'; onComplete: () => void; completing: boolean;
}) {
  const isKin = language === 'KIN';
  const content = isKin && lesson.content_kin ? lesson.content_kin : lesson.content;
  return (
    <div>
      <div className="card pad-lg" style={{ marginBottom: 24 }}>
        <RenderContent text={content ?? ''} />
      </div>
      <button
        onClick={onComplete}
        disabled={completing}
        className="btn btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        {completing ? (
          <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
          </svg>
        ) : (
          <CheckCircle size={15} />
        )}
        {isKin ? 'Shyira ko wasomye' : 'Mark as Read'}
      </button>
    </div>
  );
}

// ─── Coding Lesson ────────────────────────────────────────────────────────────

function CodingLesson({ lesson, language, onComplete, completing, onCodeChange, onRunResult }: {
  lesson: CourseLesson; language: 'EN' | 'KIN'; onComplete: (usedSolution?: boolean) => void; completing: boolean;
  onCodeChange?: (code: string) => void;
  onRunResult?: (error: string | null, failedCount: number) => void;
}) {
  const isKin = language === 'KIN';
  const isHtmlExercise = !lesson.exercise_data?.starter_code;
  const [code, setCode] = useState(lesson.exercise_data?.starter_code ?? '');
  const [htmlCode, setHtmlCode] = useState('');
  const [output, setOutput] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  const tests = lesson.exercise_data?.tests ?? [];
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; actual: string }>>([]);

  const solution = lesson.exercise_data?.solution ?? null;
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showSolutionWarning, setShowSolutionWarning] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const UNLOCK_AFTER = 3;

  // Expose current code to parent (for rail chat context)
  useEffect(() => {
    onCodeChange?.(isHtmlExercise ? htmlCode : code);
  }, [code, htmlCode]);

  const run = useCallback(async () => {
    if (isHtmlExercise) {
      setPreviewSrc(htmlCode);
      setHasRun(true);
    } else {
      setRunning(true);
      const result = await executeCode(code);
      let out = result.output;
      if (result.error) out = (out ? out + '\n' : '') + `❌ ${result.error}`;
      setOutput(out || '(no output)');
      setHasRun(true);

      let failedN = 0;
      if (tests.length > 0) {
        const actualLines = (result.output ?? '').split('\n').map(l => l.trim());
        const results = tests.map((t, i) => {
          const expected = t.expectedOutput.trim();
          const actual = tests.length === 1
            ? (result.output ?? '').trim()
            : (actualLines[i] ?? '');
          const passed = !result.error && (
            actual === expected ||
            actual.toLowerCase() === expected.toLowerCase() ||
            actual.includes(expected)
          );
          return { passed, actual };
        });
        setTestResults(results);
        const allPassed = results.every(r => r.passed);
        if (!allPassed || result.error) {
          setFailedAttempts(n => n + 1);
          failedN = results.filter(r => !r.passed).length || (result.error ? 1 : 0);
        }
      } else if (result.error) {
        setFailedAttempts(n => n + 1);
        failedN = 1;
      }

      setRunning(false);
      if (result.error || failedN > 0) onRunResult?.(result.error ?? null, failedN);
    }
  }, [code, htmlCode, isHtmlExercise, tests]);

  const hasError = output.includes('❌');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Instructions */}
      <div className="card pad-lg" style={{ background: 'var(--surface)' }}>
        <p style={{ fontSize: 14, color: 'var(--text-2)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          {lesson.exercise_data?.instructions}
        </p>
        {(() => {
          const ed = lesson.exercise_data;
          if (!ed) return null;
          const hints: string[] = ed.hints?.length ? ed.hints : ed.hint ? [ed.hint] : [];
          if (hints.length === 0) return null;
          return (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {hints.slice(0, hintsRevealed).map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius)', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: 'var(--text)', flexShrink: 0 }}>
                    {isKin ? `Icyifuzo ${i + 1}` : `Hint ${i + 1}`}
                  </span>
                  <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--text-2)', margin: 0 }}>{h}</p>
                </div>
              ))}
              {hintsRevealed < hints.length && (
                <button
                  onClick={() => setHintsRevealed(n => n + 1)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  💡 {isKin
                    ? `Bona icyifuzo ${hintsRevealed + 1} (${hints.length - hintsRevealed} bisigaye)`
                    : `Show hint ${hintsRevealed + 1} of ${hints.length}`}
                </button>
              )}
              {hintsRevealed === hints.length && hintsRevealed > 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {isKin ? '✓ Ibyifuzo byose biragaragara' : '✓ All hints revealed'}
                </p>
              )}
            </div>
          );
        })()}
      </div>

      {isHtmlExercise ? (
        <>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--mono)', color: 'var(--sx-keyword)' }}>index.html</span>
              <button onClick={run} className="btn btn-primary sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Monitor size={12} />
                {isKin ? 'Reba uko bimeze' : 'Preview'}
              </button>
            </div>
            <CodeMirror
              value={htmlCode}
              onChange={setHtmlCode}
              theme={vscodeDark}
              extensions={[html()]}
              basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: false }}
              style={{ fontSize: '13px' }}
              placeholder="<!-- Write your full HTML page here -->"
            />
          </div>

          {previewSrc && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-3)' }}>Preview</span>
              </div>
              <iframe
                srcDoc={previewSrc}
                title="preview"
                style={{ width: '100%', height: 320, border: 'none', background: '#fff' }}
                sandbox="allow-scripts"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-3)' }}>JavaScript</span>
              <button onClick={run} disabled={running} className="btn btn-primary sm" style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: running ? 0.5 : 1 }}>
                {running ? (
                  <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                    <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
                  </svg>
                ) : <Play size={12} />}
                {isKin ? 'Tangiza (Run)' : 'Run'}
              </button>
            </div>
            <CodeMirror
              value={code}
              onChange={setCode}
              theme={vscodeDark}
              extensions={[javascript()]}
              basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: false }}
              style={{ fontSize: '13px' }}
            />
          </div>

          {output && (
            <div style={{ padding: '14px 16px', borderRadius: 'var(--radius)', background: 'var(--bg)', border: '1px solid var(--line)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-3)' }}>Output</p>
              <pre style={{ fontSize: 13.5, whiteSpace: 'pre-wrap', fontFamily: 'var(--mono)', color: hasError ? 'var(--error)' : '#9eaa84', lineHeight: 1.6 }}>
                {output}
              </pre>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
                  {isKin ? 'Ibigerageza' : 'Test Cases'}
                </p>
                <span style={{ fontSize: 13, fontWeight: 500, padding: '2px 8px', borderRadius: 99,
                  background: testResults.every(r => r.passed) ? 'rgba(158,170,132,0.15)' : 'rgba(210,136,123,0.12)',
                  color: testResults.every(r => r.passed) ? '#9eaa84' : 'var(--error)' }}>
                  {testResults.filter(r => r.passed).length}/{testResults.length} {isKin ? 'byatsinzwe' : 'passed'}
                </span>
              </div>
              <div>
                {tests.map((t, i) => {
                  const res = testResults[i];
                  const passed = res?.passed ?? false;
                  return (
                    <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ marginTop: 2, flexShrink: 0, fontSize: 14 }}>{passed ? '✅' : '❌'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)' }}>{t.description}</p>
                        {!passed && res && (
                          <div style={{ marginTop: 4 }}>
                            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                              {isKin ? 'Byategerezwaga' : 'Expected'}:{' '}
                              <span style={{ fontFamily: 'var(--mono)', color: '#9eaa84' }}>{t.expectedOutput}</span>
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                              {isKin ? 'Byaboneka' : 'Got'}:{' '}
                              <span style={{ fontFamily: 'var(--mono)', color: 'var(--error)' }}>{res.actual || '(no output)'}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* See Solution */}
      {solution && failedAttempts >= UNLOCK_AFTER && (
        <div>
          {!solutionRevealed ? (
            <button
              onClick={() => setShowSolutionWarning(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              🔓 {isKin ? `Reba igisubizo (nyuma y'igerageza ${UNLOCK_AFTER})` : `See solution (after ${UNLOCK_AFTER} attempts)`}
            </button>
          ) : (
            <div className="card" style={{ overflow: 'hidden', border: '1px solid rgba(210,136,123,0.25)' }}>
              <div style={{ padding: '10px 16px', background: 'rgba(210,136,123,0.06)', borderBottom: '1px solid rgba(210,136,123,0.15)' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--error)' }}>
                  {isKin ? '💡 Igisubizo — XP ntizahabwa' : '💡 Solution — no XP awarded'}
                </span>
              </div>
              <CodeMirror
                value={solution}
                theme={vscodeDark}
                extensions={[javascript()]}
                editable={false}
                basicSetup={{ lineNumbers: true, highlightActiveLine: false, foldGutter: false }}
                style={{ fontSize: '13px' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Solution warning modal */}
      {showSolutionWarning && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="card pad-lg" style={{ width: '100%', maxWidth: 360 }}>
            <h3 style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
              {isKin ? 'Urashaka kureba igisubizo?' : 'View the solution?'}
            </h3>
            <p style={{ fontSize: 13.5, marginBottom: 20, color: 'var(--text-2)', lineHeight: 1.55 }}>
              {isKin
                ? "Niba ureba igisubizo, ntuzahabwa XP kuri iri somo."
                : "Viewing the solution means no XP for this lesson."}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowSolutionWarning(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                {isKin ? 'Subira inyuma' : 'Go back'}
              </button>
              <button
                onClick={() => { setSolutionRevealed(true); setShowSolutionWarning(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', background: 'rgba(210,136,123,0.1)', color: 'var(--error)', border: '1px solid rgba(210,136,123,0.25)' }}
              >
                {isKin ? 'Yego, reba igisubizo' : 'Yes, show solution'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete button */}
      {(() => {
        const allTestsPassed = tests.length === 0 || testResults.every(r => r.passed);
        const canComplete = hasRun && (isHtmlExercise || !hasError) && allTestsPassed;
        if (!canComplete) {
          if (hasRun && tests.length > 0 && !allTestsPassed) {
            return (
              <p style={{ fontSize: 13.5, textAlign: 'center', padding: '8px 0', color: 'var(--text-3)' }}>
                {isKin
                  ? '⚠️ Rangiza ibigerageza byose mbere yo gusoza isomo'
                  : '⚠️ Pass all test cases to complete the lesson'}
              </p>
            );
          }
          return null;
        }
        return (
          <button
            onClick={() => onComplete(solutionRevealed)}
            disabled={completing}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: completing ? 0.5 : 1 }}
          >
            {completing ? (
              <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
              </svg>
            ) : <CheckCircle size={15} />}
            {solutionRevealed
              ? (isKin ? 'Rangiza Isomo (nta XP)' : 'Complete Lesson (no XP)')
              : (isKin ? 'Rangiza Isomo' : 'Complete Lesson')}
          </button>
        );
      })()}
    </div>
  );
}

// ─── Quiz Lesson ──────────────────────────────────────────────────────────────

function QuizLesson({ lesson, language, onComplete, completing }: {
  lesson: CourseLesson; language: 'EN' | 'KIN'; onComplete: (score: number) => void; completing: boolean;
}) {
  const isKin = language === 'KIN';
  const questions = lesson.exercise_data?.questions ?? [];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id] !== undefined);

  const handleSubmit = () => {
    const correct = questions.filter(q => answers[q.id] === q.correct).length;
    setScore(correct);
    setSubmitted(true);
  };

  const perfect = score === questions.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {questions.map((q, qi) => (
        <div key={q.id} className="card pad-lg">
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text)', lineHeight: 1.5 }}>
            {qi + 1}. {q.text}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              const correct  = submitted && oi === q.correct;
              const wrong    = submitted && selected && oi !== q.correct;
              return (
                <button
                  key={oi}
                  onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: oi }))}
                  disabled={submitted}
                  style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px',
                    borderRadius: 'var(--radius)', fontSize: 13.5, cursor: submitted ? 'default' : 'pointer',
                    background: correct ? 'rgba(158,170,132,0.12)' : wrong ? 'var(--error-dim)' : selected ? 'var(--surface-2)' : 'var(--surface)',
                    border: correct ? '1px solid rgba(158,170,132,0.3)' : wrong ? '1px solid rgba(210,136,123,0.25)' : selected ? '1px solid var(--line-strong)' : '1px solid var(--line)',
                    color: correct ? '#9eaa84' : wrong ? 'var(--error)' : selected ? 'var(--text)' : 'var(--text-2)',
                  }}>
                  {String.fromCharCode(65 + oi)}. {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: !allAnswered ? 0.4 : 1 }}
        >
          {isKin ? 'Ohereza Ibisubizo' : 'Submit Answers'}
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card pad-lg" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)' }}>
              {score}/{questions.length}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>
              {perfect
                ? (isKin ? 'Ni byiza cyane! Wasubije neza byose.' : 'Perfect! You got everything right.')
                : (isKin ? 'Wagerageje! Ongera usuzume ibyo utatsinze.' : "Good effort! Review the ones you missed.")}
            </p>
          </div>
          <button
            onClick={() => onComplete(score)}
            disabled={completing}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: completing ? 0.5 : 1 }}
          >
            {completing ? (
              <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
              </svg>
            ) : <CheckCircle size={15} />}
            {isKin ? 'Rangiza Isomo' : 'Complete Lesson'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Lesson Viewer Root ───────────────────────────────────────────────────────

export default function LessonViewer({ lesson, courseTitle, allLessons, language, nextLesson, onBack, onCompleted, onNextLesson }: Props) {
  const isKin = language === 'KIN';
  const lessonTitle = isKin && lesson.title_kin ? lesson.title_kin : lesson.title;
  usePageTitle(`${lessonTitle} · EduCode`);
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [readPct, setReadPct] = useState(0);

  // ── Rail Mwarimu chat (works for all lesson types) ────────────────────────
  const codeCtxRef = useRef('');
  const instrCtx = lesson.exercise_data?.instructions ?? '';
  const [railMessages, setRailMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; auto?: boolean }>>([]);
  const [railLoading, setRailLoading] = useState(false);
  const [railInput, setRailInput] = useState('');
  const railEndRef = useRef<HTMLDivElement>(null);
  const [railWidth, setRailWidth] = useState(360);

  // Feature 1 — proactive error hint
  const railLoadingRef = useRef(false);
  useEffect(() => { railLoadingRef.current = railLoading; }, [railLoading]);
  const lastAutoRef = useRef(0);

  const pushAutoHint = useCallback(async (error: string | null, failedCount: number) => {
    if (railLoadingRef.current) return;
    const now = Date.now();
    if (now - lastAutoRef.current < 8000) return;
    lastAutoRef.current = now;
    const q = language === 'KIN'
      ? (error ? `Namaze gukora code maze ibica iki ikosa: ${error}` : `Ibigerageza ${failedCount} byanze.`)
      : (error ? `I ran my code and got this error: ${error}` : `${failedCount} test${failedCount > 1 ? 's' : ''} failed.`);
    setRailLoading(true);
    const answer = await getLessonAIHelp(q, codeCtxRef.current, instrCtx, language, 'coding');
    setRailMessages(prev => [...prev, { role: 'ai', text: answer, auto: true }]);
    setRailLoading(false);
  }, [language, instrCtx]);

  // Feature 3 — post-lesson reflection
  const [reflection, setReflection] = useState<string | null>(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);

  const startRailResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = railWidth;
    const onMove = (mv: MouseEvent) => {
      const dx = startX - mv.clientX; // drag left = wider rail
      setRailWidth(Math.max(260, Math.min(620, startW + dx)));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [railWidth]);

  useEffect(() => {
    railEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [railMessages, railLoading]);

  const RAIL_BUSY_RE = /bit busy right now|he'll be back shortly/i;

  const askRail = async () => {
    const q = railInput.trim();
    if (!q || railLoading) return;
    setRailInput('');
    setRailMessages(prev => [...prev, { role: 'user', text: q }]);
    setRailLoading(true);
    const answer = await getLessonAIHelp(q, codeCtxRef.current, instrCtx, language, lesson.lesson_type as 'reading' | 'coding' | 'quiz');
    setRailMessages(prev => {
      const lastAiIdx = prev.reduce((acc, m, i) => m.role === 'ai' ? i : acc, -1);
      if (lastAiIdx >= 0 && RAIL_BUSY_RE.test(prev[lastAiIdx].text)) {
        return prev.map((m, i) => i === lastAiIdx ? { ...m, text: answer } : m);
      }
      return [...prev, { role: 'ai', text: answer }];
    });
    setRailLoading(false);
  };

  const typeInfo = {
    reading: { icon: <BookOpen size={13} />, label: isKin ? 'Gusoma' : 'Reading',      color: '#7eb8cf', bg: 'rgba(126,184,207,0.08)', border: 'rgba(126,184,207,0.2)' },
    coding:  { icon: <Code2 size={13} />,    label: isKin ? 'Gukora Code' : 'Coding',  color: '#9eaa84', bg: 'rgba(158,170,132,0.08)', border: 'rgba(158,170,132,0.2)' },
    quiz:    { icon: <HelpCircle size={13} />,label: isKin ? 'Ibibazo (Quiz)' : 'Quiz', color: '#cda86a', bg: 'rgba(205,168,106,0.08)', border: 'rgba(205,168,106,0.2)' },
  }[lesson.lesson_type];

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      setReadPct(scrollable > 0 ? Math.round((el.scrollTop / scrollable) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleComplete = async (score?: number, usedSolution?: boolean) => {
    setCompleting(true);
    const { xpAwarded: earned } = await completeLesson(lesson.id, score, usedSolution ? 0 : undefined);
    setXpAwarded(earned);
    setCompleting(false);

    // Feature 3 — fire reflection in background while rating modal is open
    setReflectionLoading(true);
    const reflCtx = lesson.lesson_type === 'reading'
      ? (lesson.content ?? '').slice(0, 600)
      : instrCtx;
    const reflQ = language === 'KIN'
      ? `Umunyeshuri arangije isomo: "${lesson.title}". Muhe amagambi 2 mafupi: igitekerezo cy'ingenzi gikwiye gutunga, n'ikintu kimwe gito azagerageza.`
      : `The student just completed "${lesson.title}". Write 2 short sentences: the key concept to take away, and one small thing to try next.`;
    getLessonAIHelp(reflQ, '', reflCtx, language, lesson.lesson_type as 'reading' | 'coding' | 'quiz')
      .then(r => { setReflection(r); setReflectionLoading(false); })
      .catch(() => setReflectionLoading(false));

    setShowRating(true);
  };

  // Rating modal — appears right after completion, before the done screen
  if (showRating) {
    return (
      <>
        {/* blurred background so student knows they finished */}
        <div style={{ minHeight: '100vh', background: 'var(--bg)', filter: 'blur(2px)', pointerEvents: 'none' }} />
        <RatingModal
          contentType="lesson"
          contentId={lesson.id}
          usedMwarimu={railMessages.some(m => m.role === 'ai')}
          language={language}
          onDone={() => { setShowRating(false); setDone(true); }}
        />
      </>
    );
  }

  // Completion screen
  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, width: '100%' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', background: 'rgba(158,170,132,0.08)', border: '1px solid rgba(158,170,132,0.25)' }}>
            <CheckCircle size={32} style={{ color: '#9eaa84' }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {isKin ? 'Warangije Isomo!' : 'Lesson Complete!'}
          </h2>
          <p style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-2)' }}>{lessonTitle}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24, color: xpAwarded > 0 ? '#cda86a' : 'var(--text-3)' }}>
            <Zap size={18} fill={xpAwarded > 0 ? '#cda86a' : 'none'} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {xpAwarded > 0 ? `+${xpAwarded} XP` : isKin ? 'Nta XP (wakoresheje igisubizo)' : 'No XP (solution used)'}
            </span>
          </div>

          {/* Feature 3 — Mwarimu reflection */}
          {(reflection || reflectionLoading) && (
            <div className="card" style={{ padding: '14px 16px', textAlign: 'left', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span className="ai-mwicon" style={{ fontSize: 11, width: 22, height: 22, minWidth: 22 }}>M</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Mwarimu</span>
              </div>
              {reflectionLoading ? (
                <div className="typing-dots"><span /><span /><span /></div>
              ) : (
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-2)', margin: 0 }}>{reflection}</p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {nextLesson && (
              <button onClick={() => onNextLesson(nextLesson)} className="btn btn-primary btn-block">
                {isKin ? 'Isomo Rikurikira →' : 'Next Lesson →'}
              </button>
            )}
            <button
              onClick={() => onCompleted(lesson.xp_reward)}
              className={nextLesson ? 'btn btn-secondary btn-block' : 'btn btn-primary btn-block'}
            >
              {isKin ? 'Garuka ku Isomo' : 'Back to Course'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppNav />

      {/* Reading progress bar */}
      <div className="readprog">
        <i style={{ width: `${readPct}%` }} />
      </div>

      <div className="lwrap" style={{ '--rail-w': `${railWidth}px` } as React.CSSProperties}>
        {/* LEFT OUTLINE */}
        <aside className="outline">
          <div className="ohead">{courseTitle}</div>
          {allLessons?.map(l => {
            const isCur = l.id === lesson.id;
            const lTitle = isKin && l.title_kin ? l.title_kin : l.title;
            return (
              <a key={l.id} className={isCur ? 'cur' : ''} style={{ cursor: 'default' }}>
                <span className="d" />
                {lTitle}
              </a>
            );
          })}
        </aside>

        {/* MAIN CONTENT */}
        <main className="reading rise">
          {/* Back + meta */}
          <div style={{ marginBottom: 32 }}>
            <button
              onClick={onBack}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-2)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              <ArrowLeft size={14} /> {courseTitle}
            </button>

            <p className="leyebrow">
              {lesson.lesson_type === 'reading' ? (isKin ? 'Isomo · Gusoma' : 'Lesson · Reading')
                : lesson.lesson_type === 'coding' ? (isKin ? 'Isomo · Gukora Code' : 'Lesson · Coding')
                : (isKin ? 'Isomo · Ibibazo' : 'Lesson · Quiz')}
            </p>
            <h1>{lessonTitle}</h1>
            <div className="meta">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, background: typeInfo.bg, color: typeInfo.color, border: `1px solid ${typeInfo.border}`, fontSize: 12 }}>
                {typeInfo.icon} {typeInfo.label}
              </span>
              {lesson.xp_reward > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#cda86a', fontSize: 13 }}>
                  <Zap size={13} fill="#cda86a" /> {lesson.xp_reward} XP
                </span>
              )}
            </div>
          </div>

          {lesson.lesson_type === 'reading' && (
            <ReadingLesson lesson={lesson} language={language} onComplete={() => handleComplete()} completing={completing} />
          )}
          {lesson.lesson_type === 'coding' && (
            <CodingLesson lesson={lesson} language={language} onComplete={(usedSolution) => handleComplete(undefined, usedSolution)} completing={completing} onCodeChange={c => { codeCtxRef.current = c; }} onRunResult={pushAutoHint} />
          )}
          {lesson.lesson_type === 'quiz' && (
            <QuizLesson lesson={lesson} language={language} onComplete={(s) => handleComplete(s)} completing={completing} />
          )}

          {/* Lesson nav */}
          <div className="lnav">
            <a onClick={onBack} style={{ cursor: 'pointer' }}>
              <div className="dir">{isKin ? '← Subira' : '← Back'}</div>
              <div className="ttl">{courseTitle}</div>
            </a>
            {nextLesson && (
              <a className="next" onClick={() => onNextLesson(nextLesson)} style={{ cursor: 'pointer' }}>
                <div className="dir">{isKin ? 'Rikurikira →' : 'Next lesson →'}</div>
                <div className="ttl">{isKin && nextLesson.title_kin ? nextLesson.title_kin : nextLesson.title}</div>
              </a>
            )}
          </div>
        </main>

        {/* RIGHT RAIL */}
        <aside className="rail">
          {/* Drag handle — grab the left edge to resize the panel */}
          <div className="rail-resizer" onMouseDown={startRailResize} title="Drag to resize" />

          {/* Chat panel — fills viewport height minus nav + padding */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - var(--nav-h) - 72px)',
            border: '1px solid var(--line)', borderRadius: 'var(--radius)',
            background: 'var(--bg)', overflow: 'hidden',
          }}>
            {/* Header */}
            <div className="ah" style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '12px 16px', borderBottom: '1px solid var(--line)',
              fontSize: 14, fontWeight: 500, flexShrink: 0,
            }}>
              <span className="ai-mwicon">M</span>
              Mwarimu
            </div>

            {/* Messages — scrollable, fills remaining height */}
            <div style={{
              flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden',
              padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {railMessages.length === 0 && !railLoading && (
                <p style={{ fontSize: 12.5, color: 'var(--text-3)', textAlign: 'center', padding: '8px 0' }}>
                  {isKin ? "Ufite ikibazo? Baza Mwarimu." : "Have a question? Ask Mwarimu."}
                </p>
              )}
              {railMessages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.auto && (
                    <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4, paddingLeft: 2 }}>
                      {isKin ? 'Mwarimu yabibonye' : 'Mwarimu noticed'}
                    </p>
                  )}
                  <div style={{
                    maxWidth: '94%', padding: '7px 11px', borderRadius: 'var(--radius)', fontSize: 13, lineHeight: 1.55,
                    background: m.role === 'user' ? 'var(--surface-2)' : 'var(--surface)',
                    color: m.role === 'user' ? 'var(--text-2)' : 'var(--text)',
                    border: '1px solid var(--line)',
                  }}>
                    {m.role === 'ai'
                      ? <div className="bubble rail-bubble" style={{ background: 'none', border: 'none', padding: 0, fontSize: 13 }}><ReactMarkdown>{m.text}</ReactMarkdown></div>
                      : m.text}
                  </div>
                </div>
              ))}
              {railLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '8px 12px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)' }}>
                    <div className="typing-dots"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={railEndRef} />
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 6, padding: '10px 12px', borderTop: '1px solid var(--line)', flexShrink: 0 }}>
              <input
                value={railInput}
                onChange={e => setRailInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askRail()}
                placeholder={isKin ? 'Baza ikibazo...' : 'Ask a question...'}
                className="input"
                style={{ flex: 1, fontSize: 12.5 }}
              />
              <button
                onClick={askRail}
                disabled={!railInput.trim() || railLoading}
                className="btn btn-secondary"
                style={{ padding: '0 10px', display: 'flex', alignItems: 'center', opacity: (!railInput.trim() || railLoading) ? 0.4 : 1 }}
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
