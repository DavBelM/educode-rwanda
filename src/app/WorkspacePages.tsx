import { useState } from 'react';
import { SubmissionConfirmation } from './components/workspace/SubmissionConfirmation';
import { ResultsPage } from './components/workspace/ResultsPage';
import { AssignmentInstructions } from './components/workspace/AssignmentInstructions';
import { HelpPage } from './components/workspace/HelpPage';
import { SubmissionHistory } from './components/workspace/SubmissionHistory';

type WorkspacePageType = 'instructions' | 'confirmation' | 'results' | 'help' | 'history';

export default function WorkspacePages() {
  const [language] = useState<'EN' | 'KIN'>('EN');
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
