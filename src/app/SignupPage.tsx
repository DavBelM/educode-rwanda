import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useTheme } from '../lib/theme';
import { usePageTitle } from '../hooks/usePageTitle';

export default function SignupPage({ onSuccess, onLoginClick }: {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}) {
  usePageTitle('Sign Up · EduCode');
  const { signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    userType: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getPasswordStrength = (pw: string) => {
    if (pw.length === 0) return { strength: 0, label: '', color: '' };
    if (pw.length < 6) return { strength: 1, label: 'Weak', color: 'var(--error)' };
    if (pw.length < 10) return { strength: 2, label: 'Medium', color: 'var(--accent)' };
    return { strength: 3, label: 'Strong', color: 'var(--text)' };
  };
  const pwStrength = getPasswordStrength(formData.password);

  const typeMap: Record<string, 'student' | 'teacher' | 'self_learner'> = {
    student: 'student', teacher: 'teacher', 'self-learner': 'self_learner',
  };

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      userType: typeMap[formData.userType] ?? 'student',
      preferredLanguage: 'en',
    });
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    onSuccess?.();
  };

  const set = (key: string, val: string) => setFormData(f => ({ ...f, [key]: val }));

  return (
    <div className="auth">
      {/* LEFT PANEL */}
      <aside className="auth-aside">
        <a className="logo" href="/"><span className="edu">EduCode</span></a>
        <div className="aside-mid">
          <h2>Start where you are.</h2>
          <p>No prior experience needed. Mwarimu explains everything in English or Kinyarwanda as you go.</p>
          <div className="code aside-code">
            <div className="code-bar">
              <span className="code-dots"><i></i><i></i><i></i></span>
              <span className="fname">hello.js</span>
            </div>
            <pre>
              <span style={{ color: 'var(--text-3)' }}>{'// Your first line of code'}</span>{'\n'}
              <span style={{ color: 'var(--text)' }}>console</span>
              <span style={{ color: 'var(--text-2)' }}>.</span>
              <span style={{ color: 'var(--text)' }}>log</span>
              <span style={{ color: 'var(--text-2)' }}>(</span>
              <span style={{ color: 'var(--text)' }}>&quot;Muraho, isi!&quot;</span>
              <span style={{ color: 'var(--text-2)' }}>);</span>
            </pre>
          </div>
        </div>
        <div className="aside-foot">No credit card required · Free to start</div>
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

        <div className="auth-card rise">
          <h1>Create your account</h1>
          <p className="sub">Free to start — no credit card needed.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Full name */}
            <div className="field">
              <span className="label">Full name</span>
              <input
                className="input"
                type="text"
                value={formData.fullName}
                onChange={e => set('fullName', e.target.value)}
                placeholder="Jean Mugisha"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="field">
              <span className="label">Email</span>
              <input
                className="input"
                type="text"
                value={formData.email}
                onChange={e => set('email', e.target.value)}
                placeholder="jean@example.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="field">
              <span className="label">Password</span>
              <div className="input-group">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
              {formData.password && (
                <div className="pw-strength">
                  <div className="pw-bars">
                    {[1, 2, 3].map(lvl => (
                      <div
                        key={lvl}
                        className="pw-bar"
                        style={{ background: lvl <= pwStrength.strength ? pwStrength.color : undefined }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{pwStrength.label} strength</span>
                </div>
              )}
            </div>

            {/* I am a */}
            <div className="field">
              <span className="label">I am a:</span>
              <div className="role-seg">
                {(['student', 'teacher', 'self-learner'] as const).map(v => (
                  <label key={v}>
                    <input
                      type="radio"
                      name="userType"
                      value={v}
                      checked={formData.userType === v}
                      onChange={e => set('userType', e.target.value)}
                    />
                    <span>{v === 'self-learner' ? 'Self-learner' : v.charAt(0).toUpperCase() + v.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms */}
            <label className="checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
              />
              {' '}I agree to the <span style={{ color: 'var(--text)', fontWeight: 500 }}>Terms of Service</span> and{' '}
              <span style={{ color: 'var(--text)', fontWeight: 500 }}>Privacy Policy</span>
            </label>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--error-dim)', color: 'var(--error)', fontSize: 14 }}>
                {error}
              </div>
            )}

            {success && (
              <div className="callout success">
                Account created! Check your email to confirm.
              </div>
            )}

            <button
              className="btn btn-primary btn-block lg"
              type="submit"
              disabled={loading || !agreedToTerms}
            >
              {loading ? (
                <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
                </svg>
              ) : "Sign up — It's free!"}
            </button>
          </form>

          <p className="auth-alt">
            Already have an account?{' '}
            <button type="button" onClick={onLoginClick}>Log in</button>
          </p>
        </div>
      </main>
    </div>
  );
}
