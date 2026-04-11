import React, { useState } from 'react';
import { ArrowLeft, Mail, Calendar, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Target, BookOpen, MessageSquare, Video, FileText } from 'lucide-react';

interface StudentDetailPageProps {
  language: 'EN' | 'KIN';
  onBack: () => void;
}

interface Assignment {
  id: string;
  title: string;
  submittedDate: string;
  grade: number;
  testsPassedCount: number;
  testsTotalCount: number;
  timeSpent: string;
  status: 'completed' | 'partial' | 'late';
}

export function StudentDetailPage({ language, onBack }: StudentDetailPageProps) {
  const isKinyarwanda = language === 'KIN';

  const studentData = {
    name: 'Jean Mugisha',
    email: 'jean.mugisha@student.rw',
    joinDate: isKinyarwanda ? 'Mutarama 15, 2026' : 'January 15, 2026',
    lastActive: isKinyarwanda ? 'Ejo' : 'Yesterday',
    level: 'Beginner II',
    xpPoints: 1240,
    classRank: 8,
    totalStudents: 52,
    assignmentsCompleted: 12,
    assignmentsTotal: 16,
    avgGrade: 78,
    currentStreak: 5
  };

  const assignments: Assignment[] = [
    {
      id: '1',
      title: isKinyarwanda ? 'Conditional Statements' : 'Conditional Statements',
      submittedDate: isKinyarwanda ? 'Ukwakira 3, 2026' : 'April 3, 2026',
      grade: 100,
      testsPassedCount: 5,
      testsTotalCount: 5,
      timeSpent: '45m',
      status: 'completed'
    },
    {
      id: '2',
      title: isKinyarwanda ? 'Functions & Returns' : 'Functions & Returns',
      submittedDate: isKinyarwanda ? 'Werurwe 28, 2026' : 'March 28, 2026',
      grade: 80,
      testsPassedCount: 4,
      testsTotalCount: 5,
      timeSpent: '1h 20m',
      status: 'partial'
    },
    {
      id: '3',
      title: isKinyarwanda ? 'Imyitozo ya Loops' : 'Loops Practice',
      submittedDate: isKinyarwanda ? 'Werurwe 25, 2026' : 'March 25, 2026',
      grade: 60,
      testsPassedCount: 3,
      testsTotalCount: 5,
      timeSpent: '2h 15m',
      status: 'partial'
    },
    {
      id: '4',
      title: isKinyarwanda ? 'Variables Practice' : 'Variables Practice',
      submittedDate: isKinyarwanda ? 'Werurwe 20, 2026' : 'March 20, 2026',
      grade: 85,
      testsPassedCount: 5,
      testsTotalCount: 5,
      timeSpent: '50m',
      status: 'completed'
    }
  ];

  const weeklyProgress = [
    { week: 'W1', avgGrade: 65, trend: 'up' },
    { week: 'W2', avgGrade: 70, trend: 'up' },
    { week: 'W3', avgGrade: 75, trend: 'up' },
    { week: 'W4', avgGrade: 78, trend: 'up' }
  ];

  const skills = [
    { name: 'Variables', progress: 90, trend: 'strong' },
    { name: 'Functions', progress: 75, trend: 'improving' },
    { name: 'Loops', progress: 55, trend: 'struggling' },
    { name: 'Conditionals', progress: 95, trend: 'strong' },
    { name: 'Arrays', progress: 65, trend: 'improving' },
    { name: 'Objects', progress: 50, trend: 'struggling' }
  ];

  const recentActivity = [
    { action: isKinyarwanda ? 'Yarangije "Conditional Statements"' : 'Completed "Conditional Statements"', time: isKinyarwanda ? 'Amasaha 2 ashize' : '2 hours ago', type: 'success' },
    { action: isKinyarwanda ? 'Yatangije "Calculate Total Price"' : 'Started "Calculate Total Price"', time: isKinyarwanda ? 'Ejo' : 'Yesterday', type: 'info' },
    { action: isKinyarwanda ? 'Yabajije ikibazo kuri Loops' : 'Asked question about Loops', time: isKinyarwanda ? 'Iminsi 2 ishize' : '2 days ago', type: 'question' }
  ];

  const aiInsights = [
    {
      type: 'alert',
      title: isKinyarwanda ? 'Akenera ubufasha kuri Loops' : 'Needs help with Loops',
      description: isKinyarwanda ? 'Yakoze ibigeragezo 3 ariko akanangwa ku bizamini bimwe na bimwe' : 'Has attempted 3 times but struggles with same tests',
      priority: 'high'
    },
    {
      type: 'success',
      title: isKinyarwanda ? 'Ateye imbere kuri Conditionals' : 'Excelling at Conditionals',
      description: isKinyarwanda ? 'Yarangije byose neza ku mushinga wa nyuma' : 'Perfect score on last assignment',
      priority: 'low'
    },
    {
      type: 'info',
      title: isKinyarwanda ? 'Umwanya w\'igihe uri neza' : 'Good time management',
      description: isKinyarwanda ? 'Ikigereranyo cy\'igihe cyo kurangiza ni munsi y\'ikigereranyo cy\'ishuri' : 'Average completion time below class average',
      priority: 'medium'
    }
  ];

  const maxGrade = Math.max(...weeklyProgress.map(w => w.avgGrade));

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'completed': return 'text-[#22c55e] bg-green-50 border-green-200';
      case 'partial': return 'text-[#f59e0b] bg-amber-50 border-amber-200';
      case 'late': return 'text-[#ef4444] bg-red-50 border-red-200';
    }
  };

  const getStatusLabel = (status: Assignment['status']) => {
    if (status === 'completed') return isKinyarwanda ? 'Byarangiye' : 'Completed';
    if (status === 'partial') return isKinyarwanda ? 'Igice' : 'Partial';
    return isKinyarwanda ? 'Bitinze' : 'Late';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'strong') return '#22c55e';
    if (trend === 'improving') return '#0ea5e9';
    return '#f59e0b';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#10b981] font-semibold mb-6 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          {isKinyarwanda ? 'Subira ku banyeshuri bose' : 'Back to All Students'}
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Photo */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {studentData.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Student Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#1e293b] mb-2">{studentData.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {studentData.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {isKinyarwanda ? 'Yinjiye:' : 'Joined:'} {studentData.joinDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {isKinyarwanda ? 'Igikorwa cya nyuma:' : 'Last active:'} {studentData.lastActive}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-[#0ea5e9] rounded-full text-sm font-semibold">
                  {studentData.level}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-[#8b5cf6] rounded-full text-sm font-semibold">
                  {studentData.xpPoints} XP
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <button className="px-4 py-2 bg-[#10b981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {isKinyarwanda ? 'Ohereza Ubutumwa' : 'Send Message'}
              </button>
              <button className="px-4 py-2 bg-white text-[#10b981] border-2 border-[#10b981] rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                <Video className="w-4 h-4" />
                {isKinyarwanda ? 'Shiraho Inama' : 'Schedule Meeting'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{studentData.avgGrade}%</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Amanota y\'ikigereranyo' : 'Average Grade'}</div>
            <div className="flex items-center gap-1 text-xs text-[#22c55e] mt-2">
              <TrendingUp className="w-4 h-4" />
              +13% {isKinyarwanda ? 'kuruta icyumweru' : 'vs last week'}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#0ea5e9]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{studentData.assignmentsCompleted}/{studentData.assignmentsTotal}</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Imishinga yarangiye' : 'Assignments Done'}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-[#0ea5e9] h-2 rounded-full"
                style={{ width: `${(studentData.assignmentsCompleted / studentData.assignmentsTotal) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">#{studentData.classRank}</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Ku ishuri' : 'Class Rank'}</div>
            <div className="text-xs text-gray-500 mt-2">
              {isKinyarwanda ? 'kuri' : 'of'} {studentData.totalStudents} {isKinyarwanda ? 'abanyeshuri' : 'students'}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Clock className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div className="text-3xl font-bold text-[#1e293b] mb-1">{studentData.currentStreak}</div>
            <div className="text-sm text-gray-600">{isKinyarwanda ? 'Iminsi ikurikirana' : 'Day Streak'}</div>
            <div className="text-xs text-gray-500 mt-2">
              {isKinyarwanda ? 'Arakora buri munsi' : 'Coding daily'}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Progress Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
                {isKinyarwanda ? 'Iterambere ry\'ibyumweru' : 'Weekly Progress'}
              </h2>

              <div className="h-64 flex items-end justify-between gap-6">
                {weeklyProgress.map((week, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full relative" style={{ height: '200px' }}>
                      <div className="absolute bottom-0 w-full flex flex-col items-center">
                        <div className="text-sm font-bold text-[#10b981] mb-2">{week.avgGrade}%</div>
                        <div
                          className="w-full bg-gradient-to-t from-[#10b981] to-[#34d399] rounded-t-lg transition-all"
                          style={{ height: `${(week.avgGrade / maxGrade) * 180}px` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-3 font-semibold">{week.week}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#10b981]" />
                {isKinyarwanda ? 'Ubumenyi' : 'Skills Breakdown'}
              </h2>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: getTrendColor(skill.trend) }}>
                          {skill.progress}%
                        </span>
                        {skill.trend === 'strong' && <TrendingUp className="w-4 h-4 text-[#22c55e]" />}
                        {skill.trend === 'improving' && <TrendingUp className="w-4 h-4 text-[#0ea5e9]" />}
                        {skill.trend === 'struggling' && <TrendingDown className="w-4 h-4 text-[#f59e0b]" />}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${skill.progress}%`,
                          backgroundColor: getTrendColor(skill.trend)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#10b981]" />
                {isKinyarwanda ? 'Amateka y\'imishinga' : 'Assignment History'}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        {isKinyarwanda ? 'Umushinga' : 'Assignment'}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        {isKinyarwanda ? 'Itariki' : 'Date'}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        {isKinyarwanda ? 'Amanota' : 'Grade'}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        {isKinyarwanda ? 'Ibizamini' : 'Tests'}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        {isKinyarwanda ? 'Igihe' : 'Time'}
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                        {isKinyarwanda ? 'Uko bimeze' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">{assignment.title}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{assignment.submittedDate}</td>
                        <td className="py-3 px-2">
                          <span className={`text-sm font-bold ${assignment.grade >= 80 ? 'text-[#22c55e]' : assignment.grade >= 60 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
                            {assignment.grade}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {assignment.testsPassedCount}/{assignment.testsTotalCount}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">{assignment.timeSpent}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${getStatusColor(assignment.status)}`}>
                            {getStatusLabel(assignment.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - AI Insights & Activity */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#8b5cf6]" />
                {isKinyarwanda ? 'Inama z\'AI' : 'AI Insights'}
              </h2>

              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      insight.type === 'alert'
                        ? 'bg-red-50 border-red-200'
                        : insight.type === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {insight.type === 'alert' && <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />}
                      {insight.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />}
                      {insight.type === 'info' && <TrendingUp className="w-5 h-5 text-[#0ea5e9] flex-shrink-0 mt-0.5" />}
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">{insight.title}</div>
                        <div className="text-sm text-gray-700">{insight.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6">
                {isKinyarwanda ? 'Ibikorwa bya vuba' : 'Recent Activity'}
              </h2>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'success'
                          ? 'bg-[#22c55e]'
                          : activity.type === 'question'
                          ? 'bg-[#8b5cf6]'
                          : 'bg-[#0ea5e9]'
                      }`}
                    />
                    <div>
                      <div className="text-sm text-gray-900 font-medium">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
