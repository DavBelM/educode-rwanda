import React from 'react';
import { Clock, Target, Award, BookOpen, Play, AlertCircle } from 'lucide-react';

interface AssignmentInstructionsProps {
  language: 'EN' | 'KIN';
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  dueDate: string;
  objectives: string[];
  requirements: string[];
  hints: string[];
  starterCode: string;
  onStartCoding: () => void;
}

export function AssignmentInstructions({
  language,
  title,
  description,
  difficulty,
  estimatedTime,
  dueDate,
  objectives,
  requirements,
  hints,
  starterCode,
  onStartCoding
}: AssignmentInstructionsProps) {
  const isKinyarwanda = language === 'KIN';

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Beginner':
        return { bg: '#dbeafe', text: '#0ea5e9', border: '#0ea5e9' };
      case 'Intermediate':
        return { bg: '#fef3c7', text: '#f59e0b', border: '#f59e0b' };
      case 'Advanced':
        return { bg: '#fce7f3', text: '#ec4899', border: '#ec4899' };
    }
  };

  const difficultyColor = getDifficultyColor();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {title}
            </h1>
            <span
              className="px-4 py-2 rounded-lg text-sm font-semibold border-2"
              style={{
                backgroundColor: difficultyColor.bg,
                color: difficultyColor.text,
                borderColor: difficultyColor.border,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {difficulty}
            </span>
          </div>
          <p className="text-gray-600 text-lg mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            {description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[#0ea5e9]" />
              <div>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Igihe Giteganijwe' : 'Estimated Time'}
                </p>
                <p className="text-sm font-semibold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {estimatedTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-[#f59e0b]" />
              <div>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Itariki yo Kurangiza' : 'Due Date'}
                </p>
                <p className="text-sm font-semibold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {dueDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} className="text-[#10b981]" />
              <div>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Amanota' : 'Points'}
                </p>
                <p className="text-sm font-semibold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  100 XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Learning Objectives */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target size={24} className="text-[#0ea5e9]" />
            <h2 className="text-xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Intego zo Kwiga' : 'Learning Objectives'}
            </h2>
          </div>
          <ul className="space-y-2">
            {objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0ea5e9] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {objective}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={24} className="text-[#8b5cf6]" />
            <h2 className="text-xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibisabwa' : 'Requirements'}
            </h2>
          </div>
          <div className="space-y-3">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-3 bg-[#f8fafc] rounded-lg p-3">
                <div className="w-5 h-5 rounded border-2 border-[#8b5cf6] flex-shrink-0 mt-0.5"></div>
                <p className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {requirement}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hints */}
        {hints.length > 0 && (
          <div className="bg-gradient-to-br from-[#fef3c7] to-[#fef9e7] rounded-xl shadow-lg border-2 border-[#f59e0b] p-6">
            <h3 className="font-bold text-[#d97706] mb-4 flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="text-xl">💡</span>
              {isKinyarwanda ? 'Amakuru Afasha' : 'Helpful Hints'}
            </h3>
            <ul className="space-y-2">
              {hints.map((hint, index) => (
                <li key={index} className="text-[#78350f] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  • {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Starter Code Preview */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#1e293b] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Kode yo Gutangira' : 'Starter Code'}
          </h2>
          <div className="bg-[#1e1e2e] rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {starterCode}
            </pre>
          </div>
        </div>

        {/* Start Button */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-bold text-[#1e293b] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Witeguye Gutangira?' : 'Ready to Start?'}
              </h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda
                  ? 'Kanda hano kugirango utangire gukora kode yawe'
                  : 'Click below to open the coding workspace'}
              </p>
            </div>
            <button
              onClick={onStartCoding}
              className="flex items-center gap-3 px-8 py-4 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition-all shadow-lg font-bold text-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Play size={24} fill="white" />
              <span>{isKinyarwanda ? 'Tangira Gukora' : 'Start Coding'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
