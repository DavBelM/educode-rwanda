import React from 'react';
import { CheckCircle, XCircle, Code, TrendingUp, Download, Edit } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  error?: string;
}

interface ResultsPageProps {
  language: 'EN' | 'KIN';
  assignmentTitle: string;
  grade: number;
  testResults: TestResult[];
  aiFeedback: string[];
  submissionDate: string;
  onReviseCode: () => void;
  onDownloadReport: () => void;
}

export function ResultsPage({
  language,
  assignmentTitle,
  grade,
  testResults,
  aiFeedback,
  submissionDate,
  onReviseCode,
  onDownloadReport
}: ResultsPageProps) {
  const isKinyarwanda = language === 'KIN';
  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {assignmentTitle}
              </h1>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Watanzwe ku' : 'Submitted on'} {submissionDate}
              </p>
            </div>
            <button
              onClick={onDownloadReport}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              <Download size={16} />
              <span className="hidden sm:inline">{isKinyarwanda ? 'Kuramo Raporo' : 'Download Report'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Grade Card */}
        <div className="bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] rounded-xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <p className="text-sm opacity-90 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Amanota yawe' : 'Your Grade'}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {grade}
                </span>
                <span className="text-3xl font-bold opacity-75">/100</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {passedTests}/{totalTests}
                </p>
                <p className="text-sm opacity-90" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Ibizamini' : 'Tests Passed'}
                </p>
              </div>
              {grade >= 80 && (
                <TrendingUp size={48} className="opacity-75" />
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#1e293b] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Ibisubizo by\'Ibizamini' : 'Test Results'}
          </h2>
          <div className="space-y-4">
            {testResults.map((test) => (
              <div
                key={test.id}
                className={`border-2 rounded-lg p-4 ${
                  test.passed ? 'border-[#10b981] bg-[#f0fdf4]' : 'border-[#ef4444] bg-[#fef2f2]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {test.passed ? (
                    <CheckCircle size={24} className="text-[#10b981] flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={24} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1e293b] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {test.name}
                    </h3>

                    {test.input && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {isKinyarwanda ? 'Icyinjiye' : 'Input'}:
                        </p>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {test.input}
                        </code>
                      </div>
                    )}

                    {!test.passed && (
                      <>
                        {test.expectedOutput && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {isKinyarwanda ? 'Icyari giteganijwe' : 'Expected Output'}:
                            </p>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {test.expectedOutput}
                            </code>
                          </div>
                        )}
                        {test.actualOutput && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {isKinyarwanda ? 'Icyavuye' : 'Your Output'}:
                            </p>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              {test.actualOutput}
                            </code>
                          </div>
                        )}
                        {test.error && (
                          <div className="text-sm text-[#ef4444] mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {test.error}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feedback */}
        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] rounded-xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <Code size={24} />
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibisobanuro by\'AI' : 'AI Feedback'}
            </h2>
          </div>
          <div className="space-y-3">
            {aiFeedback.map((feedback, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                  {feedback}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onReviseCode}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition-all shadow-md font-semibold"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Edit size={18} />
            <span>{isKinyarwanda ? 'Hindura Kode Yawe' : 'Revise Your Code'}</span>
          </button>
          <button
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isKinyarwanda ? 'Subira ku Mishinga' : 'Back to Assignments'}
          </button>
        </div>
      </div>
    </div>
  );
}
