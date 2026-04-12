import { useState, useRef, useEffect } from 'react';
import { Save, Send, LogOut, User } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface HeaderProps {
  language: 'EN' | 'KIN';
  onLanguageToggle: () => void;
  subtitle?: string;
  hideAssignmentInfo?: boolean;
  showWorkspaceActions?: boolean;
  onBack?: () => void;
}

export function Header({ language, onLanguageToggle, subtitle, hideAssignmentInfo = false, showWorkspaceActions = false, onBack }: HeaderProps) {
  const isKinyarwanda = language === 'KIN';
  const defaultSubtitle = subtitle || (isKinyarwanda ? 'Ikibanza cyo gutoza kode' : 'Student Coding Workspace');
  const { profile, signOut } = useAuth();
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
    <header className="flex items-center justify-between px-6 py-4" style={{ background: '#13161e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
          <h1 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#f1f5f9' }}>
            EduCode Rwanda
          </h1>
          <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}>
            {defaultSubtitle}
          </p>
        </div>
      </div>

      {/* Assignment Info (only show in workspace, not dashboard) */}
      {!hideAssignmentInfo && (
        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Umushinga: Kubara Igiciro Cyose' : 'Assignment: Calculate Total Price'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2 py-0.5 rounded text-xs font-medium bg-[#10b981] text-white">
                3/5 {isKinyarwanda ? 'Ibizamini byatsinze' : 'Tests Passed'}
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
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
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
              color: language === 'EN' ? '#00d4aa' : '#475569',
              border: language === 'EN' ? '1px solid rgba(0,212,170,0.3)' : '1px solid rgba(255,255,255,0.06)',
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
              color: language === 'KIN' ? '#00d4aa' : '#475569',
              border: language === 'KIN' ? '1px solid rgba(0,212,170,0.3)' : '1px solid rgba(255,255,255,0.06)',
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
            <div className="absolute right-0 top-12 w-56 rounded-xl z-50 overflow-hidden" style={{ background: '#1a1e2a', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              {/* User info */}
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(0,212,170,0.15)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)' }}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{profile?.full_name ?? 'Student'}</p>
                    <p className="text-xs capitalize" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>{profile?.user_type?.replace('_', ' ') ?? ''}</p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <User size={15} style={{ color: '#475569' }} />
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
