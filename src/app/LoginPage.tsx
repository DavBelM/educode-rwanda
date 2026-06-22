import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export default function LoginPage({ onSuccess, onSignupClick, onForgotPassword }: {
  onSuccess?: () => void;
  onSignupClick?: () => void;
  onForgotPassword?: () => void;
}) {
  usePageTitle('Log In · EduCode');
  const { signIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError('Email or password is incorrect');
      setLoading(false);
      return;
    }
    onSuccess?.();
  };

  return (
    <div className="auth">
      {/* LEFT PANEL */}
      <aside className="auth-aside">
        <a className="logo" href="/"><span className="edu">EduCode</span></a>
        <div className="aside-mid">
          <h2>Pick up where you left off.</h2>
          <p>Your streak, your progress, and Mwarimu&apos;s notes are waiting exactly where you stopped.</p>
          <div className="code aside-code">
            <div className="code-bar">
              <span className="code-dots"><i></i><i></i><i></i></span>
              <span className="fname">streak.js</span>
            </div>
            <pre>
              <span style={{ color: 'var(--cream)' }}>const</span>
              {' '}<span style={{ color: 'var(--text)' }}>days</span>
              <span style={{ color: 'var(--text-2)' }}> = </span>
              <span style={{ color: 'var(--text)' }}>12</span>
              <span style={{ color: 'var(--text-2)' }}>;</span>{'\n'}
              <span style={{ color: 'var(--text-3)' }}>{'// keep it going today'}</span>
              <span className="mock-cursor" />
            </pre>
          </div>
        </div>
        <div className="aside-foot">Built for Rwandan technical secondary schools.</div>
      </aside>

      {/* RIGHT : FORM */}
      <main className="auth-main">
        <div className="auth-top">
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

        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="sub">Log in to continue learning.</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="field">
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="aline.u@school.rw"
                autoComplete="username"
              />
            </div>

            <div className="field">
              <div className="label-row">
                <span className="label">Password</span>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13, padding: 0 }}
                >
                  Forgot?
                </button>
              </div>
              <div className="input-group">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-affix"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}
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

            <label className="checkbox">
              <input type="checkbox" defaultChecked/> Keep me signed in on this computer
            </label>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--error-dim)', color: 'var(--error)', fontSize: 14 }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary btn-block lg" type="submit" disabled={loading}>
              {loading ? (
                <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
                </svg>
              ) : 'Log in'}
            </button>
          </form>

          <div className="or" style={{ margin: '22px 0' }}>on a shared computer?</div>
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={onSignupClick}
            style={{ width: '100%' }}
          >
            Use a class code instead
          </button>

          <p className="auth-alt">
            New to EduCode?{' '}
            <button type="button" onClick={onSignupClick}>Create an account</button>
          </p>
        </div>
      </main>
    </div>
  );
}
