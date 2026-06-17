import { useState, useEffect, useCallback, useRef } from 'react';
import { AppNav } from './components/AppNav';
import { CodeEditor } from './components/CodeEditor';
import { Console } from './components/Console';
import { MwarimuPanel } from './components/MwarimuPanel';
import { executeCode } from '../lib/code-executor';
import { analyzeFeedback, formatFeedbackForUI } from '../lib/feedback-engine';
import { warmUpSpace } from '../lib/ai';
import { submitCodingAssignment, type Assignment } from '../lib/db';
import { useExamMode } from '../hooks/useExamMode';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../lib/auth';
import { Send, CheckCircle, Loader, AlertTriangle, Clock } from 'lucide-react';

const DEFAULT_JS = `// Welcome to EduCode Rwanda!
// Try manipulating the DOM elements in index.html

const heading = document.getElementById('title');
heading.textContent = 'Hello from JavaScript!';

const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
  document.getElementById('output').textContent = 'Button clicked! 🎉';
});
`;

const DEFAULT_HTML = `<div style="padding: 20px; font-family: sans-serif;">
  <h1 id="title">Change me with JS</h1>
  <button id="btn" style="padding: 8px 16px; margin: 12px 0; cursor: pointer;">
    Click me
  </button>
  <p id="output" style="color: #0ea5e9;"></p>
</div>`;

interface Props {
  onBack?: () => void;
  assignment?: Assignment | null;
  language?: 'EN' | 'KIN';
}

function dueLabel(dueDate: string | null, isKin: boolean): string | null {
  if (!dueDate) return null;
  const diffMs = new Date(dueDate).getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffMs < 0) return isKin ? 'BYARENZE IGIHE' : 'OVERDUE';
  if (diffDays <= 0) return isKin ? 'BIGOMBA KUBA UYU MUNSI' : 'DUE TODAY';
  if (diffDays === 1) return isKin ? 'BISIGAYE UMUNSI 1' : 'DUE IN 1 DAY';
  return isKin ? `BISIGAYE IMINSI ${diffDays}` : `DUE IN ${diffDays} DAYS`;
}

