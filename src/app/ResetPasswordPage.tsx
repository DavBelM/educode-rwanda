import { useState } from 'react';
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface Props {
  onDone: () => void;
}

export default function ResetPasswordPage({ onDone }: Props) {
  const { updatePassword } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrong) {
      setError(isKin ? 'Ijambo ryibanga rigomba kuba nibura inyuguti 8.' : 'Password must be at least 8 characters.');
      return;
    }
    if (!matches) {
      setError(isKin ? 'Amagambo yombi ntahuye.' : 'Passwords do not match.');
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
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif', background: '#0d0f14' }}>

      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: '#13161e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0ea5e9' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M8 6H16M8 12H16M8 18H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ color: '#f1f5f9' }}>EduCode Rwanda</span>
        </div>
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-8xl font-mono" style={{ color: '#8b5cf6', textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>&lt;/&gt;</div>
        </div>
        <div className="relative z-10">
          <p className="text-base font-semibold mb-2" style={{ color: '#f1f5f9' }}>
            {isKin ? 'Wige programming mu rurimi rwawe' : 'Learn programming in your language'}
          </p>
          <p className="text-sm" style={{ color: '#475569' }}>
            {isKin ? 'Ibisobanuro mu Kinyarwanda. Buri kosa risobanurwa.' : 'Error explanations in Kinyarwanda. Built for Rwanda.'}
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Language toggle */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['EN', 'KIN'] as const).map((lang, i) => (
                <button key={lang} onClick={() => setLanguage(lang)}
                  className="px-3 py-1.5 text-xs font-bold transition-all"
                  style={{
                    background: language === lang ? 'rgba(0,212,170,0.15)' : 'transparent',
                    color: language === lang ? '#00d4aa' : '#475569',
                    borderRight: i === 0 ? '1px solid rgba(255,255,255,0.08)' : undefined,
                  }}>
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)' }}>
                <CheckCircle size={32} style={{ color: '#00d4aa' }} />
              </div>
              <h1 className="text-2xl font-bold mb-3" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                {isKin ? 'Ijambo ryibanga ryahinduwe!' : 'Password updated!'}
              </h1>
              <p className="text-sm mb-8" style={{ color: '#64748b' }}>
                {isKin ? 'Injira ukoresheje ijambo ryibanga rishya.' : 'You can now log in with your new password.'}
              </p>
              <button onClick={onDone}
                className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{ height: '48px', background: '#00d4aa', color: '#0d0f14' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#00bfa0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#00d4aa')}>
                {isKin ? 'Injira' : 'Go to Login'} <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                {isKin ? 'Hinda ijambo ryibanga' : 'Set new password'}
              </h1>
              <p className="text-sm mb-8" style={{ color: '#64748b' }}>
                {isKin ? 'Hitamo ijambo ryibanga rishya kandi rikomeye.' : 'Choose a strong new password for your account.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                    {isKin ? 'Ijambo ryibanga rishya' : 'New password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3 rounded-xl text-sm focus:outline-none"
                      style={{ height: '48px', background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9' }}
                      onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                      onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#475569' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {password && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-1 w-8 rounded-full transition-all"
                            style={{ background: password.length >= i * 4 ? (password.length >= 10 ? '#00d4aa' : '#f59e0b') : 'rgba(255,255,255,0.08)' }} />
                        ))}
                      </div>
                      <span className="text-xs" style={{ color: password.length >= 10 ? '#00d4aa' : password.length >= 8 ? '#f59e0b' : '#f87171' }}>
                        {password.length >= 10 ? (isKin ? 'Rikomeye' : 'Strong') : password.length >= 8 ? (isKin ? 'Rirakwiye' : 'Fair') : (isKin ? 'Riraseseka' : 'Weak')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                    {isKin ? 'Porosha ijambo ryibanga' : 'Confirm password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3 rounded-xl text-sm focus:outline-none"
                      style={{
                        height: '48px', background: '#13161e', color: '#f1f5f9',
                        border: confirm && !matches ? '1px solid rgba(239,68,68,0.5)' : confirm && matches ? '1px solid rgba(0,212,170,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                      onFocus={e => { if (!confirm) e.target.style.border = '1px solid rgba(0,212,170,0.4)'; }}
                      onBlur={e => { if (!confirm) e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                    />
                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#475569' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm && !matches && (
                    <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>
                      {isKin ? 'Amagambo ntahuye.' : 'Passwords do not match.'}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isStrong || !matches}
                  className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ height: '48px', background: '#00d4aa', color: '#0d0f14', boxShadow: '0 0 20px rgba(0,212,170,0.2)' }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}>
                  {loading
                    ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0d0f14', borderTopColor: 'transparent' }} />
                    : <>{isKin ? 'Hinda ijambo ryibanga' : 'Update password'} <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
