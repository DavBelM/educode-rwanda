import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { AIFeedbackPanel } from './components/AIFeedbackPanel';
import { OutputConsole } from './components/OutputConsole';
import { RunCodeButton } from './components/RunCodeButton';
import { MobileAssignmentCard } from './components/MobileAssignmentCard';
import { executeCode } from '../lib/code-executor';
import { analyzeFeedback, formatFeedbackForUI } from '../lib/feedback-engine';

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
}

export default function CodingWorkspace({ onBack }: Props) {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [output, setOutput] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<Array<{ type: 'success' | 'error' | 'info'; message: string }>>([]);
  const [errorLine, setErrorLine] = useState<number | undefined>(undefined);

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
      <Header language={language} onLanguageToggle={toggleLanguage} showWorkspaceActions onBack={onBack} />

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left: Code Editor (60%) */}
        <div className="w-[60%] flex flex-col">
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

        <div className="h-[40%]">
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

        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <RunCodeButton onClick={runCode} isRunning={isRunning} language={language} isMobile />
        </div>
      </div>
    </div>
  );
}
