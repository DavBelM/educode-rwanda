import React, { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Facebook, Twitter, Instagram, ChevronRight } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ContactPage() {
  usePageTitle('Contact · EduCode');
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isKin = language === 'KIN';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const faqs = [
    {
      question: isKin ? 'Ni gute nahindura ijambo ryanjye ry\'ibanga?' : 'How do I reset my password?',
      answer: isKin
        ? 'Kanda "Wibagiwe ijambo ryibanga?" ku rupapuro rwo kwinjira, hanyuma ukurikire amabwiriza.'
        : 'Click "Forgot Password?" on the login page and follow the instructions.',
      link: '#'
    },
    {
      question: isKin ? 'Bigura amafaranga angahe?' : 'How much does it cost?',
      answer: isKin
        ? 'Ni ubuntu ku mikoro 5 ya mbere. Premium ni 2,000 RWF ku kwezi.'
        : 'Free to start with 5 assignments. Premium is RWF 2,000/month.',
      link: '#pricing'
    },
    {
      question: isKin ? 'Hari igabanyirizwa muha amashuri?' : 'Do you offer school discounts?',
      answer: isKin
        ? 'Yego! Amashuri ahabwa amezi 3 y\'igerageza ku buntu. Saba demo.'
        : 'Yes! Schools get a 3-month free trial. Request a demo.',
      link: '#schools'
    },
    {
      question: isKin ? 'Nshobora kuyikoresha nta interineti ihari?' : 'Can I use it offline?',
      answer: isKin
        ? 'Yego! Andika code nawe udafite interineti, amakuru azajyaho neza nuyihuza na interineti.'
        : 'Yes! Code offline and sync when you connect.',
      link: '#features'
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
            <Link className="nav-link active" to="/contact">{isKin ? 'Twandikire' : 'Contact'}</Link>
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
          <p className="eyebrow rise">{isKin ? 'Twandikire' : 'Contact'}</p>
          <h1 className="rise-2">
            {isKin ? 'Twandikire' : 'Get in touch.'}
          </h1>
          <p className="lede rise-3">
            {isKin
              ? 'Duhe ubutumwa, tuzakusubiza vuba.'
              : "Send us a message and we'll respond soon."}
          </p>
        </section>

        {/* CONTACT INFO + FORM */}
        <section className="section">
          <div className="split">
            <div>
              <p className="eyebrow">{isKin ? 'Aho dukorera' : 'Reach us'}</p>
              <h2 style={{ fontSize: 'clamp(26px,3.4vw,34px)', letterSpacing: '-0.03em', marginBottom: 18 }}>
                {isKin ? 'Vuga natwe' : 'Talk to us'}
              </h2>

              <div className="stack" style={{ ['--gap' as string]: '18px' }}>
                <div className="flex items-start gap-3">
                  <div className="iconbtn" style={{ pointerEvents: 'none', flexShrink: 0 }}>
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text)' }}>Email</div>
                    <a href="mailto:info@educode.rw" className="dim">info@educode.rw</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="iconbtn" style={{ pointerEvents: 'none', flexShrink: 0 }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text)' }}>{isKin ? 'Telefoni' : 'Phone'}</div>
                    <a href="tel:+250" className="dim">+250 XXX XXX XXX</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="iconbtn" style={{ pointerEvents: 'none', flexShrink: 0 }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text)' }}>{isKin ? 'Aho turi' : 'Location'}</div>
                    <p className="dim">Kigali, Rwanda</p>
                  </div>
                </div>
              </div>

              <div className="divider" style={{ margin: '24px 0' }}></div>

              <div className="flex items-center gap-3 mb-3">
                <Clock size={18} style={{ color: 'var(--text)' }} />
                <h3 className="font-bold" style={{ color: 'var(--text)' }}>
                  {isKin ? 'Amasaha y\'akazi' : 'Office hours'}
                </h3>
              </div>
              <div className="dim" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 16 }}>
                <div className="flex justify-between">
                  <span>{isKin ? 'Kuwa mbere - Kuwa gatanu' : 'Monday - Friday'}</span>
                  <span>8 AM - 5 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{isKin ? 'Ku wa gatandatu' : 'Saturday'}</span>
                  <span>9 AM - 1 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{isKin ? 'Ku cyumweru' : 'Sunday'}</span>
                  <span>{isKin ? 'Harafunze' : 'Closed'}</span>
                </div>
              </div>

              <div className="divider" style={{ margin: '24px 0' }}></div>

              <h3 className="font-bold mb-3" style={{ color: 'var(--text)' }}>{isKin ? 'Dukurikire' : 'Follow us'}</h3>
              <div className="flex gap-2">
                {[
                  { Icon: Twitter, href: '#' },
                  { Icon: Linkedin, href: '#' },
                  { Icon: Facebook, href: '#' },
                  { Icon: Instagram, href: '#' }
                ].map(({ Icon, href }, index) => (
                  <a key={index} href={href} className="iconbtn">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className="card pad-lg">
              {submitted ? (
                <div className="text-center" style={{ padding: '24px 0' }}>
                  <div className="iconbtn" style={{ width: 56, height: 56, margin: '0 auto 16px', pointerEvents: 'none' }}>
                    <Send size={26} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                    {isKin ? 'Murakoze!' : 'Thank you!'}
                  </h3>
                  <p className="dim mb-6">
                    {isKin
                      ? 'Ubutumwa bwawe bwoherejwe. Tuzakusubiza mu gihe cy\'amasaha 24.'
                      : "Your message has been sent. We'll respond within 24 hours."}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', userType: '', subject: '', message: '' });
                    }}
                    className="btn btn-secondary"
                  >
                    {isKin ? 'Ohereza Ubundi Butumwa' : 'Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="stack" style={{ ['--gap' as string]: '16px' }}>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
                    {isKin ? 'Twoherereze ubutumwa' : 'Send us a message'}
                  </h2>

                  <div className="field">
                    <label className="label">{isKin ? 'Amazina Yawe' : 'Your name'} *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Mugisha"
                      className="input"
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jean@example.com"
                      className="input"
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label">{isKin ? 'Ndi' : 'I am a'} *</label>
                    <select
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      className="select"
                      required
                    >
                      <option value="">{isKin ? 'Hitamo' : 'Select'}</option>
                      <option value="student">{isKin ? 'Umunyeshuri' : 'Student'}</option>
                      <option value="teacher">{isKin ? 'Umwarimu' : 'Teacher'}</option>
                      <option value="school">{isKin ? 'Umuyobozi w\'ishuri' : 'School admin'}</option>
                      <option value="other">{isKin ? 'Ikindi' : 'Other'}</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="label">{isKin ? 'Icyo wandikira' : 'Subject'} *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={isKin ? 'Umutwe w\'ubutumwa bwawe' : 'Subject of your message'}
                      className="input"
                      required
                    />
                  </div>

                  <div className="field">
                    <label className="label">{isKin ? 'Ubutumwa' : 'Message'} *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isKin ? 'Tubwire uburyo twagufashamo...' : 'Tell us how we can help...'}
                      rows={6}
                      className="textarea"
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary btn-block lg">
                    {loading ? (
                      <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
                      </svg>
                    ) : (
                      <>
                        <Send size={16} />
                        {isKin ? 'Ohereza Ubutumwa' : 'Send message'}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs dim">
                    {isKin
                      ? 'Mubisanzwe dusubiza mu masaha 24'
                      : 'We typically respond within 24 hours'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2>{isKin ? 'Ibibazo Bikunze Kubazwa' : 'Quick answers'}</h2>
          </div>
          <div className="grid g-2">
            {faqs.map((faq, index) => (
              <div key={index} className="card pad-lg">
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{faq.question}</h3>
                <p className="dim" style={{ fontSize: 16, marginBottom: 12 }}>{faq.answer}</p>
                <a href={faq.link} className="btn btn-tertiary" style={{ padding: 0 }}>
                  {isKin ? 'Menya byinshi' : 'Learn more'}
                  <ChevronRight size={14} />
                </a>
              </div>
            ))}
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
            <Link to="/privacy">{isKin ? 'Ibanga' : 'Privacy'}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
