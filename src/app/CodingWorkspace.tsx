import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { AIFeedbackPanel } from './components/AIFeedbackPanel';
import { OutputConsole } from './components/OutputConsole';
import { RunCodeButton } from './components/RunCodeButton';
import { StateSelector } from './components/StateSelector';
import { MobileAssignmentCard } from './components/MobileAssignmentCard';

type DemoState = 'empty' | 'success' | 'error' | 'loading';

export default function CodingWorkspace() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [demoState, setDemoState] = useState<DemoState>('empty');
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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'KIN' : 'EN');
  };

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput('');
    setFeedback([]);
    setDemoState('loading');

    // Simulate code execution
    setTimeout(() => {
      // Randomly pick success or error for demo purposes
      const isSuccess = Math.random() > 0.3;
      setDemoState(isSuccess ? 'success' : 'error');
      setIsRunning(false);
    }, 2000);
  }, []);

  // Update output and feedback based on demo state
  useEffect(() => {
    if (demoState === 'empty') {
      setOutput('');
      setFeedback([]);
    } else if (demoState === 'loading') {
      setOutput('');
      setFeedback([]);
    } else if (demoState === 'success') {
      const successOutput = `> Product: Laptop
> Total Price: 1000000 RWF
✅ All tests passed!`;
      setOutput(successOutput);

      const successFeedback = language === 'KIN'
        ? [
            { type: 'success' as const, message: 'Byakoze neza! (Well done!)\n\nYour code works perfectly! You correctly:\n• Defined variables with proper naming\n• Calculated the total price accurately\n• Displayed results in Rwandan Francs' },
            { type: 'info' as const, message: 'Icyifuzo (Next Challenge):\nTry adding a discount calculation. If quantity > 5, apply 10% discount.' }
          ]
        : [
            { type: 'success' as const, message: 'Byakoze neza! (Well done!)\n\nYour code works perfectly! You correctly:\n• Defined variables with proper naming\n• Calculated the total price accurately\n• Displayed results in Rwandan Francs' },
            { type: 'info' as const, message: 'Icyifuzo (Next Challenge):\nTry adding a discount calculation. If quantity > 5, apply 10% discount.' }
          ];
      setFeedback(successFeedback);
    } else if (demoState === 'error') {
      const errorOutput = `❌ ReferenceError: totalPrice is not defined
   at line 10`;
      setOutput(errorOutput);

      const errorFeedback = language === 'KIN'
        ? [
            { type: 'error' as const, message: 'Ikosa Ryabayeho (Error Found)\n\nIbisobanuro mu Kinyarwanda:\n\nUragerageza gukoresha umuhindagurika \'totalPrice\' ariko ntiwawushyizeho mbere. Ni nk\'uko ushaka gukoresha gasanduku utarabanje kukibika!' },
            { type: 'info' as const, message: 'Igisubizo (Solution):\nMbere yo gukoresha umuhindagurika, ugomba kuwushyiraho:\n\nconst totalPrice = price * quantity;\n\nWibuke: Umuhindagurika ugomba kugira agaciro mbere yo kuwukoresha!' }
          ]
        : [
            { type: 'error' as const, message: 'Ikosa Ryabayeho (Error Found)\n\nExplanation in English:\n\nYou are trying to use the variable \'totalPrice\' but you haven\'t declared it first. It\'s like trying to use a box before you\'ve stored it!' },
            { type: 'info' as const, message: 'Igisubizo (Solution):\nBefore using a variable, you must declare it:\n\nconst totalPrice = price * quantity;\n\nWibuke: A variable must have a value before you can use it!' }
          ];
      setFeedback(errorFeedback);
    }
  }, [demoState, language]);

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
      <Header language={language} onLanguageToggle={toggleLanguage} />

      {/* Demo State Selector */}
      <StateSelector currentState={demoState} onStateChange={setDemoState} />

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left: Code Editor (60%) */}
        <div className="w-[60%] relative">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            errorLine={demoState === 'error' ? 10 : undefined}
          />
          <div className="absolute bottom-6 left-6">
            <RunCodeButton onClick={runCode} isRunning={isRunning} language={language} />
          </div>
        </div>

        {/* Right: AI Feedback + Output (40%) */}
        <div className="w-[40%] flex flex-col">
          <div className="h-1/2">
            <AIFeedbackPanel feedback={feedback} language={language} isLoading={demoState === 'loading'} />
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
            errorLine={demoState === 'error' ? 10 : undefined}
          />
        </div>

        {/* Output Console */}
        <div className="h-[25%]">
          <OutputConsole output={output} isRunning={isRunning} language={language} />
        </div>

        {/* AI Feedback */}
        <div className="flex-1">
          <AIFeedbackPanel feedback={feedback} language={language} isLoading={demoState === 'loading'} />
        </div>

        {/* Run Button - Sticky at bottom on mobile */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <RunCodeButton onClick={runCode} isRunning={isRunning} language={language} isMobile />
        </div>
      </div>
    </div>
  );
}
