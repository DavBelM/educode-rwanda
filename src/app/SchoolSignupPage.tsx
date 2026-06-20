import { useState } from 'react';
import { Link } from 'react-router';
import { School, Users, Target, CheckCircle2, ArrowRight, Mail, Phone, ChevronDown, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createSchool, linkProfileToSchool } from '../lib/db';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export default function SchoolSignupPage() {
  usePageTitle('School Sign Up · EduCode');
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: '',
    location: '',
    studentCount: '',
    fullName: '',
    position: '',
    email: '',
    phone: '',
    password: '',
    challenges: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isKin = language === 'KIN';

  const faqs = [
    {
      question: isKin ? 'Bigutwara amafaranga angahe?' : 'How much does it cost?',
      answer: isKin
        ? 'Tuha trial y\'amezi 3 kubusa. Nyuma y\'ibyo, ni RWF 100,000 ku mwaka ku banyeshuri badahagarika.'
        : "We offer a free 3-month trial. After that, it's RWF 100,000/year for unlimited students."
    },
    {
      question: isKin ? 'Igihe cy\'igerageza (trial) kimara igihe kingana iki?' : 'How long is the trial?',
      answer: isKin
        ? 'Amezi 3 yose ni ubuntu, nta karita ya banki ukeneye.'
        : '3 months completely free, no credit card required.'
    },
    {
      question: isKin ? 'Dukeneye mudasobwa zidasanzwe?' : 'Do we need special computers?',
      answer: isKin
        ? 'Oya. Irakora kuri mudasobwa zose n\'amatefoni. Ikora na offline.'
        : 'No. Works on any computer or phone. Even works offline.'
    },
    {
      question: isKin ? 'Abanyeshuri barashobora kuyikoresha bari mu rugo?' : 'Can students use it at home?',
      answer: isKin
        ? 'Yego! Abanyeshuri barashobora kwandika code bari mu rugo cyangwa ku ishuri. Amakuru yikora sync iyo bahuye na interineti.'
        : 'Yes! Students can code at home or at school. Syncs whenever they connect.'
    },
    {
      question: isKin ? 'Ni ubuhe bufasha duhabwa?' : 'What support do we get?',
      answer: isKin
        ? 'Ubufasha bwihuse kuri i-meyili na telefoni, amahugurwa y\'abarimu, na demo ku ishuri.'
        : 'Priority email and phone support, teacher training, and in-school demos.'
    }
  ];

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true); setError('');

    const { data: school, error: schoolErr } = await createSchool({
      name: formData.schoolName,
      location: formData.location,
      contactEmail: formData.email,
    });
    if (schoolErr || !school) { setError(schoolErr ?? 'Failed to create school'); setLoading(false); return; }

    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.fullName, user_type: 'school_admin', preferred_language: 'en' } },
    });
    if (authErr || !authData.user) { setError(authErr?.message ?? 'Signup failed'); setLoading(false); return; }

    await linkProfileToSchool(authData.user.id, school.id);

    setLoading(false);
    setSuccess(true);
  };

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
          <p className="eyebrow rise">{isKin ? 'Ku Mashuri' : 'For schools'}</p>
          <h1 className="rise-2">
            {isKin ? 'Zana EduCode mu Ishuri Ryanyu' : 'Bring EduCode to your school.'}
          </h1>
          <p className="lede rise-3">
            {isKin
              ? 'Injira mu mashuri arenga 50 akoresha uburezi bwa coding bufashijwe na AI.'
              : 'Join 50+ schools using AI-powered coding education.'}
          </p>
          <div className="hero-meta rise-4">
            <div className="m"><b><School size={16} style={{ marginBottom: -2 }} /> 50+</b><span>{isKin ? 'Amashuri' : 'Schools'}</span></div>
            <div className="m"><b><Users size={16} style={{ marginBottom: -2 }} /> 5,000+</b><span>{isKin ? 'Abanyeshuri' : 'Students'}</span></div>
            <div className="m"><b><Target size={16} style={{ marginBottom: -2 }} /> 95%</b><span>{isKin ? 'Igipimo cy\'ubutsinda' : 'Success rate'}</span></div>
          </div>
        </section>

        {/* FORM */}
        <section className="section" style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="card pad-lg">
            {success ? (
              <div className="text-center" style={{ padding: '24px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                  {isKin ? 'Konti yafunguwe neza!' : 'Account created!'}
                </h2>
                <p className="dim mb-2">
                  {isKin
                    ? 'Injira ukoresheje i-meyili n\'ijambo ry\'ibanga umaze gushyiraho.'
                    : 'Log in with the email and password you just set.'}
                </p>
                <p className="dim" style={{ fontSize: 15, marginBottom: 24 }}>
                  {isKin ? 'Uzabona dashboard ya konti y\'ishuri ryawe.' : "You'll see your school admin dashboard after logging in."}
                </p>
                <Link to="/login" className="btn btn-primary lg">
                  {isKin ? 'Injira' : 'Go to login'}
                </Link>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', marginBottom: 6, textAlign: 'center' }}>
                  {isKin ? 'Saba amezi 3 y\'igerageza ku buntu' : 'Request your free 3-month trial'}
                </h2>
                <p className="dim text-center mb-6">
                  {isKin ? 'Uzuzanya uyu form tuzakuhamagara mu gihe cy\'amasaha 24' : "Fill out this form and we'll contact you within 24 hours"}
                </p>

                <form onSubmit={handleSubmit} className="stack" style={{ ['--gap' as string]: '20px' }}>
                  {/* School information */}
                  <div className="stack" style={{ ['--gap' as string]: '14px' }}>
                    <h3 className="font-bold" style={{ color: 'var(--text)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {isKin ? 'Amakuru y\'Ishuri' : 'School information'}
                    </h3>

                    <div className="field">
                      <span className="label">{isKin ? 'Izina ry\'Ishuri' : 'School name'} *</span>
                      <input
                        type="text"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        placeholder="IPRC Kigali"
                        className="input"
                        required
                      />
                    </div>

                    <div className="field">
                      <span className="label">{isKin ? 'Ubwoko bw\'Ishuri' : 'School type'} *</span>
                      <select
                          value={formData.schoolType}
                          onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                          className="select"
                          required
                        >
                          <option value="">{isKin ? 'Hitamo ubwoko' : 'Select type'}</option>
                          <option value="tvet">TVET</option>
                          <option value="secondary">{isKin ? 'Ishuri ryisumbuye' : 'Secondary school'}</option>
                          <option value="university">{isKin ? 'Kaminuza' : 'University'}</option>
                          <option value="training">{isKin ? 'Ikigo cy\'amahugurwa' : 'Training center'}</option>
                        </select>
                    </div>

                    <div className="field">
                      <span className="label">{isKin ? 'Akarere' : 'Location (district)'} *</span>
                      <select
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="select"
                          required
                        >
                          <option value="">{isKin ? 'Hitamo akarere' : 'Select district'}</option>
                          <option value="kigali">Kigali</option>
                          <option value="huye">Huye</option>
                          <option value="musanze">Musanze</option>
                          <option value="rubavu">Rubavu</option>
                          <option value="other">{isKin ? 'Ikindi' : 'Other'}</option>
                        </select>
                    </div>

                    <div className="field">
                      <span className="label">{isKin ? 'Umubare w\'Abanyeshuri' : 'Number of students'} *</span>
                      <select
                          value={formData.studentCount}
                          onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                          className="select"
                          required
                        >
                          <option value="">{isKin ? 'Hitamo umubare' : 'Select count'}</option>
                          <option value="1-50">1-50</option>
                          <option value="50-100">50-100</option>
                          <option value="100-200">100-200</option>
                          <option value="200-500">200-500</option>
                          <option value="500+">500+</option>
                        </select>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Contact person */}
                  <div className="stack" style={{ ['--gap' as string]: '14px' }}>
                    <h3 className="font-bold" style={{ color: 'var(--text)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {isKin ? 'Umuntu wo guhamagara' : 'Contact person'}
                    </h3>

                    <div className="field">
                      <span className="label">{isKin ? 'Amazina Yose' : 'Full name'} *</span>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="input"
                        required
                      />
                    </div>

                    <div className="field">
                      <span className="label">{isKin ? 'Umwanya' : 'Position'} *</span>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder={isKin ? 'Umuyobozi w\'Amasomo' : 'Dean of Studies'}
                        className="input"
                        required
                      />
                    </div>

                    <div className="field">
                      <span className="label">Email *</span>
                      <div className="input-group">
                        <Mail size={16} className="input-affix" style={{ left: 12, right: 'auto', pointerEvents: 'none' }} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@school.ac.rw"
                          className="input"
                          style={{ paddingLeft: 38 }}
                          required
                        />
                      </div>
                    </div>

                    <div className="field">
                      <span className="label">{isKin ? 'Ijambo ry\'ibanga' : 'Password'} *</span>
                      <div className="input-group">
                        <Lock size={16} className="input-affix" style={{ left: 12, right: 'auto', pointerEvents: 'none' }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder={isKin ? 'Byibuze inyuguti 8' : 'Min. 8 characters'}
                          minLength={8}
                          className="input"
                          style={{ paddingLeft: 38, paddingRight: 38 }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          className="input-affix"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          style={{ left: 'auto', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}
                        >
                          {showPassword ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="field">
                      <span className="label">{isKin ? 'Nimero ya Telefoni' : 'Phone number'} *</span>
                      <div className="input-group">
                        <Phone size={16} className="input-affix" style={{ left: 12, right: 'auto', pointerEvents: 'none' }} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+250 XXX XXX XXX"
                          className="input"
                          style={{ paddingLeft: 38 }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <span className="label">
                      {isKin ? 'Ni izihe mbogamizi muhura nazo?' : 'What challenges do you face?'}{' '}
                      <span className="dim">({isKin ? 'Si itegeko' : 'Optional'})</span>
                    </span>
                    <textarea
                      value={formData.challenges}
                      onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      placeholder={isKin
                        ? 'Tubwire imbogamizi muhura nazo mu kwigisha programming...'
                        : 'Tell us about your current challenges with programming education...'}
                      rows={4}
                      className="textarea"
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--error-dim)', color: 'var(--error)', fontSize: 16 }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn btn-primary btn-block lg">
                    {loading ? (
                      <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
                      </svg>
                    ) : (
                      <>
                        {isKin ? 'Saba igerageza ry\'ubuntu' : 'Request free trial'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="callout success">
                    <div className="stack" style={{ ['--gap' as string]: '6px', fontSize: 16 }}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                        <span>{isKin ? 'Ntabwo ari itegeko gukomeza nyuma' : 'No commitment required'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                        <span>{isKin ? 'Tuzakuhamagara mu masaha 24' : "We'll contact you within 24 hours"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                        <span>{isKin ? 'Ni ubuntu mu mezi 3 ya mbere, hanyuma akaba 100,000 RWF ku mwaka.' : 'Free for 3 months, then RWF 100,000/year'}</span>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>

        {/* WHAT HAPPENS NEXT */}
        <section className="section">
          <div className="section-head">
            <p className="eyebrow">{isKin ? 'Inzira' : 'Process'}</p>
            <h2>{isKin ? 'Iki nicyo kizakurikira' : 'What happens next'}</h2>
          </div>
          <div className="grid g-3">
            {[
              {
                step: '1',
                title: isKin ? 'Tuzakuhamagara' : "We'll call you",
                description: isKin ? 'Mu masaha 24 tuzakuhamagara tuganire' : "Within 24 hours we'll give you a call"
              },
              {
                step: '2',
                title: isKin ? 'Shiraho igihe cya Demo' : 'Schedule a demo',
                description: isKin ? 'Tuza ku ishuri ryanyu kumurika uko platform ikora ku barimu' : 'We come to your school for a teacher demo'
              },
              {
                step: '3',
                title: isKin ? 'Tangira igerageza' : 'Start your trial',
                description: isKin ? 'Tangira amezi yawe 3 y\'igerageza ku buntu' : 'Begin your free 3-month trial'
              }
            ].map((item) => (
              <article key={item.step} className="card feat text-center">
                <div className="iconbtn" style={{ margin: '0 auto 18px', pointerEvents: 'none', fontWeight: 600 }}>
                  {item.step}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2>{isKin ? 'Ibibazo Bikunze Kubazwa' : 'Frequently asked questions'}</h2>
          </div>
          <div className="stack" style={{ ['--gap' as string]: '8px', maxWidth: 720, margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <div key={index} className="card" style={{ padding: 0 }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="flex items-center justify-between"
                  style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text)', fontWeight: 600, fontSize: 17 }}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    style={{ flexShrink: 0, transition: 'transform 0.2s', transform: expandedFAQ === index ? 'rotate(180deg)' : 'none', color: 'var(--text-3)' }}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="dim" style={{ padding: '0 20px 16px', fontSize: 16 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section">
          <div className="cta-band">
            <h2>{isKin ? 'Ufite ibibazo?' : 'Have questions?'}</h2>
            <div className="row" style={{ justifyContent: 'center' }}>
              <Link to="/contact" className="btn btn-secondary lg">
                {isKin ? 'Vugana n\'abashinzwe kugurisha' : 'Contact sales'}
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
            <Link to="/about">{isKin ? 'Abo turibo' : 'About'}</Link>
            <Link to="/contact">{isKin ? 'Twandikire' : 'Contact'}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
