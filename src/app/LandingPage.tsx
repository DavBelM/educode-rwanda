import { useState } from 'react';
import { Code2, BookOpen, LayoutDashboard, ArrowRight, Menu, X, Sparkles, Zap, Globe } from 'lucide-react';

interface Props {
  onLogin?: () => void;
  onSignup?: () => void;
  onSchoolSignup?: () => void;
}

export default function LandingPage({ onLogin, onSignup, onSchoolSignup }: Props) {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [menuOpen, setMenuOpen] = useState(false);
  const isKin = language === 'KIN';

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', background: '#0d0f14', color: '#f1f5f9' }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(13,15,20,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0ea5e9' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 6H16M8 12H16M8 18H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-base font-bold" style={{ color: '#f1f5f9' }}>EduCode Rwanda</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium transition-colors" style={{ color: '#94a3b8' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >
              {isKin ? 'Ibiranga' : 'Features'}
            </a>
            <a href="#for-schools" className="text-sm font-medium transition-colors" style={{ color: '#94a3b8' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >
              {isKin ? 'Amashuri' : 'For Schools'}
            </a>

            {/* Language toggle */}
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setLanguage('EN')}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: language === 'EN' ? 'rgba(0,212,170,0.15)' : 'transparent',
                  color: language === 'EN' ? '#00d4aa' : '#475569',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('KIN')}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: language === 'KIN' ? 'rgba(0,212,170,0.15)' : 'transparent',
                  color: language === 'KIN' ? '#00d4aa' : '#475569',
                }}
              >
                KIN
              </button>
            </div>

            <button
              onClick={onLogin}
              className="text-sm font-semibold transition-colors"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >
              {isKin ? 'Injira' : 'Log In'}
            </button>
            <button
              onClick={onSignup}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: '#00d4aa', color: '#0d0f14' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#00bfa0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#00d4aa')}
            >
              {isKin ? 'Tangira Kubusa' : 'Get Started Free'}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden transition-colors"
            style={{ color: '#94a3b8' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 py-4 flex flex-col gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#13161e' }}>
            <button onClick={onLogin} className="text-sm font-semibold text-left" style={{ color: '#94a3b8' }}>
              {isKin ? 'Injira' : 'Log In'}
            </button>
            <button
              onClick={onSignup}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-center"
              style={{ background: '#00d4aa', color: '#0d0f14' }}
            >
              {isKin ? 'Tangira Kubusa' : 'Get Started Free'}
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center relative">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute top-20 left-1/4 w-[400px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}>
          <Sparkles size={12} />
          {isKin ? 'Uburezi bwa Code mu Rwanda' : 'AI-Powered Coding Education for Rwanda'}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          {isKin ? (
            <>Wige Programming<br /><span style={{ color: '#00d4aa' }}>mu Kinyarwanda</span></>
          ) : (
            <>Learn to Code<br /><span style={{ color: '#00d4aa' }}>in Your Language</span></>
          )}
        </h1>

        <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#64748b' }}>
          {isKin
            ? 'Uburezi bwa JavaScript bufite AI ikuganirira mu rurimi rwawe. Buri kosa ukoze, ubona ibisobanuro bijyanye na we.'
            : 'JavaScript education with an AI tutor that explains your errors in Kinyarwanda. Built for Rwandan TVET students and teachers.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={onSignup}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: '#00d4aa', color: '#0d0f14', boxShadow: '0 0 24px rgba(0,212,170,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(0,212,170,0.45)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(0,212,170,0.3)'; }}
          >
            {isKin ? 'Tangira Kwiga Kubusa' : 'Start Learning Free'}
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onSchoolSignup}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', background: 'rgba(255,255,255,0.04)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = '#f1f5f9'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
          >
            {isKin ? 'Ishuri Ryawe' : 'For Schools'}
          </button>
        </div>

        {/* Product preview */}
        <div className="rounded-2xl overflow-hidden max-w-4xl mx-auto" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)' }}>
          {/* Window chrome */}
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#1a1e2a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
            <span className="ml-3 text-xs font-mono" style={{ color: '#475569' }}>variables-practice.js</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Code editor preview */}
            <div className="p-6 text-left font-mono text-sm" style={{ background: '#0d1117' }}>
              <div style={{ color: '#475569' }} className="mb-1">{'// Calculate total price'}</div>
              <div>
                <span style={{ color: '#c792ea' }}>const </span>
                <span style={{ color: '#82aaff' }}>price</span>
                <span style={{ color: '#f1f5f9' }}> = </span>
                <span style={{ color: '#f78c6c' }}>500000</span>
                <span style={{ color: '#f1f5f9' }}>;</span>
              </div>
              <div>
                <span style={{ color: '#c792ea' }}>const </span>
                <span style={{ color: '#82aaff' }}>quantity</span>
                <span style={{ color: '#f1f5f9' }}> = </span>
                <span style={{ color: '#f78c6c' }}>2</span>
                <span style={{ color: '#f1f5f9' }}>;</span>
              </div>
              <div className="mt-2">
                <span style={{ color: '#c792ea' }}>const </span>
                <span style={{ color: '#82aaff' }}>total</span>
                <span style={{ color: '#f1f5f9' }}> = price * quantity;</span>
              </div>
              <div className="mt-2">
                <span style={{ color: '#82aaff' }}>console</span>
                <span style={{ color: '#f1f5f9' }}>.log(</span>
                <span style={{ color: '#c3e88d' }}>"Total: "</span>
                <span style={{ color: '#f1f5f9' }}> + total);</span>
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#475569' }}>{'> '}</span>
                <span style={{ color: '#00d4aa' }}>Total: 1000000</span>
              </div>
            </div>

            {/* AI feedback preview */}
            <div className="p-6 text-left" style={{ background: '#13161e', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>
                  <Sparkles size={16} style={{ color: '#8b5cf6' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>AI Tutor</p>
                  <p className="text-xs" style={{ color: '#475569' }}>{isKin ? 'Ibisobanuro by\'AI' : 'Personalized feedback'}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: '#00d4aa' }}>✅ {isKin ? 'Byakoze neza!' : 'Well done!'}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
                  {isKin
                    ? 'Kode yawe ikora neza. Ukoresheje variables neza.'
                    : 'Your code works perfectly. Variables used correctly.'}
                </p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#a78bfa' }}>
                  {isKin ? 'Icyifuzo:' : 'Next challenge:'}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
                  {isKin
                    ? 'Gerageza kongeraho discout niba umubare w\'ibicuruzwa uri hejuru ya 5.'
                    : 'Try adding a 10% discount when quantity is over 5.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { value: 'TVET', label: isKin ? 'Amashuri' : 'Schools' },
            { value: 'EN + KIN', label: isKin ? 'Indimi' : 'Languages' },
            { value: 'AI', label: isKin ? 'Igishishwa cy\'AI' : 'Powered' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-2xl font-bold mb-1" style={{ color: '#00d4aa' }}>{s.value}</p>
              <p className="text-sm" style={{ color: '#475569' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
              {isKin ? 'Ibiranga Byacu' : 'What Makes Us Different'}
            </h2>
            <p className="max-w-xl mx-auto text-base leading-relaxed" style={{ color: '#64748b' }}>
              {isKin
                ? 'Ntabwo ari porogaramu nk\'izindi. Yakozwe ku buryo bw\'abanyeshuri b\'u Rwanda.'
                : 'Not another generic coding platform. Built around how Rwandan students actually learn.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles size={22} style={{ color: '#8b5cf6' }} />,
                iconBg: 'rgba(139,92,246,0.12)',
                iconBorder: 'rgba(139,92,246,0.25)',
                accent: '#8b5cf6',
                title: isKin ? 'AI Ikuganirira mu Kinyarwanda' : 'AI Feedback in Kinyarwanda',
                description: isKin
                  ? 'Buri kosa ryawe risobanurwa mu rurimi rwawe. Ntabwo ugomba gusobanukirwa Icyongereza mbere yo gusobanukiwa kode.'
                  : "Every error explained in your language. You shouldn't need to understand English before you understand code."
              },
              {
                icon: <Code2 size={22} style={{ color: '#00d4aa' }} />,
                iconBg: 'rgba(0,212,170,0.12)',
                iconBorder: 'rgba(0,212,170,0.25)',
                accent: '#00d4aa',
                title: isKin ? 'Amasomo ya JavaScript' : 'Structured JavaScript Course',
                description: isKin
                  ? 'Tangira ku basics ukagera ku mashusho. Variables, loops, functions, arrays — byose bifite ibisobanuro birambuye.'
                  : 'From variables to DOM projects. A full beginner curriculum with exercises built for self-learners and school students.'
              },
              {
                icon: <LayoutDashboard size={22} style={{ color: '#f59e0b' }} />,
                iconBg: 'rgba(245,158,11,0.12)',
                iconBorder: 'rgba(245,158,11,0.25)',
                accent: '#f59e0b',
                title: isKin ? 'Dashboard y\'Abarimu' : 'Teacher Dashboard',
                description: isKin
                  ? 'Abarimu babona iterambere ry\'umunyeshuri wese. AI ibabwira uwabuze mbere yuko bashaka ubufasha.'
                  : "Teachers see every student's progress. AI alerts flag who needs help before they fall behind."
              }
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 transition-all"
                style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${f.accent}33`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${f.accent}10`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.06)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: f.iconBg, border: `1px solid ${f.iconBorder}` }}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: '#f1f5f9' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: '#13161e', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-12" style={{ color: '#f1f5f9' }}>
            {isKin ? 'Ukora Ite?' : 'How It Works'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <Globe size={20} style={{ color: '#00d4aa' }} />, title: isKin ? 'Iyandikishe' : 'Sign Up Free', desc: isKin ? 'Fungura konti mu masegonda make.' : 'Create your account in seconds. No credit card needed.' },
              { step: '02', icon: <Code2 size={20} style={{ color: '#8b5cf6' }} />, title: isKin ? 'Wige no Gukora' : 'Learn & Code', desc: isKin ? 'Kora imyitozo ya JavaScript ikurikirana neza.' : 'Work through structured JavaScript exercises at your own pace.' },
              { step: '03', icon: <Zap size={20} style={{ color: '#f59e0b' }} />, title: isKin ? 'Bona Ibisobanuro bya AI' : 'Get AI Feedback', desc: isKin ? 'AI ikuganirira ibisobanuro mu rurimi rwawe.' : 'Instant explanations in Kinyarwanda or English when you get stuck.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.12)', color: '#475569' }}>{i + 1}</span>
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: '#f1f5f9' }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Schools CTA */}
      <section id="for-schools" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl p-10 md:p-16 text-center relative overflow-hidden" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,212,170,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa' }}>
                <BookOpen size={12} />
                {isKin ? 'Amashuri' : 'For Schools & Teachers'}
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                {isKin ? 'Ishuri Ryawe Rikeneye EduCode?' : 'Bring EduCode to Your School'}
              </h2>
              <p className="max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: '#64748b' }}>
                {isKin
                  ? 'Twebwe dukora na mashuri menshi mu Rwanda. Tanga ubusabe ubone demo y\'ubuntu.'
                  : "We're partnering with TVET schools across Rwanda. Request a free demo and see how teachers can track every student's progress."}
              </p>
              <button
                onClick={onSchoolSignup}
                className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: '#00d4aa', color: '#0d0f14', boxShadow: '0 0 24px rgba(0,212,170,0.25)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}
              >
                {isKin ? 'Saba Demo y\'Ubuntu' : 'Request a Free Demo'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0ea5e9' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M8 6H16M8 12H16M8 18H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold" style={{ color: '#f1f5f9' }}>EduCode Rwanda</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: '#475569' }}>
            <button onClick={onLogin} className="transition-colors"
              onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            >
              {isKin ? 'Injira' : 'Log In'}
            </button>
            <button onClick={onSignup} className="transition-colors"
              onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            >
              {isKin ? 'Iyandikishe' : 'Sign Up'}
            </button>
            <span>© 2026 EduCode Rwanda</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
