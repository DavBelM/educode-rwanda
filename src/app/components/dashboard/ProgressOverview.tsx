import { Zap } from 'lucide-react';

interface ProgressOverviewProps {
  language: 'EN' | 'KIN';
  progress: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  streak: number;
  xpPoints: number;
  level: string;
  onContinueLearning?: () => void;
}

export function ProgressOverview({ language, progress, assignmentsCompleted, assignmentsTotal, streak, xpPoints, level, onContinueLearning }: ProgressOverviewProps) {
  const isKinyarwanda = language === 'KIN';
  const circumference = 2 * Math.PI * 70;

  return (
    <div className="rounded-2xl p-6 sticky top-6" style={{
      background: '#13161e',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
    }}>
      <h2 className="text-base font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '11px' }}>
        {isKinyarwanda ? 'Iterambere' : 'Progress Overview'}
      </h2>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90" width="160" height="160">
            <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
            <circle
              cx="80" cy="80" r="70"
              stroke="url(#tealGradient)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress / 100)}
              className="transition-all duration-1000"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,170,0.5))' }}
            />
            <defs>
              <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4aa" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold" style={{ fontFamily: 'Inter, sans-serif', color: '#f1f5f9' }}>
                {progress}%
              </p>
              <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}>
                {isKinyarwanda ? 'Byarangiye' : 'Complete'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: isKinyarwanda ? 'Ibyasabwe' : 'Assignments', value: `${assignmentsCompleted}/${assignmentsTotal}` },
          { label: isKinyarwanda ? 'Iminsi' : 'Streak', value: streak, icon: <Zap size={16} className="text-[#f59e0b]" fill="#f59e0b" /> },
          { label: isKinyarwanda ? 'Amanota' : 'XP Points', value: xpPoints.toLocaleString() },
          { label: isKinyarwanda ? 'Urwego' : 'Level', value: level, small: true },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: '#1a1e2a', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}>{stat.label}</p>
            <div className="flex items-center gap-1.5">
              <p className={`font-bold ${stat.small ? 'text-sm' : 'text-2xl'}`} style={{ fontFamily: 'Inter, sans-serif', color: '#f1f5f9' }}>
                {stat.value}
              </p>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
        style={{
          fontFamily: 'Inter, sans-serif',
          background: 'rgba(0,212,170,0.12)',
          color: '#00d4aa',
          border: '1px solid rgba(0,212,170,0.25)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.12)')}
        onClick={onContinueLearning}
      >
        {isKinyarwanda ? 'Komeza Kwiga' : 'Continue Learning'}
      </button>
    </div>
  );
}
