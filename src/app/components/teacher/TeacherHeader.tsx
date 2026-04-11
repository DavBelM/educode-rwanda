import React from 'react';
import { Bell, Plus, ChevronDown } from 'lucide-react';

interface TeacherHeaderProps {
  language: 'EN' | 'KIN';
  onLanguageToggle: () => void;
  notificationCount?: number;
}

export function TeacherHeader({ language, onLanguageToggle, notificationCount = 0 }: TeacherHeaderProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0ea5e9]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6H16M8 12H16M8 18H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
            EduCode Rwanda
          </h1>
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Ikibanza cy\'abarimu' : 'Teacher Dashboard'}
          </p>
        </div>
      </div>

      {/* Center: Class Selector + Create Assignment */}
      <div className="hidden md:flex items-center gap-4">
        {/* Class Selector */}
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all">
          <span className="font-semibold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Level 3A - JavaScript
          </span>
          <ChevronDown size={16} className="text-gray-600" />
        </button>

        {/* Create Assignment */}
        <button className="flex items-center gap-2 px-6 py-2 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition-all shadow-md">
          <Plus size={18} />
          <span className="font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Kora Umushinga' : 'Create Assignment'}
          </span>
        </button>
      </div>

      {/* Right Side: Notifications, Language Toggle, Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
          <Bell size={20} className="text-gray-700" />
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center text-xs text-white font-bold">
              {notificationCount}
            </div>
          )}
        </button>

        {/* Language Toggle Pill */}
        <div className="flex items-center rounded-lg overflow-hidden" style={{ minWidth: '100px', height: '40px' }}>
          <button
            onClick={() => language === 'KIN' && onLanguageToggle()}
            className="flex-1 h-full px-3 transition-all border-2"
            style={{
              backgroundColor: language === 'EN' ? '#0ea5e9' : 'transparent',
              color: language === 'EN' ? 'white' : '#64748b',
              borderColor: language === 'EN' ? '#0ea5e9' : '#e2e8f0',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: '8px 0 0 8px'
            }}
          >
            EN
          </button>
          <button
            onClick={() => language === 'EN' && onLanguageToggle()}
            className="flex-1 h-full px-3 transition-all border-2 border-l-0"
            style={{
              backgroundColor: language === 'KIN' ? '#0ea5e9' : 'transparent',
              color: language === 'KIN' ? 'white' : '#64748b',
              borderColor: language === 'KIN' ? '#0ea5e9' : '#e2e8f0',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              borderRadius: '0 8px 8px 0'
            }}
          >
            KIN
          </button>
        </div>

        {/* Profile */}
        <div className="hidden lg:flex w-10 h-10 rounded-full bg-[#f1f5f9] border-2 border-[#0ea5e9] items-center justify-center text-[#0ea5e9] font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          TM
        </div>
      </div>
    </header>
  );
}
