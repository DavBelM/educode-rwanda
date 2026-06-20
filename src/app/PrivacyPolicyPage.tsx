import { useState } from 'react';
import { Link } from 'react-router';
import { Download, Shield, Lock, Eye, Database, Users, Cookie, FileText, Mail } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export default function PrivacyPolicyPage() {
  usePageTitle('Privacy Policy · EduCode');
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [activeSection, setActiveSection] = useState('');

  const isKin = language === 'KIN';

  const sections = [
    {
      id: 'collection',
      icon: Database,
      title: isKin ? 'Amakuru Dukusanya' : 'Information We Collect',
      content: (
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <p>
            {isKin
              ? 'Dukusanya amakuru akurikira kugirango dushobore gutanga serivisi zacu:'
              : 'We collect the following information to provide our services:'}
          </p>
          <ul className="plain-list">
            <li>
              <strong>{isKin ? 'Amakuru y\'ikonti' : 'Account information'}:</strong>{' '}
              {isKin
                ? 'Amazina, i-meyili, telefoni (niba wayitanze)'
                : 'Name, email, phone (if provided)'}
            </li>
            <li>
              <strong>{isKin ? 'Imikoro ya code watanze' : 'Code submissions'}:</strong>{' '}
              {isKin
                ? 'Code utanga (zikoreshwa mu kwigisha AI no kuguha ibitekerezo)'
                : 'Code you submit (for AI training and feedback)'}
            </li>
            <li>
              <strong>{isKin ? 'Amakuru y\'imikoreshereze' : 'Usage data'}:</strong>{' '}
              {isKin
                ? 'Ibiranga platform ukoresha, igihe umazeho, n\'iterambere ryawe'
                : 'Which features you use, time spent, and progress'}
            </li>
          </ul>
          <div className="callout success">
            <Shield size={18} />
            <p>
              <strong>{isKin ? 'Ntabwo tugurisha amakuru yawe' : 'We do NOT sell your data'}.</strong>{' '}
              {isKin ? 'Na rimwe. Amakuru yawe ni ayawe.' : 'Never. Your data is yours.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'usage',
      icon: Eye,
      title: isKin ? 'Uburyo dukoresha amakuru yawe' : 'How We Use Your Data',
      content: (
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <p>{isKin ? 'Dukoresha amakuru yawe kugirango:' : 'We use your information to:'}</p>
          <ul className="plain-list">
            <li>
              <strong>{isKin ? 'Duhe AI uburyo bwo kuguha ibitekerezo' : 'Provide AI feedback'}:</strong>{' '}
              {isKin
                ? 'AI yacu isuzuma code yawe ikaguha inama n\'ibisobanuro'
                : 'Our AI analyzes your code and provides guidance'}
            </li>
            <li>
              <strong>{isKin ? 'Kunoza iyi platform' : 'Improve the platform'}:</strong>{' '}
              {isKin ? 'Gusobanukirwa aho abanyeshuri bagira imbogamizi' : 'Understand where students struggle'}
            </li>
            <li>
              <strong>{isKin ? 'Kohereza amakuru mashya y\'ingenzi' : 'Send important updates'}:</strong>{' '}
              {isKin ? 'Ibiranga platform bishya n\'amahirwe yo kwiga' : 'New features and training opportunities'}
            </li>
          </ul>
          <p className="dim" style={{ fontSize: 16 }}>
            {isKin
              ? 'Urashobora guhagarika kwakira i-meyili z\'ubucuruzi igihe cyose.'
              : 'You can opt out of marketing emails anytime.'}
          </p>
        </div>
      )
    },
    {
      id: 'storage',
      icon: Lock,
      title: isKin ? 'Kubika no kurinda amakuru' : 'Data Storage & Security',
      content: (
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <p>{isKin ? 'Dufata umutekano w\'amakuru yawe nk\'ikintu cy\'ingenzi:' : 'We take your data security seriously:'}</p>
          <ul className="plain-list">
            <li>
              <strong>{isKin ? 'Aho tubika amakuru hararinzwe cyane' : 'Encrypted storage'}:</strong>{' '}
              {isKin ? 'Amakuru yawe yose afite uburinzi bukomeye (AES-256)' : 'All your data is encrypted (AES-256)'}
            </li>
            <li>
              <strong>{isKin ? 'Seriveri zacu zifite ibyemezo by\'umutekano (SOC2)' : 'SOC2-certified infrastructure'}:</strong>{' '}
              {isKin
                ? 'Dukoresha Supabase ifite icyemezo cy\'umutekano cya SOC2 Type 2'
                : 'We use Supabase infrastructure with SOC2 Type 2 security certification'}
            </li>
            <li>
              <strong>{isKin ? 'Twandukura amakuru kenshi (Backups)' : 'Regular backups'}:</strong>{' '}
              {isKin ? 'Twandukura amakuru buri munsi kugirango atazazima' : 'Daily backups to prevent data loss'}
            </li>
            <li>
              <strong>{isKin ? 'Kugenzura abagerera ku makuru' : 'Access controls'}:</strong>{' '}
              {isKin ? 'Abakozi babifitiye uruhushya gusa nibo bemerewe kureba amakuru' : 'Only authorized staff can access data'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'rights',
      icon: Users,
      title: isKin ? 'Uburenganzira bwawe' : 'Your Rights',
      content: (
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <p>{isKin ? 'Ufite uburenganzira bwo:' : 'You have the right to:'}</p>
          <ul className="plain-list">
            <li>
              <strong>{isKin ? 'Kureba amakuru yawe' : 'Access your data'}:</strong>{' '}
              {isKin ? 'Saba kopi y\'amakuru yawe yose igihe cyose' : 'Request a copy of all your data anytime'}
            </li>
            <li>
              <strong>{isKin ? 'Gusiba konti yawe' : 'Delete your account'}:</strong>{' '}
              {isKin ? 'Gusiba konti yawe hamwe n\'amakuru yose yerekeranye na yo' : 'Delete your account and all associated data'}
            </li>
            <li>
              <strong>{isKin ? 'Kohereza amakuru yawe ahandi' : 'Export your data'}:</strong>{' '}
              {isKin ? 'Kuramo amakuru yawe mu buryo bworoshye (JSON)' : 'Download your data in a portable format (JSON)'}
            </li>
            <li>
              <strong>{isKin ? 'Gukosora amakuru yawe' : 'Correct your data'}:</strong>{' '}
              {isKin ? 'Hindura amakuru atari yo' : 'Update incorrect information'}
            </li>
          </ul>
          <div className="callout">
            <p>
              <strong>{isKin ? 'Kugirango ukoreshe uburenganzira bwawe:' : 'To exercise your rights:'}</strong>{' '}
              {isKin ? 'Twandikire kuri privacy@educode.rw' : 'Email us at privacy@educode.rw'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'children',
      icon: Shield,
      title: isKin ? 'Abana n\'Ibanga' : "Children's Privacy",
      content: (
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <p>{isKin ? 'Dufasha abanyeshuri bari munsi y\'imyaka 18:' : 'We serve students under 18:'}</p>
          <ul className="plain-list">
            <li>{isKin ? 'Abanyeshuri munsi y\'imyaka 18 bakeneye uruhushya rw\'ababyeyi cyangwa ababarera' : 'Students under 18 need parent/guardian consent'}</li>
            <li>{isKin ? 'Amashuri afatwa nk\'abarezi b\'abanyeshuri bayo' : 'Schools act as guardians for their students'}</li>
            <li>{isKin ? 'Ntidukusanya amakuru atari ngombwa ku bato' : "We don't collect unnecessary data from minors"}</li>
            <li>{isKin ? 'Ababyeyi bashobora gusaba kureba cyangwa gusiba amakuru y\'umwana wabo' : 'Parents can request to view or delete child data'}</li>
          </ul>
        </div>
      )
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: 'Cookies',
      content: (
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <p>{isKin ? 'Dukoresha cookies kugirango:' : 'We use cookies to:'}</p>
          <ul className="plain-list">
            <li>
              <strong>{isKin ? 'Twibuke ko winjiye' : 'Keep you logged in'}:</strong>{' '}
              {isKin ? 'Nta kwiyandikisha buri gihe' : "You don't have to log in every time"}
            </li>
            <li>
              <strong>{isKin ? 'Twibuke ururimi wahisemo' : 'Remember your language'}:</strong>{' '}
              {isKin ? 'Icyongereza cyangwa Ikinyarwanda uhitamo' : 'English or Kinyarwanda preference'}
            </li>
            <li>
              <strong>{isKin ? 'Gusobanukirwa uko platform ikoreshwa' : 'Understand usage'}:</strong>{' '}
              {isKin ? 'Ibiranga platform bikora neza kurusha ibindi' : 'Which features work best'}
            </li>
          </ul>
          <div className="callout warning">
            <p>
              {isKin
                ? 'Ntabwo dukoresha cookies zigukurikirana ngo tuguhe amatangazo y\'ubucuruzi. Dukoresha gusa cookies z\'ingenzi.'
                : 'We do NOT use tracking cookies for ads. Only essential cookies.'}
            </p>
          </div>
          <p className="dim" style={{ fontSize: 16 }}>
            {isKin
              ? 'Urashobora kugenzura cookies muri browser yawe, ariko bishobora gutuma platform itakora neza.'
              : 'You can manage cookies in your browser settings, but this may affect functionality.'}
          </p>
        </div>
      )
    },
    {
      id: 'changes',
      icon: FileText,
      title: isKin ? 'Impinduka kuri iyi politiki' : 'Changes to Policy',
      content: (
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <p>{isKin ? 'Tushobora kuvugurura iyi politiki rimwe na rimwe:' : 'We may update this policy from time to time:'}</p>
          <ul className="plain-list">
            <li>{isKin ? 'Tuzakumenyesha ku email niba hari impinduka zikomeye' : "We'll notify you by email of major changes"}</li>
            <li>{isKin ? 'Itariki "Last updated" izahinduka' : 'The "Last updated" date will change'}</li>
            <li>{isKin ? 'Gukomeza kuyikoresha bivuze ko wemeye izo mpinduka' : 'Continued use means you accept changes'}</li>
          </ul>
          <p className="dim" style={{ fontSize: 16 }}>
            {isKin
              ? 'Niba utemeye impinduka, urashobora gusiba konti yawe.'
              : "If you don't agree with changes, you can delete your account."}
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      icon: Mail,
      title: isKin ? 'Twandikire' : 'Contact Us',
      content: (
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <p>{isKin ? 'Niba ufite ibibazo ku banga cyangwa amakuru yawe:' : 'If you have questions about privacy or your data:'}</p>
          <div className="card pad-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="iconbtn" style={{ pointerEvents: 'none' }}>
                <Mail size={16} />
              </div>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text)' }}>
                  {isKin ? 'Itsinda rishinzwe ibanga' : 'Privacy Team'}
                </div>
                <a href="mailto:privacy@educode.rw" className="dim">privacy@educode.rw</a>
              </div>
            </div>
            <p className="dim" style={{ fontSize: 16 }}>
              {isKin ? 'Tuzakusubiza mu gihe cy\'iminsi 5 y\'akazi.' : "We'll respond within 5 business days."}
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      {/* NAV */}
      <header className="nav">
        <div className="nav-inner">
          <Link className="logo" to="/"><span className="edu">EduCode</span></Link>
          <nav className="nav-links nav-collapse" aria-label="Main">
            <Link className="nav-link" to="/about">{isKin ? 'Abo turibo' : 'About'}</Link>
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
          <p className="eyebrow rise">{isKin ? 'Ibanga' : 'Legal'}</p>
          <h1 className="rise-2">{isKin ? 'Politiki y\'ibanga' : 'Privacy policy'}</h1>
          <p className="lede rise-3">
            {isKin
              ? 'Iyi politiki isobanura uburyo EduCode Rwanda ikusanya, ikoresha, kandi irinda amakuru yawe.'
              : 'This policy explains how EduCode Rwanda collects, uses, and protects your information.'}
          </p>
          <p className="dim rise-3">
            {isKin ? 'Yavuguruwe bwa nyuma:' : 'Last updated:'} <strong style={{ color: 'var(--text)' }}>April 6, 2026</strong>
          </p>
        </section>

        {/* CONTENT */}
        <section className="section">
          <div className="privacy-layout">
            {/* Table of contents */}
            <aside className="privacy-toc">
              <div className="card pad-sm" style={{ position: 'sticky', top: 90 }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold" style={{ color: 'var(--text)', fontSize: 16 }}>
                    {isKin ? 'Ibirimo' : 'Contents'}
                  </h3>
                  <button className="btn btn-tertiary sm">
                    <Download size={14} />
                    PDF
                  </button>
                </div>
                <nav className="stack" style={{ ['--gap' as string]: '2px' }}>
                  {sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`toc-link${activeSection === section.id ? ' on' : ''}`}
                    >
                      <section.icon size={14} />
                      <span>{index + 1}. {section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Sections */}
            <div className="stack" style={{ ['--gap' as string]: '40px' }}>
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} style={{ scrollMarginTop: 90 }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="iconbtn" style={{ pointerEvents: 'none', flexShrink: 0 }}>
                      <section.icon size={16} />
                    </div>
                    <h2 style={{ fontSize: 25, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      {index + 1}. {section.title}
                    </h2>
                  </div>
                  <div className="dim" style={{ fontSize: 17, lineHeight: 1.7, marginLeft: 48 }}>
                    {section.content}
                  </div>
                </section>
              ))}

              {/* Footer note */}
              <div className="cta-band">
                <Shield size={28} style={{ marginBottom: 12 }} />
                <h2>{isKin ? 'Dufata ibanga ryawe nka rishingiro' : 'We value your privacy'}</h2>
                <p>
                  {isKin
                    ? 'Niba ufite ibibazo ku banga cyangwa amakuru yawe, twandikire ku privacy@educode.rw. Tuzakusubiza mu gihe cy\'iminsi 5 y\'akazi.'
                    : "If you have questions about privacy or your data, email us at privacy@educode.rw. We'll respond within 5 business days."}
                </p>
                <div className="row" style={{ justifyContent: 'center' }}>
                  <a href="mailto:privacy@educode.rw" className="btn btn-primary lg">
                    <Mail size={16} />
                    {isKin ? 'Twandikire itsinda rishinzwe ibanga' : 'Contact privacy team'}
                  </a>
                </div>
              </div>
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
            <Link to="/about">{isKin ? 'Abo turibo' : 'About'}</Link>
            <Link to="/contact">{isKin ? 'Twandikire' : 'Contact'}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
