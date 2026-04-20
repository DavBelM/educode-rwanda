import { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface Props {
  onBack: () => void;
}

export default function ForgotPasswordPage({ onBack }: Props) {
  const { requestPasswordReset } = useAuth();
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
      setError(isKin ? 'Hari ikibazo. Gerageza nanone.' : 'Something went wrong. Please try again.');
    } else {
      setSent(true);
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
          <div className="text-center">
            <div className="text-8xl font-mono mb-6" style={{ color: '#8b5cf6', textShadow: '0 0 40px rgba(139,92,246,0.3)' }}>&lt;/&gt;</div>
          </div>
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

          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)' }}>
                <CheckCircle size={32} style={{ color: '#00d4aa' }} />
              </div>
              <h1 className="text-2xl font-bold mb-3" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                {isKin ? 'Imeyili yoherejwe!' : 'Email sent!'}
              </h1>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: '#64748b' }}>
                {isKin
                  ? `Twoherereje ijambo ryo guhindura ijambo ryibanga kuri ${email}. Reba imbwiriza mu imeyili yawe.`
                  : `We sent a password reset link to ${email}. Check your inbox and follow the instructions.`}
              </p>
              <button onClick={onBack}
                className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{ height: '48px', background: '#00d4aa', color: '#0d0f14' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#00bfa0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#00d4aa')}>
                {isKin ? 'Garuka ku kwinjira' : 'Back to Login'}
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <button onClick={onBack}
                className="flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
                style={{ color: '#475569' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                <ArrowLeft size={16} />
                {isKin ? 'Subira inyuma' : 'Back to login'}
              </button>

              <h1 className="text-3xl font-bold mb-2" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                {isKin ? 'Wibagiwe ijambo ryibanga?' : 'Forgot password?'}
              </h1>
              <p className="text-sm mb-8" style={{ color: '#64748b' }}>
                {isKin
                  ? 'Andika imeyili yawe hano kandi tuzagutumaho ijambo ryo guhindura ijambo ryibanga.'
                  : "Enter your email and we'll send you a link to reset your password."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8' }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="jean@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={{ height: '48px', background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9' }}
                      onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                      onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ height: '48px', background: '#00d4aa', color: '#0d0f14', boxShadow: '0 0 20px rgba(0,212,170,0.2)' }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}>
                  {loading
                    ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0d0f14', borderTopColor: 'transparent' }} />
                    : <>{isKin ? 'Ohereza ijambo ryo gusubiza' : 'Send reset link'} <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
