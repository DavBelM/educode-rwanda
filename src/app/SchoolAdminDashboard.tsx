import { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart2, Megaphone, X, Plus, Trash2, Pin, AlertCircle, Loader, Mail, MapPin, Copy, Check, UserMinus, UserPlus, Clock } from 'lucide-react';
import {
  getMySchool, getSchoolOverview, getSchoolTeachers, getSchoolStudents,
  addTeacherToSchool, removeTeacherFromSchool,
  createSchoolAnnouncement, getSchoolAnnouncements, deleteSchoolAnnouncement,
  type School, type SchoolOverview, type SchoolTeacher, type SchoolStudent, type SchoolAnnouncement,
} from '../lib/db';
import { useAuth } from '../lib/auth';

type Tab = 'overview' | 'teachers' | 'students' | 'engagement' | 'announcements';

// ─── Engagement badge ──────────────────────────────────────────────────────────
function EngagementBadge({ days }: { days: number }) {
  const { label, bg, color } =
    days === 999 ? { label: 'Never logged in', bg: 'rgba(239,68,68,0.1)', color: '#ef4444' }
    : days === 0  ? { label: 'Active today',    bg: 'rgba(0,212,170,0.1)',  color: '#00d4aa' }
    : days <= 3   ? { label: `${days}d ago`,    bg: 'rgba(0,212,170,0.08)', color: '#00d4aa' }
    : days <= 7   ? { label: `${days}d ago`,    bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' }
    : days <= 14  ? { label: `${days}d ago`,    bg: 'rgba(239,68,68,0.08)', color: '#f87171' }
                  : { label: `${days}d ago`,    bg: 'rgba(239,68,68,0.12)', color: '#ef4444' };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: bg, color, fontFamily: 'Inter, sans-serif' }}>
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
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Ongeramo Umwarimu' : 'Add Teacher'}
          </h3>
          <button onClick={onClose} style={{ color: '#475569' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm font-semibold" style={{ color: '#00d4aa', fontFamily: 'Inter, sans-serif' }}>
              {isKin ? 'Umwarimu yongewe!' : 'Teacher added!'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-4" style={{ color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
              {isKin
                ? 'Shyiramo email y\'umwarimu wiyandikishije kuri EduCode Rwanda.'
                : 'Enter the email of a teacher who has already signed up on EduCode Rwanda.'}
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder={isKin ? 'email@ishuri.rw' : 'teacher@school.rw'}
              className="w-full px-4 py-3 rounded-xl text-sm mb-3 outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
            />
            {error && <p className="text-xs mb-3" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>{error}</p>}
            <button
              onClick={handleAdd}
              disabled={loading || !email.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: '#00d4aa', color: '#0d0f14', opacity: loading || !email.trim() ? 0.6 : 1 }}>
              {loading ? <Loader size={14} className="animate-spin" /> : <UserPlus size={14} />}
              {isKin ? 'Ongeramo' : 'Add Teacher'}
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
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Inkuru Nshya' : 'New Announcement'}
          </h3>
          <button onClick={onClose} style={{ color: '#475569' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder={isKin ? 'Umutwe w\'inkuru' : 'Announcement title'}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
          />
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            rows={4}
            placeholder={isKin ? 'Ubutumwa bwawe...' : 'Message content...'}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setPinned(p => !p)}
              className="w-8 h-4 rounded-full transition-all flex items-center px-0.5"
              style={{ background: pinned ? '#00d4aa' : 'rgba(255,255,255,0.1)' }}>
              <div className="w-3 h-3 rounded-full bg-white transition-all" style={{ transform: pinned ? 'translateX(16px)' : 'translateX(0)' }} />
            </div>
            <span className="text-xs" style={{ color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
              {isKin ? 'Shyira hejuru (pin)' : 'Pin announcement'}
            </span>
          </label>
        </div>

        {error && <p className="text-xs mt-3" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>{error}</p>}

        <button
          onClick={handleCreate}
          disabled={loading || !title.trim() || !body.trim()}
          className="w-full mt-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          style={{ background: '#00d4aa', color: '#0d0f14', opacity: loading || !title.trim() || !body.trim() ? 0.6 : 1 }}>
          {loading ? <Loader size={14} className="animate-spin" /> : <Megaphone size={14} />}
          {isKin ? 'Ohereza' : 'Post Announcement'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function SchoolAdminDashboard() {
  const { user, profile } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0f14' }}>
        <Loader size={24} className="animate-spin" style={{ color: '#00d4aa' }} />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0d0f14' }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🏫</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Nta shuri rihuye' : 'No school linked'}
          </h2>
          <p className="text-sm" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Vugana na EduCode Rwanda ngo bashyireho ishuri ryawe.' : 'Contact EduCode Rwanda to get your school set up.'}
          </p>
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
    <div className="min-h-screen" style={{ background: '#0d0f14', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#13161e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <div>
              <h1 className="text-base font-bold" style={{ color: '#f1f5f9' }}>{school.name}</h1>
              <div className="flex items-center gap-3 mt-0.5">
                {school.location && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#475569' }}>
                    <MapPin size={10} /> {school.location}
                  </span>
                )}
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg transition-all"
                  style={{ background: 'rgba(0,212,170,0.08)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.15)' }}>
                  {codeCopied ? <Check size={10} /> : <Copy size={10} />}
                  {isKin ? 'Kode:' : 'Code:'} {school.school_code}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {(['EN', 'KIN'] as const).map(l => (
                <button key={l} onClick={() => setLanguage(l)}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
                  style={{ background: language === l ? 'rgba(0,212,170,0.15)' : 'transparent', color: language === l ? '#00d4aa' : '#475569' }}>
                  {l}
                </button>
              ))}
            </div>
            <span className="text-sm" style={{ color: '#475569' }}>{profile?.full_name}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2"
              style={{
                color: activeTab === tab.id ? '#00d4aa' : '#475569',
                borderColor: activeTab === tab.id ? '#00d4aa' : 'transparent',
                background: 'transparent',
              }}>
              {tab.icon}
              {isKin ? tab.labelKin : tab.label}
              {tab.id === 'engagement' && atRisk.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                  {atRisk.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">

        {/* ── Overview ── */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: isKin ? 'Abarimu' : 'Teachers',         value: overview.teacher_count,                                               color: '#8b5cf6' },
                { label: isKin ? 'Abanyeshuri' : 'Students',     value: overview.student_count,                                               color: '#00d4aa' },
                { label: isKin ? 'Amazuru' : 'Classes',          value: overview.class_count,                                                 color: '#f59e0b' },
                { label: isKin ? 'Amanota y\'ishuri' : 'Avg Score', value: overview.avg_score_pct !== null ? `${overview.avg_score_pct}%` : '—', color: overview.avg_score_pct !== null && overview.avg_score_pct >= 70 ? '#00d4aa' : '#f59e0b' },
                { label: isKin ? 'Bakoresha iki cyumweru' : 'Active this week', value: overview.active_this_week, color: '#00d4aa' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs" style={{ color: '#475569' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Engagement snapshot */}
            {students.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#f1f5f9' }}>
                  {isKin ? 'Ikigereranyo cy\'ikoreshwa' : 'Engagement Snapshot'}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: isKin ? 'Bakora neza (≤7 iminsi)' : 'Engaged (≤7 days)', count: students.filter(s => s.days_inactive <= 7 && s.days_inactive !== 999).length, color: '#00d4aa', bg: 'rgba(0,212,170,0.06)' },
                    { label: isKin ? 'Barenze 7 iminsi' : 'At risk (7–14 days)',  count: students.filter(s => s.days_inactive > 7 && s.days_inactive <= 14).length, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
                    { label: isKin ? 'Ntibakoresha (+14 iminsi)' : 'Inactive (14+ days)', count: inactive2Weeks.length, color: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: s.bg, border: `1px solid ${s.color}20` }}>
                      <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.count}</p>
                      <p className="text-xs" style={{ color: '#475569' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                {neverLoggedIn.length > 0 && (
                  <div className="mt-3 rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                    <p className="text-xs" style={{ color: '#f87171' }}>
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
              <div className="rounded-2xl p-5" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: '#f1f5f9' }}>{isKin ? 'Inkuru za Vuba' : 'Recent Announcements'}</h3>
                  <button onClick={() => setActiveTab('announcements')} className="text-xs font-semibold" style={{ color: '#00d4aa' }}>
                    {isKin ? 'Reba Zose' : 'See All'}
                  </button>
                </div>
                {announcements.slice(0, 2).map(a => (
                  <div key={a.id} className="py-2 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{a.title}</p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#475569' }}>{a.body}</p>
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
              <h2 className="text-sm font-bold" style={{ color: '#f1f5f9' }}>
                {isKin ? `Abarimu (${teachers.length})` : `Teachers (${teachers.length})`}
              </h2>
              <button
                onClick={() => setShowAddTeacher(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
                <UserPlus size={13} /> {isKin ? 'Ongeramo' : 'Add Teacher'}
              </button>
            </div>

            {teachers.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Users size={32} style={{ color: '#1e293b', margin: '0 auto 12px' }} />
                <p className="text-sm" style={{ color: '#475569' }}>
                  {isKin ? 'Nta mwarimu uhuye n\'ishuri ryawe.' : 'No teachers linked to your school yet.'}
                </p>
                <p className="text-xs mt-1" style={{ color: '#334155' }}>
                  {isKin ? 'Kanda "Ongeramo" wongeye umwarimu.' : 'Click "Add Teacher" to link one.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {teachers.map(t => (
                  <div key={t.id} className="rounded-2xl p-4 flex items-center justify-between gap-4"
                    style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                        style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
                        {t.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#f1f5f9' }}>{t.full_name}</p>
                        <p className="text-xs flex items-center gap-1 mt-0.5 truncate" style={{ color: '#475569' }}>
                          <Mail size={10} /> {t.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="hidden sm:flex gap-4 text-center">
                        {[
                          { v: t.class_count,      l: isKin ? 'Amazuru' : 'Classes' },
                          { v: t.student_count,    l: isKin ? 'Abanyeshuri' : 'Students' },
                          { v: t.assignment_count, l: isKin ? 'Imishinga' : 'Assignments' },
                        ].map(s => (
                          <div key={s.l}>
                            <p className="text-sm font-bold" style={{ color: '#f1f5f9' }}>{s.v}</p>
                            <p className="text-xs" style={{ color: '#475569' }}>{s.l}</p>
                          </div>
                        ))}
                      </div>
                      <EngagementBadge days={t.last_seen ? Math.max(0, Math.floor((Date.now() - new Date(t.last_seen).getTime()) / 86400000)) : 999} />
                      <button
                        onClick={() => handleRemoveTeacher(t.id)}
                        disabled={removingId === t.id}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: '#475569' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                        title={isKin ? 'Kura umwarimu' : 'Remove teacher'}>
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
              <h2 className="text-sm font-bold" style={{ color: '#f1f5f9' }}>
                {isKin ? `Abanyeshuri (${students.length})` : `Students (${students.length})`}
              </h2>
              <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: '#475569' }}>
                {isKin ? 'Gutondeka: Ntibakoresha' : 'Sorted: least active first'}
              </span>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                <BookOpen size={32} style={{ color: '#1e293b', margin: '0 auto 12px' }} />
                <p className="text-sm" style={{ color: '#475569' }}>
                  {isKin ? 'Nta munyeshuri uhuye n\'abarimu b\'ishuri ryawe.' : 'No students enrolled in your school\'s classes yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.id} className="rounded-2xl p-4 flex items-center justify-between gap-4"
                    style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                        style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa' }}>
                        {s.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#f1f5f9' }}>{s.full_name}</p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: '#475569' }}>
                          {s.class_names.join(', ') || (isKin ? 'Nta ishuri' : 'No class')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {s.avg_score_pct !== null && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: s.avg_score_pct >= 70 ? 'rgba(0,212,170,0.1)' : s.avg_score_pct >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                            color: s.avg_score_pct >= 70 ? '#00d4aa' : s.avg_score_pct >= 50 ? '#f59e0b' : '#ef4444',
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
              <h2 className="text-sm font-bold mb-1" style={{ color: '#f1f5f9' }}>
                {isKin ? 'Abanyeshuri Batakoresha Platform' : 'Student Engagement Monitor'}
              </h2>
              <p className="text-xs" style={{ color: '#475569' }}>
                {isKin
                  ? 'Abanyeshuri b\'iminsi 7+ ntibonekaga kuri platform. Bwira abarimu babo babahamagare.'
                  : 'Students inactive for 7+ days. Advise their teachers to follow up.'}
              </p>
            </div>

            {atRisk.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-sm font-semibold" style={{ color: '#00d4aa' }}>
                  {isKin ? 'Abanyeshuri bose bakoresha platform!' : 'All students are actively using the platform!'}
                </p>
              </div>
            ) : (
              <>
                {/* Severity buckets */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: isKin ? '7–14 iminsi' : '7–14 days inactive', count: students.filter(s => s.days_inactive >= 7 && s.days_inactive < 14).length, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
                    { label: isKin ? '14+ iminsi' : '14+ days inactive',    count: students.filter(s => s.days_inactive >= 14 && s.days_inactive !== 999).length, color: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
                    { label: isKin ? 'Ntibarigeze kwinjira' : 'Never logged in', count: neverLoggedIn.length, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: s.bg, border: `1px solid ${s.color}25` }}>
                      <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* At-risk list */}
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="px-4 py-3" style={{ background: 'rgba(239,68,68,0.05)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} style={{ color: '#f87171' }} />
                      <p className="text-xs font-bold" style={{ color: '#f87171' }}>
                        {isKin ? `Basaba gukurikirana (${atRisk.length})` : `Need follow-up (${atRisk.length})`}
                      </p>
                    </div>
                  </div>
                  {atRisk.map(s => (
                    <div key={s.id} className="px-4 py-3 flex items-center justify-between border-b last:border-0"
                      style={{ borderColor: 'rgba(255,255,255,0.04)', background: '#13161e' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                          {s.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{s.full_name}</p>
                          <p className="text-xs" style={{ color: '#475569' }}>
                            {s.class_names.join(', ') || (isKin ? 'Nta ishuri' : 'No class')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {s.avg_score_pct !== null && (
                          <span className="text-xs" style={{ color: '#475569' }}>{s.avg_score_pct}%</span>
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
              <h2 className="text-sm font-bold" style={{ color: '#f1f5f9' }}>
                {isKin ? 'Inkuru z\'Ishuri' : 'School Announcements'}
              </h2>
              <button
                onClick={() => setShowAnnouncement(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
                <Plus size={13} /> {isKin ? 'Inkuru Nshya' : 'New Announcement'}
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Megaphone size={32} style={{ color: '#1e293b', margin: '0 auto 12px' }} />
                <p className="text-sm" style={{ color: '#475569' }}>
                  {isKin ? 'Nta nkuru. Kanda hejuru wongeye inkuru.' : 'No announcements yet. Post one above.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="rounded-2xl p-4" style={{ background: '#13161e', border: a.pinned ? '1px solid rgba(0,212,170,0.2)' : '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0">
                        {a.pinned && <Pin size={13} style={{ color: '#00d4aa', flexShrink: 0, marginTop: 2 }} />}
                        <div className="min-w-0">
                          <p className="text-sm font-bold" style={{ color: '#f1f5f9' }}>{a.title}</p>
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: '#64748b' }}>{a.body}</p>
                          <p className="text-xs mt-2" style={{ color: '#334155' }}>
                            {new Date(a.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        disabled={deletingAnnId === a.id}
                        className="p-1.5 rounded-lg transition-all shrink-0"
                        style={{ color: '#475569' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
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
