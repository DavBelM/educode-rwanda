import { AppNav } from './components/AppNav';
import { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart2, Megaphone, X, Plus, Trash2, Pin, AlertCircle, Loader, Mail, MapPin, Copy, Check, UserMinus, UserPlus, Clock } from 'lucide-react';
import {
  getMySchool, getSchoolOverview, getSchoolTeachers, getSchoolStudents,
  addTeacherToSchool, removeTeacherFromSchool,
  createSchoolAnnouncement, getSchoolAnnouncements, deleteSchoolAnnouncement,
  type School, type SchoolOverview, type SchoolTeacher, type SchoolStudent, type SchoolAnnouncement,
} from '../lib/db';
import { usePageTitle } from '../hooks/usePageTitle';

type Tab = 'overview' | 'teachers' | 'students' | 'engagement' | 'announcements';

// ─── Engagement badge ──────────────────────────────────────────────────────────
function EngagementBadge({ days }: { days: number }) {
  const color =
    days === 999 ? 'var(--error)'
    : days === 0  ? '#9eaa84'
    : days <= 3   ? '#9eaa84'
    : days <= 7   ? '#cda86a'
                  : 'var(--error)';
  const label = days === 999 ? 'Never logged in' : days === 0 ? 'Active today' : `${days}d ago`;
  return (
    <span className="pill solid" style={{ color, borderColor: color }}>
      {label}
    </span>
  );
}

