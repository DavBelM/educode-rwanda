import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SetPasswordPage({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.updateUser({
      password,
      data: { needs_password_change: false },
    });

    if (err) { setError(err.message); setLoading(false); return; }
    onDone();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="card pad-lg rise" style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔑</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Set your password</h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Your teacher created your account. Choose a personal password to continue — you will use it to log in every time.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label className="label">New password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className="input"
                style={{ paddingRight: 48 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-3)' }}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="field">
            <label className="label">Confirm password</label>
            <input
              type={showPw ? 'text' : 'password'}
              className="input"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: 'var(--error)', background: 'var(--error-dim)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 4 }}
            disabled={!password || !confirm || loading}
          >
            {loading ? 'Saving…' : 'Set password and continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
