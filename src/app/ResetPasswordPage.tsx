import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  onDone: () => void;
}

export default function ResetPasswordPage({ onDone }: Props) {
  usePageTitle('Reset Password · EduCode');
  const { updatePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const isKin = language === 'KIN';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const isStrong = password.length >= 8;
  const matches = password === confirm;

  const pwStrength = (() => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 8) return { strength: 1, label: isKin ? 'Ni ryoroshye cyane' : 'Weak', color: 'var(--error)' };
    if (password.length < 10) return { strength: 2, label: isKin ? 'Ririringaniye' : 'Fair', color: 'var(--accent)' };
    return { strength: 3, label: isKin ? 'Rikomeye' : 'Strong', color: 'var(--text)' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrong) {
      setError(isKin ? 'Ijambo ry\'ibanga rigomba kuba rifite nibura inyuguti 8.' : 'Password must be at least 8 characters.');
      return;
    }
    if (!matches) {
      setError(isKin ? 'Amagambo y\'ibanga ntahuye.' : 'Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await updatePassword(password);
    if (error) {
      setError(isKin ? 'Hari ikibazo. Gerageza nanone.' : 'Something went wrong. Please try again.');
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  return (
    <div className="auth">
      {/* LEFT PANEL */}
      <aside className="auth-aside">
        <a className="logo" href="/"><span className="edu">EduCode</span></a>
        <div className="aside-mid">
          <h2>{isKin ? 'Wige programming mu rurimi rwawe' : 'Learn programming in your language'}</h2>
          <p>{isKin ? 'Ibisobanuro mu Kinyarwanda. Buri kosa risobanurwa.' : 'Error explanations in Kinyarwanda. Built for Rwanda.'}</p>
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
          {done ? (
            <div className="text-center">
              <div className="iconbtn" style={{ width: 56, height: 56, margin: '0 auto 20px', pointerEvents: 'none' }}>
                <CheckCircle size={26} />
              </div>
              <h1>{isKin ? 'Ijambo ry\'ibanga ryahinduwe neza!' : 'Password updated!'}</h1>
              <p className="sub">
                {isKin ? 'Urashobora kwinjira ukoresheje ijambo ry\'ibanga rishya.' : 'You can now log in with your new password.'}
              </p>
              <button onClick={onDone} className="btn btn-primary btn-block lg" style={{ marginTop: 24 }}>
                {isKin ? 'Jya kwinjira' : 'Go to Login'} <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <h1>{isKin ? 'Shyiraho ijambo ry\'ibanga rishya' : 'Set new password'}</h1>
              <p className="sub">
                {isKin ? 'Hitamo ijambo ry\'ibanga rishya kandi rikomeye.' : 'Choose a strong new password for your account.'}
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                {/* New password */}
                <div className="field">
                  <span className="label">{isKin ? 'Ijambo ry\'ibanga rishya' : 'New password'}</span>
                  <div className="input-group">
                    <input
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="input-affix"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
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
                  {/* Strength indicator */}
                  {password && (
                    <div className="pw-strength">
                      <div className="pw-bars">
                        {[1, 2, 3].map(lvl => (
                          <div key={lvl} className="pw-bar" style={{ background: lvl <= pwStrength.strength ? pwStrength.color : undefined }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{pwStrength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="field">
                  <span className="label">{isKin ? 'Subiramo ijambo ry\'ibanga' : 'Confirm password'}</span>
                  <div className="input-group">
                    <input
                      className="input"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={confirm && !matches ? { borderColor: 'var(--error)' } : undefined}
                    />
                    <button
                      type="button"
                      className="input-affix"
                      onClick={() => setShowConfirm(p => !p)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showConfirm ? (
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
                  {confirm && !matches && (
                    <p className="text-xs mt-1.5" style={{ color: 'var(--error)' }}>
                      {isKin ? 'Amagambo y\'ibanga ntahuye.' : 'Passwords do not match.'}
                    </p>
                  )}
                </div>

                {error && (
                  <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--error-dim)', color: 'var(--error)', fontSize: 16 }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading || !isStrong || !matches} className="btn btn-primary btn-block lg">
                  {loading ? (
                    <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
                    </svg>
                  ) : <>{isKin ? 'Hindura ijambo ry\'ibanga' : 'Update password'} <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
