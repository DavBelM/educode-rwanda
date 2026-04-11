import React from 'react';
import { CheckCircle, Code, Clock, ArrowRight } from 'lucide-react';

interface SubmissionConfirmationProps {
  language: 'EN' | 'KIN';
  assignmentTitle: string;
  testsPassedCount: number;
  testsTotalCount: number;
  onViewResults: () => void;
  onBackToAssignments: () => void;
}

export function SubmissionConfirmation({
  language,
  assignmentTitle,
  testsPassedCount,
  testsTotalCount,
  onViewResults,
  onBackToAssignments
}: SubmissionConfirmationProps) {
  const isKinyarwanda = language === 'KIN';
  const allTestsPassed = testsPassedCount === testsTotalCount;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
          {/* Icon */}
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            allTestsPassed ? 'bg-gradient-to-br from-[#10b981] to-[#059669]' : 'bg-gradient-to-br from-[#f59e0b] to-[#d97706]'
          }`}>
            <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1e293b] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Umushinga watanzwe!' : 'Assignment Submitted!'}
          </h1>

          {/* Assignment Name */}
          <p className="text-lg text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            {assignmentTitle}
          </p>

          {/* Test Results Summary */}
          <div className="bg-[#f8fafc] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Code size={24} className="text-[#0ea5e9]" />
              <span className="text-4xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {testsPassedCount}/{testsTotalCount}
              </span>
            </div>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibizamini byatsinze' : 'Tests Passed'}
            </p>
          </div>

          {/* Status Message */}
          {allTestsPassed ? (
            <div className="bg-[#f0fdf4] border border-[#10b981] rounded-lg p-4 mb-8">
              <p className="text-[#10b981] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda
                  ? 'Byose byarangiye neza! Umushinga wawe watsinze ibizamini byose.'
                  : 'Perfect! Your assignment passed all tests.'}
              </p>
            </div>
          ) : (
            <div className="bg-[#fef3c7] border border-[#f59e0b] rounded-lg p-4 mb-8">
              <p className="text-[#d97706] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda
                  ? 'Umushinga watanzwe ariko ibizamini bimwe birimo ibibazo.'
                  : 'Assignment submitted, but some tests failed. You can revise and resubmit.'}
              </p>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-8">
            <Clock size={16} />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Watanzwe ku' : 'Submitted at'} {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onViewResults}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition-all shadow-md font-semibold"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span>{isKinyarwanda ? 'Reba Ibisubizo' : 'View Detailed Results'}</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onBackToAssignments}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {isKinyarwanda ? 'Subira ku Mishinga' : 'Back to Assignments'}
            </button>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-[#1e293b] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Ibikurikira' : 'What\'s Next?'}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda
                  ? 'Umwarimu uzareba kode yawe mu minsi 1-2'
                  : 'Your teacher will review your code within 1-2 days'}
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#8b5cf6] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda
                  ? 'Uzabona ibisobanuro by\'AI n\'amanota yawe'
                  : 'You\'ll receive AI feedback and your grade'}
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda
                  ? 'Ushobora gusubiramo mu gihe ibizamini bitarangiye'
                  : 'You can revise and resubmit if needed'}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
