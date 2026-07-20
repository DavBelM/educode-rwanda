import { useState } from 'react';
import { Link } from 'react-router';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export interface LegalSection {
  id: string;       // 'section-1' … 'section-20'
  heading: string;  // verbatim from document
  content: React.ReactNode;
}

interface Props {
  pageTitle: string;
  eyebrow: string;
  title: string;
  lede: string;
  version: string;
  effective: string;
  lastReviewed: string;
  sections: LegalSection[];
  crossLink: { label: string; to: string };
}

export default function LegalLayout({
  pageTitle, eyebrow, title, lede, version, effective, lastReviewed,
  sections, crossLink,
}: Props) {
  usePageTitle(pageTitle);
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [active, setActive] = useState('');
  const isKin = language === 'KIN';

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Public nav ── */}
      <header className="nav">
        <div className="nav-inner">
          <Link className="logo" to="/"><span className="edu">Edu</span><span className="code">Code</span></Link>
          <nav className="nav-links nav-collapse" aria-label="Main">
            <Link className="nav-link" to="/about">About</Link>
            <Link className="nav-link" to="/contact">Contact</Link>
            <Link className="nav-link" to="/legal">Legal</Link>
          </nav>
          <div className="nav-right">
            <div className="lang-toggle">
              {(['EN', 'KIN'] as const).map(l => (
                <button key={l} className={language === l ? 'on' : ''} onClick={() => setLanguage(l)}>{l}</button>
              ))}
            </div>
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
        {/* ── Hero ── */}
        <section className="hero">
          <p className="eyebrow rise">{eyebrow}</p>
          <h1 className="rise-2">{title}</h1>
          <p className="lede rise-3">{lede}</p>
          <p className="dim rise-3" style={{ fontSize: 14 }}>
            {version} &nbsp;·&nbsp; Effective {effective} &nbsp;·&nbsp; Last reviewed {lastReviewed}
          </p>
        </section>

        {/* ── KIN notice ── */}
        {isKin && (
          <div className="callout warning" style={{ maxWidth: 720, margin: '0 auto 32px', borderRadius: 8 }}>
            <p>
              <strong>Icyitonderwa / Note:</strong>{' '}
              Ubuhinduzi bw&rsquo;iki giporisi mu Kinyarwanda burakiri gutegurwa.
              Verisiyo y&rsquo;icyongereza nizo ifite agaciro.{' '}
              <em>A Kinyarwanda translation of this document is in preparation.
              The authoritative version is the English text below.</em>
            </p>
          </div>
        )}

        {/* ── Content ── */}
        <section className="section">
          <div className="privacy-layout">

            {/* Sticky TOC */}
            <aside className="privacy-toc">
              <div className="card pad-sm" style={{ position: 'sticky', top: 90 }}>
                <h3 className="font-bold" style={{ color: 'var(--text)', fontSize: 14, marginBottom: 10 }}>
                  Contents
                </h3>
                <nav className="stack" style={{ ['--gap' as string]: '2px' }}>
                  {sections.map(s => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={e => { e.preventDefault(); scrollTo(s.id); }}
                      className={`toc-link${active === s.id ? ' on' : ''}`}
                    >
                      <span>{s.heading}</span>
                    </a>
                  ))}
                </nav>
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                  <Link
                    to={crossLink.to}
                    style={{ fontSize: 12, color: 'var(--text-2)', textDecoration: 'underline' }}
                  >
                    {crossLink.label}
                  </Link>
                </div>
              </div>
            </aside>

            {/* Sections */}
            <div className="stack" style={{ ['--gap' as string]: '48px' }}>

              {/* Cross-link banner */}
              <div className="callout" style={{ borderRadius: 8 }}>
                <p style={{ fontSize: 14 }}>
                  See also:{' '}
                  <Link to={crossLink.to} style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'underline' }}>
                    {crossLink.label}
                  </Link>
                </p>
              </div>

              {sections.map(s => (
                <section
                  key={s.id}
                  id={s.id}
                  style={{ scrollMarginTop: 90 }}
                >
                  <h2 style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--text)',
                    letterSpacing: '-0.01em',
                    marginBottom: 16,
                    lineHeight: 1.3,
                  }}>
                    {s.heading}
                  </h2>
                  <div style={{
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: 'var(--text-2)',
                    maxWidth: '68ch',
                  }}>
                    {s.content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
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
