import React, { useState } from 'react';
import { Download, TrendingUp, Users, Target, Clock, BarChart3, Award, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

interface ClassAnalyticsPageProps {
  language: 'EN' | 'KIN';
}

export function ClassAnalyticsPage({ language }: ClassAnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('week');
  const isKinyarwanda = language === 'KIN';

  const overallStats = {
    avgGrade: 76,
    completionRate: 73,
    activeStudents: 48,
    totalStudents: 52,
    avgTimeSpent: '1h 35m',
    improvementRate: 12
  };

  const gradeDistribution = [
    { range: '90-100%', count: 8, percentage: 15 },
    { range: '80-89%', count: 12, percentage: 23 },
    { range: '70-79%', count: 18, percentage: 35 },
    { range: '60-69%', count: 10, percentage: 19 },
    { range: 'Below 60%', count: 4, percentage: 8 }
  ];

  const weeklyEngagement = [
    { day: 'Mon', active: 45, submitted: 12 },
    { day: 'Tue', active: 42, submitted: 15 },
    { day: 'Wed', active: 48, submitted: 18 },
    { day: 'Thu', active: 38, submitted: 10 },
    { day: 'Fri', active: 40, submitted: 14 },
    { day: 'Sat', active: 20, submitted: 5 },
    { day: 'Sun', active: 15, submitted: 3 }
  ];

  const assignmentComparison = [
    { title: 'Variables', avgGrade: 88, completionRate: 100, difficulty: 'Beginner' },
    { title: 'Conditionals', avgGrade: 84, completionRate: 100, difficulty: 'Beginner' },
    { title: 'Functions', avgGrade: 78, completionRate: 92, difficulty: 'Beginner' },
    { title: 'Loops', avgGrade: 68, completionRate: 85, difficulty: 'Intermediate' },
    { title: 'Arrays', avgGrade: 72, completionRate: 88, difficulty: 'Intermediate' }
  ];

  const skillsHeatmap = [
    { skill: 'Variables', mastery: 85 },
    { skill: 'Functions', mastery: 72 },
    { skill: 'Loops', mastery: 58 },
    { skill: 'Arrays', mastery: 65 },
    { skill: 'Objects', mastery: 52 },
    { skill: 'Conditionals', mastery: 82 }
  ];

  const topPerformers = [
    { name: 'Marie Uwase', grade: 94, assignments: 16, trend: 'up' },
    { name: 'David Nkunda', grade: 92, assignments: 16, trend: 'up' },
    { name: 'Grace Mutesi', grade: 90, assignments: 15, trend: 'stable' }
  ];

  const strugglingStudents = [
    { name: 'Jean Mugisha', grade: 58, assignments: 12, trend: 'down' },
    { name: 'Patrick Habimana', grade: 62, assignments: 10, trend: 'down' },
    { name: 'Alice Uwera', grade: 65, assignments: 11, trend: 'stable' }
  ];

  const maxActive = Math.max(...weeklyEngagement.map(d => d.active));
  const maxCount = Math.max(...gradeDistribution.map(g => g.count));

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return '#22c55e';
    if (mastery >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 80) return isKinyarwanda ? 'Byiza' : 'Strong';
    if (mastery >= 60) return isKinyarwanda ? 'Bigenda' : 'Moderate';
    return isKinyarwanda ? 'Bigoye' : 'Weak';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
              {isKinyarwanda ? 'Isesengura ry\'ishuri' : 'Class Analytics'}
            </h1>
            <p className="text-gray-600">
              {isKinyarwanda ? 'Amakuru y\'imikorere y\'ishuri ryawe' : 'Comprehensive insights into your class performance'}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2">
              {[
                { id: 'week', label: isKinyarwanda ? 'Icyumweru' : 'Week' },
                { id: 'month', label: isKinyarwanda ? 'Ukwezi' : 'Month' },
                { id: 'semester', label: isKinyarwanda ? 'Iherezo' : 'Semester' }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as any)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    timeRange === range.id
                      ? 'bg-[#10b981] text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-[#10b981]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button className="px-6 py-2 bg-white text-[#10b981] border-2 border-[#10b981] rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              {isKinyarwanda ? 'Gufata' : 'Export'}
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{overallStats.avgGrade}%</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Amanota' : 'Avg Grade'}</div>
            <div className="flex items-center gap-1 text-xs text-[#22c55e] mt-2">
              <TrendingUp className="w-3 h-3" />
              +{overallStats.improvementRate}%
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#0ea5e9]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{overallStats.completionRate}%</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Byuzuye' : 'Completion'}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{overallStats.activeStudents}</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Barakora' : 'Active'}</div>
            <div className="text-xs text-gray-500 mt-2">
              {isKinyarwanda ? 'kuri' : 'of'} {overallStats.totalStudents}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{overallStats.avgTimeSpent.split(' ')[0]}</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Igihe' : 'Avg Time'}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{topPerformers.length}</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Barusha' : 'Top'}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-[#ef4444]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{strugglingStudents.length}</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Bakenera' : 'Need Help'}</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Grade Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#10b981]" />
              {isKinyarwanda ? 'Ikigabanywa cy\'amanota' : 'Grade Distribution'}
            </h2>

            <div className="space-y-4">
              {gradeDistribution.map((grade, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{grade.range}</span>
                    <span className="text-sm text-gray-600">{grade.count} students ({grade.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-[#10b981] to-[#34d399] h-3 rounded-full transition-all"
                      style={{ width: `${(grade.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Engagement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#10b981]" />
              {isKinyarwanda ? 'Kwitabira buri cyumweru' : 'Weekly Engagement'}
            </h2>

            <div className="h-64 flex items-end justify-between gap-3">
              {weeklyEngagement.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative" style={{ height: '200px' }}>
                    <div className="absolute bottom-0 w-full flex flex-col items-center gap-1">
                      <div className="text-xs font-bold text-[#10b981]">{day.active}</div>
                      <div
                        className="w-full bg-gradient-to-t from-[#10b981] to-[#34d399] rounded-t-lg transition-all"
                        style={{ height: `${(day.active / maxActive) * 170}px` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-3 font-semibold">{day.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment Comparison & Skills Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Assignment Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#10b981]" />
              {isKinyarwanda ? 'Ugereranya imishinga' : 'Assignment Comparison'}
            </h2>

            <div className="space-y-4">
              {assignmentComparison.map((assignment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">{assignment.title}</div>
                      <div className="text-xs text-gray-500">{assignment.difficulty}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#1e293b]">{assignment.avgGrade}%</div>
                      <div className="text-xs text-gray-500">{assignment.completionRate}% done</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">{isKinyarwanda ? 'Amanota' : 'Grade'}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#10b981] h-2 rounded-full"
                          style={{ width: `${assignment.avgGrade}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">{isKinyarwanda ? 'Byuzuye' : 'Done'}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#0ea5e9] h-2 rounded-full"
                          style={{ width: `${assignment.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#10b981]" />
              {isKinyarwanda ? 'Ubumenyi bw\'ishuri' : 'Class Skills Overview'}
            </h2>

            <div className="space-y-4">
              {skillsHeatmap.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: getMasteryColor(skill.mastery) }}>
                        {skill.mastery}%
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${getMasteryColor(skill.mastery)}20`,
                          color: getMasteryColor(skill.mastery)
                        }}
                      >
                        {getMasteryLabel(skill.mastery)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${skill.mastery}%`,
                        backgroundColor: getMasteryColor(skill.mastery)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers & Struggling Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#22c55e]" />
              {isKinyarwanda ? 'Abakora neza' : 'Top Performers'}
            </h2>

            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.assignments} assignments</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#22c55e]">{student.grade}%</div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-[#22c55e]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Struggling Students */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
              {isKinyarwanda ? 'Bakenera ubufasha' : 'Students Needing Help'}
            </h2>

            <div className="space-y-4">
              {strugglingStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-6 h-6 text-[#ef4444]" />
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-600">{student.assignments} assignments completed</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#ef4444]">{student.grade}%</div>
                    </div>
                    {student.trend === 'down' && <TrendingDown className="w-5 h-5 text-[#ef4444]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
