import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  onBack: () => void;
}

export default function ForgotPasswordPage({ onBack }: Props) {
  usePageTitle('Forgot Password · EduCode');
  const { requestPasswordReset } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const isKin = language === 'KIN';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    const { error } = await requestPasswordReset(email.trim());
    if (error) {
      setError(isKin ? 'Hari ikibazo cyabaye. Gerageza nanone.' : 'Something went wrong. Please try again.');
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="auth">
      {/* LEFT PANEL */}
      <aside className="auth-aside">
        <a className="logo" href="/"><span className="edu">EduCode</span></a>
        <div className="aside-mid">
          <h2>{isKin ? 'Iga programming mu rurimi rwawe' : 'Learn programming in your language'}</h2>
          <p>{isKin ? 'Ibisobanuro by\'amakosa mu Kinyarwanda. Byakorewe u Rwanda.' : 'Error explanations in Kinyarwanda. Built for Rwanda.'}</p>
        </div>
        <div className="aside-foot">Built for Rwandan technical secondary schools.</div>
      </aside>

      {/* RIGHT : FORM */}
      <main className="auth-main">
        <div className="auth-top">
          <div className="lang-toggle">
            {(['EN', 'KIN'] as const).map(lang => (
              <button key={lang} className={language === lang ? 'on' : ''} onClick={() => setLanguage(lang)}>
                {lang}
              </button>
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
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="auth-card rise">
          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="iconbtn" style={{ width: 56, height: 56, margin: '0 auto 20px', pointerEvents: 'none' }}>
                <CheckCircle size={26} />
              </div>
              <h1>{isKin ? 'I-meyili yoherejwe!' : 'Email sent!'}</h1>
              <p className="sub">
                {isKin
                  ? `Twoherereje link yo guhindura ijambo ry'ibanga kuri ${email}. Reba muri i-meyili yawe hanyuma ukurikire amabwiriza.`
                  : `We sent a password reset link to ${email}. Check your inbox and follow the instructions.`}
              </p>
              <button onClick={onBack} className="btn btn-primary btn-block lg" style={{ marginTop: 24 }}>
                {isKin ? 'Subira inyuma' : 'Back to Login'}
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h1>{isKin ? 'Wibagiwe ijambo ry\'ibanga?' : 'Forgot password?'}</h1>
              <p className="sub">
                {isKin
                  ? 'Andika imeyili yawe hano kandi tuzagutumaho ijambo ryo guhindura ijambo ryibanga.'
                  : "Enter your email and we'll send you a link to reset your password."}
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="field">
                  <span className="label">Email</span>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jean@example.com"
                    required
                  />
                </div>

                {error && (
                  <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--error-dim)', color: 'var(--error)', fontSize: 16 }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading || !email.trim()} className="btn btn-primary btn-block lg">
                  {loading ? (
                    <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
                    </svg>
                  ) : <>{isKin ? 'Ohereza link yo guhindura ijambo ry\'ibanga' : 'Send reset link'} <ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="auth-alt">
                <button type="button" onClick={onBack}>{isKin ? 'Subira inyuma' : 'Back to login'}</button>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