export default function CodingWorkspace({ assignment }: Props) {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const isKin = language === 'KIN';
  const { profile } = useAuth();

  // Auto-save key — scoped to user so different students on the same
  // browser never share code drafts.
  const userId = profile?.id ?? 'anon';
  const saveKey = assignment
    ? `educode_code_${userId}_${assignment.id}`
    : `educode_code_${userId}_free`;
  const savedJs = localStorage.getItem(saveKey + '_js');
  const savedHtml = localStorage.getItem(saveKey + '_html');

  const [jsCode, setJsCode] = useState(savedJs ?? DEFAULT_JS);
  const [htmlCode, setHtmlCode] = useState(savedHtml ?? DEFAULT_HTML);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<Array<{ type: 'success' | 'error' | 'info'; message: string }>>([]);
  const [errorLine, setErrorLine] = useState<number | undefined>(undefined);
  const [lastError, setLastError] = useState<string | null>(null);
  const [runCount, setRunCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [violationWarning, setViolationWarning] = useState('');

  // Auto-save code as student types
  useEffect(() => {
    localStorage.setItem(saveKey + '_js', jsCode);
  }, [jsCode, saveKey]);

  useEffect(() => {
    localStorage.setItem(saveKey + '_html', htmlCode);
  }, [htmlCode, saveKey]);

  // Warn before refresh/close during active assignment
  useEffect(() => {
    if (!assignment || submitted) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [assignment, submitted]);

  // Wake up the HuggingFace Space as soon as the workspace opens
  useEffect(() => { warmUpSpace(); }, []);

  // Exam mode
  const examMode = !!(assignment?.exam_mode);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    assignment?.duration_minutes ? assignment.duration_minutes * 60 : 0
  );
  const autoSubmitRef = useRef(false);

  const { violations, isFullscreen, requestFullscreen, onPaste } = useExamMode({
    enabled: examMode,
    onViolation: (type) => {
      const msg = type === 'tabSwitches'
        ? (isKin ? '⚠️ Twabonye ko wahinduye paji!' : '⚠️ Tab switch detected!')
        : type === 'pasteCount'
        ? (isKin ? '⚠️ Twabonye ko hari code ukopye ukayishyiramo!' : '⚠️ Code paste detected!')
        : (isKin ? '⚠️ Twabonye ko wasohotse muri screen yuzuye!' : '⚠️ Fullscreen exit detected!');
      setViolationWarning(msg);
      setTimeout(() => setViolationWarning(''), 3000);
    },
  });

  // Request fullscreen when exam mode starts
  useEffect(() => {
    if (examMode && !submitted) requestFullscreen();
  }, [examMode, submitted, requestFullscreen]);

  // Countdown timer
  useEffect(() => {
    if (!examMode || submitted || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examMode, submitted, secondsLeft]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (examMode && secondsLeft === 0 && !submitted && !autoSubmitRef.current && assignment) {
      autoSubmitRef.current = true;
      submitCodingAssignment({
        assignmentId: assignment.id,
        codeSubmitted: jsCode,
        violations: { tabSwitches: violations.current.tabSwitches, pasteCount: violations.current.pasteCount, fullscreenExits: violations.current.fullscreenExits },
      }).then(() => setSubmitted(true));
    }
  }, [secondsLeft, examMode, submitted, assignment, jsCode, violations]);

  const timerColor = secondsLeft > 60 ? '#9eaa84' : secondsLeft > 30 ? '#cda86a' : 'var(--error)';
  const timerDisplay = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  const handleSubmit = async () => {
    if (!assignment) return;
    setSubmitting(true);
    setSubmitError('');
    const { error } = await submitCodingAssignment({
      assignmentId: assignment.id,
      codeSubmitted: jsCode,
      violations: examMode ? { tabSwitches: violations.current.tabSwitches, pasteCount: violations.current.pasteCount, fullscreenExits: violations.current.fullscreenExits } : undefined,
    });
    if (error === 'already_submitted') {
      setSubmitted(true);
    } else if (error) {
      setSubmitError(error);
    } else {
      setSubmitted(true);
      localStorage.removeItem(saveKey + '_js');
      localStorage.removeItem(saveKey + '_html');
    }
    setSubmitting(false);
  };

  const handleReset = () => {
    if (!window.confirm(isKin ? 'Wifuza gusubiza kode yawe ku ntangiriro?' : 'Reset your code back to the starting point?')) return;
    setJsCode(DEFAULT_JS);
    setHtmlCode(DEFAULT_HTML);
    setOutput('');
    setFeedback([]);
    setErrorLine(undefined);
    setLastError(null);
  };

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('');
    setFeedback([]);
    setErrorLine(undefined);
    setLastError(null);

    const result = await executeCode(jsCode, htmlCode);

    // Console output
    let displayOutput = result.output;
    if (result.error) {
      displayOutput = (result.output ? result.output + '\n' : '') + `❌ ${result.error}`;
    }
    setOutput(displayOutput);
    setLastError(result.error ?? null);

    // Error line highlight
    const lineMatch = result.error?.match(/line (\d+)/i);
    if (lineMatch) setErrorLine(parseInt(lineMatch[1], 10));

    // Bilingual rule-based feedback
    const feedbacks = analyzeFeedback(result.error, jsCode, result.output, language);
    setFeedback(formatFeedbackForUI(feedbacks, language));

    setIsRunning(false);

    // Trigger Mwarimu — disabled during exam mode (handled inside MwarimuPanel)
    setRunCount(c => c + 1);
  }, [jsCode, htmlCode, language]);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) runCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, runCode]);

  const title = assignment
    ? (isKin && assignment.title_kin ? assignment.title_kin : assignment.title)
    : (isKin ? 'Umwanya wo Kwimenyereza' : 'Practice Workspace');

  usePageTitle(`${title} · EduCode`);

  const breadcrumb = assignment
    ? (isKin && assignment.description_kin ? assignment.description_kin : assignment.description) ?? ''
    : (isKin ? 'Umwanya wigenga · JavaScript' : 'Free practice · JavaScript');

  const due = assignment ? dueLabel(assignment.due_date, isKin) : null;

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <AppNav />

      {/* Violation warning toast */}
      {violationWarning && (
        <div className="shrink-0 px-4 py-2 flex items-center gap-2" style={{ background: 'var(--error-dim)', borderBottom: '1px solid color-mix(in srgb, var(--error) 40%, transparent)' }}>
          <AlertTriangle size={14} style={{ color: 'var(--error)' }} />
          <p className="text-xs font-semibold" style={{ color: 'var(--error)' }}>{violationWarning}</p>
        </div>
      )}

      {/* Exam mode — enter fullscreen nudge */}
      {examMode && !isFullscreen && !submitted && (
        <div className="shrink-0 px-4 py-2 flex items-center justify-between" style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--line)' }}>
          <p className="text-xs font-semibold" style={{ color: '#cda86a' }}>
            {isKin ? '⚠️ Injira muri screen yuzuye kugirango ukomeze ikizamini' : '⚠️ Enter fullscreen to continue the exam'}
          </p>
          <button onClick={requestFullscreen} className="btn btn-secondary sm">
            {isKin ? 'Koresha Screen Yose' : 'Go Fullscreen'}
          </button>
        </div>
      )}

      <div className="ws" style={{ flex: 1, minHeight: 0, height: 'auto' }}>
        {/* EDITOR SIDE */}
        <section className="ws-main" onPaste={examMode ? onPaste : undefined}>
          <div className="ws-bar">
            <div className="ctx">
              <div className="et">{title}</div>
              {breadcrumb && <div className="ed">{breadcrumb}</div>}
            </div>
            <div className="acts">
              {examMode && !submitted && (
                <span className="pill solid" style={{ color: timerColor, borderColor: timerColor }}>
                  <Clock size={12} />
                  {timerDisplay}
                </span>
              )}
              {due && !submitted && <span className="pill error">{due}</span>}
              {submitError && <span className="pill error">{submitError}</span>}
              <button className="btn btn-secondary sm" onClick={handleReset}>
                {isKin ? 'Subiza' : 'Reset'}
              </button>
              <button className="btn btn-secondary sm" onClick={runCode} disabled={isRunning}>
                {isRunning ? (isKin ? 'Birakora...' : 'Running...') : (isKin ? 'Tangiza' : 'Run')}
              </button>
              {assignment && (
                submitted ? (
                  <span className="pill solid">
                    <CheckCircle size={12} />
                    {isKin ? 'Byatanzwe' : 'Submitted'}
                  </span>
                ) : (
                  <button className="btn btn-primary sm" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <Loader size={12} className="animate-spin" /> : <Send size={12} />}
                    {isKin ? 'Ohereza' : 'Submit'}
                  </button>
                )
              )}
            </div>
          </div>

          <CodeEditor
            jsCode={jsCode}
            htmlCode={htmlCode}
            onJsChange={setJsCode}
            onHtmlChange={setHtmlCode}
            language={language}
            errorLine={errorLine}
          />

          <Console
            output={output}
            feedback={feedback}
            isRunning={isRunning}
            language={language}
            onClear={() => { setOutput(''); setFeedback([]); }}
          />
        </section>

        {/* MWARIMU SIDE */}
        <MwarimuPanel
          code={jsCode}
          error={lastError}
          runCount={runCount}
          instructions={breadcrumb}
          language={language}
          onLanguageChange={setLanguage}
          examMode={examMode}
        />
      </div>
    </div>
  );
}
