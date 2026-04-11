import React from 'react';
import { Zap } from 'lucide-react';

interface ProgressOverviewProps {
  language: 'EN' | 'KIN';
  progress: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  streak: number;
  xpPoints: number;
  level: string;
}

export function ProgressOverview({
  language,
  progress,
  assignmentsCompleted,
  assignmentsTotal,
  streak,
  xpPoints,
  level
}: ProgressOverviewProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sticky top-6">
      <h2 className="text-xl font-bold text-[#1e293b] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        {isKinyarwanda ? 'Iterambere / Progress' : 'Progress Overview'}
      </h2>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90" width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {progress}%
              </p>
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Byarangiye' : 'Complete'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#f8fafc] rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Ibyasabwe' : 'Assignments'}
          </p>
          <p className="text-2xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {assignmentsCompleted}/{assignmentsTotal}
          </p>
        </div>

        <div className="bg-[#f8fafc] rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Iminsi' : 'Streak'}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {streak}
            </p>
            <Zap size={20} className="text-[#f59e0b]" fill="#f59e0b" />
          </div>
        </div>

        <div className="bg-[#f8fafc] rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            XP {isKinyarwanda ? 'Amanota' : 'Points'}
          </p>
          <p className="text-2xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {xpPoints.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#f8fafc] rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Urwego' : 'Level'}
          </p>
          <p className="text-sm font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {level}
          </p>
        </div>
      </div>

      {/* Continue Learning Button */}
      <button
        className="w-full py-3 px-4 bg-[#0ea5e9] text-white rounded-lg font-semibold hover:bg-[#0284c7] transition-all shadow-md"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {isKinyarwanda ? 'Komeza Kwiga' : 'Continue Learning'}
      </button>
    </div>
  );
}
