import React from 'react';
import { Bot, CheckCircle, Lightbulb } from 'lucide-react';

interface AIInsightsProps {
  language: 'EN' | 'KIN';
  insights: Array<{ text: string; isPositive: boolean }>;
}

export function AIInsights({ language, insights }: AIInsightsProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] rounded-xl shadow-xl p-6 text-white">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
          <Bot size={32} strokeWidth={2.5} />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        {isKinyarwanda ? 'Ibisobanuro by\'AI' : 'AI Insights'}
      </h2>

      {/* Subtitle */}
      <p className="text-sm opacity-90 mb-6 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        {isKinyarwanda ? 'Ibyo ukwiye kunoza' : 'Areas to Improve'}
      </p>

      {/* Insights List */}
      <div className="space-y-3 mb-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3"
          >
            {insight.isPositive ? (
              <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
            ) : (
              <Lightbulb size={18} className="flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {insight.text}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-all border-2 border-white/30"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {isKinyarwanda ? 'Bona Ubufasha Bwihariye' : 'Get Personalized Help'}
      </button>
    </div>
  );
}
