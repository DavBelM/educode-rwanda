import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

type Step = 'code' | 'details' | 'done';

interface ClassInfo {
  class_name: string;
  join_code: string;
}

export default function JoinPage() {
  usePageTitle('Join a Class · EduCode');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<Step>('code');
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loginEmail, setLoginEmail] = useState('');

  // Step 1 state
  const [code, setCode] = useState(searchParams.get('code') ?? '');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState('');

  // Step 2 state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length < 4) return;
    setCodeLoading(true);
    setCodeError('');
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send minimal body just to validate the code; full submission happens in step 2
        body: JSON.stringify({ join_code: code.trim(), full_name: '__probe__', password: '______' }),
      });
      const json = await res.json();
      if (res.status === 404) {
        setCodeError('Class not found — check the code and try again.');
      } else if (res.ok) {
        setClassInfo({ class_name: json.class_name, join_code: code.trim().toUpperCase() });
        setStep('details');
      } else {
        // Any non-404 error with a recognisable code means the code is valid
        setClassInfo({ class_name: 'Your class', join_code: code.trim().toUpperCase() });
        setStep('details');
      }
    } catch {
      setCodeError('Could not reach the server — check your connection.');
    } finally {
      setCodeLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || password.length < 6 || !classInfo) return;
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          join_code: classInfo.join_code,
          full_name: fullName.trim(),
          password,
          email: email.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error ?? 'Something went wrong. Try again.');
        return;
      }
      setLoginEmail(json.login_email);
      setStep('done');
    } catch {
      setSubmitError('Could not reach the server — check your connection.');
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'var(--bg)' }}>

      {/* Logo / wordmark */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
          EduCode<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>Rwanda</div>
      </div>

      <div className="card pad-lg" style={{ width: '100%', maxWidth: 400 }}>

        {/* ── Step 1: Enter join code ────────────────────────────────────────── */}
        {step === 'code' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Join a class</h1>
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Enter the 6-letter code your teacher gave you.</p>
            </div>

            <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field">
                <label className="label">Class code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError(''); }}
                  placeholder="e.g. AB3K7X"
                  className="input"
                  maxLength={8}
                  autoFocus
                  style={{ fontFamily: 'var(--mono)', letterSpacing: '0.15em', fontSize: 20, textTransform: 'uppercase' }}
                />
              </div>

              {codeError && (
                <p style={{ fontSize: 13, color: 'var(--error, #f87171)', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 'var(--radius)', padding: '8px 12px' }}>
                  {codeError}
                </p>
              )}

              <button type="submit" className="btn btn-primary" disabled={code.trim().length < 4 || codeLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {codeLoading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={16} />}
                {codeLoading ? 'Checking...' : 'Find class'}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button
                onClick={() => navigate('/login')}
                style={{ fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Already have an account? Log in
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Enter name + password ──────────────────────────────────── */}
        {step === 'details' && classInfo && (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: 'var(--accent-soft)', border: '1px solid var(--accent)', marginBottom: 12 }}>
                <CheckCircle size={13} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>{classInfo.class_name}</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Create your account</h1>
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Set up your name and a password. Email is optional.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label className="label">Your full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Ange Mukamana"
                  className="input"
                  autoFocus
                />
              </div>

              <div className="field">
                <label className="label">
                  Email <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional — we'll generate one if blank)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input"
                />
              </div>

              <div className="field">
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="input"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {password.length > 0 && password.length < 6 && (
                  <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Must be at least 6 characters</p>
                )}
              </div>

              {submitError && (
                <p style={{ fontSize: 13, color: 'var(--error, #f87171)', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 'var(--radius)', padding: '8px 12px' }}>
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!fullName.trim() || password.length < 6 || submitLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {submitLoading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
                {submitLoading ? 'Creating account...' : 'Create account & join'}
              </button>
            </form>

            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <button
                onClick={() => { setStep('code'); setSubmitError(''); }}
                style={{ fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Wrong code? Go back
              </button>
            </div>
          </>
        )}

        {/* ── Step 3: Done ───────────────────────────────────────────────────── */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>You're in!</h1>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 20 }}>
              Your account has been created and you've been enrolled in <strong>{classInfo?.class_name}</strong>.
            </p>

            <div style={{ padding: '14px 16px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)', textAlign: 'left', marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Save your login email
              </p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text)', wordBreak: 'break-all' }}>{loginEmail}</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>
                Use this email + your password to log in. Write it down or screenshot this screen.
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
              style={{ width: '100%' }}
            >
              Log in now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
