import { useState, useEffect } from 'react';
import {
  Loader, Plus, Download, Building2, X, Check, Inbox, Users, BarChart2,
  Search, RefreshCw, ShieldAlert, ShieldCheck, UserX, UserCheck, ChevronDown,
} from 'lucide-react';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

// ── Types ─────────────────────────────────────────────────────────────────────

interface School { id: string; name: string; location: string | null; contact_email: string; school_code: string; created_at: string; teacher_count?: number; student_count?: number; }
interface Lead { id: string; school_name: string; contact_name: string; role: string | null; email: string | null; phone: string | null; message: string | null; followed_up: boolean; created_at: string; }
interface UserRow { id: string; full_name: string; email: string; user_type: string; school_id: string | null; last_active: string | null; created_at: string; is_deactivated: boolean | null; }
interface Stats { totalSchools: number; totalTeachers: number; totalStudents: number; totalSelfLearners: number; activeThisWeek: number; newLeads: number; }

type Tab = 'overview' | 'schools' | 'users' | 'leads';

// ── Modals ────────────────────────────────────────────────────────────────────

function CreateSchoolModal({ onClose, onCreated }: { onClose: () => void; onCreated: (s: School) => void }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const { data, error: err } = await supabase.from('schools')
      .insert({ name: name.trim(), location: location.trim() || null, contact_email: contactEmail.trim() })
      .select().single();
    if (err) { setError(err.message); setLoading(false); return; }
    onCreated(data as School);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-head" style={{ marginBottom: 16 }}>
          <h2 className="card-title">New school</h2>
          <button onClick={onClose} className="iconbtn"><X size={18} /></button>
        </div>
        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field"><label className="label">School name</label><input type="text" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. IPRC Kigali" autoFocus required /></div>
          <div className="field"><label className="label">Location</label><input type="text" className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Kigali" /></div>
          <div className="field"><label className="label">Contact email</label><input type="email" className="input" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="admin@school.rw" required /></div>
          {error && <p style={{ fontSize: 13, color: 'var(--error)' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={!name.trim() || !contactEmail.trim() || loading}>
            {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create school'}
          </button>
        </form>
      </div>
    </div>
  );
}

function CreateSchoolAdminModal({ schools, onClose, onCreated }: { schools: School[]; onClose: () => void; onCreated: () => void }) {
  const [schoolId, setSchoolId] = useState(schools[0]?.id ?? '');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolId || !fullName.trim() || !email.trim() || password.length < 6) return;
    setLoading(true); setError('');
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token ?? ''}` },
      body: JSON.stringify({ school_id: schoolId, full_name: fullName.trim(), email: email.trim(), password }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error ?? 'Failed'); setLoading(false); return; }
    setDone(true); onCreated();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-head" style={{ marginBottom: 16 }}>
          <h2 className="card-title">New school admin</h2>
          <button onClick={onClose} className="iconbtn"><X size={18} /></button>
        </div>
        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>School admin account created. They can log in immediately.</p>
            <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="field">
              <label className="label">School</label>
              <select className="select" value={schoolId} onChange={e => setSchoolId(e.target.value)}>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="field"><label className="label">Full name</label><input type="text" className="input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Diane Uwase" autoFocus /></div>
            <div className="field"><label className="label">Email (login)</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.rw" /></div>
            <div className="field"><label className="label">Temporary password</label><input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" /></div>
            {error && <p style={{ fontSize: 13, color: 'var(--error)' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={!schoolId || !fullName.trim() || !email.trim() || password.length < 6 || loading}>
              {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create admin account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function Stat({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div className="card pad-lg" style={{ borderLeft: accent ? `3px solid ${accent}` : undefined }}>
      <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{label}</p>
      <p style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

// ── Type badge ────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    student: '#7eb8cf', teacher: '#9eaa84', school_admin: '#cda86a', super_admin: '#c084fc', self_learner: 'var(--text-3)',
  };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: colors[type] ?? 'var(--text-3)', background: `${colors[type] ?? 'var(--text-3)'}18`, padding: '3px 8px', borderRadius: 99 }}>
      {type.replace('_', ' ')}
    </span>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────

export default function SuperAdminDashboard() {
  usePageTitle('Owner Dashboard · EduCode Rwanda');

  const [tab, setTab] = useState<Tab>('overview');
  const [schools, setSchools] = useState<School[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [showCreateSchool, setShowCreateSchool] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { if (tab === 'users' && users.length === 0) loadUsers(); }, [tab]);

  async function loadAll() {
    setLoading(true);
    const [{ data: sc }, { data: ld }, { data: profiles }] = await Promise.all([
      supabase.from('schools').select('*').order('created_at', { ascending: false }),
      supabase.from('school_leads').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('user_type, last_active'),
    ]);
    setSchools((sc ?? []) as School[]);
    setLeads((ld ?? []) as Lead[]);

    // Compute stats from profiles
    const allProfiles = (profiles ?? []) as { user_type: string; last_active: string | null }[];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    setStats({
      totalSchools: (sc ?? []).length,
      totalStudents: allProfiles.filter(p => p.user_type === 'student').length,
      totalTeachers: allProfiles.filter(p => p.user_type === 'teacher').length,
      totalSelfLearners: allProfiles.filter(p => p.user_type === 'self_learner').length,
      activeThisWeek: allProfiles.filter(p => p.last_active && p.last_active > weekAgo).length,
      newLeads: (ld ?? []).filter((l: Lead) => !l.followed_up).length,
    });
    setLoading(false);
  }

  async function loadUsers() {
    setUsersLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers((data ?? []) as UserRow[]);
    setUsersLoading(false);
  }

  async function toggleDeactivate(user: UserRow) {
    setActionLoading(user.id);
    const newVal = !user.is_deactivated;
    await supabase.from('profiles').update({ is_deactivated: newVal }).eq('id', user.id);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_deactivated: newVal } : u));
    setActionLoading(null);
  }

  async function changeUserType(userId: string, newType: string) {
    setActionLoading(userId);
    await supabase.from('profiles').update({ user_type: newType }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, user_type: newType } : u));
    setActionLoading(null);
  }

  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase();
    const matchSearch = !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchType = userTypeFilter === 'all' || u.user_type === userTypeFilter;
    return matchSearch && matchType;
  });

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 size={15} /> },
    { id: 'schools', label: 'Schools', icon: <Building2 size={15} /> },
    { id: 'users', label: 'All Users', icon: <Users size={15} /> },
    { id: 'leads', label: 'Enquiries', icon: <Inbox size={15} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppNav />
      <div className="wrap page">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--text)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={14} />
              </span>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)' }}>Owner dashboard</h1>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-3)' }}>EduCode Rwanda — full platform control</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary sm" onClick={() => setShowCreateSchool(true)}>
              <Building2 size={13} /> New school
            </button>
            <button className="btn btn-primary sm" onClick={() => setShowCreateAdmin(true)} disabled={schools.length === 0}>
              <Plus size={13} /> New school admin
            </button>
            <button className="btn btn-tertiary sm" onClick={loadAll} title="Refresh data">
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 28, padding: 0, background: 'transparent', gap: 2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`tab${tab === t.id ? ' on' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {t.icon}{t.label}
              {t.id === 'leads' && (stats?.newLeads ?? 0) > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--error)', color: '#fff', borderRadius: 99, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
                  {stats!.newLeads}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <Loader size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-3)' }} />
          </div>
        ) : (
          <>

            {/* ── OVERVIEW ── */}
            {tab === 'overview' && stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Stats grid */}
                <div className="grid g-3" style={{ gap: 14 }}>
                  <Stat label="Schools" value={stats.totalSchools} sub="on the platform" accent="#9eaa84" />
                  <Stat label="Students" value={stats.totalStudents} sub="enrolled accounts" accent="#7eb8cf" />
                  <Stat label="Teachers" value={stats.totalTeachers} sub="teacher accounts" accent="#cda86a" />
                  <Stat label="Self-learners" value={stats.totalSelfLearners} sub="independent users" />
                  <Stat label="Active this week" value={stats.activeThisWeek} sub="logged in last 7 days" accent="#9eaa84" />
                  <Stat label="Open enquiries" value={stats.newLeads} sub="need follow-up" accent={stats.newLeads > 0 ? 'var(--error)' : undefined} />
                </div>

                {/* Quick actions */}
                <div className="card pad-lg">
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Quick actions</p>
                  <div className="grid g-3" style={{ gap: 10 }}>
                    {[
                      { label: 'Create a new school', desc: 'Add a school before creating its admin account', action: () => setShowCreateSchool(true), icon: <Building2 size={16} /> },
                      { label: 'Create a school admin', desc: 'Give a school admin access to their dashboard', action: () => setShowCreateAdmin(true), icon: <ShieldAlert size={16} />, disabled: schools.length === 0 },
                      { label: 'View all users', desc: 'Search, change roles, deactivate accounts', action: () => setTab('users'), icon: <Users size={16} /> },
                      { label: 'Follow up on leads', desc: `${stats.newLeads} enquiries waiting`, action: () => setTab('leads'), icon: <Inbox size={16} /> },
                    ].map(a => (
                      <button key={a.label} onClick={a.action} disabled={a.disabled}
                        style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--line)', background: 'var(--surface)', cursor: a.disabled ? 'default' : 'pointer', opacity: a.disabled ? 0.45 : 1, transition: 'border-color 0.14s' }}
                        onMouseEnter={e => { if (!a.disabled) (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-strong)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: 'var(--text)' }}>{a.icon}<span style={{ fontSize: 13.5, fontWeight: 600 }}>{a.label}</span></div>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.45 }}>{a.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent schools */}
                {schools.length > 0 && (
                  <div className="card pad-lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Recent schools</p>
                      <button className="btn btn-tertiary sm" onClick={() => setTab('schools')}>View all</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {schools.slice(0, 5).map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderTop: '1px solid var(--line)' }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{s.name}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.location ?? '—'} · {s.contact_email}</p>
                          </div>
                          <span className="pill" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{s.school_code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── SCHOOLS ── */}
            {tab === 'schools' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {schools.length === 0 ? (
                  <div className="card pad-lg" style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 14, padding: '48px 24px' }}>
                    No schools yet. Create the first one with the button above.
                  </div>
                ) : schools.map(s => (
                  <div key={s.id} className="card pad-lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{s.name}</p>
                        <span className="pill" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{s.school_code}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 2 }}>{s.location ?? 'No location'} · {s.contact_email}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Created {new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary sm" onClick={() => setShowCreateAdmin(true)} title="Create admin for this school">
                        <Plus size={13} /> Add admin
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── USERS ── */}
            {tab === 'users' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Search + filter */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                    <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      className="input"
                      placeholder="Search by name or email…"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      style={{ paddingLeft: 36 }}
                    />
                  </div>
                  <select className="select" style={{ minWidth: 160 }} value={userTypeFilter} onChange={e => setUserTypeFilter(e.target.value)}>
                    <option value="all">All types</option>
                    <option value="student">Students</option>
                    <option value="teacher">Teachers</option>
                    <option value="school_admin">School admins</option>
                    <option value="self_learner">Self-learners</option>
                    <option value="super_admin">Super admins</option>
                  </select>
                  <button className="btn btn-tertiary sm" onClick={loadUsers} disabled={usersLoading}>
                    <RefreshCw size={13} style={{ animation: usersLoading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
                  </button>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {usersLoading ? 'Loading…' : `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} shown`}
                </div>

                {/* Users table */}
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="tbl-scroll">
                    <table className="tbl" style={{ minWidth: 700 }}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Last active</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.id} style={{ opacity: u.is_deactivated ? 0.5 : 1 }}>
                            <td style={{ fontWeight: 500, color: 'var(--text)' }}>{u.full_name}</td>
                            <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{u.email}</td>
                            <td>
                              {u.user_type !== 'super_admin' ? (
                                <select
                                  className="select"
                                  value={u.user_type}
                                  style={{ fontSize: 12, padding: '4px 8px', height: 'auto' }}
                                  disabled={actionLoading === u.id}
                                  onChange={e => changeUserType(u.id, e.target.value)}
                                >
                                  <option value="student">Student</option>
                                  <option value="teacher">Teacher</option>
                                  <option value="school_admin">School admin</option>
                                  <option value="self_learner">Self-learner</option>
                                </select>
                              ) : <TypeBadge type={u.user_type} />}
                            </td>
                            <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                              {u.last_active ? new Date(u.last_active).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
                            </td>
                            <td>
                              {u.is_deactivated
                                ? <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deactivated</span>
                                : <span style={{ fontSize: 11, fontWeight: 600, color: '#9eaa84', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active</span>}
                            </td>
                            <td>
                              {u.user_type !== 'super_admin' && (
                                <button
                                  className="btn btn-tertiary sm"
                                  style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                                  disabled={actionLoading === u.id}
                                  onClick={() => toggleDeactivate(u)}
                                  title={u.is_deactivated ? 'Reactivate account' : 'Deactivate account'}
                                >
                                  {actionLoading === u.id
                                    ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} />
                                    : u.is_deactivated ? <UserCheck size={12} /> : <UserX size={12} />}
                                  {u.is_deactivated ? 'Reactivate' : 'Deactivate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && !usersLoading && (
                          <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)', fontSize: 14 }}>No users match your search.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── LEADS ── */}
            {tab === 'leads' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {leads.length === 0 ? (
                  <div className="card pad-lg" style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 14, padding: '48px 24px' }}>
                    No enquiries yet. They arrive here when someone fills in the "Request demo" form on the landing page.
                  </div>
                ) : leads.map(lead => (
                  <div key={lead.id} className="card pad-lg" style={{ display: 'flex', gap: 18, alignItems: 'flex-start', borderLeft: lead.followed_up ? 'none' : '3px solid var(--text)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{lead.school_name}</p>
                        {lead.followed_up
                          ? <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9eaa84' }}>✓ followed up</span>
                          : <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text)' }}>● new</span>}
                      </div>
                      <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 4 }}>
                        {lead.contact_name}{lead.role ? ` · ${lead.role}` : ''}
                      </p>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {lead.email && <a href={`mailto:${lead.email}`} style={{ fontSize: 13, color: 'var(--text-3)' }}>{lead.email}</a>}
                        {lead.phone && <a href={`tel:${lead.phone}`} style={{ fontSize: 13, color: 'var(--text-3)' }}>{lead.phone}</a>}
                      </div>
                      {lead.message && <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.6, borderLeft: '2px solid var(--line)', paddingLeft: 12 }}>"{lead.message}"</p>}
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 10 }}>
                        {new Date(lead.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!lead.followed_up && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                        <a href={`mailto:${lead.email}`} className="btn btn-secondary sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                          Reply by email
                        </a>
                        <button className="btn btn-tertiary sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                          onClick={async () => {
                            await supabase.from('school_leads').update({ followed_up: true }).eq('id', lead.id);
                            setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, followed_up: true } : l));
                            if (stats) setStats(s => s ? { ...s, newLeads: Math.max(0, s.newLeads - 1) } : s);
                          }}>
                          <Check size={12} /> Mark done
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </>
        )}
      </div>

      {showCreateSchool && (
        <CreateSchoolModal onClose={() => setShowCreateSchool(false)} onCreated={s => { setSchools(p => [s, ...p]); setShowCreateSchool(false); if (stats) setStats(st => st ? { ...st, totalSchools: st.totalSchools + 1 } : st); }} />
      )}
      {showCreateAdmin && (
        <CreateSchoolAdminModal schools={schools} onClose={() => setShowCreateAdmin(false)} onCreated={() => {}} />
      )}
    </div>
  );
}
