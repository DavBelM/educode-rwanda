import React from 'react';
import { Award, Flame, CheckCircle, Star, Trophy, Target } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
}

interface AchievementBadgesProps {
  language: 'EN' | 'KIN';
  badges: Badge[];
}

export function AchievementBadges({ language, badges }: AchievementBadgesProps) {
  const isKinyarwanda = language === 'KIN';

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      award: <Award size={24} />,
      flame: <Flame size={24} />,
      check: <CheckCircle size={24} />,
      star: <Star size={24} />,
      trophy: <Trophy size={24} />,
      target: <Target size={24} />
    };
    return iconMap[iconName] || <Award size={24} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-[#1e293b] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        {isKinyarwanda ? 'Ibihembo / Recent Achievements' : 'Recent Achievements'}
      </h2>

      {/* Badges Row */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center gap-2 min-w-[80px]">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                badge.earned
                  ? 'bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]'
                  : 'bg-gray-200'
              }`}
            >
              <div className={badge.earned ? 'text-white' : 'text-gray-400'}>
                {getIcon(badge.icon)}
              </div>
            </div>
            <p
              className={`text-xs text-center ${
                badge.earned ? 'text-[#1e293b] font-medium' : 'text-gray-400'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {badge.name}
            </p>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <button
        className="text-[#0ea5e9] font-semibold text-sm hover:underline"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {isKinyarwanda ? 'Reba Byose' : 'View All Badges'} →
      </button>
    </div>
  );
}
