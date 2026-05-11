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
      background: 'var(--ec-surface)',
      border: '1px solid var(--ec-b1)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
    }}>
      <h2 className="font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-4)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '13px' }}>
        {isKinyarwanda ? 'Incamake y\'iterambere' : 'Progress Overview'}
      </h2>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90" width="160" height="160">
            <circle cx="80" cy="80" r="70" stroke="var(--ec-b1)" strokeWidth="10" fill="none" />
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
              <p className="text-4xl font-bold" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-1)' }}>
                {progress}%
              </p>
              <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-6)' }}>
                {isKinyarwanda ? 'Byarangiye' : 'Complete'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: isKinyarwanda ? 'Amasomo' : 'Lessons', value: `${assignmentsCompleted}/${assignmentsTotal}` },
          { label: isKinyarwanda ? 'Iminsi ukurikirana' : 'Streak', value: streak, icon: <Zap size={16} className="text-[#f59e0b]" fill="#f59e0b" /> },
          { label: isKinyarwanda ? 'Amanota (XP)' : 'XP Points', value: xpPoints.toLocaleString() },
          { label: isKinyarwanda ? 'Urwego' : 'Level', value: level, small: true },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: 'var(--ec-surface-2)', border: '1px solid var(--ec-b3)' }}>
            <p className="text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-6)' }}>{stat.label}</p>
            <div className="flex items-center gap-1.5">
              <p className={`font-bold ${stat.small ? 'text-base' : 'text-2xl'}`} style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-1)' }}>
                {stat.value}
              </p>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full py-3.5 rounded-xl font-semibold text-base transition-all"
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
