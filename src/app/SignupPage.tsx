import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function SignupPage({ onSuccess, onLoginClick }: { onSuccess?: () => void; onLoginClick?: () => void }) {
  const { signUp } = useAuth();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    userType: '',
    preferredLanguage: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isKinyarwanda = language === 'KIN';

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: isKinyarwanda ? 'Ntacyo bitwaye' : 'Weak' };
    if (password.length < 10) return { strength: 2, label: isKinyarwanda ? 'Hagati' : 'Medium' };
    return { strength: 3, label: isKinyarwanda ? 'Byiza' : 'Strong' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const langMap: Record<string, 'en' | 'kin' | 'both'> = {
    english: 'en', kinyarwanda: 'kin', both: 'both'
  };
  const typeMap: Record<string, 'student' | 'teacher' | 'self_learner'> = {
    student: 'student', teacher: 'teacher', 'self-learner': 'self_learner'
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
      preferredLanguage: langMap[formData.preferredLanguage] ?? 'en'
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

  const inputStyle = (hasError = false) => ({
    height: '48px',
    background: '#13161e',
    border: hasError ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
    color: '#f1f5f9',
  });

  const strengthColors = ['#ef4444', '#f59e0b', '#22c55e'];

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
            <div className="text-8xl font-mono mb-6" style={{ color: '#00d4aa', textShadow: '0 0 40px rgba(0,212,170,0.3)' }}>&lt;/&gt;</div>
            <div className="flex items-center justify-center gap-5 text-3xl font-mono">
              <span style={{ color: '#8b5cf6' }}>{'{ }'}</span>
              <span style={{ color: '#0ea5e9' }}>{'[ ]'}</span>
              <span style={{ color: '#f59e0b' }}>{'( )'}</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="relative z-10 space-y-3">
          {[
            isKinyarwanda ? 'Nta karita ya kirimiti ikenewe' : 'No credit card required',
            isKinyarwanda ? 'Imishinga 5 kubusa kugirango utangire' : '5 free assignments to get started',
            isKinyarwanda ? 'Ibisobanuro mu Kinyarwanda' : 'AI feedback in Kinyarwanda',
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 size={14} style={{ color: '#00d4aa' }} />
              <span className="text-sm" style={{ color: '#94a3b8' }}>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto" style={{ background: '#0d0f14' }}>
        <div className="w-full max-w-md py-8">

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
            {isKinyarwanda ? 'Tangira Kwiga None' : 'Start Learning Today'}
          </h1>
          <p className="mb-8 text-sm" style={{ color: '#64748b' }}>
            {isKinyarwanda
              ? 'Kora konti yawe kubusa mu masegonda 30'
              : 'Create your free account in 30 seconds'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                {isKinyarwanda ? 'Amazina Yose' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={isKinyarwanda ? 'Jean Mugisha' : 'Jean Mugisha'}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={inputStyle()}
                  onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                {isKinyarwanda ? 'Email' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean@example.com"
                  className="w-full pl-11 pr-10 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={inputStyle()}
                  onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
                {formData.email && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {formData.email.includes('@') && formData.email.includes('.') ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#22c55e' }} />
                    ) : (
                      <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
                    )}
                  </div>
                )}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={inputStyle()}
                  onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="h-1.5 flex-1 rounded-full transition-all"
                        style={{
                          background: level <= passwordStrength.strength
                            ? strengthColors[passwordStrength.strength - 1]
                            : 'rgba(255,255,255,0.06)'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: '#475569' }}>
                    {passwordStrength.label} {isKinyarwanda ? 'imbaraga' : 'strength'}
                  </p>
                </div>
              )}
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>
                {isKinyarwanda ? 'Ndi:' : 'I am a:'}
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'student', label: isKinyarwanda ? 'Umunyeshuri' : 'Student' },
                  { value: 'teacher', label: isKinyarwanda ? 'Umwarimu' : 'Teacher' },
                  { value: 'self-learner', label: isKinyarwanda ? 'Nwiga wenyine' : 'Self-Learner' }
                ].map((type) => (
                  <label
                    key={type.value}
                    className="flex-1 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-center"
                    style={{
                      background: formData.userType === type.value ? 'rgba(0,212,170,0.12)' : 'rgba(255,255,255,0.03)',
                      border: formData.userType === type.value ? '1px solid rgba(0,212,170,0.35)' : '1px solid rgba(255,255,255,0.06)',
                      color: formData.userType === type.value ? '#00d4aa' : '#64748b',
                    }}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={formData.userType === type.value}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-xs font-semibold">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#94a3b8' }}>
                {isKinyarwanda ? 'Ururimi nkunda:' : 'Preferred language:'}
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'english', label: 'English' },
                  { value: 'kinyarwanda', label: 'Kinyarwanda' },
                  { value: 'both', label: isKinyarwanda ? 'Byombi' : 'Both' }
                ].map((lang) => (
                  <label
                    key={lang.value}
                    className="flex-1 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-center"
                    style={{
                      background: formData.preferredLanguage === lang.value ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                      border: formData.preferredLanguage === lang.value ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.06)',
                      color: formData.preferredLanguage === lang.value ? '#a78bfa' : '#64748b',
                    }}
                  >
                    <input
                      type="radio"
                      name="preferredLanguage"
                      value={lang.value}
                      checked={formData.preferredLanguage === lang.value}
                      onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-xs font-semibold">{lang.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className="w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: agreedToTerms ? '#00d4aa' : 'transparent',
                    border: agreedToTerms ? '1px solid #00d4aa' : '1px solid rgba(255,255,255,0.15)',
                  }}
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                >
                  {agreedToTerms && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0d0f14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="sr-only" />
                <span className="text-xs" style={{ color: '#64748b' }}>
                  {isKinyarwanda ? 'Nemera' : 'I agree to the'}{' '}
                  <span className="font-semibold" style={{ color: '#00d4aa' }}>
                    {isKinyarwanda ? 'Amabwiriza' : 'Terms of Service'}
                  </span>{' '}
                  {isKinyarwanda ? 'na' : 'and'}{' '}
                  <span className="font-semibold" style={{ color: '#00d4aa' }}>
                    {isKinyarwanda ? 'Politiki y\'ibanga' : 'Privacy Policy'}
                  </span>
                </span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa' }}>
                {isKinyarwanda
                  ? 'Konti yakozwe! Reba email yawe kugirango wemeze.'
                  : 'Account created! Check your email to confirm.'}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ height: '48px', background: '#00d4aa', color: '#0d0f14', boxShadow: '0 0 20px rgba(0,212,170,0.25)' }}
              onMouseEnter={e => { if (!loading && agreedToTerms) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0d0f14', borderTopColor: 'transparent' }} />
              ) : (
                <>
                  {isKinyarwanda ? "Iyandikishe — Ni ubuntu!" : "Sign Up — It's Free!"}
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

            {/* Login Link */}
            <div className="text-center text-sm">
              <span style={{ color: '#475569' }}>
                {isKinyarwanda ? 'Usanzwe ufite konti?' : 'Already have an account?'}{' '}
              </span>
              <button
                type="button"
                onClick={onLoginClick}
                className="font-semibold transition-colors"
                style={{ color: '#00d4aa' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00bfa0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#00d4aa')}
              >
                {isKinyarwanda ? 'Injira' : 'Log In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
