import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../../lib/auth';
import { useTheme } from '../../lib/theme';
import { requestAccountDeletion, getStudentNotifications, markAssignmentsSeen, markGradesSeen, markAnnouncementsSeen, getStudentAssignments, getStudentGrades, getStudentAnnouncements, type StudentNotifications } from '../../lib/db';

interface AppNavProps {
  /** Current streak count. Shown when > 0; hidden when undefined or 0. */
  streak?: number;
}

// ─── Notification Bell ────────────────────────────────────────────────────────

function NotificationBell({ userId }: { userId: string }) {
  const [counts, setCounts] = useState<StudentNotifications | null>(null);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<{
    assignments: Array<{ id: string; title: string; due_date: string | null }>;
    grades: Array<{ assignment_id: string; title: string; marks_earned: number; total_marks: number }>;
    announcements: Array<{ id: string; title: string; body: string }>;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    const n = await getStudentNotifications();
    setCounts(n);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const fetchDetail = async () => {
      const [{ data: asgns }, grades, { data: anns }] = await Promise.all([
        getStudentAssignments(),
        getStudentGrades(),
        getStudentAnnouncements(),
      ]);
      const seenAssignments: string[] = JSON.parse(localStorage.getItem(`educode_seen_assignments_${userId}`) ?? '[]');
      const seenGrades: string[] = JSON.parse(localStorage.getItem(`educode_seen_grades_${userId}`) ?? '[]');
      const seenAnnouncements: string[] = JSON.parse(localStorage.getItem(`educode_seen_announcements_${userId}`) ?? '[]');

      const newAsgns = (asgns ?? []).filter((a: { id: string }) => !seenAssignments.includes(a.id));
      const newGrades = grades.filter(g => g.marks_earned !== null && !seenGrades.includes(g.assignment_id));
      const newAnns = (anns ?? []).filter(a => !seenAnnouncements.includes(a.id));

      setDetail({
        assignments: newAsgns.map((a: { id: string; title: string; due_date: string | null }) => ({ id: a.id, title: a.title, due_date: a.due_date ?? null })),
        grades: newGrades.map(g => ({ assignment_id: g.assignment_id, title: '', marks_earned: g.marks_earned!, total_marks: g.total_marks })),
        announcements: newAnns.map(a => ({ id: a.id, title: a.title, body: a.body })),
      });
    };
    fetchDetail();
  }, [open, userId]);

  const handleOpen = () => {
    setOpen(o => !o);
  };

  const handleMarkAllRead = () => {
    if (!detail) return;
    markAssignmentsSeen(detail.assignments.map(a => a.id), userId);
    markGradesSeen(detail.grades.map(g => g.assignment_id), userId);
    markAnnouncementsSeen(detail.announcements.map(a => a.id), userId);
    setCounts({ newAssignments: 0, newGrades: 0, newAnnouncements: 0 });
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const total = (counts?.newAssignments ?? 0) + (counts?.newGrades ?? 0) + (counts?.newAnnouncements ?? 0);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="iconbtn"
        onClick={handleOpen}
        aria-label={`Notifications${total > 0 ? ` (${total} new)` : ''}`}
        style={{ position: 'relative' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {total > 0 && (
          <span style={{
            position: 'absolute', top: 3, right: 3, width: 8, height: 8,
            background: 'var(--error, #ef4444)', borderRadius: '50%', display: 'block',
            boxShadow: '0 0 0 2px var(--bg)'
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0, zIndex: 100,
          background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)', width: 320, maxHeight: 420, overflowY: 'auto',
          animation: 'rise 0.2s ease both'
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Notifications</span>
            {total > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{ fontSize: 11.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Mark all read
              </button>
            )}
          </div>

          {total === 0 ? (
            <div style={{ padding: '24px 14px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              All caught up!
            </div>
          ) : (
            <div>
              {(counts?.newGrades ?? 0) > 0 && (
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>✅</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                        {counts!.newGrades} grade{counts!.newGrades > 1 ? 's' : ''} returned
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>Your teacher has released marks</div>
                    </div>
                  </div>
                </div>
              )}
              {(counts?.newAssignments ?? 0) > 0 && (
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>📋</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                        {counts!.newAssignments} new assignment{counts!.newAssignments > 1 ? 's' : ''}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>Posted by your teacher</div>
                    </div>
                  </div>
                </div>
              )}
              {(counts?.newAnnouncements ?? 0) > 0 && (
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>📢</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                        {counts!.newAnnouncements} new announcement{counts!.newAnnouncements > 1 ? 's' : ''}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>From your class</div>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ padding: '8px 14px' }}>
                <button
                  onClick={handleMarkAllRead}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius)', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--text-2)', fontSize: 12.5, cursor: 'pointer', fontWeight: 500 }}
                >
                  Dismiss all
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AppNav({ streak }: AppNavProps) {
  const { profile, user, signOut } = useAuth();
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

          {/* Notification bell — students only */}
          {isStudent && user && (
            <NotificationBell userId={user.id} />
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

    {/* Mobile bottom navigation — visible on ≤900px */}
    {!isTeacher && (
      <nav className="mob-nav" aria-label="Mobile navigation">
        <Link to="/" className={`mob-nav-item${isDashboardActive ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </Link>
        <Link to="/courses" className={`mob-nav-item${isCoursesActive ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          Courses
        </Link>
        <Link to="/workspace" className={`mob-nav-item${isWorkspaceActive ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          Code
        </Link>
        <Link to="/challenges" className={`mob-nav-item${isChallengesActive ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
          Challenges
        </Link>
      </nav>
    )}

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
