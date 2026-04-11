import React from 'react';
import { Bot } from 'lucide-react';

interface AIFeedbackPanelProps {
  feedback: Array<{ type: 'success' | 'error' | 'info'; message: string }>;
  language: 'EN' | 'KIN';
  isLoading?: boolean;
}

export function AIFeedbackPanel({ feedback, language, isLoading = false }: AIFeedbackPanelProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-[#8b5cf6] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-semibold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
          {isKinyarwanda ? 'Ubufasha bwa AI' : 'AI Feedback'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            {/* Loading Animation */}
            <div className="mb-6 relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center shadow-lg">
                <Bot size={40} className="text-white animate-pulse" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-[#8b5cf6] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-4 mb-6 w-full max-w-xs">
              <div className="space-y-1">
                <p className="text-gray-700 font-medium flex items-center justify-center gap-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
                  <span className="animate-spin">⏳</span>
                  Turareba code yawe...
                </p>
                <p className="text-gray-500 text-sm text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Analyzing your code...
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] rounded-full animate-pulse" style={{ width: '60%', transition: 'width 2s ease-in-out' }}></div>
              </div>

              <div className="space-y-1">
                <p className="text-gray-700 font-medium text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
                  Tugira ibisobanuro by'AI...
                </p>
                <p className="text-gray-500 text-sm text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Generating AI feedback...
                </p>
              </div>
            </div>

            {/* Shimmer Effect Ghost Lines */}
            <div className="w-full max-w-xs space-y-2">
              <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse" style={{ animationDelay: '150ms' }}></div>
            </div>
          </div>
        ) : feedback.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            {/* Friendly Robot Icon - Empty State */}
            <div className="mb-6 relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center shadow-lg">
                <Bot size={40} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-[#8b5cf6] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Bilingual Text */}
            <div className="space-y-2 mb-6">
              <p className="text-gray-700 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
                Click "Run Code" to get AI-powered feedback
              </p>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Kanda "Kora Code" kugirango ubone ibisobanuro by'AI
              </p>
            </div>

            {/* Ghost Preview */}
            <div className="w-full max-w-sm space-y-2 mt-4">
              <div className="p-3 rounded-lg border-l-4 border-[#8b5cf6] bg-[#faf5ff] opacity-30">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#8b5cf6]"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#8b5cf6] rounded w-3/4"></div>
                    <div className="h-3 bg-[#8b5cf6] rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg border-l-4 border-[#10b981] bg-[#f0fdf4] opacity-30">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10b981]"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#10b981] rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Robot Icon with Status Badge */}
            {feedback.length > 0 && (
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center shadow-lg">
                    <Bot size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  {/* Success Badge */}
                  {feedback.some(f => f.type === 'success') && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-[#10b981] flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {/* Error Badge */}
                  {feedback.some(f => f.type === 'error') && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-[#ef4444] flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12M12 16H12.01" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feedback Messages */}
            {feedback.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-l-4"
                style={{
                  borderLeftColor: item.type === 'success' ? '#10b981' : item.type === 'error' ? '#ef4444' : '#8b5cf6',
                  backgroundColor: item.type === 'success' ? '#f0fdf4' : item.type === 'error' ? '#fef2f2' : '#faf5ff'
                }}
              >
                <p className="text-sm text-[#1e293b] whitespace-pre-line" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.6' }}>
                  {item.message}
                </p>
              </div>
            ))}
          </>
        )}

        {/* Action Buttons */}
        {feedback.length > 0 && (
          <div className="mt-2 space-y-2">
            {/* Error State: Two Buttons */}
            {feedback.some(f => f.type === 'error') ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {isKinyarwanda ? 'Kosora Wenyine' : 'Fix Myself'}
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-all text-sm font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {isKinyarwanda ? 'Sobanura mu Cyongereza' : 'Explain in Kinyarwanda'}
                </button>
              </div>
            ) : (
              /* Success/Info State: Single Button */
              <button
                className="w-full px-4 py-2 rounded-lg border-2 border-[#8b5cf6] text-[#8b5cf6] hover:bg-purple-50 transition-all text-sm font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isKinyarwanda ? 'Sobanura mu Cyongereza (Explain in English)' : 'Explain in Kinyarwanda'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
