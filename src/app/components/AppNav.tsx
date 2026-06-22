import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';
import { requestAccountDeletion } from '../../lib/db';

interface AppNavProps {
  /** Current streak count. Shown when > 0; hidden when undefined or 0. */
  streak?: number;
}

export function AppNav({ streak }: AppNavProps) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isStudent = profile?.user_type === 'student' || profile?.user_type === 'self_learner';

  const handleRequestDeletion = async () => {
    setDeleting(true);
    setDeleteError('');
    const { error } = await requestAccountDeletion();
    if (error) {
      setDeleteError(error);
      setDeleting(false);
      return;
    }
    // Reload so App.tsx picks up is_deactivated = true from the profile query
    window.location.reload();
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Derive active nav link from pathname.
  // /courses and /lesson are both part of the courses flow.
  // /workspace and /assignment are the coding flow.
  // Everything else (including the catch-all dashboard route) is dashboard.
  const isCoursesActive =
    pathname.startsWith('/courses') || pathname.startsWith('/lesson');
  const isWorkspaceActive =
    pathname.startsWith('/workspace') || pathname.startsWith('/assignment');
  const isChallengesActive = pathname.startsWith('/challenges');
  const isDashboardActive = !isCoursesActive && !isWorkspaceActive && !isChallengesActive;

  const navClass = (active: boolean) => `nav-link${active ? ' active' : ''}`;

  const isTeacher = profile?.user_type === 'teacher';

  return (
    <>
    <header className="nav">
      <div className="nav-inner">

        {/* Logo */}
        <Link to="/" className="logo">
          <span className="edu">Edu</span><span className="code">Code</span>
        </Link>

        {/* Centre links — hidden on small screens via .nav-collapse */}
        <nav className="nav-links nav-collapse" aria-label="Main">
          {isTeacher ? (
            <Link to="/" className={navClass(true)}>
              Overview
            </Link>
          ) : (
            <>
              <Link to="/" className={navClass(isDashboardActive)}>
                Dashboard
              </Link>
              <Link to="/courses" className={navClass(isCoursesActive)}>
                Courses
              </Link>
              <Link to="/workspace" className={navClass(isWorkspaceActive)}>
                Workspace
              </Link>
              <Link to="/challenges" className={navClass(isChallengesActive)}>
                Challenges
              </Link>
            </>
          )}
        </nav>

        {/* Right cluster */}
        <div className="nav-right">

          {/* Streak — only shown when the parent screen provides the count */}
          {streak != null && streak > 0 && (
            <span className="metric" aria-label={`${streak}-day streak`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3c1 3-1 5-1 5s4 1 4 5a4 4 0 0 1-8 .5C7 10 9 9 9 9s-1-4 3-6z" />
              </svg>
              <b>{streak}</b>
            </span>
          )}

          {/* Theme toggle */}
          <button
            className="iconbtn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'light'}
          >
            {theme === 'dark' ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Profile dropdown — Radix for focus trap, arrow-key nav, Escape-to-close */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="avatar"
                aria-label={`Profile menu for ${profile?.full_name ?? 'user'}`}
                aria-haspopup="menu"
                title={profile?.full_name ?? ''}
              >
                {initials}
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={10}
                className="nav-dropdown"
              >
                {/* User identity — not interactive */}
                <div className="nav-dropdown-header">
                  <p>{profile?.full_name ?? 'User'}</p>
                  <p>{profile?.user_type?.replace('_', ' ') ?? ''}</p>
                </div>

                <DropdownMenu.Separator className="nav-dropdown-sep" />

                {isStudent && (
                  <DropdownMenu.Item
                    className="nav-dropdown-item"
                    onSelect={(e) => { e.preventDefault(); setShowDeleteConfirm(true); }}
                    style={{ color: 'var(--error)', fontSize: 13 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 15, height: 15, flexShrink: 0 }}>
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Request account deletion
                  </DropdownMenu.Item>
                )}

                <DropdownMenu.Item
                  className="nav-dropdown-item signout"
                  onSelect={signOut}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ width: 15, height: 15, flexShrink: 0 }}
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Sign Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

        </div>
      </div>
    </header>

    {/* Deletion confirmation modal */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
        <div className="card pad-lg w-full" style={{ maxWidth: 380, animation: 'ethics-card-in 0.3s cubic-bezier(0.22,0.61,0.36,1) both' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
              Request account deletion?
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
              Your account will be <strong>deactivated immediately</strong> — you will no longer be able to log in.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
              Your teacher will still be able to see your work and grades during the pilot period. Your data will be permanently deleted after the pilot ends.
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.5 }}>
              If you did this by mistake, contact your teacher or <span style={{ color: 'var(--text-2)' }}>belamitali@gmail.com</span>.
            </p>
          </div>
          {deleteError && (
            <p style={{ fontSize: 12.5, color: 'var(--error)', marginBottom: 12, textAlign: 'center' }}>{deleteError}</p>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
              Cancel
            </button>
            <button
              className="btn"
              style={{ flex: 1, background: 'var(--error)', color: '#fff', border: 'none', opacity: deleting ? 0.6 : 1 }}
              onClick={handleRequestDeletion}
              disabled={deleting}
            >
              {deleting ? 'Processing...' : 'Yes, deactivate'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
