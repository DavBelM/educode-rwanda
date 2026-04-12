import { Award, Flame, CheckCircle, Star, Trophy, Target } from 'lucide-react';

interface Badge { id: string; name: string; icon: string; earned: boolean; }

interface AchievementBadgesProps {
  language: 'EN' | 'KIN';
  badges: Badge[];
}

const iconMap: Record<string, React.ReactNode> = {
  award:  <Award size={22} />,
  flame:  <Flame size={22} />,
  check:  <CheckCircle size={22} />,
  star:   <Star size={22} />,
  trophy: <Trophy size={22} />,
  target: <Target size={22} />,
};

export function AchievementBadges({ language, badges }: AchievementBadgesProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="rounded-2xl p-6" style={{
      background: '#13161e',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '11px' }}>
          {isKinyarwanda ? 'Ibihembo' : 'Achievements'}
        </p>
        <button className="text-xs font-semibold" style={{ color: '#00d4aa', fontFamily: 'Inter, sans-serif' }}>
          {isKinyarwanda ? 'Reba Byose' : 'View all'} →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center gap-2 min-w-[64px]">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
              style={badge.earned
                ? {
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))',
                    border: '1px solid rgba(245,158,11,0.35)',
                    color: '#f59e0b',
                    boxShadow: '0 0 14px rgba(245,158,11,0.15)',
                  }
                : {
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#334155',
                  }
              }
            >
              {iconMap[badge.icon] ?? <Award size={22} />}
            </div>
            <p className="text-xs text-center leading-tight" style={{
              fontFamily: 'Inter, sans-serif',
              color: badge.earned ? '#94a3b8' : '#334155',
              maxWidth: '60px'
            }}>
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
