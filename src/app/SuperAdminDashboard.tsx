import { useState, useEffect } from 'react';
import { Loader, Plus, Download, Building2, X, Check, Inbox } from 'lucide-react';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey      = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase     = createClient(supabaseUrl, anonKey);

// ── Types ─────────────────────────────────────────────────────────────────────

interface School { id: string; name: string; location: string | null; contact_email: string; created_at: string; }
interface CohortRow { cohort_tag: string; event_count: number; student_count: number; last_event_at: string; }
interface Lead { id: string; school_name: string; contact_name: string; role: string | null; email: string | null; phone: string | null; message: string | null; followed_up: boolean; created_at: string; }

// ── Create School Modal ────────────────────────────────────────────────────────

function CreateSchoolModal({ onClose, onCreated }: { onClose: () => void; onCreated: (s: School) => void }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contactEmail.trim()) return;
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('schools')
      .insert({ name: name.trim(), location: location.trim() || null, contact_email: contactEmail.trim() })
      .select()
      .single();
    if (err) { setError(err.message); setLoading(false); return; }
    onCreated(data as School);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-head">
          <h2 className="card-title">New School</h2>
          <button onClick={onClose} className="iconbtn"><X size={18} /></button>
        </div>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          <div className="field">
            <label className="label">School name</label>
            <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. IPRC Kigali" autoFocus />
          </div>
          <div className="field">
            <label className="label">Location (optional)</label>
            <input type="text" className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Kigali" />
          </div>
          <div className="field">
            <label className="label">Contact email</label>
            <input type="email" className="input" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="admin@school.rw" />
          </div>
          {error && <p style={{ fontSize: 13, color: 'var(--error, #f87171)' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={!name.trim() || !contactEmail.trim() || loading}>
            {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create school'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Create School Admin Modal ──────────────────────────────────────────────────

function CreateSchoolAdminModal({ schools, onClose, onCreated }: {
  schools: School[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [schoolId, setSchoolId] = useState(schools[0]?.id ?? '');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolId || !fullName.trim() || !email.trim() || password.length < 6) return;
    setLoading(true);
    setError('');
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token ?? ''}` },
      body: JSON.stringify({ school_id: schoolId, full_name: fullName.trim(), email: email.trim(), password }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error ?? 'Failed to create account'); setLoading(false); return; }
    setDone(true);
    onCreated();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-head">
          <h2 className="card-title">New School Admin</h2>
          <button onClick={onClose} className="iconbtn"><X size={18} /></button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>School admin account created.</p>
            <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <div className="field">
              <label className="label">School</label>
              <select className="select" value={schoolId} onChange={e => setSchoolId(e.target.value)}>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Full name</label>
              <input type="text" className="input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Diane Uwase" autoFocus />
            </div>
            <div className="field">
              <label className="label">Email (login)</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.rw" />
            </div>
            <div className="field">
              <label className="label">Temporary password</label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
            </div>
            {error && <p style={{ fontSize: 13, color: 'var(--error, #f87171)' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={!schoolId || !fullName.trim() || !email.trim() || password.length < 6 || loading}>
              {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Create admin account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────

export default function SuperAdminDashboard() {
  usePageTitle('Super Admin · EduCode');
  const [schools, setSchools] = useState<School[]>([]);
  const [cohorts, setCohorts] = useState<CohortRow[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSchool, setShowCreateSchool] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data: sc }, { data: co }, { data: ld }] = await Promise.all([
        supabase.from('schools').select('*').order('created_at', { ascending: false }),
        supabase.from('learning_events').select('cohort_tag').not('cohort_tag', 'is', null),
        supabase.from('school_leads').select('*').order('created_at', { ascending: false }),
      ]);
      setLeads((ld ?? []) as Lead[]);
      setSchools((sc ?? []) as School[]);

      // Aggregate cohort stats client-side (small dataset)
      const map = new Map<string, { count: number; students: Set<string>; last: string }>();
      for (const row of co ?? []) {
        const tag = row.cohort_tag as string;
        if (!map.has(tag)) map.set(tag, { count: 0, students: new Set(), last: '' });
        const entry = map.get(tag)!;
        entry.count++;
      }
      // Enrich with student counts and last event per cohort
      const { data: enriched } = await supabase
        .from('learning_events')
        .select('cohort_tag, student_id, created_at')
        .not('cohort_tag', 'is', null);
      const richMap = new Map<string, { count: number; students: Set<string>; last: string }>();
      for (const row of enriched ?? []) {
        const tag = row.cohort_tag as string;
        if (!richMap.has(tag)) richMap.set(tag, { count: 0, students: new Set(), last: '' });
        const e = richMap.get(tag)!;
        e.count++;
        e.students.add(row.student_id as string);
        if (!e.last || (row.created_at as string) > e.last) e.last = row.created_at as string;
      }
      setCohorts([...richMap.entries()].map(([tag, v]) => ({
        cohort_tag: tag,
        event_count: v.count,
        student_count: v.students.size,
        last_event_at: v.last,
      })).sort((a, b) => b.last_event_at.localeCompare(a.last_event_at)));

      setLoading(false);
    }
    load();
  }, []);

  function handleExportCohort(tag: string) {
    // Calls the export_events RPC via Supabase (service role is needed server-side for full export;
    // here we export what this admin can see via their authenticated session)
    supabase.rpc('export_events', { p_cohort_tag: tag }).then(({ data }) => {
      if (!data?.length) { alert('No events to export for this cohort yet.'); return; }
      const keys = Object.keys(data[0] as object);
      const rows = (data as object[]).map(r => keys.map(k => JSON.stringify((r as Record<string, unknown>)[k] ?? '')).join(','));
      const csv = [keys.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tag}_events.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppNav />
      <div className="wrap page">
        <div className="thead rise" style={{ marginBottom: 32 }}>
          <div>
            <h1>Super Admin</h1>
            <p className="sub">Control seat — schools, admins, cohort exports.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary sm" onClick={() => setShowCreateSchool(true)}>
              <Building2 size={14} style={{ marginRight: 6 }} />New school
            </button>
            <button className="btn btn-primary sm" onClick={() => setShowCreateAdmin(true)} disabled={schools.length === 0}>
              <Plus size={14} style={{ marginRight: 6 }} />New school admin
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-3)' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>

            {/* Schools */}
            <section className="card pad-lg rise">
              <div className="card-head" style={{ marginBottom: 16 }}>
                <h2 className="card-title">Schools</h2>
                <span className="pill">{schools.length}</span>
              </div>
              {schools.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--text-3)' }}>No schools yet. Create one above.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {schools.map(s => (
                    <div key={s.id} style={{ padding: '12px 14px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{s.name}</div>
                      {s.location && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.location}</div>}
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.contact_email}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Cohorts */}
            <section className="card pad-lg rise">
              <div className="card-head" style={{ marginBottom: 16 }}>
                <h2 className="card-title">Cohorts</h2>
                <span className="pill">{cohorts.length}</span>
              </div>
              {cohorts.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--text-3)' }}>No events recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cohorts.map(c => (
                    <div key={c.cohort_tag} style={{ padding: '12px 14px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{c.cohort_tag}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                          {c.student_count} students · {c.event_count.toLocaleString()} events
                        </div>
                      </div>
                      <button
                        className="btn btn-tertiary sm"
                        onClick={() => handleExportCohort(c.cohort_tag)}
                        title="Export events CSV"
                        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        <Download size={13} />CSV
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* School leads */}
            <section className="card pad-lg rise" style={{ gridColumn: '1 / -1' }}>
              <div className="card-head" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Inbox size={18} style={{ color: 'var(--text-2)' }} />
                  <h2 className="card-title">School enquiries</h2>
                </div>
                <span className="pill">{leads.filter(l => !l.followed_up).length} new</span>
              </div>
              {leads.length === 0 ? (
                <p style={{ fontSize: 14, color: 'var(--text-3)' }}>No enquiries yet. The "Contact us for schools" button on the landing page sends leads here.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {leads.map(lead => (
                    <div key={lead.id} style={{ padding: '14px 16px', borderRadius: 'var(--radius)', background: lead.followed_up ? 'var(--surface)' : 'var(--accent-soft)', border: `1px solid ${lead.followed_up ? 'var(--line)' : 'var(--accent)'}`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>
                          {lead.school_name}
                          {lead.followed_up && <span className="pill" style={{ marginLeft: 8, fontSize: 11 }}>✓ followed up</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginBottom: 4 }}>
                          {lead.contact_name}{lead.role ? ` · ${lead.role}` : ''}
                        </div>
                        {(lead.email || lead.phone) && (
                          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                            {lead.email && <span>{lead.email}</span>}
                            {lead.email && lead.phone && <span> · </span>}
                            {lead.phone && <span>{lead.phone}</span>}
                          </div>
                        )}
                        {lead.message && (
                          <p style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 8, fontStyle: 'italic' }}>"{lead.message}"</p>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
                          {new Date(lead.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {!lead.followed_up && (
                        <button
                          className="btn btn-tertiary sm"
                          style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}
                          onClick={async () => {
                            await supabase.from('school_leads').update({ followed_up: true }).eq('id', lead.id);
                            setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, followed_up: true } : l));
                          }}
                        >
                          <Check size={13} />Mark followed up
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {showCreateSchool && (
        <CreateSchoolModal
          onClose={() => setShowCreateSchool(false)}
          onCreated={s => { setSchools(prev => [s, ...prev]); setShowCreateSchool(false); }}
        />
      )}

      {showCreateAdmin && (
        <CreateSchoolAdminModal
          schools={schools}
          onClose={() => setShowCreateAdmin(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
}
