import React, { useState } from 'react';
import { Header } from './components/Header';
import { AllAssignmentsPage } from './components/student/AllAssignmentsPage';
import { AchievementsGalleryPage } from './components/student/AchievementsGalleryPage';
import { ProfileSettingsPage } from './components/student/ProfileSettingsPage';
import { ProgressAnalyticsPage } from './components/student/ProgressAnalyticsPage';

type StudentPageType = 'assignments' | 'achievements' | 'profile' | 'analytics';

export default function StudentPages() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [currentPage, setCurrentPage] = useState<StudentPageType>('assignments');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'KIN' : 'EN');
  };

  const isKinyarwanda = language === 'KIN';

  const pages: { id: StudentPageType; label: string; labelKin: string }[] = [
    { id: 'assignments', label: 'All Assignments', labelKin: 'Imishinga Yose' },
    { id: 'achievements', label: 'Achievements', labelKin: 'Ibihembo' },
    { id: 'analytics', label: 'Analytics', labelKin: 'Isesengura' },
    { id: 'profile', label: 'Profile', labelKin: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <Header
        language={language}
        onLanguageToggle={toggleLanguage}
        subtitle={isKinyarwanda ? 'Amapaji y\'umwalimu' : 'Student Pages'}
        hideAssignmentInfo={true}
      />

      {/* Page Selector */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-all ${
                  currentPage === page.id
                    ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isKinyarwanda ? page.labelKin : page.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div>
        {currentPage === 'assignments' && <AllAssignmentsPage language={language} />}
        {currentPage === 'achievements' && <AchievementsGalleryPage language={language} />}
        {currentPage === 'profile' && <ProfileSettingsPage language={language} />}
        {currentPage === 'analytics' && <ProgressAnalyticsPage language={language} />}
      </div>
    </div>
  );
}
