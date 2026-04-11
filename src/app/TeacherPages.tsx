import React, { useState } from 'react';
import { Header } from './components/Header';
import { StudentDetailPage } from './components/teacher/StudentDetailPage';
import { AssignmentManagementPage } from './components/teacher/AssignmentManagementPage';
import { ClassAnalyticsPage } from './components/teacher/ClassAnalyticsPage';
import { CommunicationCenterPage } from './components/teacher/CommunicationCenterPage';

type PageType = 'student-detail' | 'assignments' | 'analytics' | 'communication';

export default function TeacherPages() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [currentPage, setCurrentPage] = useState<PageType>('student-detail');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'KIN' : 'EN');
  };

  const isKinyarwanda = language === 'KIN';

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <Header
        language={language}
        onLanguageToggle={toggleLanguage}
        subtitle={isKinyarwanda ? 'Amapaji y\'umwarimu' : 'Teacher Pages'}
        hideAssignmentInfo={true}
      />

      {/* Page Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'student-detail', label: isKinyarwanda ? 'Umunyeshuri' : 'Student Detail', color: '#10b981' },
              { id: 'assignments', label: isKinyarwanda ? 'Imishinga' : 'Assignments', color: '#10b981' },
              { id: 'analytics', label: isKinyarwanda ? 'Isesengura' : 'Analytics', color: '#10b981' },
              { id: 'communication', label: isKinyarwanda ? 'Itumanaho' : 'Communication', color: '#10b981' }
            ].map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id as PageType)}
                className={`px-6 py-4 font-semibold text-sm transition-all whitespace-nowrap ${
                  currentPage === page.id
                    ? 'border-b-2 text-[#10b981]'
                    : 'text-gray-600 hover:text-[#10b981]'
                }`}
                style={{
                  borderBottomColor: currentPage === page.id ? page.color : 'transparent'
                }}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page Content */}
      {currentPage === 'student-detail' && (
        <StudentDetailPage
          language={language}
          onBack={() => {}}
        />
      )}

      {currentPage === 'assignments' && (
        <AssignmentManagementPage language={language} />
      )}

      {currentPage === 'analytics' && (
        <ClassAnalyticsPage language={language} />
      )}

      {currentPage === 'communication' && (
        <CommunicationCenterPage language={language} />
      )}
    </div>
  );
}
