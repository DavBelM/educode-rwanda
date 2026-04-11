import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { AIFeedbackPanel } from './components/AIFeedbackPanel';
import { OutputConsole } from './components/OutputConsole';
import { RunCodeButton } from './components/RunCodeButton';
import { MobileAssignmentCard } from './components/MobileAssignmentCard';
import { executeCode } from '../lib/code-executor';
import { analyzeFeedback, formatFeedbackForUI } from '../lib/feedback-engine';

interface Props {
  onBack?: () => void;
}

export default function CodingWorkspace({ onBack }: Props) {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [code, setCode] = useState(`// Welcome to EduCode Rwanda!
// Assignment: Variables Practice - Calculate Total Price

// Define product variables
const productName = "Laptop";
const price = 500000;
const quantity = 2;

// Calculate total
const totalPrice = price * quantity;

// Display results
console.log("Product: " + productName);
console.log("Total Price: " + totalPrice + " RWF");
`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<Array<{ type: 'success' | 'error' | 'info'; message: string }>>([]);
  const [errorLine, setErrorLine] = useState<number | undefined>(undefined);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'KIN' : 'EN');
  };

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('');
    setFeedback([]);
    setErrorLine(undefined);

    const result = await executeCode(code);

    // Format output
    let displayOutput = result.output;
    if (result.error) {
      displayOutput = (result.output ? result.output + '\n' : '') + `❌ ${result.error}`;
    }
    setOutput(displayOutput);

    // Extract error line from error message if present
    const lineMatch = result.error?.match(/line (\d+)/i);
    if (lineMatch) setErrorLine(parseInt(lineMatch[1], 10));

    // Generate bilingual feedback
    const feedbacks = analyzeFeedback(result.error, code, result.output, language);
    setFeedback(formatFeedbackForUI(feedbacks, language));

    setIsRunning(false);
  }, [code, language]);

  // Keyboard shortcut: Ctrl+Enter to run code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) {
          runCode();
        }
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
        <div className="w-[60%] relative">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            errorLine={errorLine}
          />
          <div className="absolute bottom-6 left-6">
            <RunCodeButton onClick={runCode} isRunning={isRunning} language={language} />
          </div>
        </div>

        {/* Right: AI Feedback + Output (40%) */}
        <div className="w-[40%] flex flex-col">
          <div className="h-1/2">
            <AIFeedbackPanel feedback={feedback} language={language} isLoading={isRunning} />
          </div>
          <div className="h-1/2">
            <OutputConsole output={output} isRunning={isRunning} language={language} />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 overflow-hidden flex flex-col">
        {/* Mobile Assignment Card */}
        <MobileAssignmentCard language={language} />

        {/* Code Editor */}
        <div className="h-[40%] relative">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            errorLine={errorLine}
          />
        </div>

        {/* Output Console */}
        <div className="h-[25%]">
          <OutputConsole output={output} isRunning={isRunning} language={language} />
        </div>

        {/* AI Feedback */}
        <div className="flex-1">
          <AIFeedbackPanel feedback={feedback} language={language} isLoading={isRunning} />
        </div>

        {/* Run Button - Sticky at bottom on mobile */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <RunCodeButton onClick={runCode} isRunning={isRunning} language={language} isMobile />
        </div>
      </div>
    </div>
  );
}
