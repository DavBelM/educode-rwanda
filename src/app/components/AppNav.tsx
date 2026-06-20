import { Link, useLocation } from 'react-router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';

interface AppNavProps {
  /** Current streak count. Shown when > 0; hidden when undefined or 0. */
  streak?: number;
}

export function AppNav({ streak }: AppNavProps) {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

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
  );
}
