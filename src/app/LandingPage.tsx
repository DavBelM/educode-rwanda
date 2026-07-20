import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  onLogin?: () => void;
  onSignup?: () => void;
  onSchoolSignup?: () => void;
}

export default function LandingPage({ onLogin, onSignup, onSchoolSignup }: Props) {
  usePageTitle('EduCode Rwanda — Learn to Code');
  const { theme, toggleTheme } = useTheme();
  const [aiLang, setAiLang] = useState<'EN' | 'RW'>('EN');

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* NAV */}
      <header className="nav">
        <div className="nav-inner">
          <a className="logo" href="/"><span className="edu">EduCode</span></a>
          <nav className="nav-links nav-collapse" aria-label="Main">
            <a className="nav-link" href="#platform">Platform</a>
            <a className="nav-link" href="#bilingual">Bilingual</a>
            <a className="nav-link" href="#teachers">For schools</a>
          </nav>
          <div className="nav-right">
            <button
              className="iconbtn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'light'}
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="btn btn-tertiary" onClick={onLogin}>Log in</button>
            <button className="btn btn-primary sm" onClick={onSignup}>Get started</button>
          </div>
        </div>
      </header>

      <main className="wrap">
        {/* HERO */}
        <section className="hero">
          <p className="eyebrow rise">JavaScript for Rwandan TVET</p>
          <h1 className="rise-2">Learn to code on the tools real developers use.</h1>
          <p className="lede rise-3">
            EduCode is a JavaScript learning platform for technical secondary schools — structured courses,
            a proper code workspace, and an AI tutor that explains your mistakes in English or Kinyarwanda.
          </p>
          <div className="hero-cta rise-3">
            <button className="btn btn-primary lg" onClick={onSignup}>Start learning free</button>
            <Link to="/courses" className="btn btn-secondary lg">Browse the courses</Link>
          </div>
          <div className="hero-meta rise-4">
            <div className="m"><b>40+</b><span>Guided lessons</span></div>
            <div className="m"><b>EN · RW</b><span>Feedback in two languages</span></div>
            <div className="m"><b>Low-data</b><span>Built for shared lab computers</span></div>
          </div>

          {/* PRODUCT MOCK */}
          <div className="mock rise-4">
            <div className="mock-top">
              <span className="pill"><span className="dot"></span>Exercise 3 · Functions</span>
              <div className="mock-tabs">
                <span className="mock-tab on">greet.js</span>
                <span className="mock-tab">console</span>
              </div>
              <button className="btn btn-primary sm mock-run">Run code</button>
            </div>
            <div className="mock-body">
              <div className="mock-editor">
                <div className="gut">
                  <span style={{ color: 'var(--text-3)' }}>{'// Greet a learner by name'}</span><br/>
                  <span style={{ color: 'var(--cream)' }}>function</span>{' '}
                  <span style={{ color: 'var(--text)' }}>greet</span>
                  <span style={{ color: 'var(--text-2)' }}>{'('}</span>
                  <span style={{ color: 'var(--text)' }}>name</span>
                  <span style={{ color: 'var(--text-2)' }}>{')'} {'{'}</span><br/>
                  {'  '}<span style={{ color: 'var(--cream)' }}>const</span>{' '}
                  <span style={{ color: 'var(--text)' }}>message</span>
                  <span style={{ color: 'var(--text-2)' }}> = </span>
                  <span style={{ color: 'var(--text-2)' }}>"Muraho, " + name;</span><br/>
                  {'  '}<span style={{ color: 'var(--cream)' }}>return</span>
                  <span style={{ color: 'var(--text-2)' }}> message;</span><br/>
                  <span style={{ color: 'var(--text-2)' }}>{'}'}</span><br/>
                  <br/>
                  <span style={{ color: 'var(--text)' }}>greet</span>
                  <span style={{ color: 'var(--text-2)' }}>{"('Aline');"}</span>
                  <span className="mock-cursor" />
                </div>
              </div>
              <div className="mock-ai">
                <div className="ai-head">
                  <div className="ai-who">
                    <span className="ai-mwicon">M</span>Mwarimu
                  </div>
                  <div className="lang-toggle">
                    <button className={aiLang === 'EN' ? 'on' : ''} onClick={() => setAiLang('EN')}>EN</button>
                    <button className={aiLang === 'RW' ? 'on' : ''} onClick={() => setAiLang('RW')}>RW</button>
                  </div>
                </div>
                {aiLang === 'EN' ? (
                  <p className="ai-msg">
                    <b>Nice — your function returns a value.</b> One thing to try: what happens if you call{' '}
                    <span className="code-inline">greet()</span> with no name? Add a default so it never breaks.
                  </p>
                ) : (
                  <p className="ai-msg">
                    <b>Byiza — umurimo wawe usubiza agaciro.</b> Gerageza ikintu kimwe: bigenda bite iyo uhamagaye{' '}
                    <span className="code-inline">greet()</span> nta zina? Ongeraho agaciro fatizo kugira ngo idapfa.
                  </p>
                )}
                <div style={{ marginTop: 'auto', display: 'flex', gap: 8, paddingTop: 12 }}>
                  <button className="btn btn-secondary sm">Give me a hint</button>
                  <button className="btn btn-tertiary sm">Explain more</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM / FEATURES */}
        <section className="section" id="platform">
          <div className="section-head reveal">
            <p className="eyebrow">The platform</p>
            <h2>
              Everything between a first{' '}
              <span className="mono" style={{ fontSize: '0.82em' }}>console.log</span>{' '}
              and a working program.
            </h2>
            <p>
              Each part is designed to feel like professional software, not a toy — so the habits you
              build here transfer to the real world.
            </p>
          </div>
          <div className="grid g-3">
            <article className="card feat reveal">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h16M4 12h16M4 19h10"/>
              </svg>
              <h3>Structured courses</h3>
              <p>Lessons and exercises ordered from fundamentals to real projects, each with a clear goal and a checkpoint before you move on.</p>
            </article>
            <article className="card feat reveal d1">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zM5 21a7 7 0 0 1 14 0"/>
              </svg>
              <h3>An AI tutor, bilingual</h3>
              <p>Mwarimu reads your code, points out the real mistake, and offers a hint before the fix — switching between English and Kinyarwanda instantly.</p>
            </article>
            <article className="card feat reveal d2">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/><path d="M9 12h6"/>
              </svg>
              <h3>A real workspace</h3>
              <p>Write code in a proper editor with syntax highlighting and a live console — the same shape of tools you will use as a junior developer.</p>
            </article>
            <article className="card feat reveal d3">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              <h3>Exam mode</h3>
              <p>A focused assessment view with the tutor stepped back, so teachers can measure what each student can do on their own.</p>
            </article>
            <article className="card feat reveal d4">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18M7 14l3-4 4 3 5-7"/>
              </svg>
              <h3>Teacher dashboard</h3>
              <p>Classes, assignments, and per-student progress in one place — see who is stuck and where, without collecting a single file.</p>
            </article>
            <article className="card feat reveal d5">
              <svg className="fi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8-4.3-4.1 5.9-.9z"/>
              </svg>
              <h3>Quiet progress</h3>
              <p>XP and daily streaks track your momentum without the noise — a thin counter and a clear next step, never confetti.</p>
            </article>
          </div>
        </section>

        {/* BILINGUAL SPLIT */}
        <section className="section" id="bilingual">
          <div className="split reveal">
            <div>
              <p className="eyebrow">Feedback that meets you halfway</p>
              <h2 style={{ fontSize: 'clamp(26px,3.4vw,34px)', letterSpacing: '-0.03em' }}>
                Read the explanation in the language you think in.
              </h2>
              <p className="muted" style={{ marginTop: 14, fontSize: 16, lineHeight: 1.6 }}>
                Every hint, error explanation, and lesson summary has a one-tap switch between English and
                Kinyarwanda. Nothing reloads, and you never lose your place.
              </p>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span><b>Per-message, not per-account.</b> Switch one explanation to Kinyarwanda and keep the rest in English.</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span><b>Code terms stay in English.</b> You still learn the vocabulary the industry uses.</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span><b>Works on slow connections.</b> Translations are lightweight and cache for the lesson.</span>
                </li>
              </ul>
            </div>
            <div className="card pad-lg">
              <div className="ai-head" style={{ marginBottom: 16 }}>
                <div className="ai-who" style={{ fontSize: 14 }}>
                  <span className="ai-mwicon">M</span>Mwarimu · explaining an error
                </div>
              </div>
              <div className="code plain" style={{ marginBottom: 16 }}>
                <span style={{ color: 'var(--text)' }}>total</span>
                <span style={{ color: 'var(--text-2)' }}> = price * qty;</span><br/>
                <span style={{ color: 'var(--text-3)' }}>{'// ReferenceError: price is not defined'}</span>
              </div>
              <p className="ai-msg" style={{ fontSize: '14.5px' }}>
                <b>The name <span className="code-inline">price</span> doesn't exist yet.</b>{' '}
                You used it before declaring it. Declare it with{' '}
                <span className="code-inline">const price = …</span> above this line, then run again.
              </p>
              <div className="divider" style={{ margin: '18px 0' }}></div>
              <p className="ai-msg" style={{ fontSize: '14.5px' }}>
                <b>Izina <span className="code-inline">price</span> ntiriraho.</b>{' '}
                Wararikoresheje mbere yo kuritangaza. Ritangaze ukoresheje{' '}
                <span className="code-inline">const price = …</span>{' '}
                haruguru y&apos;uyu murongo, hanyuma wongere ukore.
              </p>
            </div>
          </div>
        </section>

        {/* FOR SCHOOLS */}
        <section className="section" id="teachers">
          <div className="cta-band reveal">
            <p className="eyebrow" style={{ marginBottom: 14 }}>For teachers &amp; school administrators</p>
            <h2>Run a whole class without collecting a single USB stick.</h2>
            <p>
              Create classes, assign exercises, and watch progress arrive in real time. Built to share
              gracefully across the lab computers your school already has.
            </p>
            <div className="row" style={{ justifyContent: 'center', gap: 12 }}>
              <button className="btn btn-primary lg" onClick={onSignup}>See the student view</button>
              <button className="btn btn-secondary lg" onClick={onSchoolSignup}>Contact us for schools</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap foot">
          <div>
            <div className="logo" style={{ marginBottom: 8 }}><span className="edu">EduCode</span></div>
            <div>Built for Rwandan technical secondary schools.</div>
          </div>
          <div className="foot-links">
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }} onClick={onLogin}>Log in</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }} onClick={onSignup}>Sign up</button>
            <a href="#platform">Platform</a>
            <a href="#teachers">For schools</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
