import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function LoginPage({ onSuccess, onSignupClick }: { onSuccess?: () => void; onSignupClick?: () => void }) {
  const { signIn } = useAuth();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isKinyarwanda = language === 'KIN';

  const handleLogin = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(isKinyarwanda
        ? 'Email cyangwa ijambo ryibanga ntibikora'
        : 'Email or password is incorrect'
      );
      setLoading(false);
      return;
    }

    // Keep spinner running — App.tsx will navigate once auth state changes
    onSuccess?.();
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif', background: '#0d0f14' }}>

      {/* Left Side - Brand panel */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: '#13161e', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0ea5e9' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M8 6H16M8 12H16M8 18H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ color: '#f1f5f9' }}>EduCode Rwanda</span>
        </div>

        {/* Center visual */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center">
            <div className="text-8xl font-mono mb-6" style={{ color: '#8b5cf6', textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>&lt;/&gt;</div>
            <div className="flex items-center justify-center gap-5 text-3xl font-mono">
              <span style={{ color: '#00d4aa' }}>{'{ }'}</span>
              <span style={{ color: '#0ea5e9' }}>{'[ ]'}</span>
              <span style={{ color: '#f59e0b' }}>{'( )'}</span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <p className="text-base font-semibold mb-2" style={{ color: '#f1f5f9' }}>
            {isKinyarwanda ? 'Wige programming mu rurimi rwawe' : 'Learn programming in your language'}
          </p>
          <p className="text-sm" style={{ color: '#475569' }}>
            {isKinyarwanda
              ? 'Ibisobanuro mu Kinyarwanda. Buri kosa risobanurwa.'
              : 'Error explanations in Kinyarwanda. Built for Rwanda.'}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: '#0d0f14' }}>
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0ea5e9' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 6H16M8 12H16M8 18H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#f1f5f9' }}>EduCode Rwanda</span>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setLanguage('EN')}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: language === 'EN' ? 'rgba(0,212,170,0.15)' : 'transparent',
                  color: language === 'EN' ? '#00d4aa' : '#475569',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                }}
              >EN</button>
              <button
                onClick={() => setLanguage('KIN')}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: language === 'KIN' ? 'rgba(0,212,170,0.15)' : 'transparent',
                  color: language === 'KIN' ? '#00d4aa' : '#475569',
                }}
              >KIN</button>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
            {isKinyarwanda ? 'Mwaramutse! Murakaza Neza' : 'Welcome Back'}
          </h1>
          <p className="mb-8 text-sm" style={{ color: '#64748b' }}>
            {isKinyarwanda ? 'Injira kugirango ukomeze kwiga' : 'Log in to continue learning'}
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                {isKinyarwanda ? 'Email' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={{
                    height: '48px',
                    background: '#13161e',
                    border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    color: '#f1f5f9',
                  }}
                  onFocus={e => { if (!error) e.target.style.border = '1px solid rgba(0,212,170,0.4)'; }}
                  onBlur={e => { if (!error) e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                {isKinyarwanda ? 'Ijambo ryibanga' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={{
                    height: '48px',
                    background: '#13161e',
                    border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    color: '#f1f5f9',
                  }}
                  onFocus={e => { if (!error) e.target.style.border = '1px solid rgba(0,212,170,0.4)'; }}
                  onBlur={e => { if (!error) e.target.style.border = '1px solid rgba(255,255,255,0.08)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#475569' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            {/* Forgot password */}
            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold transition-colors" style={{ color: '#475569' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00d4aa')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
              >
                {isKinyarwanda ? 'Wibagiwe ijambo ryibanga?' : 'Forgot Password?'}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ height: '48px', background: '#00d4aa', color: '#0d0f14', boxShadow: '0 0 20px rgba(0,212,170,0.25)' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0d0f14', borderTopColor: 'transparent' }} />
              ) : (
                <>
                  {isKinyarwanda ? 'Injira' : 'Log In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              <span className="px-3 text-xs" style={{ color: '#334155' }}>
                {isKinyarwanda ? 'CYANGWA' : 'OR'}
              </span>
              <div className="flex-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span style={{ color: '#475569' }}>
                {isKinyarwanda ? 'Ntabwo ufite konti?' : "Don't have an account?"}{' '}
              </span>
              <button
                type="button"
                onClick={onSignupClick}
                className="font-semibold transition-colors"
                style={{ color: '#00d4aa' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00bfa0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#00d4aa')}
              >
                {isKinyarwanda ? 'Iyandikishe' : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Security badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs" style={{ color: '#334155' }}>
            <Lock className="w-3 h-3" />
            <span>
              {isKinyarwanda
                ? 'Amakuru yawe arafite umutekano kandi yasobanuwe'
                : 'Your data is secure and encrypted'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
