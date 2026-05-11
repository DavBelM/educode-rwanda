import { ThemeToggle } from './components/ThemeToggle';
import { useState, useCallback, useRef } from 'react';
import { ArrowLeft, Play, CheckCircle, Loader, Zap, BookOpen, Code2, HelpCircle, Monitor, Bot, Send } from 'lucide-react';
import { completeLesson, type CourseLesson } from '../lib/db';
import { executeCode } from '../lib/code-executor';
import { getLessonAIHelp } from '../lib/ai';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface Props {
  lesson: CourseLesson;
  courseTitle: string;
  language: 'EN' | 'KIN';
  nextLesson: CourseLesson | null;
  onBack: () => void;
  onCompleted: (xpEarned: number) => void;
  onNextLesson: (lesson: CourseLesson) => void;
}

// ─── Content Renderer ─────────────────────────────────────────────────────────
// Handles **bold**, ```code blocks```, and plain paragraphs

function RenderContent({ text }: { text: string }) {
  const segments = text.split(/(```[\w]*\n?[\s\S]*?```)/g);
  return (
    <>
      {segments.map((seg, i) => {
        const codeMatch = seg.match(/^```[\w]*\n?([\s\S]*?)```$/);
        if (codeMatch) {
          return (
            <pre key={i} className="rounded-xl p-4 my-3 overflow-x-auto text-sm"
              style={{ background: 'var(--ec-bg)', border: '1px solid var(--ec-b2)',
                color: '#00d4aa', fontFamily: 'monospace', lineHeight: '1.6' }}>
              {codeMatch[1].trim()}
            </pre>
          );
        }
        return (
          <div key={i}>
            {seg.split('\n').map((line, li) => {
              if (!line.trim()) return <div key={li} className="h-2" />;
              const parts = line.split(/\*\*(.+?)\*\*/g);
              return (
                <p key={li} className="text-sm leading-relaxed mb-1"
                  style={{ color: 'var(--ec-text-4)', fontFamily: 'Inter, sans-serif' }}>
                  {parts.map((p, pi) =>
                    pi % 2 === 1
                      ? <strong key={pi} style={{ color: 'var(--ec-text-1)' }}>{p}</strong>
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
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
        <RenderContent text={content ?? ''} />
      </div>
      <button onClick={onComplete} disabled={completing}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
        style={{ background: '#00d4aa', color: 'var(--ec-bg)', fontFamily: 'Inter, sans-serif' }}
        onMouseEnter={e => { if (!completing) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}>
        {completing ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}
        {isKin ? 'Shyira ko wasomye' : 'Mark as Read'}
      </button>
    </div>
  );
}

// ─── Coding Lesson ────────────────────────────────────────────────────────────

function CodingLesson({ lesson, language, onComplete, completing }: {
  lesson: CourseLesson; language: 'EN' | 'KIN'; onComplete: (usedSolution?: boolean) => void; completing: boolean;
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

  // Test cases
  const tests = lesson.exercise_data?.tests ?? [];
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; actual: string }>>([]);

  // Solution
  const solution = lesson.exercise_data?.solution ?? null;
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showSolutionWarning, setShowSolutionWarning] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const UNLOCK_AFTER = 3;

  // AI Tutor state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const askAI = async () => {
    const q = aiQuestion.trim();
    if (!q || aiLoading) return;
    setAiQuestion('');
    setAiMessages(prev => [...prev, { role: 'user', text: q }]);
    setAiLoading(true);
    const answer = await getLessonAIHelp(
      q,
      isHtmlExercise ? htmlCode : code,
      lesson.exercise_data?.instructions ?? '',
      language
    );
    setAiMessages(prev => [...prev, { role: 'ai', text: answer }]);
    setAiLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

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

      // Evaluate test cases against actual output
      if (tests.length > 0) {
        const actualLines = (result.output ?? '').split('\n').map(l => l.trim());
        const results = tests.map((t, i) => {
          const expected = t.expectedOutput.trim();
          // Match against the i-th output line, or full output for single-test cases
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
        if (!allPassed || result.error) setFailedAttempts(n => n + 1);
      } else if (result.error) {
        setFailedAttempts(n => n + 1);
      }

      setRunning(false);
    }
  }, [code, htmlCode, isHtmlExercise, tests]);

  const hasError = output.includes('❌');

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)' }}>
        <p className="text-sm whitespace-pre-line" style={{ color: 'var(--ec-text-3)', fontFamily: 'Inter, sans-serif' }}>
          {lesson.exercise_data?.instructions}
        </p>
        {(() => {
          const ed = lesson.exercise_data;
          if (!ed) return null;
          // Support both hints[] array and legacy single hint string
          const hints: string[] = ed.hints?.length
            ? ed.hints
            : ed.hint ? [ed.hint] : [];
          if (hints.length === 0) return null;
          return (
            <div className="mt-3 space-y-2">
              {hints.slice(0, hintsRevealed).map((h, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg px-3 py-2"
                  style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: '#f59e0b' }}>
                    {isKin ? `Icyifuzo ${i + 1}` : `Hint ${i + 1}`}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ec-text-4)' }}>{h}</p>
                </div>
              ))}
              {hintsRevealed < hints.length && (
                <button
                  onClick={() => setHintsRevealed(n => n + 1)}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                  style={{ color: '#f59e0b' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  💡 {isKin
                    ? `Bona icyifuzo ${hintsRevealed + 1} (${hints.length - hintsRevealed} bisigaye)`
                    : `Show hint ${hintsRevealed + 1} of ${hints.length}`}
                </button>
              )}
              {hintsRevealed === hints.length && hintsRevealed > 0 && (
                <p className="text-xs" style={{ color: 'var(--ec-text-7)' }}>
                  {isKin ? '✓ Ibyifuzo byose biragaragara' : '✓ All hints revealed'}
                </p>
              )}
            </div>
          );
        })()}
      </div>

      {isHtmlExercise ? (
        <>
          {/* HTML Editor */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ec-b2)' }}>
            <div className="px-4 py-2 flex items-center justify-between"
              style={{ background: 'var(--ec-surface-2)', borderBottom: '1px solid var(--ec-b1)' }}>
              <span className="text-xs font-semibold" style={{ color: '#f97316', fontFamily: 'monospace' }}>
                index.html
              </span>
              <button onClick={run}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: '#00d4aa', color: 'var(--ec-bg)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}>
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

          {/* Iframe Preview */}
          {previewSrc && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ec-b2)' }}>
              <div className="px-4 py-2"
                style={{ background: 'var(--ec-surface-2)', borderBottom: '1px solid var(--ec-b1)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
                  Preview
                </span>
              </div>
              <iframe
                srcDoc={previewSrc}
                title="preview"
                className="w-full"
                style={{ height: '320px', border: 'none', background: '#fff' }}
                sandbox="allow-scripts"
              />
            </div>
          )}
        </>
      ) : (
        <>
          {/* JS Editor */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ec-b2)' }}>
            <div className="px-4 py-2 flex items-center justify-between"
              style={{ background: 'var(--ec-surface-2)', borderBottom: '1px solid var(--ec-b1)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
                JavaScript
              </span>
              <button onClick={run} disabled={running}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                style={{ background: '#00d4aa', color: 'var(--ec-bg)' }}
                onMouseEnter={e => { if (!running) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}>
                {running ? <Loader size={12} className="animate-spin" /> : <Play size={12} />}
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

          {/* Console Output */}
          {output && (
            <div className="rounded-xl p-4" style={{ background: 'var(--ec-bg)', border: '1px solid var(--ec-b1)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>Output</p>
              <pre className="text-sm whitespace-pre-wrap"
                style={{ color: hasError ? '#f87171' : '#00d4aa', fontFamily: 'monospace' }}>
                {output}
              </pre>
            </div>
          )}

          {/* Test results */}
          {testResults.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--ec-b2)' }}>
              <div className="px-4 py-2.5 flex items-center justify-between"
                style={{ background: 'var(--ec-surface-2)', borderBottom: '1px solid var(--ec-b1)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--ec-text-1)' }}>
                  {isKin ? 'Ibigerageza' : 'Test Cases'}
                </p>
                <span className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: testResults.every(r => r.passed) ? 'rgba(0,212,170,0.12)' : 'rgba(239,68,68,0.1)',
                    color: testResults.every(r => r.passed) ? '#00d4aa' : '#f87171',
                  }}>
                  {testResults.filter(r => r.passed).length}/{testResults.length} {isKin ? 'byatsinzwe' : 'passed'}
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--ec-b1)' }}>
                {tests.map((t, i) => {
                  const res = testResults[i];
                  const passed = res?.passed ?? false;
                  return (
                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 text-base">{passed ? '✅' : '❌'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--ec-text-1)' }}>
                          {t.description}
                        </p>
                        {!passed && res && (
                          <div className="mt-1 space-y-0.5">
                            <p className="text-xs" style={{ color: 'var(--ec-text-6)' }}>
                              {isKin ? 'Byategerezwaga' : 'Expected'}:{' '}
                              <span style={{ color: '#00d4aa', fontFamily: 'monospace' }}>{t.expectedOutput}</span>
                            </p>
                            <p className="text-xs" style={{ color: 'var(--ec-text-6)' }}>
                              {isKin ? 'Byaboneka' : 'Got'}:{' '}
                              <span style={{ color: '#f87171', fontFamily: 'monospace' }}>{res.actual || '(no output)'}</span>
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
              className="flex items-center gap-2 text-sm font-semibold transition-all"
              style={{ color: 'var(--ec-text-6)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ec-text-6)')}
            >
              🔓 {isKin ? `Reba igisubizo (nyuma y'igerageza ${UNLOCK_AFTER})` : `See solution (after ${UNLOCK_AFTER} attempts)`}
            </button>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
              <div className="px-4 py-2.5 flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
                <span className="text-sm font-semibold" style={{ color: '#f87171' }}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b2)' }}>
            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--ec-text-1)' }}>
              {isKin ? 'Urashaka kureba igisubizo?' : 'View the solution?'}
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--ec-text-6)' }}>
              {isKin
                ? 'Niba ureba igisubizo, ntuzahabwa XP kuri iri somo. Biragushishikariza kwiga ariko ntibigusiba iterambere ryawe.'
                : 'Viewing the solution means no XP for this lesson. It\'s still encouraged to learn from it — your progress is not lost.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSolutionWarning(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--ec-b3)', color: 'var(--ec-text-4)', border: '1px solid var(--ec-b2)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--ec-b2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--ec-b3)')}
              >
                {isKin ? 'Subira inyuma' : 'Go back'}
              </button>
              <button
                onClick={() => { setSolutionRevealed(true); setShowSolutionWarning(false); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
              >
                {isKin ? 'Yego, reba igisubizo' : 'Yes, show solution'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Tutor */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.25)' }}>
        <button
          onClick={() => setAiOpen(o => !o)}
          className="w-full flex items-center gap-3 px-4 py-3 transition-all"
          style={{ background: 'rgba(139,92,246,0.08)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.14)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.08)')}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
            <Bot size={15} style={{ color: '#a78bfa' }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold" style={{ color: '#a78bfa' }}>
              {isKin ? 'Baza EduCode AI' : 'Ask EduCode AI'}
            </p>
            <p className="text-xs" style={{ color: 'var(--ec-text-6)' }}>
              {isKin ? 'AI igufasha ariko ntiguha igisubizo cyose' : 'AI guides you without giving away the answer'}
            </p>
          </div>
          <span style={{ color: 'var(--ec-text-6)', fontSize: '12px' }}>{aiOpen ? '▲' : '▼'}</span>
        </button>

        {aiOpen && (
          <div style={{ background: 'var(--ec-surface)', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
            {/* Chat history */}
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {aiMessages.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: 'var(--ec-text-6)' }}>
                  {isKin
                    ? 'Baza ikibazo kijyanye na code yawe cyangwa amabwiriza y\'isomo...'
                    : 'Ask anything about your code or the lesson instructions...'}
                </p>
              )}
              {aiMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed"
                    style={{
                      background: m.role === 'user' ? 'rgba(139,92,246,0.15)' : 'var(--ec-surface-2)',
                      color: m.role === 'user' ? '#a78bfa' : 'var(--ec-text-3)',
                      border: m.role === 'user' ? '1px solid rgba(139,92,246,0.25)' : '1px solid var(--ec-b1)',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-xl flex items-center gap-2"
                    style={{ background: 'var(--ec-surface-2)', border: '1px solid var(--ec-b1)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 px-4 pb-4">
              <input
                value={aiQuestion}
                onChange={e => setAiQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askAI()}
                placeholder={isKin ? 'Andika ikibazo cyawe...' : 'Type your question...'}
                className="flex-1 px-3 py-2 rounded-xl text-sm focus:outline-none"
                style={{
                  background: 'var(--ec-surface-2)',
                  border: '1px solid var(--ec-b2)',
                  color: 'var(--ec-text-1)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={e => (e.target.style.border = '1px solid rgba(139,92,246,0.4)')}
                onBlur={e => (e.target.style.border = '1px solid var(--ec-b2)')}
              />
              <button
                onClick={askAI}
                disabled={!aiQuestion.trim() || aiLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
                onMouseEnter={e => { if (!aiLoading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.25)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,92,246,0.15)'; }}
              >
                <Send size={14} style={{ color: '#a78bfa' }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {(() => {
        const allTestsPassed = tests.length === 0 || testResults.every(r => r.passed);
        const canComplete = hasRun && (isHtmlExercise || !hasError) && allTestsPassed;
        if (!canComplete) {
          if (hasRun && tests.length > 0 && !allTestsPassed) {
            return (
              <p className="text-sm text-center py-2" style={{ color: 'var(--ec-text-6)' }}>
                {isKin
                  ? '⚠️ Rangiza ibigerageza byose mbere yo gusoza isomo'
                  : '⚠️ Pass all test cases to complete the lesson'}
              </p>
            );
          }
          return null;
        }
        return (
          <button onClick={() => onComplete(solutionRevealed)} disabled={completing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
            style={{ background: '#00d4aa', color: 'var(--ec-bg)', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => { if (!completing) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}>
            {completing ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}
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
    <div className="space-y-5">
      {questions.map((q, qi) => (
        <div key={q.id} className="rounded-xl p-5" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>
            {qi + 1}. {q.text}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi;
              const correct  = submitted && oi === q.correct;
              const wrong    = submitted && selected && oi !== q.correct;
              return (
                <button key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: oi }))}
                  disabled={submitted}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    background: correct ? 'rgba(0,212,170,0.12)' : wrong ? 'rgba(239,68,68,0.1)' : selected ? 'rgba(139,92,246,0.12)' : 'var(--ec-b6)',
                    border: correct ? '1px solid rgba(0,212,170,0.3)' : wrong ? '1px solid rgba(239,68,68,0.25)' : selected ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--ec-b1)',
                    color: correct ? '#00d4aa' : wrong ? '#f87171' : selected ? '#a78bfa' : 'var(--ec-text-4)',
                    cursor: submitted ? 'default' : 'pointer',
                  }}>
                  {String.fromCharCode(65 + oi)}. {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button onClick={handleSubmit} disabled={!allAnswered}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
          style={{ background: '#8b5cf6', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
          {isKin ? 'Ohereza Ibisubizo' : 'Submit Answers'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl p-4 flex items-center gap-4"
            style={{ background: perfect ? 'rgba(0,212,170,0.08)' : 'rgba(245,158,11,0.08)',
              border: `1px solid ${perfect ? 'rgba(0,212,170,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
            <div className="text-3xl font-bold" style={{ color: perfect ? '#00d4aa' : '#f59e0b', fontFamily: 'Inter, sans-serif' }}>
              {score}/{questions.length}
            </div>
            <p className="text-sm" style={{ color: 'var(--ec-text-4)', fontFamily: 'Inter, sans-serif' }}>
              {perfect
                ? (isKin ? 'Ni byiza cyane! Wasubije neza byose.' : 'Perfect! You got everything right.')
                : (isKin ? 'Wagerageje! Ongera usuzume ibyo utatsinze.' : 'Good effort! Review the ones you missed.')}
            </p>
          </div>
          <button onClick={() => onComplete(score)} disabled={completing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
            style={{ background: '#00d4aa', color: 'var(--ec-bg)', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={e => { if (!completing) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}>
            {completing ? <Loader size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {isKin ? 'Rangiza Isomo' : 'Complete Lesson'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Lesson Viewer Root ───────────────────────────────────────────────────────

export default function LessonViewer({ lesson, courseTitle, language, nextLesson, onBack, onCompleted, onNextLesson }: Props) {
  const isKin = language === 'KIN';
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  const lessonTitle = isKin && lesson.title_kin ? lesson.title_kin : lesson.title;

  const typeInfo = {
    reading: { icon: <BookOpen size={13} />, label: isKin ? 'Gusoma' : 'Reading', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)' },
    coding:  { icon: <Code2 size={13} />,    label: isKin ? 'Gukora Code' : 'Coding',  color: '#00d4aa', bg: 'rgba(0,212,170,0.1)',   border: 'rgba(0,212,170,0.2)' },
    quiz:    { icon: <HelpCircle size={13} />,label: isKin ? 'Ibibazo (Quiz)' : 'Quiz', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.2)' },
  }[lesson.lesson_type];

  const handleComplete = async (score?: number, usedSolution?: boolean) => {
    setCompleting(true);
    const { xpAwarded: earned } = await completeLesson(lesson.id, score, usedSolution ? 0 : undefined);
    setXpAwarded(earned);
    setDone(true);
    setCompleting(false);
  };

  // Completion screen
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ec-bg)' }}>
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(0,212,170,0.1)', border: '2px solid rgba(0,212,170,0.3)' }}>
            <CheckCircle size={36} style={{ color: '#00d4aa' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Warangije Isomo!' : 'Lesson Complete!'}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
            {lessonTitle}
          </p>
          <div className="flex items-center justify-center gap-2 mb-8" style={{ color: xpAwarded > 0 ? '#f59e0b' : 'var(--ec-text-6)' }}>
            <Zap size={20} fill={xpAwarded > 0 ? '#f59e0b' : 'none'} style={{ color: xpAwarded > 0 ? '#f59e0b' : 'var(--ec-text-6)' }} />
            <span className="text-xl font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
              {xpAwarded > 0 ? `+${xpAwarded} XP` : isKin ? 'Nta XP (wakoresheje igisubizo)' : 'No XP (solution used)'}
            </span>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {nextLesson && (
              <button
                onClick={() => onNextLesson(nextLesson)}
                className="w-full px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: '#00d4aa', color: 'var(--ec-bg)', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#00bfa0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#00d4aa')}
              >
                {isKin ? 'Isomo Rikurikira' : 'Next Lesson'} →
              </button>
            )}
            <button
              onClick={() => onCompleted(lesson.xp_reward)}
              className="w-full px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: nextLesson ? 'var(--ec-b5)' : '#00d4aa',
                color: nextLesson ? 'var(--ec-text-5)' : 'var(--ec-bg)', fontFamily: 'Inter, sans-serif',
                border: nextLesson ? '1px solid var(--ec-b2)' : 'none' }}
            >
              {isKin ? 'Garuka ku Isomo' : 'Back to Course'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ec-bg)', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div className="border-b px-6 py-4 flex items-center gap-3"
        style={{ background: 'var(--ec-surface)', borderColor: 'var(--ec-b1)' }}>
        <button onClick={onBack} className="flex items-center gap-2 text-sm transition-all"
          style={{ color: 'var(--ec-text-6)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ec-text-4)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ec-text-6)')}>
          <ArrowLeft size={16} /> {courseTitle}
        </button>
        <span style={{ color: 'var(--ec-b2)' }}>|</span>
        <div className="ml-auto"><ThemeToggle /></div>
        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
          style={{ background: typeInfo.bg, color: typeInfo.color, border: `1px solid ${typeInfo.border}` }}>
          {typeInfo.icon} {typeInfo.label}
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title + XP */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-xl font-bold leading-snug" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>
            {lessonTitle}
          </h1>
          <div className="flex items-center gap-1 ml-4 flex-shrink-0" style={{ color: '#f59e0b' }}>
            <Zap size={16} fill="#f59e0b" />
            <span className="text-sm font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>{lesson.xp_reward} XP</span>
          </div>
        </div>

        {lesson.lesson_type === 'reading' && (
          <ReadingLesson lesson={lesson} language={language} onComplete={() => handleComplete()} completing={completing} />
        )}
        {lesson.lesson_type === 'coding' && (
          <CodingLesson lesson={lesson} language={language} onComplete={(usedSolution) => handleComplete(undefined, usedSolution)} completing={completing} />
        )}
        {lesson.lesson_type === 'quiz' && (
          <QuizLesson lesson={lesson} language={language} onComplete={(s) => handleComplete(s)} completing={completing} />
        )}
      </div>
    </div>
  );
}
