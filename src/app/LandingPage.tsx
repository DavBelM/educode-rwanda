import { useState } from 'react';
import { Code2, BookOpen, LayoutDashboard, ArrowRight, Menu, X } from 'lucide-react';

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
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇷🇼</span>
            <span className="text-lg font-bold text-[#1e293b]">EduCode Rwanda</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-[#1e293b] font-medium">
              {isKin ? 'Ibiranga' : 'Features'}
            </a>
            <a href="#for-schools" className="text-sm text-gray-600 hover:text-[#1e293b] font-medium">
              {isKin ? 'Amashuri' : 'For Schools'}
            </a>

            {/* Language toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1.5 text-xs font-semibold transition-all ${language === 'EN' ? 'bg-[#0ea5e9] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('KIN')}
                className={`px-3 py-1.5 text-xs font-semibold transition-all ${language === 'KIN' ? 'bg-[#0ea5e9] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                KIN
              </button>
            </div>

            <button
              onClick={onLogin}
              className="text-sm font-semibold text-gray-700 hover:text-[#0ea5e9] transition-colors"
            >
              {isKin ? 'Injira' : 'Log In'}
            </button>
            <button
              onClick={onSignup}
              className="px-4 py-2 bg-[#0ea5e9] text-white text-sm font-semibold rounded-lg hover:bg-[#0284c7] transition-all"
            >
              {isKin ? 'Tangira Kubusa' : 'Get Started Free'}
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
            <button onClick={onLogin} className="text-sm font-semibold text-gray-700 text-left">
              {isKin ? 'Injira' : 'Log In'}
            </button>
            <button
              onClick={onSignup}
              className="px-4 py-2 bg-[#0ea5e9] text-white text-sm font-semibold rounded-lg text-center"
            >
              {isKin ? 'Tangira Kubusa' : 'Get Started Free'}
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
          <span className="w-2 h-2 bg-purple-500 rounded-full" />
          {isKin ? 'Uburezi bwa Code mu Rwanda' : 'Built for Rwanda'}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-[#1e293b] leading-tight mb-6">
          {isKin ? (
            <>Wige Programming<br /><span className="text-[#0ea5e9]">mu Kinyarwanda</span></>
          ) : (
            <>Learn Programming<br /><span className="text-[#0ea5e9]">in Kinyarwanda</span></>
          )}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          {isKin
            ? 'Uburezi bwa JavaScript bufite AI ikuganirira mu rurimi rwawe. Buri kosa ukoze, ubona ibisobanuro bijyanye na we.'
            : 'JavaScript education with an AI that explains your errors in your language. Built for Rwandan students and teachers.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onSignup}
            className="flex items-center gap-2 px-6 py-3 bg-[#0ea5e9] text-white font-semibold rounded-lg hover:bg-[#0284c7] transition-all shadow-md"
          >
            {isKin ? 'Tangira Kwiga Kubusa' : 'Start Learning Free'}
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onSchoolSignup}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            {isKin ? 'Ishuri Ryawe' : 'For Schools'}
          </button>
        </div>

        {/* Product preview */}
        <div className="mt-16 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-w-4xl mx-auto">
          <div className="bg-[#1e293b] px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 text-gray-400 text-xs font-mono">variables-practice.js</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Code editor preview */}
            <div className="bg-[#1e1e2e] p-6 text-left font-mono text-sm">
              <div className="text-gray-500 mb-1">{'// Calculate total price'}</div>
              <div>
                <span className="text-[#c792ea]">const </span>
                <span className="text-[#82aaff]">price</span>
                <span className="text-white"> = </span>
                <span className="text-[#f78c6c]">500000</span>
                <span className="text-white">;</span>
              </div>
              <div>
                <span className="text-[#c792ea]">const </span>
                <span className="text-[#82aaff]">quantity</span>
                <span className="text-white"> = </span>
                <span className="text-[#f78c6c]">2</span>
                <span className="text-white">;</span>
              </div>
              <div className="mt-2">
                <span className="text-[#c792ea]">const </span>
                <span className="text-[#82aaff]">total</span>
                <span className="text-white"> = price * quantity;</span>
              </div>
              <div className="mt-2">
                <span className="text-[#82aaff]">console</span>
                <span className="text-white">.log(</span>
                <span className="text-[#c3e88d]">"Total: "</span>
                <span className="text-white"> + total);</span>
              </div>
            </div>

            {/* AI feedback preview */}
            <div className="bg-white p-6 text-left border-l border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">🤖</div>
                <span className="text-sm font-semibold text-gray-800">AI Tutor</span>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                <p className="text-sm text-green-800 font-semibold mb-1">✅ {isKin ? 'Byakoze neza!' : 'Well done!'}</p>
                <p className="text-xs text-green-700">
                  {isKin
                    ? 'Kode yawe ikora neza. Ukoresheje variables neza.'
                    : 'Your code works perfectly. You used variables correctly.'}
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs font-semibold text-purple-800 mb-1">
                  {isKin ? 'Icyifuzo:' : 'Next challenge:'}
                </p>
                <p className="text-xs text-purple-700">
                  {isKin
                    ? 'Gerageza kongeraho discout niba umubare w\'ibicuruzwa uri hejuru ya 5.'
                    : 'Try adding a 10% discount when quantity is over 5.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1e293b] mb-4">
            {isKin ? 'Ibiranga Byacu' : 'What Makes Us Different'}
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            {isKin
              ? 'Ntabwo ari porogaramu nk\'izindi. Yakozwe ku buryo bw\'abanyeshuri b\'u Rwanda.'
              : 'Not another generic coding platform. Built around how Rwandan students actually learn.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code2 size={28} className="text-purple-600" />,
                bg: 'bg-purple-50',
                title: isKin ? 'AI Ikuganirira mu Kinyarwanda' : 'AI Feedback in Kinyarwanda',
                description: isKin
                  ? 'Buri kosa ryawe risobanurwa mu rurimi rwawe. Ntabwo ugomba gusobanukirwa Icyongereza mbere yo gusobanukiwa kode.'
                  : "Every error explained in your language. You shouldn't need to understand English before you understand code."
              },
              {
                icon: <BookOpen size={28} className="text-blue-600" />,
                bg: 'bg-blue-50',
                title: isKin ? 'Amasomo ya JavaScript' : 'Structured JavaScript Course',
                description: isKin
                  ? 'Tangira ku basics ukagera ku mashusho. Variables, loops, functions, arrays — byose bifite ibisobanuro birambuye.'
                  : 'From variables to projects. A full beginner curriculum with exercises built for self-learners and school students.'
              },
              {
                icon: <LayoutDashboard size={28} className="text-green-600" />,
                bg: 'bg-green-50',
                title: isKin ? 'Dashboard y\'Abarimu' : 'Teacher Dashboard',
                description: isKin
                  ? 'Abarimu babona iterambere ry\'umunyeshuri wese. AI ibabwira uwabuze mbere yuko bashaka ubufasha.'
                  : "Teachers see every student's progress. AI alerts flag who needs help before they give up."
              }
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1e293b] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Schools */}
      <section id="for-schools" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-[#0f172a] rounded-2xl p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {isKin ? 'Ishuri Ryawe Rikeneye EduCode?' : 'Is Your School Interested?'}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              {isKin
                ? 'Twebwe dukora na mashuri menshi mu Rwanda. Tanga ubusabe ubone demo y\'ubuntu.'
                : "We're working with schools across Rwanda. Request a free demo and we'll set you up."}
            </p>
            <button
              onClick={onSchoolSignup}
              className="px-8 py-3 bg-[#0ea5e9] text-white font-semibold rounded-lg hover:bg-[#0284c7] transition-all"
            >
              {isKin ? 'Saba Demo y\'Ubuntu' : 'Request a Free Demo'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇷🇼</span>
            <span className="font-bold text-[#1e293b]">EduCode Rwanda</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <button onClick={onLogin} className="hover:text-[#1e293b] transition-colors">
              {isKin ? 'Injira' : 'Log In'}
            </button>
            <button onClick={onSignup} className="hover:text-[#1e293b] transition-colors">
              {isKin ? 'Iyandikishe' : 'Sign Up'}
            </button>
            <span>© 2026 EduCode Rwanda</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
