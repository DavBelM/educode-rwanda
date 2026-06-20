import { useState } from 'react';
import { Link } from 'react-router';
import { Users, Target, Globe, ArrowRight, Mail, Linkedin } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export default function AboutPage() {
  usePageTitle('About · EduCode');
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const isKin = language === 'KIN';

  return (
    <>
      {/* NAV */}
      <header className="nav">
        <div className="nav-inner">
          <Link className="logo" to="/"><span className="edu">EduCode</span></Link>
          <nav className="nav-links nav-collapse" aria-label="Main">
            <Link className="nav-link active" to="/about">{isKin ? 'Abo turibo' : 'About'}</Link>
            <Link className="nav-link" to="/contact">{isKin ? 'Twandikire' : 'Contact'}</Link>
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
            <Link className="btn btn-tertiary" to="/login">{isKin ? 'Kwinjira' : 'Log in'}</Link>
            <Link className="btn btn-primary sm" to="/signup">{isKin ? 'Tangira' : 'Get started'}</Link>
          </div>
        </div>
      </header>

      <main className="wrap">
        {/* HERO */}
        <section className="hero">
          <p className="eyebrow rise">{isKin ? 'Abo turibo' : 'About us'}</p>
          <h1 className="rise-2">
            {isKin
              ? 'Kugeza uburezi bwa programming kuri bose mu Rwanda'
              : 'Making programming education accessible to every Rwandan.'}
          </h1>
          <p className="lede rise-3">
            {isKin
              ? 'Intego yacu ni kugeza uburezi bufite ireme bwa coding kuri bose binyuze mu kwiga gufashijwe na AI mu Kinyarwanda.'
              : 'Our mission is to democratize quality coding education through AI-powered learning in Kinyarwanda.'}
          </p>
        </section>

        {/* OUR STORY */}
        <section className="section">
          <div className="split">
            <div>
              <p className="eyebrow">{isKin ? 'Inkuru yacu' : 'Our story'}</p>
              <h2 style={{ fontSize: 'clamp(26px,3.4vw,34px)', letterSpacing: '-0.03em' }}>
                {isKin ? 'Yavutse mu ishuri.' : 'Born from the classroom.'}
              </h2>
              <p className="muted" style={{ marginTop: 14, fontSize: 16, lineHeight: 1.6 }}>
                {isKin
                  ? 'Yashinzwe mu 2026 n\'umunyeshuri wiga Computer Science muri African Leadership University akaba n\'umwarimu wa JavaScript mu ishuri ryaho. Ikibazo cyari gisobanutse: abanyeshuri babonaga bigoye kwiga programming.'
                  : 'Founded in 2026 by a Computer Science student at African Leadership University and JavaScript teacher at a local school. The problem was clear: students struggled to learn programming.'}
              </p>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>{isKin ? 'Amabwiriza yari mu Cyongereza gusa' : 'Instructions were only in English'}</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>{isKin ? 'Abarimu babaga bafite abanyeshuri barenga 50 bagomba gufasha' : 'Teachers had 50+ students to support'}</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>{isKin ? 'Nta bisubizo byihariye kuri buri munyeshuri' : 'No personalized feedback'}</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span>{isKin ? 'Ubushobozi buke bwo kugera muri lab ya mudasobwa' : 'Limited computer lab access'}</span>
                </li>
              </ul>
            </div>
            <div className="grid g-2">
              {[
                { icon: <Users size={22} />, number: '5,000+', label: isKin ? 'Abanyeshuri Biga' : 'Students learning' },
                { icon: <Target size={22} />, number: '50+', label: isKin ? 'Amashuri akoresha' : 'Schools using it' },
                { icon: <Globe size={22} />, number: '95%', label: isKin ? 'Igipimo cy\'abatsinda' : 'Pass rate' },
                { icon: <span style={{ fontSize: 22 }}>🇷🇼</span>, number: '#1', label: isKin ? 'Mu Rwanda' : 'In Rwanda' },
              ].map((stat) => (
                <div key={stat.label} className="card pad-sm text-center">
                  <div className="iconbtn" style={{ margin: '0 auto 12px', pointerEvents: 'none' }}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{stat.number}</div>
                  <div className="text-sm dim">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR VALUES */}
        <section className="section">
          <div className="section-head">
            <p className="eyebrow">{isKin ? 'Indangagaciro zacu' : 'Our values'}</p>
            <h2>{isKin ? 'Ibitwiganisha' : 'What guides us'}</h2>
          </div>
          <div className="grid g-3">
            <article className="card feat">
              <div style={{ fontSize: 30, marginBottom: 18 }}>🇷🇼</div>
              <h3>{isKin ? 'U Rwanda Mbere' : 'Rwanda first'}</h3>
              <p>
                {isKin
                  ? 'Byakozwe n\'Abanyarwanda ku bw\'abanyeshuri b\'u Rwanda.'
                  : 'Built for Rwandan students, by Rwandans.'}
              </p>
            </article>
            <article className="card feat">
              <div style={{ fontSize: 30, marginBottom: 18 }}>🤖</div>
              <h3>{isKin ? 'Bifashijwemo na AI' : 'AI-powered'}</h3>
              <p>
                {isKin
                  ? 'Ikoranabuhanga ryumva imiterere yacu.'
                  : 'Technology that understands our context.'}
              </p>
            </article>
            <article className="card feat">
              <div style={{ fontSize: 30, marginBottom: 18 }}>🌍</div>
              <h3>{isKin ? 'Biboneka byoroshye' : 'Accessible'}</h3>
              <p>
                {isKin
                  ? 'Irakora niyo nta interineti ihari, irahendutse, kandi iri mu rurimi rwawe.'
                  : 'Works offline, affordable, and in your language.'}
              </p>
            </article>
          </div>
        </section>

        {/* TEAM */}
        <section className="section">
          <div className="section-head">
            <p className="eyebrow">{isKin ? 'Itsinda' : 'Team'}</p>
            <h2>{isKin ? 'Menya itsinda ryacu' : 'Meet the team'}</h2>
          </div>
          <div className="card pad-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="iconbtn" style={{ width: 88, height: 88, fontSize: 28, fontWeight: 600, flexShrink: 0, pointerEvents: 'none' }}>
                JD
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>[Your Name]</h3>
                <p style={{ color: 'var(--text-2)', fontWeight: 600, marginBottom: 12 }}>
                  {isKin ? 'Umushinzwi & CEO' : 'Founder & CEO'}
                </p>
                <div className="dim" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p>{isKin ? 'Umunyeshuri wa Software Engineering muri ALU' : 'Software Engineering student at ALU'}</p>
                  <p>{isKin ? 'Umwarimu wa JavaScript' : 'JavaScript teacher'}</p>
                  <p>{isKin ? 'Nkunda ubusumbane buke mu burezi' : 'Passionate about education equity'}</p>
                </div>
                <a href="#" className="btn btn-tertiary" style={{ marginTop: 12, padding: 0 }}>
                  <Linkedin size={16} /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="cta-band" style={{ marginTop: 18 }}>
            <h2>{isKin ? 'Wifuza kwinjira mu itsinda ryacu?' : 'Want to join our team?'}</h2>
            <p>
              {isKin
                ? 'Turashaka abantu bafite ubushake bwo guhinduza uburezi mu Rwanda.'
                : "We're looking for passionate people to transform education in Rwanda."}
            </p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <a href="#" className="btn btn-primary lg">
                {isKin ? 'Reba imyanya y\'akazi ihari' : 'View open positions'}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="section">
          <div className="cta-band">
            <h2>{isKin ? 'Wifuza kumenya byinshi?' : 'Want to learn more?'}</h2>
            <p>
              {isKin
                ? 'Twandikire niba wifuza kumenya byinshi kuri EduCode Rwanda.'
                : 'Get in touch to learn more about EduCode Rwanda.'}
            </p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <Link to="/contact" className="btn btn-primary lg">
                <Mail size={16} />
                {isKin ? 'Twandikire' : 'Contact us'}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap foot">
          <div>
            <div className="logo" style={{ marginBottom: 8 }}><span className="edu">EduCode</span></div>
            <div>{isKin ? '© 2026 EduCode Rwanda. Byubatswe mu Rwanda n\'urukundo.' : '© 2026 EduCode Rwanda. Built with ❤️ in Rwanda.'}</div>
          </div>
          <div className="foot-links">
            <Link to="/login">{isKin ? 'Kwinjira' : 'Log in'}</Link>
            <Link to="/signup">{isKin ? 'Iyandikishe' : 'Sign up'}</Link>
            <Link to="/contact">{isKin ? 'Twandikire' : 'Contact'}</Link>
            <Link to="/privacy">{isKin ? 'Ibanga' : 'Privacy'}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