// ─── Add Teacher Modal ─────────────────────────────────────────────────────────
function AddTeacherModal({ schoolId, language, onClose, onAdded }: {
  schoolId: string; language: 'EN' | 'KIN'; onClose: () => void; onAdded: () => void;
}) {
  const isKin = language === 'KIN';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAdd = async () => {
    if (!email.trim()) return;
    setLoading(true); setError('');
    const { error: err } = await addTeacherToSchool(schoolId, email.trim().toLowerCase());
    setLoading(false);
    if (err) { setError(err); return; }
    setSuccess(true);
    setTimeout(() => { onAdded(); onClose(); }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg w-full max-w-sm">
        <div className="card-head">
          <h3 className="card-title">{isKin ? 'Ongeramo umwarimu' : 'Add Teacher'}</h3>
          <button onClick={onClose} className="iconbtn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {isKin ? 'Umwarimu yongewe neza!' : 'Teacher added!'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4 dim">
              {isKin
                ? 'Shyiramo i-meyili y\'umwarimu usanzwe afite konti muri EduCode Rwanda.'
                : 'Enter the email of a teacher who has already signed up on EduCode Rwanda.'}
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder={isKin ? 'mwarimu@ishuri.rw' : 'teacher@school.rw'}
              className="input mb-3"
            />
            {error && <p className="text-sm mb-3" style={{ color: 'var(--error)' }}>{error}</p>}
            <button
              onClick={handleAdd}
              disabled={loading || !email.trim()}
              className="btn btn-primary btn-block">
              {loading ? <Loader size={14} className="animate-spin" /> : <UserPlus size={14} />}
              {isKin ? 'Ongeramo umwarimu' : 'Add Teacher'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Announcement Modal ────────────────────────────────────────────────────────
function AnnouncementModal({ schoolId, language, onClose, onCreated }: {
  schoolId: string; language: 'EN' | 'KIN'; onClose: () => void; onCreated: () => void;
}) {
  const isKin = language === 'KIN';
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim() || !body.trim()) return;
    setLoading(true); setError('');
    const { error: err } = await createSchoolAnnouncement({ schoolId, title: title.trim(), body: body.trim(), pinned });
    setLoading(false);
    if (err) { setError(err); return; }
    onCreated(); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg w-full max-w-md">
        <div className="card-head">
          <h3 className="card-title">{isKin ? 'Itangazo rishya' : 'New Announcement'}</h3>
          <button onClick={onClose} className="iconbtn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder={isKin ? 'Umutwe w\'itangazo' : 'Announcement title'}
            className="input"
          />
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            rows={4}
            placeholder={isKin ? 'Ibirimo mu butumwa...' : 'Message content...'}
            className="textarea"
          />
          <label className="checkbox">
            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
            {isKin ? 'Shira itangazo hejuru' : 'Pin announcement'}
          </label>
        </div>

        {error && <p className="text-sm mt-3" style={{ color: 'var(--error)' }}>{error}</p>}

        <button
          onClick={handleCreate}
          disabled={loading || !title.trim() || !body.trim()}
          className="btn btn-primary btn-block"
          style={{ marginTop: 16 }}>
          {loading ? <Loader size={14} className="animate-spin" /> : <Megaphone size={14} />}
          {isKin ? 'Tangaza itangazo' : 'Post Announcement'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function SchoolAdminDashboard() {
  usePageTitle('School Admin · EduCode');
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const isKin = language === 'KIN';

  const [school, setSchool] = useState<School | null>(null);
  const [overview, setOverview] = useState<SchoolOverview | null>(null);
  const [teachers, setTeachers] = useState<SchoolTeacher[]>([]);
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [deletingAnnId, setDeletingAnnId] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const s = await getMySchool();
    setSchool(s);
    if (s) {
      const [ov, t, st, ann] = await Promise.all([
        getSchoolOverview(s.id),
        getSchoolTeachers(s.id),
        getSchoolStudents(s.id),
        getSchoolAnnouncements(s.id),
      ]);
      setOverview(ov);
      setTeachers(t);
      setStudents(st);
      setAnnouncements(ann);
    }
    setLoading(false);
  }

  async function handleRemoveTeacher(teacherId: string) {
    setRemovingId(teacherId);
    await removeTeacherFromSchool(teacherId);
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    setRemovingId(null);
  }

  async function handleDeleteAnnouncement(id: string) {
    setDeletingAnnId(id);
    await deleteSchoolAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setDeletingAnnId(null);
  }

  const copyCode = () => {
    if (!school) return;
    navigator.clipboard.writeText(school.school_code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Engagement segments
  const atRisk = students.filter(s => s.days_inactive >= 7);
  const inactive2Weeks = students.filter(s => s.days_inactive >= 14);
  const neverLoggedIn = students.filter(s => s.days_inactive === 999);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <Loader size={24} className="animate-spin" style={{ color: 'var(--text-2)' }} />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <AppNav />
        <div className="flex items-center justify-center p-8" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">🏫</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
              {isKin ? 'Nta shuri rihujwe na yo' : 'No school linked'}
            </h2>
            <p className="text-sm dim">
              {isKin ? 'Twandikire muri EduCode Rwanda kugirango dushyireho ishuri ryawe.' : 'Contact EduCode Rwanda to get your school set up.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; labelKin: string; icon: React.ReactNode }[] = [
    { id: 'overview',      label: 'Overview',      labelKin: 'Incamake',     icon: <BarChart2 size={15} /> },
    { id: 'teachers',      label: 'Teachers',      labelKin: 'Abarimu',      icon: <Users size={15} /> },
    { id: 'students',      label: 'Students',      labelKin: 'Abanyeshuri',  icon: <BookOpen size={15} /> },
    { id: 'engagement',    label: 'Engagement',    labelKin: 'Gukoresha',    icon: <Clock size={15} /> },
    { id: 'announcements', label: 'Announcements', labelKin: 'Inkuru',       icon: <Megaphone size={15} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNav />

      <main className="wrap page">
        {/* School header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{school.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                {school.location && (
                  <span className="flex items-center gap-1 text-xs dim">
                    <MapPin size={10} /> {school.location}
                  </span>
                )}
                <button onClick={copyCode} className="pill" style={{ cursor: 'pointer' }}>
                  {codeCopied ? <Check size={10} /> : <Copy size={10} />}
                  {isKin ? 'Kode:' : 'Code:'} {school.school_code}
                </button>
              </div>
            </div>
          </div>
          <div className="lang-toggle">
            {(['EN', 'KIN'] as const).map(l => (
              <button key={l} className={language === l ? 'on' : ''} onClick={() => setLanguage(l)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 24, padding: 0, background: 'transparent' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab${activeTab === tab.id ? ' on' : ''}`}>
              {tab.icon}
              {isKin ? tab.labelKin : tab.label}
              {tab.id === 'engagement' && atRisk.length > 0 && (
                <span className="pill error" style={{ height: 18, padding: '0 6px' }}>
                  {atRisk.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: isKin ? 'Abarimu' : 'Teachers', value: overview.teacher_count },
                { label: isKin ? 'Abanyeshuri' : 'Students', value: overview.student_count },
                { label: isKin ? 'Amashuri (Classes)' : 'Classes', value: overview.class_count },
                { label: isKin ? 'Amanota y\'ikigereranyo' : 'Avg Score', value: overview.avg_score_pct !== null ? `${overview.avg_score_pct}%` : '—' },
                { label: isKin ? 'Abakoze muri iki cyumweru' : 'Active this week', value: overview.active_this_week },
              ].map(s => (
                <div key={s.label} className="card pad-sm text-center">
                  <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>{s.value}</p>
                  <p className="text-xs dim">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Engagement snapshot */}
            {students.length > 0 && (
              <div className="card pad-lg">
                <h3 className="card-title" style={{ marginBottom: 16 }}>
                  {isKin ? 'Ishusho y’uko bakoresha platform' : 'Engagement Snapshot'}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: isKin ? 'Bakora neza (munsi y’iminsi 7)' : 'Engaged (≤7 days)', count: students.filter(s => s.days_inactive <= 7 && s.days_inactive !== 999).length, color: '#9eaa84' },
                    { label: isKin ? 'Abashobora kurekeraho (iminsi 7–14)' : 'At risk (7–14 days)', count: students.filter(s => s.days_inactive > 7 && s.days_inactive <= 14).length, color: '#cda86a' },
                    { label: isKin ? 'Batagikoresha platform (iminsi 14+)' : 'Inactive (14+ days)', count: inactive2Weeks.length, color: 'var(--error)' },
                  ].map(s => (
                    <div key={s.label} className="card pad-sm text-center" style={{ borderColor: s.color }}>
                      <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.count}</p>
                      <p className="text-xs dim">{s.label}</p>
                    </div>
                  ))}
                </div>
                {neverLoggedIn.length > 0 && (
                  <div className="mt-3 flex items-center gap-2" style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--error-dim)' }}>
                    <AlertCircle size={14} style={{ color: 'var(--error)', flexShrink: 0 }} />
                    <p className="text-xs" style={{ color: 'var(--error)' }}>
                      {isKin
                        ? `Abanyeshuri ${neverLoggedIn.length} ntibarigeze kwinjira na rimwe.`
                        : `${neverLoggedIn.length} student${neverLoggedIn.length !== 1 ? 's' : ''} have never logged in.`}
                      {' '}
                      <button onClick={() => setActiveTab('engagement')} className="underline font-semibold">
                        {isKin ? 'Reba urutonde' : 'View list'}
                      </button>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Recent announcements preview */}
            {announcements.length > 0 && (
              <div className="card pad-lg">
                <div className="card-head">
                  <h3 className="card-title">{isKin ? 'Amatangazo ya vuba' : 'Recent Announcements'}</h3>
                  <button onClick={() => setActiveTab('announcements')} className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>
                    {isKin ? 'Reba yose' : 'See All'}
                  </button>
                </div>
                {announcements.slice(0, 2).map(a => (
                  <div key={a.id} className="py-2 border-b last:border-0" style={{ borderColor: 'var(--line)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{a.title}</p>
                    <p className="text-xs mt-0.5 line-clamp-1 dim">{a.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Teachers ── */}
        {activeTab === 'teachers' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                {isKin ? `Abarimu (${teachers.length})` : `Teachers (${teachers.length})`}
              </h2>
              <button onClick={() => setShowAddTeacher(true)} className="btn btn-secondary sm">
                <UserPlus size={13} /> {isKin ? 'Ongeramo umwarimu' : 'Add Teacher'}
              </button>
            </div>

            {teachers.length === 0 ? (
              <div className="card pad-lg text-center" style={{ padding: '64px 24px' }}>
                <Users size={32} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
                <p className="text-sm dim">
                  {isKin ? 'Nta mwarimu urahuzwa n’ishuri ryawe.' : 'No teachers linked to your school yet.'}
                </p>
                <p className="text-xs mt-1 dim">
                  {isKin ? 'Kanda "Ongeramo" wongeye umwarimu.' : 'Click "Add Teacher" to link one.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {teachers.map(t => (
                  <div key={t.id} className="card pad-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                        style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
                        {t.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{t.full_name}</p>
                        <p className="text-xs flex items-center gap-1 mt-0.5 truncate dim">
                          <Mail size={10} /> {t.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="hidden sm:flex gap-4 text-center">
                        {[
                          { v: t.class_count,      l: isKin ? 'Amashuri (Classes)' : 'Classes' },
                          { v: t.student_count,    l: isKin ? 'Abanyeshuri' : 'Students' },
                          { v: t.assignment_count, l: isKin ? 'Imishinga' : 'Assignments' },
                        ].map(s => (
                          <div key={s.l}>
                            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{s.v}</p>
                            <p className="text-xs dim">{s.l}</p>
                          </div>
                        ))}
                      </div>
                      <EngagementBadge days={t.last_seen ? Math.max(0, Math.floor((Date.now() - new Date(t.last_seen).getTime()) / 86400000)) : 999} />
                      <button
                        onClick={() => handleRemoveTeacher(t.id)}
                        disabled={removingId === t.id}
                        className="iconbtn"
                        title={isKin ? 'Kuramo umwarimu' : 'Remove teacher'}>
                        {removingId === t.id ? <Loader size={14} className="animate-spin" /> : <UserMinus size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Students ── */}
        {activeTab === 'students' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                {isKin ? `Abanyeshuri (${students.length})` : `Students (${students.length})`}
              </h2>
              <span className="text-xs dim">
                {isKin ? 'Bitondekanyijwe: Abadakoresha cyane nibo baza mbere' : 'Sorted: least active first'}
              </span>
            </div>

            {students.length === 0 ? (
              <div className="card pad-lg text-center" style={{ padding: '64px 24px' }}>
                <BookOpen size={32} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
                <p className="text-sm dim">
                  {isKin ? 'Nta munyeshuri uhuye n\'abarimu b\'ishuri ryawe.' : 'No students enrolled in your school\'s classes yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.id} className="card pad-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                        style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
                        {s.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{s.full_name}</p>
                        <p className="text-xs mt-0.5 truncate dim">
                          {s.class_names.join(', ') || (isKin ? 'Nta shuri ririmo' : 'No class')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {s.avg_score_pct !== null && (
                        <span className="pill solid" style={{
                          color: s.avg_score_pct >= 70 ? '#9eaa84' : s.avg_score_pct >= 50 ? '#cda86a' : 'var(--error)',
                          borderColor: s.avg_score_pct >= 70 ? '#9eaa84' : s.avg_score_pct >= 50 ? '#cda86a' : 'var(--error)',
                        }}>
                          {s.avg_score_pct}%
                        </span>
                      )}
                      <EngagementBadge days={s.days_inactive} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Engagement ── */}
        {activeTab === 'engagement' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>
                {isKin ? 'Kugenzura uko abanyeshuri bakoresha platform' : 'Student Engagement Monitor'}
              </h2>
              <p className="text-xs dim">
                {isKin
                  ? 'Abanyeshuri bamaze iminsi 7+ batagaragara kuri platform. Bwira abarimu babo babakurikirane.'
                  : 'Students inactive for 7+ days. Advise their teachers to follow up.'}
              </p>
            </div>

            {atRisk.length === 0 ? (
              <div className="card pad-lg text-center" style={{ padding: '64px 24px' }}>
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {isKin ? 'Abanyeshuri bose barimo gukoresha platform neza!' : 'All students are actively using the platform!'}
                </p>
              </div>
            ) : (
              <>
                {/* Severity buckets */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: isKin ? 'Iminsi 7–14 batagaragara' : '7–14 days inactive', count: students.filter(s => s.days_inactive >= 7 && s.days_inactive < 14).length, color: '#cda86a' },
                    { label: isKin ? 'Iminsi 14+ batagaragara' : '14+ days inactive',    count: students.filter(s => s.days_inactive >= 14 && s.days_inactive !== 999).length, color: 'var(--error)' },
                    { label: isKin ? 'Ntibarigera binjira na rimwe' : 'Never logged in', count: neverLoggedIn.length, color: 'var(--error)' },
                  ].map(s => (
                    <div key={s.label} className="card pad-sm text-center" style={{ borderColor: s.color }}>
                      <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
                      <p className="text-xs mt-0.5 dim">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* At-risk list */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="flex items-center gap-2" style={{ padding: '12px 16px', background: 'var(--error-dim)' }}>
                    <AlertCircle size={14} style={{ color: 'var(--error)' }} />
                    <p className="text-xs font-bold" style={{ color: 'var(--error)' }}>
                      {isKin ? `Bakeneye gukurikiranwa (${atRisk.length})` : `Need follow-up (${atRisk.length})`}
                    </p>
                  </div>
                  {atRisk.map(s => (
                    <div key={s.id} className="flex items-center justify-between border-b last:border-0"
                      style={{ padding: '12px 16px', borderColor: 'var(--line)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
                          {s.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.full_name}</p>
                          <p className="text-xs dim">
                            {s.class_names.join(', ') || (isKin ? 'Nta shuri ririmo' : 'No class')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {s.avg_score_pct !== null && (
                          <span className="text-xs dim">{s.avg_score_pct}%</span>
                        )}
                        <EngagementBadge days={s.days_inactive} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Announcements ── */}
        {activeTab === 'announcements' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                {isKin ? 'Amatangazo y’Ishuri' : 'School Announcements'}
              </h2>
              <button onClick={() => setShowAnnouncement(true)} className="btn btn-secondary sm">
                <Plus size={13} /> {isKin ? 'Itangazo rishya' : 'New Announcement'}
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="card pad-lg text-center" style={{ padding: '64px 24px' }}>
                <Megaphone size={32} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
                <p className="text-sm dim">
                  {isKin ? 'Nta matangazo arahari. Koresha uburyo bwo hejuru ushyireho rishya.' : 'No announcements yet. Post one above.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="card pad-sm" style={{ borderColor: a.pinned ? 'var(--line-strong)' : undefined }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0">
                        {a.pinned && <Pin size={13} style={{ color: 'var(--text)', flexShrink: 0, marginTop: 2 }} />}
                        <div className="min-w-0">
                          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{a.title}</p>
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-2)' }}>{a.body}</p>
                          <p className="text-xs mt-2 dim">
                            {new Date(a.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        disabled={deletingAnnId === a.id}
                        className="iconbtn shrink-0">
                        {deletingAnnId === a.id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddTeacher && school && (
        <AddTeacherModal
          schoolId={school.id}
          language={language}
          onClose={() => setShowAddTeacher(false)}
          onAdded={() => { setShowAddTeacher(false); loadAll(); }}
        />
      )}
      {showAnnouncement && school && (
        <AnnouncementModal
          schoolId={school.id}
          language={language}
          onClose={() => setShowAnnouncement(false)}
          onCreated={() => getSchoolAnnouncements(school.id).then(setAnnouncements)}
        />
      )}
    </div>
  );
}
