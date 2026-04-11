import React from 'react';
import { Bot, AlertTriangle, Lightbulb, Star, TrendingUp } from 'lucide-react';

interface ClassStruggle {
  concept: string;
  percentage: number;
  suggestion: string;
}

interface StudentAlert {
  name: string;
  issue: string;
  suggestion: string;
}

interface PositiveInsight {
  text: string;
}

interface TeacherAIInsightsProps {
  language: 'EN' | 'KIN';
  classStruggle?: ClassStruggle;
  studentAlerts: StudentAlert[];
  positiveInsights: PositiveInsight[];
}

export function TeacherAIInsights({ language, classStruggle, studentAlerts, positiveInsights }: TeacherAIInsightsProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] rounded-xl shadow-xl p-6 text-white sticky top-6">
      {/* Header */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
          <Bot size={32} strokeWidth={2.5} />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        {isKinyarwanda ? 'Ibisobanuro by\'AI' : 'AI Insights'}
      </h2>
      <p className="text-sm opacity-90 mb-6 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        {isKinyarwanda ? 'Ubufasha bwihariye' : 'Powered insights for your class'}
      </p>

      {/* Class Struggles */}
      {classStruggle && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} />
            <h3 className="font-bold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibibazo by\'Ishuri' : 'Class Struggles'}
            </h3>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-3">
            <p className="font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {classStruggle.percentage}% {isKinyarwanda ? 'of students struggling with' : 'of students struggling with'} {classStruggle.concept}
            </p>
            <p className="text-sm opacity-90 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Lightbulb size={14} className="inline mr-1" />
              {classStruggle.suggestion}
            </p>
            <button
              className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-all text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {isKinyarwanda ? 'Kora Umushinga' : 'Create Targeted Assignment'}
            </button>
          </div>
        </div>
      )}

      {/* Individual Alerts */}
      {studentAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} />
            <h3 className="font-bold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Abanyeshuri Bakeneye Ubufasha' : 'Individual Alerts'}
            </h3>
          </div>
          <div className="space-y-3">
            {studentAlerts.map((alert, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="font-semibold text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {alert.name}
                </p>
                <p className="text-xs opacity-90 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {alert.issue}
                </p>
                <p className="text-xs opacity-75" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Lightbulb size={12} className="inline mr-1" />
                  {alert.suggestion}
                </p>
              </div>
            ))}
          </div>
          <button
            className="w-full mt-3 py-2 px-4 border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold transition-all text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isKinyarwanda ? 'Vugana na Abanyeshuri' : 'Contact Students'}
          </button>
        </div>
      )}

      {/* Positive Insights */}
      {positiveInsights.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star size={18} />
            <h3 className="font-bold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Amakuru Meza' : 'Positive Insights'}
            </h3>
          </div>
          <div className="space-y-2">
            {positiveInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <TrendingUp size={14} className="flex-shrink-0 mt-0.5" />
                <p className="opacity-90">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Analytics */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <button
          className="w-full text-center font-semibold hover:underline text-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {isKinyarwanda ? 'Reba Ibisobanuro Byose' : 'View Detailed Analytics'}
        </button>
      </div>
    </div>
  );
}
