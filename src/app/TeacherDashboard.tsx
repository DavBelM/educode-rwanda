import React, { useState } from 'react';
import { TeacherHeader } from './components/teacher/TeacherHeader';
import { MetricCard } from './components/teacher/MetricCard';
import { StudentProgressTable, Student } from './components/teacher/StudentProgressTable';
import { TeacherAIInsights } from './components/teacher/TeacherAIInsights';
import { Users, TrendingUp, FileText, AlertTriangle, Download, MessageSquare } from 'lucide-react';

type DashboardState = 'main' | 'high-alert' | 'success';

interface StateSelector {
  currentState: DashboardState;
  onStateChange: (state: DashboardState) => void;
}

function TeacherDashboardStateSelector({ currentState, onStateChange }: StateSelector) {
  const states = [
    { id: 'main' as const, label: 'Main Dashboard', color: '#0ea5e9' },
    { id: 'high-alert' as const, label: 'High Alert', color: '#ef4444' },
    { id: 'success' as const, label: 'Success State', color: '#10b981' }
  ];

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-3 z-50 hidden lg:block">
      <p className="text-xs font-semibold text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        Teacher Dashboard States
      </p>
      <div className="flex flex-col gap-2">
        {states.map((state) => (
          <button
            key={state.id}
            onClick={() => onStateChange(state.id)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all text-left"
            style={{
              backgroundColor: currentState === state.id ? state.color : 'transparent',
              color: currentState === state.id ? 'white' : state.color,
              border: `2px solid ${state.color}`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {state.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [dashboardState, setDashboardState] = useState<DashboardState>('main');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'KIN' : 'EN');
  };

  const isKinyarwanda = language === 'KIN';

  // Get data based on state
  const getStateData = () => {
    switch (dashboardState) {
      case 'high-alert':
        return {
          metrics: {
            totalStudents: 52,
            activeThisWeek: 38,
            avgProgress: 45,
            progressTrend: { value: '-8%', isPositive: false },
            assignmentsDue: 3,
            submissions: '28/52',
            studentsNeedingHelp: 12
          },
          students: [
            { id: '1', name: 'Uwase Grace', avatar: 'UG', progress: 28, lastActive: '4d ago', assignmentsCompleted: 2, assignmentsTotal: 8, aiAlert: true, isExcelling: false },
            { id: '2', name: 'Nkusi David', avatar: 'ND', progress: 35, lastActive: '3d ago', assignmentsCompleted: 3, assignmentsTotal: 8, aiAlert: true, isExcelling: false },
            { id: '3', name: 'Mukeshimana Alice', avatar: 'MA', progress: 38, lastActive: '2d ago', assignmentsCompleted: 3, assignmentsTotal: 8, aiAlert: true, isExcelling: false },
            { id: '4', name: 'Habimana Eric', avatar: 'HE', progress: 42, lastActive: '1d ago', assignmentsCompleted: 4, assignmentsTotal: 8, aiAlert: false, isExcelling: false },
            { id: '5', name: 'Kamanzi Paul', avatar: 'KP', progress: 100, lastActive: '1h ago', assignmentsCompleted: 8, assignmentsTotal: 8, aiAlert: false, isExcelling: true },
            { id: '6', name: 'Mukamazimpaka Sarah', avatar: 'MS', progress: 31, lastActive: '5d ago', assignmentsCompleted: 2, assignmentsTotal: 8, aiAlert: true, isExcelling: false }
          ],
          aiInsights: {
            classStruggle: {
              concept: 'Arrays',
              percentage: 65,
              suggestion: isKinyarwanda ? 'Tanga isomo ryo gutangiza ku Arrays' : 'Teach mini-lesson on Arrays'
            },
            studentAlerts: [
              { name: 'Uwase Grace', issue: isKinyarwanda ? 'Ntabwo yakinnye mu minsi 4' : 'No activity in 4 days', suggestion: isKinyarwanda ? 'Vugana na we' : 'Contact student' },
              { name: 'Nkusi David', issue: isKinyarwanda ? 'Yakosowe inshuro 7' : 'Stuck on same error 7 times', suggestion: isKinyarwanda ? 'Tegura ikiganiro cy\'umuntu ku wundi' : 'Schedule 1-on-1 session' },
              { name: 'Mukeshimana Alice', issue: isKinyarwanda ? 'Iterambere ry\'isomo ni hasi' : 'Below 40% progress', suggestion: isKinyarwanda ? 'Sobanura ibanze' : 'Review fundamentals' }
            ],
            positiveInsights: [
              { text: isKinyarwanda ? 'Kamanzi Paul yarangije mu gihe' : 'Kamanzi Paul completed ahead of schedule' }
            ]
          }
        };

      case 'success':
        return {
          metrics: {
            totalStudents: 52,
            activeThisWeek: 51,
            avgProgress: 87,
            progressTrend: { value: '+15%', isPositive: true },
            assignmentsDue: 2,
            submissions: '50/52',
            studentsNeedingHelp: 2
          },
          students: [
            { id: '1', name: 'Jean Mugisha', avatar: 'JM', progress: 85, lastActive: '30m ago', assignmentsCompleted: 7, assignmentsTotal: 8, aiAlert: false, isExcelling: false },
            { id: '2', name: 'Kamanzi Paul', avatar: 'KP', progress: 100, lastActive: '1h ago', assignmentsCompleted: 8, assignmentsTotal: 8, aiAlert: false, isExcelling: true },
            { id: '3', name: 'Iradukunda Mary', avatar: 'IM', progress: 90, lastActive: '2h ago', assignmentsCompleted: 7, assignmentsTotal: 8, aiAlert: false, isExcelling: false },
            { id: '4', name: 'Uwase Grace', avatar: 'UG', progress: 82, lastActive: '3h ago', assignmentsCompleted: 7, assignmentsTotal: 8, aiAlert: false, isExcelling: false },
            { id: '5', name: 'Nkusi David', avatar: 'ND', progress: 88, lastActive: '1h ago', assignmentsCompleted: 7, assignmentsTotal: 8, aiAlert: false, isExcelling: false },
            { id: '6', name: 'Mukeshimana Alice', avatar: 'MA', progress: 95, lastActive: '30m ago', assignmentsCompleted: 8, assignmentsTotal: 8, aiAlert: false, isExcelling: true }
          ],
          aiInsights: {
            studentAlerts: [],
            positiveInsights: [
              { text: isKinyarwanda ? 'Byose byagenze neza! 8 banyeshuri barangije mbere y\'igihe' : 'Great week! 8 students completed ahead of schedule' },
              { text: isKinyarwanda ? 'Ikigereranyo cy\'ishuri cyiyongereye 15% icyumweru gishize' : 'Class average improved by 15% this week' },
              { text: isKinyarwanda ? '96% igipimo cyo gurangiza imishinga' : '96% assignment completion rate' },
              { text: isKinyarwanda ? 'Nta muntu ukeneye ubufasha' : 'Minimal students needing intervention' }
            ]
          }
        };

      default: // 'main'
        return {
          metrics: {
            totalStudents: 52,
            activeThisWeek: 48,
            avgProgress: 68,
            progressTrend: { value: '+5%', isPositive: true },
            assignmentsDue: 3,
            submissions: '45/52',
            studentsNeedingHelp: 8
          },
          students: [
            { id: '1', name: 'Jean Mugisha', avatar: 'JM', progress: 80, lastActive: '2h ago', assignmentsCompleted: 7, assignmentsTotal: 8, aiAlert: false, isExcelling: false },
            { id: '2', name: 'Uwase Grace', avatar: 'UG', progress: 30, lastActive: '3d ago', assignmentsCompleted: 3, assignmentsTotal: 8, aiAlert: true, isExcelling: false },
            { id: '3', name: 'Kamanzi Paul', avatar: 'KP', progress: 100, lastActive: '1h ago', assignmentsCompleted: 8, assignmentsTotal: 8, aiAlert: false, isExcelling: true },
            { id: '4', name: 'Iradukunda Mary', avatar: 'IM', progress: 60, lastActive: '5h ago', assignmentsCompleted: 5, assignmentsTotal: 8, aiAlert: false, isExcelling: false },
            { id: '5', name: 'Nkusi David', avatar: 'ND', progress: 45, lastActive: '1d ago', assignmentsCompleted: 4, assignmentsTotal: 8, aiAlert: true, isExcelling: false },
            { id: '6', name: 'Mukeshimana Alice', avatar: 'MA', progress: 75, lastActive: '3h ago', assignmentsCompleted: 6, assignmentsTotal: 8, aiAlert: false, isExcelling: false }
          ],
          aiInsights: {
            classStruggle: {
              concept: 'Arrays',
              percentage: 60,
              suggestion: isKinyarwanda ? 'Tanga isomo ryo gutangiza ku Arrays' : 'Teach mini-lesson on Arrays'
            },
            studentAlerts: [
              { name: 'Uwase Grace', issue: isKinyarwanda ? 'Ntabwo yakinnye mu minsi 3' : 'No activity in 3 days', suggestion: isKinyarwanda ? 'Vugana na we' : 'Contact student' },
              { name: 'Nkusi David', issue: isKinyarwanda ? 'Yakosowe inshuro 6' : 'Stuck on same error 6 times', suggestion: isKinyarwanda ? 'Tegura ikiganiro cy\'umuntu ku wundi' : 'Schedule 1-on-1 session' }
            ],
            positiveInsights: [
              { text: isKinyarwanda ? '5 banyeshuri barangije mbere y\'igihe' : '5 students completed ahead of schedule' },
              { text: isKinyarwanda ? 'Ikigereranyo cy\'ishuri cyiyongereye 12% icyumweru gishize' : 'Class average improved by 12% this week' },
              { text: isKinyarwanda ? '87% igipimo cyo gurangiza imishinga' : '87% assignment completion rate' }
            ]
          }
        };
    }
  };

  const data = getStateData();

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <TeacherHeader language={language} onLanguageToggle={toggleLanguage} notificationCount={1} />

      {/* State Selector */}
      <TeacherDashboardStateSelector currentState={dashboardState} onStateChange={setDashboardState} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={isKinyarwanda ? 'Abanyeshuri Bose' : 'Total Students'}
            value={data.metrics.totalStudents.toString()}
            subtext={`${isKinyarwanda ? 'Bakinnye icyumweru gishize' : 'Active this week'}: ${data.metrics.activeThisWeek}`}
            icon={<Users size={24} className="text-white" />}
          />
          <MetricCard
            title={isKinyarwanda ? 'Ikigereranyo cy\'Iterambere' : 'Average Progress'}
            value={`${data.metrics.avgProgress}%`}
            subtext={isKinyarwanda ? 'Mu cyumweru gishize' : 'From last week'}
            icon={<TrendingUp size={24} className="text-white" />}
            trend={data.metrics.progressTrend}
          />
          <MetricCard
            title={isKinyarwanda ? 'Imishinga Igomba Kurangiza' : 'Assignments Due'}
            value={data.metrics.assignmentsDue.toString()}
            subtext={`${isKinyarwanda ? 'Byatanzwe' : 'Submissions'}: ${data.metrics.submissions}`}
            icon={<FileText size={24} className="text-white" />}
          />
          <MetricCard
            title={isKinyarwanda ? 'Bakeneye Ubufasha' : 'Students Needing Help'}
            value={data.metrics.studentsNeedingHelp.toString()}
            subtext={isKinyarwanda ? 'AI yabonye ibibazo' : 'AI detected struggles'}
            icon={<AlertTriangle size={24} className="text-white" />}
            isPurple
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student Progress Table */}
          <div className="lg:col-span-8">
            <StudentProgressTable students={data.students} language={language} />
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-4">
            <TeacherAIInsights
              language={language}
              classStruggle={data.aiInsights.classStruggle}
              studentAlerts={data.aiInsights.studentAlerts}
              positiveInsights={data.aiInsights.positiveInsights}
            />
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-xl shadow-xl p-4">
          <div className="flex items-center gap-4 justify-center flex-wrap">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition-all shadow-md font-semibold">
              <FileText size={18} />
              <span>{isKinyarwanda ? 'Kora Umushinga' : 'Create Assignment'}</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold">
              <Download size={18} />
              <span>{isKinyarwanda ? 'Ohereza Raporo' : 'Export Report'}</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold">
              <MessageSquare size={18} />
              <span>{isKinyarwanda ? 'Tanga Ubutumwa' : 'Send Announcement'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
