import React, { useState } from 'react';
import { Award, Trophy, Flame, Target, CheckCircle2, Lock, Star, Zap, BookOpen, Users, Crown, Sparkles } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'learning' | 'streaks' | 'milestones' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  progressTotal?: number;
}

interface AchievementsGalleryPageProps {
  language: 'EN' | 'KIN';
}

export function AchievementsGalleryPage({ language }: AchievementsGalleryPageProps) {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'learning' | 'streaks' | 'milestones' | 'special'>('all');
  const isKinyarwanda = language === 'KIN';

  const badges: Badge[] = [
    {
      id: '1',
      name: isKinyarwanda ? 'Umukoro wa mbere' : 'First Assignment',
      description: isKinyarwanda ? 'Rangiza umukoro wawe wa mbere' : 'Complete your first assignment',
      icon: 'award',
      earned: true,
      earnedDate: isKinyarwanda ? '25 Werurwe 2026' : 'March 25, 2026',
      category: 'milestones',
      rarity: 'common'
    },
    {
      id: '2',
      name: isKinyarwanda ? 'Iminsi 5 ukurikirana' : '5-Day Streak',
      description: isKinyarwanda ? 'Wanditse code iminsi 5 ikurikirana' : 'Code for 5 days in a row',
      icon: 'flame',
      earned: true,
      earnedDate: isKinyarwanda ? '30 Werurwe 2026' : 'March 30, 2026',
      category: 'streaks',
      rarity: 'common'
    },
    {
      id: '3',
      name: isKinyarwanda ? 'Amagerageza 10 yatsinzwe' : '10 Tests Passed',
      description: isKinyarwanda ? 'Tsinda amagerageza 10 neza' : 'Pass 10 tests successfully',
      icon: 'check',
      earned: true,
      earnedDate: isKinyarwanda ? '2 Mata 2026' : 'April 2, 2026',
      category: 'learning',
      rarity: 'common'
    },
    {
      id: '4',
      name: isKinyarwanda ? 'Iminsi 10 ukurikirana' : '10-Day Streak',
      description: isKinyarwanda ? 'Wanditse code iminsi 10 ikurikirana' : 'Code for 10 days in a row',
      icon: 'flame',
      earned: false,
      category: 'streaks',
      rarity: 'rare',
      progress: 5,
      progressTotal: 10
    },
    {
      id: '5',
      name: isKinyarwanda ? 'Imikoro 5' : '5 Assignments',
      description: isKinyarwanda ? 'Rangiza imikoro 5' : 'Complete 5 assignments',
      icon: 'target',
      earned: false,
      category: 'milestones',
      rarity: 'rare',
      progress: 3,
      progressTotal: 5
    },
    {
      id: '6',
      name: isKinyarwanda ? 'Amanota yose' : 'Perfect Score',
      description: isKinyarwanda ? 'Tsinda amagerageza yose ku mukoro' : 'Pass all tests on an assignment',
      icon: 'star',
      earned: false,
      category: 'learning',
      rarity: 'rare',
      progress: 4,
      progressTotal: 5
    },
    {
      id: '7',
      name: isKinyarwanda ? 'Umunyamuvuduko' : 'Speed Demon',
      description: isKinyarwanda ? 'Rangiza umukoro mu minota itageze kuri 30' : 'Complete an assignment in under 30 minutes',
      icon: 'zap',
      earned: false,
      category: 'special',
      rarity: 'epic'
    },
    {
      id: '8',
      name: isKinyarwanda ? 'Umunyabwenge' : 'Scholar',
      description: isKinyarwanda ? 'Rangiza amasomo 10' : 'Complete 10 lessons',
      icon: 'book',
      earned: false,
      category: 'learning',
      rarity: 'epic',
      progress: 6,
      progressTotal: 10
    },
    {
      id: '9',
      name: isKinyarwanda ? 'Gukorera hamwe' : 'Team Player',
      description: isKinyarwanda ? 'Fasha bagenzi bawe 5' : 'Help 5 classmates',
      icon: 'users',
      earned: false,
      category: 'special',
      rarity: 'rare'
    },
    {
      id: '10',
      name: isKinyarwanda ? 'Iminsi 30 ukurikirana' : '30-Day Streak',
      description: isKinyarwanda ? 'Wanditse code iminsi 30 ikurikirana' : 'Code for 30 days in a row',
      icon: 'flame',
      earned: false,
      category: 'streaks',
      rarity: 'epic',
      progress: 5,
      progressTotal: 30
    },
    {
      id: '11',
      name: isKinyarwanda ? 'Intwari' : 'Champion',
      description: isKinyarwanda ? 'Rangiza imikoro 15' : 'Complete 15 assignments',
      icon: 'trophy',
      earned: false,
      category: 'milestones',
      rarity: 'epic',
      progress: 12,
      progressTotal: 15
    },
    {
      id: '12',
      name: isKinyarwanda ? 'Inzobere muri Code' : 'Code Master',
      description: isKinyarwanda ? 'Rangiza ibice byose neza cyane' : 'Complete all modules with excellence',
      icon: 'crown',
      earned: false,
      category: 'special',
      rarity: 'legendary'
    }
  ];

  const filteredBadges = categoryFilter === 'all'
    ? badges
    : badges.filter(badge => badge.category === categoryFilter);

  const earnedBadges = badges.filter(b => b.earned).length;
  const totalBadges = badges.length;
  const completionPercentage = Math.round((earnedBadges / totalBadges) * 100);

  const getIconComponent = (iconName: string, className: string) => {
    const icons: { [key: string]: any } = {
      award: Award,
      flame: Flame,
      check: CheckCircle2,
      target: Target,
      star: Star,
      zap: Zap,
      book: BookOpen,
      users: Users,
      trophy: Trophy,
      crown: Crown
    };
    const IconComponent = icons[iconName] || Award;
    return <IconComponent className={className} />;
  };

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-amber-400 to-amber-600';
    }
  };

  const getRarityBorder = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-amber-300';
    }
  };

  const getRarityBg = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50';
      case 'rare': return 'bg-blue-50';
      case 'epic': return 'bg-purple-50';
      case 'legendary': return 'bg-amber-50';
    }
  };

  const categories = [
    { id: 'all', label: isKinyarwanda ? 'Byose' : 'All', count: badges.length },
    { id: 'learning', label: isKinyarwanda ? 'Kwiga' : 'Learning', count: badges.filter(b => b.category === 'learning').length },
    { id: 'streaks', label: isKinyarwanda ? 'Iminsi ukurikirana' : 'Streaks', count: badges.filter(b => b.category === 'streaks').length },
    { id: 'milestones', label: isKinyarwanda ? 'Intambwe zagezweho' : 'Milestones', count: badges.filter(b => b.category === 'milestones').length },
    { id: 'special', label: isKinyarwanda ? 'Ibidasanzwe' : 'Special', count: badges.filter(b => b.category === 'special').length }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
            {isKinyarwanda ? 'Inzu y’Ibihembo' : 'Achievements Gallery'}
          </h1>
          <p className="text-gray-600">
            {isKinyarwanda ? 'Reba ibihembo watsindiye unakore ibishya' : 'View your earned badges and unlock new ones'}
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {isKinyarwanda ? 'Iterambere ryawe' : 'Your Progress'}
              </h2>
              <p className="text-blue-100">
                {earnedBadges} {isKinyarwanda ? 'kuri' : 'of'} {totalBadges} {isKinyarwanda ? 'ibihembo watsindiye' : 'badges earned'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-1">{completionPercentage}%</div>
              <p className="text-blue-100">{isKinyarwanda ? 'Byarangiye' : 'Complete'}</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4">
            <div
              className="bg-white h-4 rounded-full transition-all flex items-center justify-end pr-2"
              style={{ width: `${completionPercentage}%` }}
            >
              {completionPercentage > 10 && <Sparkles className="w-4 h-4 text-[#0ea5e9]" />}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                categoryFilter === cat.id
                  ? 'bg-[#0ea5e9] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0ea5e9]'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
                badge.earned
                  ? `${getRarityBorder(badge.rarity)} hover:shadow-lg cursor-pointer`
                  : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center mx-auto mb-4 relative`}>
                {badge.earned ? (
                  getIconComponent(badge.icon, 'w-10 h-10 text-white')
                ) : (
                  <Lock className="w-10 h-10 text-white" />
                )}
                {badge.earned && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Badge Name */}
              <h3 className="text-lg font-bold text-[#1e293b] text-center mb-2">
                {badge.name}
              </h3>

              {/* Badge Description */}
              <p className="text-sm text-gray-600 text-center mb-4">
                {badge.description}
              </p>

              {/* Progress Bar (for locked badges) */}
              {!badge.earned && badge.progress !== undefined && badge.progressTotal !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>{isKinyarwanda ? 'Iterambere' : 'Progress'}</span>
                    <span>{badge.progress}/{badge.progressTotal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0ea5e9] h-2 rounded-full transition-all"
                      style={{ width: `${(badge.progress / badge.progressTotal) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Rarity Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getRarityBg(badge.rarity)} border ${getRarityBorder(badge.rarity)}`}>
                  {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                </span>
                {badge.earned && badge.earnedDate && (
                  <span className="text-xs text-gray-500">{badge.earnedDate}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBadges.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {isKinyarwanda ? 'Nta bihembo bihari muri iki gice' : 'No badges in this category'}
            </h3>
            <p className="text-gray-500">
              {isKinyarwanda ? 'Gerageza guhitamo ikindi gice' : 'Try selecting a different category'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
