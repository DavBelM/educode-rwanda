import { Sparkles, CheckCircle, Lightbulb } from 'lucide-react';

interface AIInsightsProps {
  language: 'EN' | 'KIN';
  insights: Array<{ text: string; isPositive: boolean }>;
}

export function AIInsights({ language, insights }: AIInsightsProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="rounded-2xl p-6" style={{
      background: '#13161e',
      border: '1px solid rgba(139,92,246,0.2)',
      boxShadow: '0 0 30px rgba(139,92,246,0.05)'
    }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>
          <Sparkles size={18} style={{ color: '#8b5cf6' }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#f1f5f9' }}>
            {isKinyarwanda ? 'Ibisobanuro by\'AI' : 'AI Insights'}
          </p>
          <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}>
            {isKinyarwanda ? 'Ibyo ukwiye kunoza' : 'Personalized for you'}
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-2.5 mb-5">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
            {insight.isPositive
              ? <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#00d4aa' }} />
              : <Lightbulb size={15} className="shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />}
            <p className="text-xs leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8' }}>
              {insight.text}
            </p>
          </div>
        ))}
      </div>

      <button
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          fontFamily: 'Inter, sans-serif',
          background: 'rgba(139,92,246,0.12)',
          color: '#8b5cf6',
          border: '1px solid rgba(139,92,246,0.25)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.12)')}
      >
        {isKinyarwanda ? 'Bona Ubufasha Bwihariye' : 'Get Personalized Help'}
      </button>
    </div>
  );
}
