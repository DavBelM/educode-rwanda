import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { AIFeedbackPanel } from './components/AIFeedbackPanel';
import { OutputConsole } from './components/OutputConsole';
import { RunCodeButton } from './components/RunCodeButton';
import { MobileAssignmentCard } from './components/MobileAssignmentCard';
import { executeCode } from '../lib/code-executor';
import { analyzeFeedback, formatFeedbackForUI } from '../lib/feedback-engine';
import { submitCodingAssignment, type Assignment } from '../lib/db';
import { useExamMode } from '../hooks/useExamMode';
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

export default function CodingWorkspace({ onBack, assignment, language: initialLanguage }: Props) {
  const [language, setLanguage] = useState<'EN' | 'KIN'>( initialLanguage ?? 'EN');
  const isKin = language === 'KIN';
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [output, setOutput] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<Array<{ type: 'success' | 'error' | 'info'; message: string }>>([]);
  const [errorLine, setErrorLine] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [violationWarning, setViolationWarning] = useState('');

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
        ? (isKin ? '⚠️ Guhindura tab byarabonye!' : '⚠️ Tab switch detected!')
        : type === 'pasteCount'
        ? (isKin ? '⚠️ Gukopya code byarabonye!' : '⚠️ Code paste detected!')
        : (isKin ? '⚠️ Gusohoka ku screen nzima byarabonye!' : '⚠️ Fullscreen exit detected!');
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

  const timerColor = secondsLeft > 60 ? '#00d4aa' : secondsLeft > 30 ? '#f59e0b' : '#ef4444';
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
    }
    setSubmitting(false);
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'EN' ? 'KIN' : 'EN');

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('');
    setFeedback([]);
    setErrorLine(undefined);
    setPreviewSrc('');

    const result = await executeCode(jsCode, htmlCode);

    // Console output
    let displayOutput = result.output;
    if (result.error) {
      displayOutput = (result.output ? result.output + '\n' : '') + `❌ ${result.error}`;
    }
    setOutput(displayOutput);

    // Build preview src (HTML + JS combined for the iframe preview)
    if (!result.error) {
      setPreviewSrc(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:sans-serif;margin:0;padding:8px}</style>
</head><body>${htmlCode}<script>${jsCode}<\/script></body></html>`);
    }

    // Error line highlight
    const lineMatch = result.error?.match(/line (\d+)/i);
    if (lineMatch) setErrorLine(parseInt(lineMatch[1], 10));

    // Bilingual feedback
    const feedbacks = analyzeFeedback(result.error, jsCode, result.output, language);
    setFeedback(formatFeedbackForUI(feedbacks, language));

    setIsRunning(false);
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

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header language={language} onLanguageToggle={toggleLanguage} onBack={onBack} hideAssignmentInfo />

      {/* Violation warning toast */}
      {violationWarning && (
        <div className="shrink-0 px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle size={14} style={{ color: '#f87171' }} />
          <p className="text-xs font-semibold" style={{ color: '#f87171' }}>{violationWarning}</p>
        </div>
      )}

      {/* Exam mode — enter fullscreen nudge */}
      {examMode && !isFullscreen && !submitted && (
        <div className="shrink-0 px-4 py-2 flex items-center justify-between" style={{ background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
            {isKin ? '⚠️ Injira mu screen yuzuye kugirango utangire' : '⚠️ Enter fullscreen to continue the exam'}
          </p>
          <button onClick={requestFullscreen} className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
            {isKin ? 'Injira' : 'Go Fullscreen'}
          </button>
        </div>
      )}

      {/* Assignment banner */}
      {assignment && (
        <div className="shrink-0 px-6 py-3 flex items-center justify-between" style={{ background: '#13161e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase mb-0.5" style={{ color: '#475569', letterSpacing: '0.05em' }}>
              {examMode ? (isKin ? '🔒 Ikizamini' : '🔒 Exam') : (isKin ? 'Umushinga' : 'Assignment')}
            </p>
            <p className="text-sm font-bold truncate" style={{ color: '#f1f5f9' }}>
              {isKin && assignment.title_kin ? assignment.title_kin : assignment.title}
            </p>
            {assignment.description && (
              <p className="text-xs mt-0.5 truncate" style={{ color: '#475569' }}>
                {isKin && assignment.description_kin ? assignment.description_kin : assignment.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            {/* Countdown timer */}
            {examMode && !submitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${timerColor}40`, color: timerColor }}>
                <Clock size={14} />
                {timerDisplay}
              </div>
            )}
            {submitError && (
              <p className="text-xs" style={{ color: '#f87171' }}>{submitError}</p>
            )}
            {submitted ? (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)' }}>
                <CheckCircle size={15} />
                {isKin ? 'Byatanzwe!' : 'Submitted!'}
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: '#00d4aa', color: '#0d0f14' }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}
              >
                {submitting ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                {isKin ? 'Ohereza' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left: Code Editor (60%) */}
        <div className="w-[60%] flex flex-col" onPaste={examMode ? onPaste : undefined}>
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              jsCode={jsCode}
              htmlCode={htmlCode}
              onJsChange={setJsCode}
              onHtmlChange={setHtmlCode}
              language={language}
              errorLine={errorLine}
            />
          </div>
          <div className="shrink-0 px-4 py-3 bg-[#181825] border-t border-gray-700 flex items-center gap-3">
            <RunCodeButton onClick={runCode} isRunning={isRunning} language={language} />
          </div>
        </div>

        {/* Right: AI Feedback + Output (40%) */}
        <div className="w-[40%] flex flex-col">
          <div className="h-1/2">
            <AIFeedbackPanel feedback={feedback} language={language} isLoading={isRunning} />
          </div>
          <div className="h-1/2">
            <OutputConsole
              output={output}
              previewSrc={previewSrc}
              isRunning={isRunning}
              language={language}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 overflow-hidden flex flex-col">
        <MobileAssignmentCard language={language} />

        <div className="h-[40%]" onPaste={examMode ? onPaste : undefined}>
          <CodeEditor
            jsCode={jsCode}
            htmlCode={htmlCode}
            onJsChange={setJsCode}
            onHtmlChange={setHtmlCode}
            language={language}
            errorLine={errorLine}
          />
        </div>

        <div className="h-[25%]">
          <OutputConsole
            output={output}
            previewSrc={previewSrc}
            isRunning={isRunning}
            language={language}
          />
        </div>

        <div className="flex-1">
          <AIFeedbackPanel feedback={feedback} language={language} isLoading={isRunning} />
        </div>

        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shadow-lg flex gap-3">
          <RunCodeButton onClick={runCode} isRunning={isRunning} language={language} isMobile />
          {assignment && !submitted && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
              style={{ background: '#00d4aa', color: '#0d0f14' }}
            >
              {submitting ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
              {isKin ? 'Ohereza' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
