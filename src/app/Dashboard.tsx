import { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { ProgressOverview } from './components/dashboard/ProgressOverview';
import { AssignmentCard } from './components/dashboard/AssignmentCard';
import { AIInsights } from './components/dashboard/AIInsights';
import { AchievementBadges } from './components/dashboard/AchievementBadges';
import { useAuth } from '../lib/auth';

export default function Dashboard() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const { profile } = useAuth();
  const dashboardState: 'full' | 'new-student' | 'high-achiever' = 'full';
  const studentName = profile?.full_name ?? 'Student';

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'KIN' : 'EN');
  };

  const isKinyarwanda = language === 'KIN';

  // Data for different states
  const getStateData = () => {
    switch (dashboardState) {
      case 'new-student':
        return {
          studentName,
          progress: 0,
          assignmentsCompleted: 0,
          assignmentsTotal: 16,
          streak: 0,
          xpPoints: 0,
          level: 'Beginner I',
          assignments: [
            {
              id: '1',
              title: isKinyarwanda ? 'Imyitozo ya Variables' : 'Variables Practice',
              description: isKinyarwanda ? 'Wiga gukoresha variables mu JavaScript' : 'Learn to use variables in JavaScript',
              dueStatus: 'due-soon' as const,
              dueText: isKinyarwanda ? 'Iminsi 7 isigaye' : 'Due in 7 days',
              difficulty: 'Beginner' as const,
              testsCompleted: 0,
              testsTotal: 5,
              status: 'not-started' as const
            }
          ],
          insights: [
            { text: isKinyarwanda ? 'Tangira ukore umushinga wawe wa mbere!' : 'Start with your first assignment!', isPositive: false },
            { text: isKinyarwanda ? 'Wiga buhoro buhoro - ntacyo uhutira' : 'Learn at your own pace - no rush', isPositive: false }
          ],
          badges: [
            { id: '1', name: isKinyarwanda ? 'Umushinga wa mbere' : 'First Assignment', icon: 'award', earned: false },
            { id: '2', name: isKinyarwanda ? 'Iminsi 5' : '5-Day Streak', icon: 'flame', earned: false },
            { id: '3', name: isKinyarwanda ? 'Ibizamini 10' : '10 Tests Passed', icon: 'check', earned: false }
          ]
        };

      case 'high-achiever':
        return {
          studentName,
          progress: 95,
          assignmentsCompleted: 15,
          assignmentsTotal: 16,
          streak: 21,
          xpPoints: 3840,
          level: 'Intermediate III',
          assignments: [
            {
              id: '1',
              title: isKinyarwanda ? 'Umushinga w\'inyuma: API Integration' : 'Final Project: API Integration',
              description: isKinyarwanda ? 'Huza API y\'inyuma n\'imbere' : 'Connect backend API with frontend',
              dueStatus: 'due-soon' as const,
              dueText: isKinyarwanda ? 'Iminsi 3 isigaye' : 'Due in 3 days',
              difficulty: 'Advanced' as const,
              testsCompleted: 3,
              testsTotal: 5,
              status: 'in-progress' as const
            },
            {
              id: '2',
              title: isKinyarwanda ? 'Functions n\'Arrays' : 'Functions & Arrays',
              description: isKinyarwanda ? 'Byatsinzwe neza!' : 'Completed successfully!',
              dueStatus: 'submitted' as const,
              dueText: isKinyarwanda ? 'Byatanzwe' : 'Submitted',
              difficulty: 'Intermediate' as const,
              testsCompleted: 5,
              testsTotal: 5,
              status: 'completed' as const
            }
          ],
          insights: [
            { text: isKinyarwanda ? 'Urakora neza cyane! Urashoboye kwiga byihuse' : 'Excellent work! You\'re learning very fast', isPositive: true },
            { text: isKinyarwanda ? 'Urangije umushinga w\'inyuma uzabona icyiciro gishya' : 'Complete the final project to unlock the next level', isPositive: false }
          ],
          badges: [
            { id: '1', name: isKinyarwanda ? 'Umushinga wa mbere' : 'First Assignment', icon: 'award', earned: true },
            { id: '2', name: isKinyarwanda ? 'Iminsi 5' : '5-Day Streak', icon: 'flame', earned: true },
            { id: '3', name: isKinyarwanda ? 'Ibizamini 10' : '10 Tests', icon: 'check', earned: true },
            { id: '4', name: isKinyarwanda ? 'Igikombe' : 'Champion', icon: 'trophy', earned: true },
            { id: '5', name: isKinyarwanda ? 'Intego' : 'Goal', icon: 'target', earned: true }
          ]
        };

      default: // 'full'
        return {
          studentName,
          progress: 75,
          assignmentsCompleted: 12,
          assignmentsTotal: 16,
          streak: 5,
          xpPoints: 1240,
          level: 'Beginner II',
          assignments: [
            {
              id: '1',
              title: isKinyarwanda ? 'Kubara Igiciro Cyose' : 'Calculate Total Price',
              description: isKinyarwanda ? 'Koresha variables kugirango ubaze igiciro cyose' : 'Use variables to calculate total price',
              dueStatus: 'due-soon' as const,
              dueText: isKinyarwanda ? 'Iminsi 2 isigaye' : 'Due in 2 days',
              difficulty: 'Beginner' as const,
              testsCompleted: 3,
              testsTotal: 5,
              status: 'in-progress' as const
            },
            {
              id: '2',
              title: isKinyarwanda ? 'Imyitozo ya Loops' : 'Loops Practice',
              description: isKinyarwanda ? 'Wiga for n\'while loops' : 'Learn for and while loops',
              dueStatus: 'overdue' as const,
              dueText: isKinyarwanda ? 'Yarangirije' : 'Overdue',
              difficulty: 'Intermediate' as const,
              testsCompleted: 1,
              testsTotal: 5,
              status: 'in-progress' as const
            },
            {
              id: '3',
              title: isKinyarwanda ? 'Functions n\'Returns' : 'Functions & Returns',
              description: isKinyarwanda ? 'Kora functions zisubiza agaciro' : 'Create functions that return values',
              dueStatus: 'due-soon' as const,
              dueText: isKinyarwanda ? 'Iminsi 5 isigaye' : 'Due in 5 days',
              difficulty: 'Beginner' as const,
              testsCompleted: 0,
              testsTotal: 4,
              status: 'not-started' as const
            },
            {
              id: '4',
              title: isKinyarwanda ? 'Conditional Statements' : 'Conditional Statements',
              description: isKinyarwanda ? 'If, else, else if - gufata ibyemezo' : 'If, else, else if - making decisions',
              dueStatus: 'submitted' as const,
              dueText: isKinyarwanda ? 'Byatanzwe' : 'Submitted',
              difficulty: 'Beginner' as const,
              testsCompleted: 5,
              testsTotal: 5,
              status: 'completed' as const
            }
          ],
          insights: [
            { text: isKinyarwanda ? 'Wiga cyane loops - uzazikenera mu mashusho' : 'Practice more with loops - you\'ll need them in projects', isPositive: false },
            { text: isKinyarwanda ? 'Suzuma syntax ya functions' : 'Review function syntax', isPositive: false },
            { text: isKinyarwanda ? 'Urakora neza kuri variables! ✅' : 'Great progress on variables! ✅', isPositive: true }
          ],
          badges: [
            { id: '1', name: isKinyarwanda ? 'Umushinga wa mbere' : 'First Assignment', icon: 'award', earned: true },
            { id: '2', name: isKinyarwanda ? 'Iminsi 5' : '5-Day Streak', icon: 'flame', earned: true },
            { id: '3', name: isKinyarwanda ? 'Ibizamini 10' : '10 Tests Passed', icon: 'check', earned: true }
          ]
        };
    }
  };

  const data = getStateData();

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <Header
        language={language}
        onLanguageToggle={toggleLanguage}
        subtitle={isKinyarwanda ? 'Ikibanza cy\'abanyeshuri' : 'Student Dashboard'}
        hideAssignmentInfo={true}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Banner */}
        <HeroBanner language={language} studentName={data.studentName} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Progress Overview (Sticky) */}
          <div className="lg:col-span-3">
            <ProgressOverview
              language={language}
              progress={data.progress}
              assignmentsCompleted={data.assignmentsCompleted}
              assignmentsTotal={data.assignmentsTotal}
              streak={data.streak}
              xpPoints={data.xpPoints}
              level={data.level}
            />
          </div>

          {/* Column 2: Active Assignments */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Ibisabwa / Assignments' : 'Active Assignments'}
                </h2>
                {data.assignments.length > 0 && (
                  <button className="text-[#0ea5e9] font-semibold text-sm hover:underline" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {isKinyarwanda ? 'Reba Byose' : 'View All'} →
                  </button>
                )}
              </div>

              {/* Assignment Cards */}
              {dashboardState === 'new-student' ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {isKinyarwanda ? 'Karibu kuri EduCode Rwanda!' : 'Welcome to EduCode Rwanda!'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {isKinyarwanda
                      ? 'Tangira urugendo rwawe rwo kwiga kode. Umushinga wawe wa mbere urakurindira!'
                      : 'Start your coding journey. Your first assignment is waiting for you!'}
                  </p>
                  <button className="px-6 py-3 bg-[#0ea5e9] text-white rounded-lg font-semibold hover:bg-[#0284c7] transition-all shadow-md" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {isKinyarwanda ? 'Tangira Umushinga Wawe wa Mbere' : 'Start Your First Assignment'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {data.assignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      language={language}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: AI Insights & Achievements */}
          <div className="lg:col-span-3 space-y-6">
            <AIInsights language={language} insights={data.insights} />
            <AchievementBadges language={language} badges={data.badges} />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav (only visible on mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium text-[#0ea5e9]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ahabanza' : 'Home'}
            </span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Imishinga' : 'Assignments'}
            </span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibihembo' : 'Badges'}
            </span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Profile' : 'Profile'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
