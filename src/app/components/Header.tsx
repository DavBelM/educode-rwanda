import { useState, useRef, useEffect } from 'react';
import { Save, Send, LogOut, User, Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';

interface HeaderProps {
  language: 'EN' | 'KIN';
  onLanguageToggle: () => void;
  subtitle?: string;
  hideAssignmentInfo?: boolean;
  showWorkspaceActions?: boolean;
  onBack?: () => void;
  announcementCount?: number;
  onAnnouncementsClick?: () => void;
}

export function Header({ language, onLanguageToggle, subtitle, hideAssignmentInfo = false, showWorkspaceActions = false, onBack, announcementCount, onAnnouncementsClick }: HeaderProps) {
  const isKinyarwanda = language === 'KIN';
  const defaultSubtitle = subtitle || (isKinyarwanda ? 'Workspace yo kwandikiramo code' : 'Student Coding Workspace');
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4" style={{ background: 'var(--ec-surface)', borderBottom: '1px solid var(--ec-b1)' }}>
      {/* Logo / Back */}
      <div className="flex items-center gap-3">
        {onBack ? (
          <button onClick={onBack} className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ) : (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0ea5e9]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H16M8 12H16M8 18H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-1)' }}>
            EduCode Rwanda
          </h1>
          <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-6)' }}>
            {defaultSubtitle}
          </p>
        </div>
      </div>

      {/* Assignment Info (only show in workspace, not dashboard) */}
      {!hideAssignmentInfo && (
        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--ec-text-1)' }}>
              {isKinyarwanda ? 'Umukoro: Kubara igiciro cyose hamwe' : 'Assignment: Calculate Total Price'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)' }}>
                3/5 {isKinyarwanda ? 'Amagerageza yatsinzwe' : 'Tests Passed'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Side: Save, Submit, Language Toggle */}
      <div className="flex items-center gap-3">
        {/* Save + Submit — workspace only */}
        {showWorkspaceActions && (
          <>
            <button
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: 'var(--ec-text-4)', border: '1px solid var(--ec-b4)', background: 'var(--ec-b3)' }}
            >
              <Save size={16} />
              <span className="hidden lg:inline">{isKinyarwanda ? 'Bika' : 'Save'}</span>
            </button>
            <button
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#00d4aa', border: '1px solid rgba(0,212,170,0.3)', background: 'rgba(0,212,170,0.08)' }}
            >
              <Send size={16} />
              <span className="hidden lg:inline">{isKinyarwanda ? 'Ohereza' : 'Submit'}</span>
            </button>
          </>
        )}

        {/* Announcements Bell */}
        {onAnnouncementsClick !== undefined && (
          <button
            onClick={onAnnouncementsClick}
            title={isKinyarwanda ? 'Inyandiko z\'Umwarimu' : 'Announcements'}
            className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: announcementCount ? 'rgba(245,158,11,0.15)' : 'var(--ec-b1)', border: announcementCount ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--ec-b7)' }}
            onMouseEnter={e => (e.currentTarget.style.background = announcementCount ? 'rgba(245,158,11,0.25)' : 'var(--ec-b7)')}
            onMouseLeave={e => (e.currentTarget.style.background = announcementCount ? 'rgba(245,158,11,0.15)' : 'var(--ec-b1)')}
          >
            <Bell size={17} style={{ color: announcementCount ? '#f59e0b' : 'var(--ec-text-4)' }} />
            {!!announcementCount && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: '#f59e0b', color: 'var(--ec-bg)', fontFamily: 'Inter, sans-serif', fontSize: '10px' }}>
                {announcementCount > 9 ? '9+' : announcementCount}
              </span>
            )}
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'var(--ec-b1)', border: '1px solid var(--ec-b2)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ec-b2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--ec-b1)')}
        >
          {theme === 'dark'
            ? <Sun size={16} style={{ color: 'var(--ec-text-4)' }} />
            : <Moon size={16} style={{ color: 'var(--ec-text-4)' }} />}
        </button>

        {/* Language Toggle Pill */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{
            minWidth: '100px',
            height: '40px'
          }}
        >
          <button
            onClick={() => language === 'KIN' && onLanguageToggle()}
            className="flex-1 h-full px-3 transition-all"
            style={{
              backgroundColor: language === 'EN' ? 'rgba(0,212,170,0.15)' : 'transparent',
              color: language === 'EN' ? '#00d4aa' : 'var(--ec-text-6)',
              border: language === 'EN' ? '1px solid rgba(0,212,170,0.3)' : '1px solid var(--ec-b1)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              borderRadius: '8px 0 0 8px'
            }}
          >
            EN
          </button>
          <button
            onClick={() => language === 'EN' && onLanguageToggle()}
            className="flex-1 h-full px-3 transition-all"
            style={{
              backgroundColor: language === 'KIN' ? 'rgba(0,212,170,0.15)' : 'transparent',
              color: language === 'KIN' ? '#00d4aa' : 'var(--ec-text-6)',
              border: language === 'KIN' ? '1px solid rgba(0,212,170,0.3)' : '1px solid var(--ec-b1)',
              borderLeft: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              borderRadius: '0 8px 8px 0'
            }}
          >
            KIN
          </button>
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all"
            style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa', fontFamily: 'Inter, sans-serif' }}
          >
            {initials}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-xl z-50 overflow-hidden" style={{ background: 'var(--ec-surface-2)', border: '1px solid var(--ec-b2)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              {/* User info */}
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--ec-b1)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)' }}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>{profile?.full_name ?? 'Student'}</p>
                    <p className="text-xs capitalize" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>{profile?.user_type?.replace('_', ' ') ?? ''}</p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors" style={{ color: 'var(--ec-text-4)', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--ec-b3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <User size={15} style={{ color: 'var(--ec-text-6)' }} />
                  {isKinyarwanda ? 'Umwirondoro' : 'Profile'}
                </button>
                <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors" style={{ color: '#ef4444', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={15} />
                  {isKinyarwanda ? 'Sohoka' : 'Log Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
