import { Link } from 'react-router';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export default function LegalLandingPage() {
  usePageTitle('Legal · EduCode Rwanda');
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* ── Nav ── */}
      <header className="nav">
        <div className="nav-inner">
          <Link className="logo" to="/"><span className="edu">Edu</span><span className="code">Code</span></Link>
          <nav className="nav-links nav-collapse" aria-label="Main">
            <Link className="nav-link" to="/about">About</Link>
            <Link className="nav-link" to="/contact">Contact</Link>
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
            <Link className="btn btn-tertiary" to="/login">Log in</Link>
            <Link className="btn btn-primary sm" to="/signup">Get started</Link>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section className="hero">
          <p className="eyebrow rise">Legal</p>
          <h1 className="rise-2">EduCode Rwanda Legal Documents</h1>
          <p className="lede rise-3">
            Version 1.0 &nbsp;·&nbsp; Effective 1 June 2026 &nbsp;·&nbsp; Last reviewed 19 July 2026
          </p>
          <p className="dim rise-3" style={{ fontSize: 14 }}>
            EduCode Rwanda is a capstone research project by Mitali Bela, BSc. Software Engineering,
            African Leadership University.
          </p>
        </section>

        <section className="section">
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

            {/* Terms card */}
            <Link to="/terms" style={{ textDecoration: 'none' }}>
              <div className="card pad-lg" style={{ height: '100%', cursor: 'pointer', transition: 'box-shadow .15s' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>📄</div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  Part A — End-User Licence Agreement
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
                  Sections 1–9. Who may use the platform, what you are licensed to do,
                  AI feedback limits, assessment monitoring, and your responsibilities.
                </p>
                <span className="btn btn-secondary" style={{ display: 'inline-block' }}>
                  Read Terms →
                </span>
              </div>
            </Link>

            {/* Privacy card */}
            <Link to="/privacy" style={{ textDecoration: 'none' }}>
              <div className="card pad-lg" style={{ height: '100%', cursor: 'pointer', transition: 'box-shadow .15s' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>🔒</div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  Part B — Privacy Policy
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
                  Sections 10–20. What data is collected and why, who sees it, how long
                  it is kept, your rights under Law No. 058/2021, and how to contact us.
                </p>
                <span className="btn btn-secondary" style={{ display: 'inline-block' }}>
                  Read Privacy Policy →
                </span>
              </div>
            </Link>

          </div>

          <div className="callout" style={{ maxWidth: 680, margin: '32px auto 0', borderRadius: 8 }}>
            <p style={{ fontSize: 13.5, lineHeight: 1.7 }}>
              Questions about these documents or your personal data may be directed to Mitali Bela
              at{' '}
              <a href="mailto:belamitali@gmail.com" style={{ color: 'var(--text)', fontWeight: 500 }}>
                belamitali@gmail.com
              </a>
              . The supervisory authority for data protection in Rwanda is the National Cyber
              Security Authority (NCSA).
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap foot">
          <div>
            <div className="logo" style={{ marginBottom: 8 }}><span className="edu">EduCode</span></div>
            <div>© 2026 EduCode Rwanda. Built with ❤️ in Rwanda.</div>
          </div>
          <div className="foot-links">
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
