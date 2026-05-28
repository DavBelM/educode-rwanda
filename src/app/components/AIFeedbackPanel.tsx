import { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { translateToKinyarwanda } from '../../lib/ai';

interface AIFeedbackPanelProps {
  feedback: Array<{ type: 'success' | 'error' | 'info'; message: string }>;
  language: 'EN' | 'KIN';
  isLoading?: boolean;
  aiResponse?: string | null;
  aiLoading?: boolean;
}

export function AIFeedbackPanel({ feedback, language, isLoading = false, aiResponse = null, aiLoading = false }: AIFeedbackPanelProps) {
  const isKinyarwanda = language === 'KIN';
  const [kinText, setKinText] = useState<string | null>(null);
  const [kinLoading, setKinLoading] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  useEffect(() => { setKinText(null); setKinLoading(false); setResponseTime(null); }, [aiResponse]);

  useEffect(() => {
    if (!aiLoading) {
      setElapsed(s => { setResponseTime(s); return 0; });
      return;
    }
    setElapsed(0);
    const interval = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [aiLoading]);

  async function handleTranslate() {
    if (!aiResponse) return;
    setKinLoading(true);
    try {
      const translated = await translateToKinyarwanda(aiResponse);
      setKinText(translated);
    } catch {
      setKinText(aiResponse);
    } finally {
      setKinLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--ec-surface)', borderLeft: '1px solid var(--ec-b1)' }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--ec-b1)' }}>
        <div className="w-8 h-8 rounded-lg bg-[#8b5cf6] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-semibold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: 'var(--ec-text-1)' }}>
          {isKinyarwanda ? 'Ibisobanuro bya AI' : 'AI Feedback'}
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
                <p className="font-medium flex items-center justify-center gap-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: 'var(--ec-text-4)' }}>
                  <span className="animate-spin">⏳</span>
                  Turareba code yawe...
                </p>
                <p className="text-sm text-center" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-6)' }}>
                  Analyzing your code...
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] rounded-full animate-pulse" style={{ width: '60%', transition: 'width 2s ease-in-out' }}></div>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'var(--ec-text-4)' }}>
                  Tugira ibisobanuro by'AI...
                </p>
                <p className="text-sm text-center" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-6)' }}>
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
              <p className="font-medium" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: 'var(--ec-text-4)' }}>
                {isKinyarwanda ? 'Kanda "Kora Code" kugirango ubone ibisobanuro' : 'Run your code to get AI feedback'}
              </p>
              <p className="text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-6)' }}>
                {isKinyarwanda ? 'EduCode AI izaza mu masegonda ~20 nyuma yo gukora' : 'EduCode AI responds in ~20s after running'}
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
            {/* Robot Icon with Status Badge — hide once AI is loading or has responded */}
            {feedback.length > 0 && !aiResponse && !aiLoading && (
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

            {/* Feedback Messages — hide when AI is loading or has responded */}
            {!aiResponse && !aiLoading && feedback.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-l-4"
                style={{
                  borderLeftColor: item.type === 'success' ? '#10b981' : item.type === 'error' ? '#ef4444' : '#8b5cf6',
                  backgroundColor: item.type === 'success' ? 'rgba(16,185,129,0.08)' : item.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(139,92,246,0.08)'
                }}
              >
                <p className="text-sm whitespace-pre-line" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: '1.6', color: 'var(--ec-text-3)' }}>
                  {item.message}
                </p>
              </div>
            ))}
          </>
        )}

        {/* AI Model Response */}
        {(aiLoading || aiResponse) && (
          <div className="mt-2 p-4 rounded-xl" style={{ background: 'var(--ec-gradient-ai)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} style={{ color: '#a78bfa' }} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#a78bfa' }}>
                {isKinyarwanda ? 'EduCode AI' : 'EduCode AI'}
              </span>
            </div>
            {aiLoading ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: '#a78bfa', animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#a78bfa' }}>
                    {isKinyarwanda ? 'EduCode AI irimo gusuzuma code yawe...' : 'EduCode AI is analyzing your code...'}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'rgba(167,139,250,0.6)' }}>
                  {elapsed < 30
                    ? (isKinyarwanda ? 'Bisaba hafi ya 20s...' : 'Usually takes ~20s...')
                    : elapsed < 70
                    ? (isKinyarwanda ? 'Gukora imirimo iremereye — komeza gutegereza...' : 'Loading AI model, please wait...')
                    : (isKinyarwanda ? 'Bisaba igihe kinini uyu munsi — komeza gutegereza...' : 'Taking longer than usual — still working...')}
                  <span className="ml-2 font-mono font-bold" style={{ color: '#a78bfa' }}>{elapsed}s</span>
                </p>
                <div className="mt-2 space-y-2">
                  <div className="h-2.5 rounded-full animate-pulse" style={{ background: 'rgba(139,92,246,0.25)', width: '90%' }} />
                  <div className="h-2.5 rounded-full animate-pulse" style={{ background: 'rgba(139,92,246,0.18)', width: '70%', animationDelay: '200ms' }} />
                  <div className="h-2.5 rounded-full animate-pulse" style={{ background: 'rgba(139,92,246,0.12)', width: '80%', animationDelay: '400ms' }} />
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--ec-text-2)' }}>
                  {kinText ?? aiResponse}
                </p>
                {responseTime !== null && (
                  <p className="mt-2 text-xs" style={{ color: 'rgba(167,139,250,0.5)' }}>
                    Responded in {responseTime}s
                  </p>
                )}
                {!kinText && !kinLoading && (
                  <button
                    onClick={handleTranslate}
                    className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa', background: 'rgba(139,92,246,0.08)', fontFamily: 'Inter, sans-serif' }}
                  >
                    Sobanura mu Kinyarwanda
                  </button>
                )}
                {kinLoading && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 150, 300].map(d => (
                        <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ background: '#a78bfa', animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                    <span className="text-xs" style={{ color: '#a78bfa' }}>Translating to Kinyarwanda...</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Action Buttons — only show when no AI activity */}
        {feedback.length > 0 && !aiResponse && !aiLoading && (
          <div className="mt-2 space-y-2">
            {/* Error State: Two Buttons */}
            {feedback.some(f => f.type === 'error') ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ fontFamily: 'Inter, sans-serif', border: '1px solid var(--ec-b4)', color: 'var(--ec-text-4)', background: 'var(--ec-b3)' }}
                >
                  {isKinyarwanda ? 'Kwikosora' : 'Fix Myself'}
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-all text-sm font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {isKinyarwanda ? 'Sobanura mu Kinyarwanda' : 'Explain in Kinyarwanda'}
                </button>
              </div>
            ) : (
              /* Success/Info State: Single Button */
              <button
                className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ fontFamily: 'Inter, sans-serif', border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa', background: 'rgba(139,92,246,0.08)' }}
              >
                {isKinyarwanda ? 'Sobanura mu Kinyarwanda' : 'Explain in Kinyarwanda'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
