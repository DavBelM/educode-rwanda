import { useState } from 'react';
import { Link } from 'react-router';
import { Lock, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createSchool, linkProfileToSchool } from '../lib/db';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export default function SchoolSignupPage() {
  usePageTitle('School Sign Up · EduCode Rwanda');
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    schoolName: '', schoolType: '', location: '', studentCount: '',
    fullName: '', position: '', email: '', phone: '', password: '', challenges: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { data: school, error: schoolErr } = await createSchool({
      name: formData.schoolName, location: formData.location, contactEmail: formData.email,
    });
    if (schoolErr || !school) { setError(schoolErr ?? 'Failed to create school'); setLoading(false); return; }
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: formData.email, password: formData.password,
      options: { data: { full_name: formData.fullName, user_type: 'school_admin', preferred_language: 'en' } },
    });
    if (authErr || !authData.user) { setError(authErr?.message ?? 'Signup failed'); setLoading(false); return; }
    await linkProfileToSchool(authData.user.id, school.id);
    setLoading(false);
    setSuccess(true);
  };

  const faqs = [
    { q: 'How much does it cost?', a: 'Free for 30 days, no credit card required. After that, 80,000 RWF/month for unlimited students and classes.' },
    { q: 'Do we need special computers?', a: 'No. EduCode runs in any browser — school lab computers, tablets, or phones. No installation needed.' },
    { q: 'Can students use it at home?', a: 'Yes. Students log in from any device. Their progress syncs automatically.' },
    { q: 'What support do you provide?', a: 'We do an onboarding call with your teachers, set up your first class together, and are available via email and phone.' },
    { q: 'Is it aligned with the RTB curriculum?', a: 'Yes. All courses map to the Rwanda TVET Board RQF Level 1–3 Software Development outcomes (SWDVC301, SWDPR301, SWDUX301, SWDVF301).' },
  ];

  return (
    <>
      {/* ── NAV ── */}
      <header className="nav">
        <div className="nav-inner">
          <Link className="logo" to="/"><span className="edu">EduCode</span><span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 6 }}>Rwanda</span></Link>
          <div className="nav-right">
            <button className="iconbtn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark'
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
            </button>
            <Link className="btn btn-tertiary" to="/login">Log in</Link>
          </div>
        </div>
      </header>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="auth">

        {/* ── LEFT: PITCH ── */}
        <aside className="auth-aside">
          <div>
            <p className="eyebrow" style={{ marginBottom: 20 }}>For school administrators</p>
            <h2 style={{ fontSize: 'clamp(24px, 2.6vw, 38px)', letterSpacing: '-0.03em', lineHeight: 1.12, maxWidth: '18ch' }}>
              Bring EduCode to your school.
            </h2>
            <p style={{ color: 'var(--text-2)', marginTop: 16, fontSize: 15, lineHeight: 1.65, maxWidth: '42ch' }}>
              Give your teachers a full digital classroom — assignments, grading, attendance, and an AI tutor that speaks Kinyarwanda. Built for Rwanda's TVET curriculum.
            </p>

            <ul style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none', padding: 0 }}>
              {[
                { title: 'RTB RQF Level 1–3 aligned', desc: 'Every lesson maps to TVET Board assessment criteria.' },
                { title: 'Mwarimu AI — EN & Kinyarwanda', desc: 'Students get instant help in the language they think in.' },
                { title: 'No installation, no USB sticks', desc: 'Works in any browser. Your lab computers are ready now.' },
                { title: 'Teacher dashboard + grade book', desc: 'Post assignments, grade work, track attendance digitally.' },
              ].map(item => (
                <li key={item.title} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ marginTop: 3, flexShrink: 0 }}>
                    <CheckCircle2 size={16} style={{ color: '#9eaa84' }} />
                  </span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* What happens after */}
          <div style={{ marginTop: 40, padding: '20px 22px', borderRadius: 'var(--radius)', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: 14 }}>What happens next</p>
            {[
              'We review your signup within 24 hours',
              'Onboarding call to set up your first class',
              'Your 30-day free trial begins',
            ].map((step, i) => (
              <div key={step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 2 ? 12 : 0 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text)', flexShrink: 0 }}>{i + 1}</span>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, paddingTop: 2 }}>{step}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 28 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--text-2)', fontWeight: 500 }}>Log in</Link>
          </p>
        </aside>

        {/* ── RIGHT: FORM ── */}
        <main className="auth-main">
          <div style={{ width: '100%', maxWidth: 460 }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(158,170,132,0.12)', border: '1px solid rgba(158,170,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={24} style={{ color: '#9eaa84' }} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>School account created!</h2>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 6 }}>
                  Log in with the email and password you just set. You will land directly on your school admin dashboard.
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 28 }}>
                  We will reach out within 24 hours to help you set up your first class.
                </p>
                <Link to="/login" className="btn btn-primary lg" style={{ display: 'inline-flex' }}>Go to login →</Link>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 6 }}>Create your school account</h1>
                <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 28, lineHeight: 1.5 }}>
                  30-day free trial · No credit card · Full platform access
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* ── School info ── */}
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: -4 }}>School</p>

                  <div className="field">
                    <label className="label">School name *</label>
                    <input type="text" className="input" value={formData.schoolName} onChange={e => set('schoolName', e.target.value)} placeholder="e.g. IPRC Kigali" required />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="field">
                      <label className="label">School type *</label>
                      <select className="select" value={formData.schoolType} onChange={e => set('schoolType', e.target.value)} required>
                        <option value="">Select type</option>
                        <option value="tvet">TVET</option>
                        <option value="secondary">Secondary school</option>
                        <option value="university">University</option>
                        <option value="training">Training center</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">District *</label>
                      <select className="select" value={formData.location} onChange={e => set('location', e.target.value)} required>
                        <option value="">Select district</option>
                        <option value="kigali">Kigali</option>
                        <option value="huye">Huye</option>
                        <option value="musanze">Musanze</option>
                        <option value="rubavu">Rubavu</option>
                        <option value="nyanza">Nyanza</option>
                        <option value="rwamagana">Rwamagana</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Approximate number of students *</label>
                    <select className="select" value={formData.studentCount} onChange={e => set('studentCount', e.target.value)} required>
                      <option value="">Select range</option>
                      <option value="1-50">1 – 50</option>
                      <option value="50-100">50 – 100</option>
                      <option value="100-200">100 – 200</option>
                      <option value="200-500">200 – 500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>

                  {/* ── Contact person ── */}
                  <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: -4 }}>Your details</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="field">
                      <label className="label">Your name *</label>
                      <input type="text" className="input" value={formData.fullName} onChange={e => set('fullName', e.target.value)} placeholder="e.g. Diane Uwase" required />
                    </div>
                    <div className="field">
                      <label className="label">Your position</label>
                      <input type="text" className="input" value={formData.position} onChange={e => set('position', e.target.value)} placeholder="Head teacher" />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Work email *</label>
                    <input type="email" className="input" value={formData.email} onChange={e => set('email', e.target.value)} placeholder="you@school.ac.rw" required />
                  </div>

                  <div className="field">
                    <label className="label">Phone number *</label>
                    <input type="tel" className="input" value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="+250 7xx xxx xxx" required />
                  </div>

                  {/* ── Account ── */}
                  <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginBottom: -4 }}>Set your password</p>

                  <div className="field">
                    <label className="label">Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw ? 'text' : 'password'}
                        className="input"
                        value={formData.password}
                        onChange={e => set('password', e.target.value)}
                        placeholder="Min. 8 characters"
                        minLength={8}
                        style={{ paddingRight: 44 }}
                        required
                      />
                      <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 0 }}>
                        {showPw
                          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>}
                      </button>
                    </div>
                  </div>

                  {/* ── Optional ── */}
                  <div className="field">
                    <label className="label">Current challenges <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></label>
                    <textarea className="input" style={{ minHeight: 72, resize: 'vertical' }} value={formData.challenges} onChange={e => set('challenges', e.target.value)} placeholder="What problems are you trying to solve for your students?" />
                  </div>

                  {error && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'rgba(239,68,68,0.08)', color: 'var(--error)', fontSize: 13, border: '1px solid rgba(239,68,68,0.2)' }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary btn-block lg" disabled={loading || !formData.schoolName || !formData.email || !formData.password || formData.password.length < 8}>
                    {loading ? 'Creating account…' : <>Create school account <ArrowRight size={16} /></>}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: -4 }}>
                    By signing up you agree to our{' '}
                    <Link to="/terms" style={{ color: 'var(--text-2)' }}>Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" style={{ color: 'var(--text-2)' }}>Privacy Policy</Link>.
                  </p>
                </form>

                {/* FAQ */}
                <div style={{ marginTop: 40, borderTop: '1px solid var(--line)', paddingTop: 28 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Common questions</p>
                  {faqs.map((faq, i) => (
                    <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13.5, fontWeight: 500, color: 'var(--text)', gap: 10 }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={15} style={{ flexShrink: 0, transition: 'transform 0.2s', transform: expandedFAQ === i ? 'rotate(180deg)' : 'none', color: 'var(--text-3)' }} />
                      </button>
                      {expandedFAQ === i && (
                        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, paddingBottom: 12 }}>{faq.a}</p>
                      )}
                    </div>
                  ))}
                </div>

              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
