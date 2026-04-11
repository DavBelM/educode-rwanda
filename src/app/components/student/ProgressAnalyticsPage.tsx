import React, { useState } from 'react';
import { TrendingUp, Target, Clock, CheckCircle2, AlertCircle, Lightbulb, BarChart3, Calendar } from 'lucide-react';

interface ProgressAnalyticsPageProps {
  language: 'EN' | 'KIN';
}

export function ProgressAnalyticsPage({ language }: ProgressAnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const isKinyarwanda = language === 'KIN';

  const weeklyData = [
    { day: 'Mon', hours: 2.5, xp: 200 },
    { day: 'Tue', hours: 1.8, xp: 150 },
    { day: 'Wed', hours: 3.2, xp: 300 },
    { day: 'Thu', hours: 2.1, xp: 180 },
    { day: 'Fri', hours: 2.8, xp: 250 },
    { day: 'Sat', hours: 0, xp: 0 },
    { day: 'Sun', hours: 1.5, xp: 120 }
  ];

  const skillsData = [
    { name: 'Variables', progress: 95, color: '#22c55e' },
    { name: 'Functions', progress: 80, color: '#0ea5e9' },
    { name: 'Loops', progress: 65, color: '#f59e0b' },
    { name: 'Arrays', progress: 70, color: '#8b5cf6' },
    { name: 'Objects', progress: 55, color: '#ec4899' },
    { name: 'Conditionals', progress: 90, color: '#06b6d4' }
  ];

  const testPassRateData = [
    { week: 'Week 1', passRate: 60 },
    { week: 'Week 2', passRate: 68 },
    { week: 'Week 3', passRate: 75 },
    { week: 'Week 4', passRate: 82 }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));
  const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);
  const avgHoursPerDay = totalHours / 7;

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
            {isKinyarwanda ? 'Isesengura ry\'Iterambere' : 'Progress Analytics'}
          </h1>
          <p className="text-gray-600">
            {isKinyarwanda ? 'Reba amakuru arambuye yerekeye iterambere ryawe' : 'Detailed insights into your learning progress'}
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-3 mb-8">
          {[
            { id: 'week', label: isKinyarwanda ? 'Icyumweru' : 'This Week' },
            { id: 'month', label: isKinyarwanda ? 'Ukwezi' : 'This Month' },
            { id: 'all', label: isKinyarwanda ? 'Byose' : 'All Time' }
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range.id
                  ? 'bg-[#0ea5e9] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0ea5e9]'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#0ea5e9]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{totalHours.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Igihe cyose' : 'Total Time'}</div>
            <div className="text-xs text-[#22c55e] mt-2">+12% {isKinyarwanda ? 'kuruta icyumweru' : 'vs last week'}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#22c55e]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">82%</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Ibizamini byatsinzwe' : 'Test Pass Rate'}</div>
            <div className="text-xs text-[#22c55e] mt-2">+22% {isKinyarwanda ? 'kuruta icyumweru' : 'vs last week'}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">75%</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Imishinga yarangiye' : 'Assignments Done'}</div>
            <div className="text-xs text-[#22c55e] mt-2">12/16 {isKinyarwanda ? 'byarangiye' : 'completed'}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{avgHoursPerDay.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Ikigereranyo ku munsi' : 'Avg per Day'}</div>
            <div className="text-xs text-gray-500 mt-2">{isKinyarwanda ? 'Icyumweru gishya' : 'This week'}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0ea5e9]" />
              {isKinyarwanda ? 'Ibikorwa by\'icyumweru' : 'Weekly Activity'}
            </h2>

            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700 w-12">{day.day}</span>
                    <span className="text-gray-600">{day.hours}h</span>
                    <span className="text-[#0ea5e9] font-semibold">{day.xp} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] h-3 rounded-full transition-all relative"
                      style={{ width: `${(day.hours / maxHours) * 100}%` }}
                    >
                      {day.hours > 0 && (
                        <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full border-2 border-[#0ea5e9]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{isKinyarwanda ? 'Igihe cyose cy\'icyumweru' : 'Total this week'}</span>
                <span className="text-lg font-bold text-[#1e293b]">{totalHours.toFixed(1)} {isKinyarwanda ? 'amasaha' : 'hours'}</span>
              </div>
            </div>
          </div>

          {/* Test Pass Rate Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
              {isKinyarwanda ? 'Iterambere ry\'ibizamini' : 'Test Pass Rate Trend'}
            </h2>

            <div className="h-64 flex items-end justify-between gap-4">
              {testPassRateData.map((week, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative" style={{ height: '200px' }}>
                    <div className="absolute bottom-0 w-full flex flex-col items-center">
                      <div className="text-sm font-bold text-[#22c55e] mb-2">{week.passRate}%</div>
                      <div
                        className="w-full bg-gradient-to-t from-[#22c55e] to-[#4ade80] rounded-t-lg transition-all"
                        style={{ height: `${(week.passRate / 100) * 180}px` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-3 font-semibold">{week.week}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{isKinyarwanda ? 'Iterambere' : 'Improvement'}</span>
                <span className="text-lg font-bold text-[#22c55e]">+22%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills Progress */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#8b5cf6]" />
              {isKinyarwanda ? 'Ubumenyi bwawe' : 'Skills Breakdown'}
            </h2>

            <div className="space-y-5">
              {skillsData.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">{skill.name}</span>
                    <span className="text-sm font-bold" style={{ color: skill.color }}>{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all relative"
                      style={{
                        width: `${skill.progress}%`,
                        backgroundColor: skill.color
                      }}
                    >
                      <div
                        className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full border-2"
                        style={{ borderColor: skill.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
              {isKinyarwanda ? 'Inama' : 'Insights'}
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#22c55e] mb-1">
                      {isKinyarwanda ? 'Imbaraga' : 'Strength'}
                    </div>
                    <div className="text-sm text-gray-700">
                      {isKinyarwanda
                        ? 'Uri cyane kuri Variables n\'Conditionals!'
                        : 'You excel at Variables and Conditionals!'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#f59e0b] mb-1">
                      {isKinyarwanda ? 'Kwiyongera' : 'Focus Area'}
                    </div>
                    <div className="text-sm text-gray-700">
                      {isKinyarwanda
                        ? 'Wiga cyane Objects n\'Loops'
                        : 'Practice more with Objects and Loops'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0ea5e9] mb-1">
                      {isKinyarwanda ? 'Iterambere' : 'Progress'}
                    </div>
                    <div className="text-sm text-gray-700">
                      {isKinyarwanda
                        ? 'Iterambere ryawe rikiri hejuru kuruta 68% by\'abagenzi bawe'
                        : 'Your progress is ahead of 68% of your peers'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
