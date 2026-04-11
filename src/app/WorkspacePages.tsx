import React, { useState } from 'react';
import { SubmissionConfirmation } from './components/workspace/SubmissionConfirmation';
import { ResultsPage } from './components/workspace/ResultsPage';
import { AssignmentInstructions } from './components/workspace/AssignmentInstructions';
import { HelpPage } from './components/workspace/HelpPage';
import { SubmissionHistory } from './components/workspace/SubmissionHistory';

type WorkspacePageType = 'instructions' | 'confirmation' | 'results' | 'help' | 'history';

interface PageSelectorProps {
  currentPage: WorkspacePageType;
  onPageChange: (page: WorkspacePageType) => void;
}

function WorkspacePageSelector({ currentPage, onPageChange }: PageSelectorProps) {
  const pages = [
    { id: 'instructions' as const, label: 'Instructions', color: '#0ea5e9' },
    { id: 'confirmation' as const, label: 'Confirmation', color: '#10b981' },
    { id: 'results' as const, label: 'Results', color: '#8b5cf6' },
    { id: 'help' as const, label: 'Help', color: '#f59e0b' },
    { id: 'history' as const, label: 'History', color: '#64748b' }
  ];

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-3 z-50 hidden lg:block">
      <p className="text-xs font-semibold text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        Workspace Pages
      </p>
      <div className="flex flex-col gap-2">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onPageChange(page.id)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all text-left"
            style={{
              backgroundColor: currentPage === page.id ? page.color : 'transparent',
              color: currentPage === page.id ? 'white' : page.color,
              border: `2px solid ${page.color}`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {page.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WorkspacePages() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [currentPage, setCurrentPage] = useState<WorkspacePageType>('instructions');

  const isKinyarwanda = language === 'KIN';

  // Sample data
  const assignmentData = {
    title: isKinyarwanda ? 'Kubara Igiciro Cyose' : 'Calculate Total Price',
    description: isKinyarwanda
      ? 'Kora porogaramu ikoresha variables kugirango ubaze igiciro cyose cy\'ibicuruzwa'
      : 'Create a program that uses variables to calculate the total price of products',
    difficulty: 'Beginner' as const,
    estimatedTime: isKinyarwanda ? 'Iminota 30' : '30 minutes',
    dueDate: 'April 10, 2026',
    objectives: [
      isKinyarwanda ? 'Kwiga gukoresha variables neza' : 'Learn to declare and use variables properly',
      isKinyarwanda ? 'Gukora imikorere ya arithmetic' : 'Perform arithmetic operations',
      isKinyarwanda ? 'Kwerekana ibisubizo neza' : 'Display results correctly'
    ],
    requirements: [
      isKinyarwanda ? 'Shyiraho variables zitatu: productName, price, quantity' : 'Define three variables: productName, price, quantity',
      isKinyarwanda ? 'Baza igiciro cyose (price * quantity)' : 'Calculate total price (price * quantity)',
      isKinyarwanda ? 'Kwerekana izina ry\'igicuruzwa n\'igiciro cyose' : 'Display product name and total price',
      isKinyarwanda ? 'Koresha RWF mu ibisubizo' : 'Use RWF in the output'
    ],
    hints: [
      isKinyarwanda ? 'Koresha const kugirango ushyireho variables' : 'Use const to declare variables',
      isKinyarwanda ? 'Koresha console.log() kugirango werekane ibisubizo' : 'Use console.log() to display results',
      isKinyarwanda ? 'Wibuke gukoresha + kugirango uhuje strings' : 'Remember to use + to concatenate strings'
    ],
    starterCode: `// Define your variables here
const productName = "";
const price = 0;
const quantity = 0;

// Calculate total price

// Display results`
  };

  const testResults = [
    {
      id: '1',
      name: isKinyarwanda ? 'Igizamini 1: Variables zashyizweho' : 'Test 1: Variables Declared',
      passed: true,
      input: 'productName = "Laptop", price = 500000, quantity = 2'
    },
    {
      id: '2',
      name: isKinyarwanda ? 'Igizamini 2: Kubara neza' : 'Test 2: Correct Calculation',
      passed: true,
      input: 'price * quantity',
      expectedOutput: '1000000',
      actualOutput: '1000000'
    },
    {
      id: '3',
      name: isKinyarwanda ? 'Igizamini 3: Ibisubizo byerekanywe' : 'Test 3: Output Displayed',
      passed: true
    },
    {
      id: '4',
      name: isKinyarwanda ? 'Igizamini 4: RWF yinjijwe' : 'Test 4: RWF Included',
      passed: false,
      expectedOutput: 'Total Price: 1000000 RWF',
      actualOutput: 'Total Price: 1000000',
      error: isKinyarwanda ? 'RWF ntiyahuje' : 'RWF currency not included'
    },
    {
      id: '5',
      name: isKinyarwanda ? 'Igizamini 5: Umubare w\'ibisubizo' : 'Test 5: Number Formatting',
      passed: true
    }
  ];

  const aiFeedback = [
    isKinyarwanda
      ? 'Urakora neza cyane! Kode yawe ni nziza kandi ifite imiterere myiza.'
      : 'Great work! Your code is clean and well-structured.',
    isKinyarwanda
      ? 'Wibuke kwongera "RWF" mu bisubizo byose kugirango uzuze ibizamini byose.'
      : 'Remember to add "RWF" to all outputs to pass all tests.',
    isKinyarwanda
      ? 'Icyifuzo: Gerageza gukoresha template literals (`) kugirango uhuje strings neza.'
      : 'Suggestion: Try using template literals (`) for cleaner string concatenation.'
  ];

  const commonIssues = [
    {
      question: isKinyarwanda ? 'Kuki kode yanjye itakora?' : 'Why isn\'t my code working?',
      answer: isKinyarwanda
        ? 'Genzura ko variables zawe zose zashyizweho mbere yo kuzikoresha. Koresha console.log() kugirango urebe ibikora.'
        : 'Check that all your variables are declared before using them. Use console.log() to debug values.'
    },
    {
      question: isKinyarwanda ? 'Ni gute nahuriza strings?' : 'How do I concatenate strings?',
      answer: isKinyarwanda
        ? 'Koresha + hagati ya strings. Urugero: "Total: " + totalPrice'
        : 'Use the + operator between strings. Example: "Total: " + totalPrice'
    },
    {
      question: isKinyarwanda ? 'Ni variables zihe nkwiye gukoresha?' : 'What variables should I use?',
      answer: isKinyarwanda
        ? 'Uzakeneye: productName (string), price (number), quantity (number), na totalPrice (number).'
        : 'You\'ll need: productName (string), price (number), quantity (number), and totalPrice (number).'
    }
  ];

  const submissions = [
    { id: '1', date: 'Apr 6, 2026', time: '10:30 AM', grade: 85, testsPassed: 4, testsTotal: 5, status: 'partial' as const },
    { id: '2', date: 'Apr 5, 2026', time: '3:15 PM', grade: 60, testsPassed: 3, testsTotal: 5, status: 'partial' as const },
    { id: '3', date: 'Apr 5, 2026', time: '2:00 PM', grade: 40, testsPassed: 2, testsTotal: 5, status: 'failed' as const }
  ];

  return (
    <>
      <WorkspacePageSelector currentPage={currentPage} onPageChange={setCurrentPage} />

      {currentPage === 'instructions' && (
        <AssignmentInstructions
          language={language}
          title={assignmentData.title}
          description={assignmentData.description}
          difficulty={assignmentData.difficulty}
          estimatedTime={assignmentData.estimatedTime}
          dueDate={assignmentData.dueDate}
          objectives={assignmentData.objectives}
          requirements={assignmentData.requirements}
          hints={assignmentData.hints}
          starterCode={assignmentData.starterCode}
          onStartCoding={() => alert('Start coding!')}
        />
      )}

      {currentPage === 'confirmation' && (
        <SubmissionConfirmation
          language={language}
          assignmentTitle={assignmentData.title}
          testsPassedCount={4}
          testsTotalCount={5}
          onViewResults={() => setCurrentPage('results')}
          onBackToAssignments={() => alert('Back to assignments')}
        />
      )}

      {currentPage === 'results' && (
        <ResultsPage
          language={language}
          assignmentTitle={assignmentData.title}
          grade={85}
          testResults={testResults}
          aiFeedback={aiFeedback}
          submissionDate="April 6, 2026 at 10:30 AM"
          onReviseCode={() => alert('Revise code')}
          onDownloadReport={() => alert('Download report')}
        />
      )}

      {currentPage === 'help' && (
        <HelpPage
          language={language}
          assignmentTitle={assignmentData.title}
          commonIssues={commonIssues}
          onAskAI={() => alert('Ask AI')}
          onContactTeacher={() => alert('Contact teacher')}
        />
      )}

      {currentPage === 'history' && (
        <SubmissionHistory
          language={language}
          assignmentTitle={assignmentData.title}
          submissions={submissions}
          bestGrade={85}
          onViewSubmission={(id) => alert(`View submission ${id}`)}
          onDownloadCode={(id) => alert(`Download code ${id}`)}
        />
      )}
    </>
  );
}
