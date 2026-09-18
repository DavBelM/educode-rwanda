import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  onLogin?: () => void;
  onSignup?: () => void;
  onSchoolSignup?: () => void;
}

// ─── Demo Request Modal ───────────────────────────────────────────────────────

function DemoModal({ onClose }: { onClose: () => void }) {
  const [schoolName, setSchoolName] = useState('');
  const [contactName, setContactName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) { setError('Please provide an email or phone number.'); return; }
    setLoading(true); setError('');
    const res = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ school_name: schoolName, contact_name: contactName, role, email, phone, message: `Students: ${studentCount}\n\n${message}` }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error ?? 'Something went wrong.'); setLoading(false); return; }
    setDone(true); setLoading(false);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
      <div className="card pad-lg" style={{ width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto' }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(158,170,132,0.12)', border: '1px solid rgba(158,170,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9eaa84" strokeWidth="2" width="24" height="24"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>We received your request</h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>
              We will reach out within 48 hours to schedule a demo and discuss how EduCode can work for your school. In the meantime, you can email <strong>belamitali@gmail.com</strong>.
            </p>
            <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Request a school demo</h2>
                <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4, lineHeight: 1.5 }}>We will set up a free pilot for your school and walk you through the platform.</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 22, lineHeight: 1, padding: '0 0 0 12px' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label className="label">School name *</label>
                <input type="text" className="input" value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. IPRC Kigali" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Your name *</label>
                  <input type="text" className="input" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="e.g. Diane Uwase" required />
                </div>
                <div className="field">
                  <label className="label">Your role</label>
                  <input type="text" className="input" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Head teacher" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Email</label>
                  <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.rw" />
                </div>
                <div className="field">
                  <label className="label">Phone</label>
                  <input type="tel" className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+250 7xx xxx xxx" />
                </div>
              </div>
              <div className="field">
                <label className="label">Approximate number of students</label>
                <input type="text" className="input" value={studentCount} onChange={e => setStudentCount(e.target.value)} placeholder="e.g. 120" />
              </div>
              <div className="field">
                <label className="label">Anything you would like us to know</label>
                <textarea className="input" style={{ minHeight: 72, resize: 'vertical' }} value={message} onChange={e => setMessage(e.target.value)} placeholder="RTB level, current challenges, questions…" />
              </div>
              {error && <p style={{ fontSize: 13, color: 'var(--error)' }}>{error}</p>}
              <button type="submit" className="btn btn-primary" disabled={!schoolName.trim() || !contactName.trim() || loading}>
                {loading ? 'Sending…' : 'Send demo request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage({ onLogin, onSignup }: Props) {
  usePageTitle('EduCode Rwanda — Digital Learning for TVET Schools');
  const { theme, toggleTheme } = useTheme();
  const [aiLang, setAiLang] = useState<'EN' | 'RW'>('EN');
  const [showDemo, setShowDemo] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ── NAV ── */}
      <header className="nav">
        <div className="nav-inner">
          <a className="logo" href="/"><span className="edu">EduCode</span><span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 6, fontWeight: 500 }}>Rwanda</span></a>

          <nav className="nav-links nav-collapse" aria-label="Main">
            <a className="nav-link" href="#for-schools">For schools</a>
            <a className="nav-link" href="#curriculum">Curriculum</a>
            <a className="nav-link" href="#how-it-works">How it works</a>
            <a className="nav-link" href="#pricing">Pricing</a>
          </nav>

          {/* Mobile nav toggle */}
          <button className="iconbtn" style={{ display: 'none' }} id="nav-toggle" onClick={() => setMobileNav(o => !o)} aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="20" height="20">
              {mobileNav ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>

          <div className="nav-right">
            <button className="iconbtn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <button className="btn btn-tertiary" onClick={onLogin}>Log in</button>
            <button className="btn btn-primary sm" onClick={() => setShowDemo(true)}>Request demo</button>
          </div>
        </div>
      </header>

      <main className="wrap">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="rise" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 99, border: '1px solid var(--line)', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9eaa84', display: 'inline-block' }} />
            RTB RQF Level 1–3 aligned · JavaScript · Bilingual EN/KIN
          </div>

          <h1 className="rise-2">Your students will pass their TVET assessments.</h1>

          <p className="lede rise-3">
            EduCode is a digital learning platform built for Rwandan technical secondary schools.
            Structured JavaScript courses, a live coding workspace, and an AI tutor — in English and Kinyarwanda —
            that helps every student when the teacher is with someone else.
          </p>

          <div className="hero-cta rise-3">
            <button className="btn btn-primary lg" onClick={() => setShowDemo(true)}>Request a free school demo</button>
            <button className="btn btn-secondary lg" onClick={onSignup}>Try it as a student</button>
          </div>

          <div className="hero-meta rise-4">
            <div className="m"><b>RTB aligned</b><span>RQF Level 1 – 3 SOD curriculum</span></div>
            <div className="m"><b>EN · KIN</b><span>Fully bilingual — switch mid-lesson</span></div>
            <div className="m"><b>Low-data</b><span>Works on shared lab computers</span></div>
            <div className="m"><b>No USB sticks</b><span>Everything runs in the browser</span></div>
          </div>

          {/* PRODUCT MOCK */}
          <div className="mock rise-4">
            <div className="mock-top">
              <span className="pill"><span className="dot"></span>Exercise · Functions</span>
              <div className="mock-tabs">
                <span className="mock-tab on">greet.js</span>
                <span className="mock-tab">console</span>
              </div>
              <button className="btn btn-primary sm mock-run">Run code</button>
            </div>
            <div className="mock-body">
              <div className="mock-editor">
                <div className="gut">
                  <span style={{ color: 'var(--text-3)' }}>{'// Greet a student by name'}</span><br/>
                  <span style={{ color: 'var(--cream)' }}>function</span>{' '}
                  <span style={{ color: 'var(--text)' }}>greet</span>
                  <span style={{ color: 'var(--text-2)' }}>{'(name) {'}</span><br/>
                  {'  '}<span style={{ color: 'var(--cream)' }}>return</span>
                  <span style={{ color: 'var(--text-2)' }}> "Muraho, " + name;</span><br/>
                  <span style={{ color: 'var(--text-2)' }}>{'}'}</span><br/><br/>
                  <span style={{ color: 'var(--text)' }}>console</span>
                  <span style={{ color: 'var(--text-2)' }}>.log(greet(</span>
                  <span style={{ color: '#cda86a' }}>'Aline'</span>
                  <span style={{ color: 'var(--text-2)' }}>));</span>
                  <span className="mock-cursor" />
                </div>
              </div>
              <div className="mock-ai">
                <div className="ai-head">
                  <div className="ai-who"><span className="ai-mwicon">M</span>Mwarimu</div>
                  <div className="lang-toggle">
                    <button className={aiLang === 'EN' ? 'on' : ''} onClick={() => setAiLang('EN')}>EN</button>
                    <button className={aiLang === 'RW' ? 'on' : ''} onClick={() => setAiLang('RW')}>RW</button>
                  </div>
                </div>
                {aiLang === 'EN' ? (
                  <p className="ai-msg"><b>Nice — your function returns a value.</b> One thing to try: what happens if you call <span className="code-inline">greet()</span> with no name? Add a default so it never breaks.</p>
                ) : (
                  <p className="ai-msg"><b>Byiza — umurimo wawe usubiza agaciro.</b> Gerageza: bigenda bite iyo uhamagaye <span className="code-inline">greet()</span> nta zina? Ongeraho agaciro fatizo.</p>
                )}
                <div style={{ marginTop: 'auto', display: 'flex', gap: 8, paddingTop: 12 }}>
                  <button className="btn btn-secondary sm">Hint</button>
                  <button className="btn btn-tertiary sm">Explain more</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOR SCHOOLS ── */}
        <section className="section" id="for-schools">
          <div className="section-head reveal">
            <p className="eyebrow">For teachers and school administrators</p>
            <h2>Run a full class — assignments, grades, attendance — without collecting a single USB stick.</h2>
            <p>
              Everything your teachers need is in one place. Set up a class in under five minutes,
              share an invite code, and your students are ready to code.
            </p>
          </div>

          <div className="grid g-3">
            <article className="card feat reveal">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
              <h3>Grade book</h3>
              <p>See every student's submission and score in a spreadsheet view. Release grades when ready — students see nothing until you publish.</p>
            </article>
            <article className="card feat reveal d1">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <h3>Class management</h3>
              <p>Create multiple classes, generate invite codes, and see per-student progress at a glance. Works for lab sessions and remote learners.</p>
            </article>
            <article className="card feat reveal d2">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              <h3>Attendance tracking</h3>
              <p>Mark attendance digitally — no paper registers. See class history and individual records. Export to PDF for school records.</p>
            </article>
            <article className="card feat reveal d3">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <h3>Assignments + feedback</h3>
              <p>Post coding and theoretical assignments, review student submissions, and write per-student feedback. Draft before publishing so students never see incomplete work.</p>
            </article>
            <article className="card feat reveal d4">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18M7 14l3-4 4 3 5-7"/></svg>
              <h3>AI-generated class reports</h3>
              <p>One click gives you a plain-language summary of your class performance, who is at risk of falling behind, and where everyone is stuck.</p>
            </article>
            <article className="card feat reveal d5">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              <h3>Announcements + resources</h3>
              <p>Post class announcements with an optional link — slides, a video, a reference document. Students see it in their dashboard immediately.</p>
            </article>
          </div>

          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <button className="btn btn-primary lg" onClick={() => setShowDemo(true)}>Get a free demo for your school</button>
          </div>
        </section>

        {/* ── CURRICULUM ── */}
        <section className="section" id="curriculum">
          <div className="split reveal" style={{ alignItems: 'flex-start' }}>
            <div>
              <p className="eyebrow">RTB-aligned curriculum</p>
              <h2 style={{ fontSize: 'clamp(26px,3.4vw,36px)', letterSpacing: '-0.03em' }}>
                Every lesson maps to the RTB RQF assessment criteria.
              </h2>
              <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
                EduCode is built around the Rwanda TVET Board's Software Development curriculum.
                Your students practise exactly the skills they are assessed on — not generic
                coding exercises from a platform built for another market.
              </p>
              <ul style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'JavaScript fundamentals (variables, functions, arrays, objects)',
                  'Version control with Git and GitHub (SWDVC301)',
                  'Project requirements and user stories (SWDPR301)',
                  'UI/UX design with Figma (SWDUX301)',
                  'Vue.js framework and SPA development (SWDVF301)',
                  'Graphic design with Photoshop and Illustrator (GENGD301)',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9eaa84" strokeWidth="2" width="16" height="16" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* RTB level cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
              {[
                { level: 'RQF Level 1', label: 'Foundation', desc: 'Variables, functions, loops, basic DOM manipulation. First programs that actually run.', color: '#7eb8cf' },
                { level: 'RQF Level 2', label: 'Applied', desc: 'Arrays, objects, APIs, debugging, HTML/CSS layouts, version control basics.', color: '#9eaa84' },
                { level: 'RQF Level 3', label: 'Professional', desc: 'Vue.js SPA development, Figma UI design, Git collaboration workflows, requirements analysis.', color: '#cda86a' },
              ].map(tier => (
                <div key={tier.level} className="card pad-lg reveal" style={{ borderLeft: `3px solid ${tier.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: tier.color }}>{tier.level}</span>
                    <span className="pill" style={{ fontSize: 11 }}>{tier.label}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55 }}>{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section" id="how-it-works">
          <div className="section-head reveal">
            <p className="eyebrow">How it works</p>
            <h2>Up and running in one class period.</h2>
            <p>No installation, no IT department, no training. If your school has a browser, EduCode works.</p>
          </div>

          <div className="grid g-3" style={{ counterReset: 'steps' }}>
            {[
              { title: 'Teacher creates a class', body: 'Sign up, create a class for your intake, and copy the 6-character invite code. Takes under three minutes.' },
              { title: 'Students join on any device', body: 'Students open educode-rwanda.vercel.app on any browser — laptop, school tablet, or phone — and enter the code.' },
              { title: 'Assign, monitor, grade', body: 'Post an assignment, watch submissions arrive in real time, grade with one-click feedback, and release grades when ready.' },
            ].map((step, i) => (
              <article key={step.title} className="card feat reveal" style={{ counterIncrement: 'steps' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
                  {i + 1}
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── BILINGUAL AI ── */}
        <section className="section" id="bilingual">
          <div className="split reveal">
            <div>
              <p className="eyebrow">The AI tutor</p>
              <h2 style={{ fontSize: 'clamp(26px,3.4vw,36px)', letterSpacing: '-0.03em' }}>
                Mwarimu — always available, never gives away the answer.
              </h2>
              <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: 'var(--text-2)' }}>
                When a student is stuck and you are with another group, Mwarimu steps in.
                It reads their code, identifies the real mistake, and guides them with a hint —
                not the solution. It never writes code for students.
              </p>
              <ul style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Explains errors in plain language — no jargon',
                  'Switch to Kinyarwanda for any explanation, mid-lesson',
                  'Knows when a student is on a quiz and stays silent on answers',
                  'Available everywhere: lessons, assignments, and the dashboard',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9eaa84" strokeWidth="2" width="16" height="16" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card pad-lg">
              <div className="ai-head" style={{ marginBottom: 16 }}>
                <div className="ai-who" style={{ fontSize: 14 }}><span className="ai-mwicon">M</span>Mwarimu · explaining an error</div>
              </div>
              <div className="code plain" style={{ marginBottom: 16 }}>
                <span style={{ color: 'var(--text)' }}>total</span>
                <span style={{ color: 'var(--text-2)' }}> = price * qty;</span><br/>
                <span style={{ color: 'var(--text-3)' }}>{'// ReferenceError: price is not defined'}</span>
              </div>
              <p className="ai-msg" style={{ fontSize: '14.5px' }}>
                <b>The name <span className="code-inline">price</span> doesn't exist yet.</b>{' '}
                You used it before declaring it. Where should the declaration go, and what keyword will you use?
              </p>
              <div className="divider" style={{ margin: '16px 0' }} />
              <p className="ai-msg" style={{ fontSize: '14.5px' }}>
                <b>Izina <span className="code-inline">price</span> ntiriraho.</b>{' '}
                Wararikoresheje mbere yo kugitangaza. Ni hehe ugomba kugishyira, kandi ni ikihe ijambo uzakoresha?
              </p>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="section" id="pricing">
          <div className="section-head reveal">
            <p className="eyebrow">Pricing</p>
            <h2>Simple, school-friendly pricing.</h2>
            <p>Start free. Scale when you are ready. No per-student fees, no hidden charges.</p>
          </div>

          <div className="grid g-3" style={{ alignItems: 'stretch' }}>
            {/* Free */}
            <div className="card pad-lg reveal" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 8 }}>Free trial</p>
                <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>0 RWF</p>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>30 days, 1 class, up to 40 students</p>
              </div>
              <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {['Full platform access', 'Mwarimu AI tutor', 'Grade book + attendance', 'All RTB Level 1–3 courses', 'Email support'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 13.5, color: 'var(--text-2)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9eaa84" strokeWidth="2.2" width="14" height="14"><path d="M20 6 9 17l-5-5"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary btn-block" onClick={() => setShowDemo(true)}>Start free trial</button>
            </div>

            {/* School — highlighted */}
            <div className="card pad-lg reveal d1" style={{ display: 'flex', flexDirection: 'column', border: '2px solid var(--text)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--text)', color: 'var(--bg)', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                Most popular
              </div>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 8 }}>School plan</p>
                <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>80,000 <span style={{ fontSize: 16, fontWeight: 500 }}>RWF</span></p>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>per month · unlimited students</p>
              </div>
              <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {['Everything in Free', 'Unlimited classes', 'School admin dashboard', 'AI class performance reports', 'Attendance + progress exports', 'Priority support + onboarding call'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 13.5, color: 'var(--text-2)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9eaa84" strokeWidth="2.2" width="14" height="14"><path d="M20 6 9 17l-5-5"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary btn-block" onClick={() => setShowDemo(true)}>Request a demo</button>
            </div>

            {/* Government / Enterprise */}
            <div className="card pad-lg reveal d2" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: 8 }}>Government / NGO</p>
                <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>Custom</p>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>District or national rollout</p>
              </div>
              <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {['All school features', 'Multi-school admin panel', 'District-level reporting', 'Custom curriculum modules', 'Data hosting in Rwanda (on request)', 'Dedicated account manager'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 13.5, color: 'var(--text-2)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9eaa84" strokeWidth="2.2" width="14" height="14"><path d="M20 6 9 17l-5-5"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary btn-block" onClick={() => setShowDemo(true)}>Contact us</button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)', marginTop: 24 }}>
            Prices are in Rwandan Francs. Annual billing available at 2 months free. MTN Mobile Money accepted.
          </p>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="section">
          <div className="cta-band reveal">
            <p className="eyebrow" style={{ marginBottom: 14 }}>Ready to bring this to your school?</p>
            <h2>Start with a free 30-day pilot. No commitment required.</h2>
            <p>
              We will set up your school, walk your teachers through the platform in one session,
              and support you through the pilot. If it doesn't work for your students, you pay nothing.
            </p>
            <div className="row" style={{ justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary lg" onClick={() => setShowDemo(true)}>Request a school demo</button>
              <button className="btn btn-secondary lg" onClick={onSignup}>Try it as a student first</button>
            </div>
          </div>
        </section>

      </main>

      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}

      <footer className="site-footer">
        <div className="wrap foot">
          <div>
            <div className="logo" style={{ marginBottom: 8 }}><span className="edu">EduCode</span><span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 6 }}>Rwanda</span></div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>Digital learning for Rwandan TVET schools.<br/>RTB RQF Level 1–3 aligned.</p>
          </div>
          <div className="foot-links">
            <a href="#for-schools">For schools</a>
            <a href="#pricing">Pricing</a>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', padding: 0 }} onClick={onLogin}>Log in</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', padding: 0 }} onClick={onSignup}>Sign up</button>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--line)', marginTop: 32, paddingTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
          © {new Date().getFullYear()} EduCode Rwanda · belamitali@gmail.com
        </div>
      </footer>
    </>
  );
}
