import React, { useState } from 'react';
import { Check, ChevronRight, Menu, X, Globe, Star, School, Users, Target, BookOpen, Smartphone, BarChart3, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

export default function LandingPage() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const isKinyarwanda = language === 'KIN';

  const testimonials = [
    {
      name: 'Jean Mugisha',
      role: 'IPRC Kigali',
      photo: '👨‍🎓',
      quote: isKinyarwanda
        ? 'Byarankoresheje kwiga mu Kinyarwanda. Noneho ndumva JavaScript neza!'
        : 'Learning in Kinyarwanda helped so much. Now I understand JavaScript!',
      rating: 5
    },
    {
      name: 'Grace Uwase',
      role: isKinyarwanda ? 'Umwarimu w\'Informatique' : 'Computer Science Teacher',
      photo: '👩‍🏫',
      quote: isKinyarwanda
        ? 'AI itanga amakuru yihuse. Noneho nzi abanyeshuri bakenera ubufasha mbere yuko batinda.'
        : 'The AI alerts save me hours. I now know exactly which students need help before they fall behind.',
      rating: 5
    },
    {
      name: 'Paul Nkusi',
      role: isKinyarwanda ? 'Umuyobozi w\'amasomo' : 'Dean of Studies',
      photo: '👨‍💼',
      quote: isKinyarwanda
        ? '80% by\'abanyeshuri bacu bongeye amanota mu gukora code nyuma yo gukoresha EduCode Rwanda amezi 3.'
        : '80% of our students improved their coding scores after using EduCode Rwanda for 3 months.',
      rating: 5
    }
  ];

  const features = [
    {
      icon: '🤖',
      color: '#8b5cf6',
      title: isKinyarwanda ? 'AI yiga mu rurimi rwawe' : 'Bilingual AI Tutor',
      subtitle: isKinyarwanda ? 'Wige mu rurimi rwawe' : 'Learn in Your Language',
      description: isKinyarwanda
        ? 'Bona ibisubizo byihuse mu Kinyarwanda cyangwa Icyongereza. AI yacu yumva uburyo abanyeshuri b\'u Rwanda biga.'
        : 'Get instant feedback in Kinyarwanda or English. Our AI understands how Rwandan students learn.'
    },
    {
      icon: '🇷🇼',
      color: '#10b981',
      title: isKinyarwanda ? 'Imishinga y\'u Rwanda' : 'Real-World Projects',
      subtitle: isKinyarwanda ? 'Kubaka u Rwanda' : 'Build for Rwanda',
      description: isKinyarwanda
        ? 'Kora ibiciro bya MCC, sisitemu y\'amaticket ya bisi. Wige hamwe n\'imishinga ikomeye ku Rwanda.'
        : 'Calculate MCC prices, create bus ticketing systems. Learn with projects that matter to Rwanda.'
    },
    {
      icon: '📱',
      color: '#0ea5e9',
      title: isKinyarwanda ? 'Gukora offline' : 'Works Offline',
      subtitle: isKinyarwanda ? 'Wige ahantu hose' : 'Learn Anywhere',
      description: isKinyarwanda
        ? 'Nta murandasi ukomeye? Nta kibazo. Kora code offline, sync iyo uhuye na interineti.'
        : 'No stable internet? No problem. Code offline, sync when connected.'
    },
    {
      icon: '👨‍🏫',
      color: '#fbbf24',
      title: isKinyarwanda ? 'Dashboard y\'abarimu' : 'Teacher Dashboard',
      subtitle: isKinyarwanda ? 'AI ifasha abarimu' : 'AI Helps Teachers',
      description: isKinyarwanda
        ? 'Amakuru y\'ikiyomatike yerekana abanyeshuri bakenera ubufasha. Gucunga abanyeshuri 50+ byoroshye.'
        : 'Automatic insights show which students need help. Manage 50+ students effortlessly.'
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇷🇼</span>
              <span className="text-xl font-bold text-[#1e293b]">EduCode Rwanda</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-[#0ea5e9] font-medium">
                {isKinyarwanda ? 'Ibiranga' : 'Features'}
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#0ea5e9] font-medium">
                {isKinyarwanda ? 'Uburyo bukora' : 'How It Works'}
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-[#0ea5e9] font-medium">
                {isKinyarwanda ? 'Ibiciro' : 'Pricing'}
              </a>
              <a href="#schools" className="text-gray-700 hover:text-[#0ea5e9] font-medium">
                {isKinyarwanda ? 'Ku mashuri' : 'For Schools'}
              </a>
              <a href="#about" className="text-gray-700 hover:text-[#0ea5e9] font-medium">
                {isKinyarwanda ? 'Abo turi' : 'About Us'}
              </a>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Toggle */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('EN')}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                    language === 'EN' ? 'bg-[#0ea5e9] text-white' : 'text-gray-600'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('KIN')}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                    language === 'KIN' ? 'bg-[#0ea5e9] text-white' : 'text-gray-600'
                  }`}
                >
                  KIN
                </button>
              </div>
              <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                {isKinyarwanda ? 'Kwinjira' : 'Login'}
              </button>
              <button className="px-6 py-2 bg-[#0ea5e9] text-white rounded-lg font-semibold hover:bg-[#0284c7] transition-all shadow-md">
                {isKinyarwanda ? 'Kwiyandikisha' : 'Sign Up'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-gray-700 font-medium">
                  {isKinyarwanda ? 'Ibiranga' : 'Features'}
                </a>
                <a href="#how-it-works" className="text-gray-700 font-medium">
                  {isKinyarwanda ? 'Uburyo bukora' : 'How It Works'}
                </a>
                <a href="#pricing" className="text-gray-700 font-medium">
                  {isKinyarwanda ? 'Ibiciro' : 'Pricing'}
                </a>
                <div className="flex gap-2 pt-4">
                  <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold">
                    {isKinyarwanda ? 'Kwinjira' : 'Login'}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-[#0ea5e9] text-white rounded-lg font-semibold">
                    {isKinyarwanda ? 'Kwiyandikisha' : 'Sign Up'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left Side */}
            <div className="lg:col-span-3">
              <h1 className="text-5xl md:text-6xl font-bold text-[#1e293b] mb-6 leading-tight">
                Learn Programming in Kinyarwanda<br />
                <span className="text-[#0ea5e9]">Iga Programming mu Kinyarwanda</span>
              </h1>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {isKinyarwanda
                  ? 'Uburezi bw\'ikode bufashijwe na AI ku banyeshuri b\'u Rwanda. Wige JavaScript hamwe n\'ibisubizo byihariye mu rurimi rwawe.'
                  : 'AI-powered coding education for Rwandan students. Master JavaScript with personalized feedback in your language.'}
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5 text-[#10b981]" />
                  <div>
                    <div className="font-bold text-[#1e293b]">50+</div>
                    <div className="text-sm text-gray-600">{isKinyarwanda ? 'Amashuri' : 'Schools'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0ea5e9]" />
                  <div>
                    <div className="font-bold text-[#1e293b]">5,000+</div>
                    <div className="text-sm text-gray-600">{isKinyarwanda ? 'Abanyeshuri' : 'Students'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#8b5cf6]" />
                  <div>
                    <div className="font-bold text-[#1e293b]">95%</div>
                    <div className="text-sm text-gray-600">{isKinyarwanda ? 'Gutsinda' : 'Success'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇷🇼</span>
                  <div>
                    <div className="font-bold text-[#1e293b]">Made in</div>
                    <div className="text-sm text-gray-600">Rwanda</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button className="px-8 py-4 bg-[#0ea5e9] text-white rounded-lg font-bold text-lg hover:bg-[#0284c7] transition-all shadow-lg flex items-center justify-center gap-2">
                  {isKinyarwanda ? 'Tangira Kwiga Kubusa' : 'Start Learning Free'}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 border-2 border-[#0ea5e9] text-[#0ea5e9] rounded-lg font-bold text-lg hover:bg-blue-50 transition-all">
                  {isKinyarwanda ? 'Gusaba Demo' : 'Book a Demo'}
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {isKinyarwanda
                  ? 'Nta karita ya kirimiti ikenewe • Imishinga 5 kubusa'
                  : 'No credit card required • 5 free assignments'}
              </p>
            </div>

            {/* Right Side - Hero Illustration */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                {/* Mock Editor */}
                <div className="bg-[#1e293b] rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="font-mono text-sm space-y-1">
                    <div className="text-purple-400">function</div>
                    <div className="text-blue-400 ml-4">calculatePrice</div>
                    <div className="text-yellow-400 ml-8">return price * 1.18</div>
                  </div>
                </div>
                {/* AI Feedback Bubble */}
                <div className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-lg p-4 text-white relative">
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-[#8b5cf6] transform rotate-45" />
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <div className="font-bold mb-1">AI Tutor</div>
                      <div className="text-sm">
                        {isKinyarwanda
                          ? 'Byiza! Ongera price ya VAT neza. Gerageza gukoresha const aho var.'
                          : 'Great! You added VAT correctly. Try using const instead of var.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">
              {isKinyarwanda ? 'Kuki abanyeshuri bakunda EduCode Rwanda' : 'Why Students Love EduCode Rwanda'}
            </h2>
            <p className="text-xl text-gray-600">
              {isKinyarwanda
                ? 'Dufite ibikenewe byose kugirango utsinde'
                : 'Everything you need to succeed in coding'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1e293b] mb-2">{feature.subtitle}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">
              {isKinyarwanda ? 'Tangira kwiga mu ntambwe 3 zoroshye' : 'Start Learning in 3 Simple Steps'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: '📝',
                title: isKinyarwanda ? 'Kwiyandikisha Kubusa' : 'Sign Up Free',
                description: isKinyarwanda
                  ? 'Kora konti yawe mu masegonda 30. Nta karita ya kirimiti ikenewe.'
                  : 'Create your account in 30 seconds. No credit card needed.'
              },
              {
                step: '2',
                icon: '🎯',
                title: isKinyarwanda ? 'Hitamo inzira yawe' : 'Choose Your Path',
                description: isKinyarwanda
                  ? 'Tangira na Variables cyangwa ujye kuri Functions. Wige ku buryo bwawe.'
                  : 'Start with Variables or jump to Functions. Learn at your own pace.'
              },
              {
                step: '3',
                icon: '🤖',
                title: isKinyarwanda ? 'Bona ibisubizo bya AI' : 'Get AI Feedback',
                description: isKinyarwanda
                  ? 'Kora code mu Cyongereza, wige mu Kinyarwanda. AI igukurikirana buri ntambwe.'
                  : 'Code in English, learn in Kinyarwanda. AI guides you every step.'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 bg-[#0ea5e9] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-[#0ea5e9]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="schools" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">
              {isKinyarwanda ? 'Ishuri nkuru mu Rwanda zidushoramye' : 'Trusted by Rwanda\'s Leading Schools'}
            </h2>
          </div>

          {/* School Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 grayscale opacity-60">
            {['IPRC Kigali', 'IPRC Huye', 'Lycée de Kigali', 'Green Hills', 'AUCA', 'UR', 'ALU', 'Kepler'].map((school, index) => (
              <div key={index} className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <School className="w-12 h-12 text-gray-400" />
                <span className="ml-2 font-bold text-gray-600">{school}</span>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] rounded-2xl shadow-xl p-8 md:p-12 text-white">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{testimonials[currentTestimonial].photo}</div>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl mb-6 leading-relaxed italic">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                <div className="text-blue-100">{testimonials[currentTestimonial].role}</div>
              </div>

              <div className="flex items-center justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentTestimonial === index ? 'bg-white w-8' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-[#e0f2fe]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e293b] mb-4">
              {isKinyarwanda ? 'Ibiciro byoroshye kandi bisobanutse' : 'Simple, Transparent Pricing'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Individual Plan */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-[#1e293b] mb-2">
                {isKinyarwanda ? 'Ku bantu ku giti cyabo' : 'For Individuals'}
              </h3>
              <div className="text-4xl font-bold text-[#0ea5e9] mb-2">
                {isKinyarwanda ? 'Kubusa' : 'Free'}
              </div>
              <p className="text-gray-600 mb-6">
                {isKinyarwanda ? 'Byiza ku biga bonyine' : 'Perfect for self-learners'}
              </p>
              <div className="space-y-3 mb-8">
                {[
                  isKinyarwanda ? '5 imishinga ku kwezi' : '5 assignments per month',
                  isKinyarwanda ? 'Ibisubizo bya AI' : 'Basic AI feedback',
                  isKinyarwanda ? 'Ubufasha bwa komunite' : 'Community support',
                  isKinyarwanda ? 'Kugera kuri code editor' : 'Code editor access'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#22c55e]" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="text-sm text-gray-600 mb-2">
                  {isKinyarwanda ? 'Premium:' : 'Premium:'}
                </div>
                <div className="text-2xl font-bold text-[#1e293b]">RWF 2,000/month</div>
                <div className="text-sm text-gray-600">
                  {isKinyarwanda ? 'Kugera byose, bidahagarika' : 'Full access, unlimited'}
                </div>
              </div>
              <button className="w-full px-6 py-3 bg-[#0ea5e9] text-white rounded-lg font-bold hover:bg-[#0284c7] transition-all flex items-center justify-center gap-2">
                {isKinyarwanda ? 'Tangira Kubusa' : 'Start Free'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Schools Plan */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-[#10b981] p-8 relative">
              <div className="absolute top-0 right-0 bg-[#10b981] text-white px-4 py-1 rounded-bl-lg rounded-tr-2xl text-sm font-bold">
                {isKinyarwanda ? 'Byiza cyane' : 'Most Popular'}
              </div>
              <h3 className="text-2xl font-bold text-[#1e293b] mb-2">
                {isKinyarwanda ? 'Ku mashuri' : 'For Schools'}
              </h3>
              <div className="text-4xl font-bold text-[#10b981] mb-2">
                {isKinyarwanda ? 'Twandikire' : 'Custom'}
              </div>
              <p className="text-gray-600 mb-6">
                {isKinyarwanda ? 'Byubatswe ku mashuri' : 'Built for classrooms'}
              </p>
              <div className="space-y-3 mb-8">
                {[
                  isKinyarwanda ? 'Abanyeshuri badahagarika' : 'Unlimited students',
                  isKinyarwanda ? 'Dashboard y\'umwarimu' : 'Teacher dashboard',
                  isKinyarwanda ? 'Isesengura risobanura' : 'Advanced analytics',
                  isKinyarwanda ? 'Ubufasha bwihuse' : 'Priority support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#10b981]" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="text-sm text-gray-600 mb-2">
                  {isKinyarwanda ? 'Guhera kuri:' : 'Starting at:'}
                </div>
                <div className="text-2xl font-bold text-[#1e293b]">RWF 100,000/year</div>
              </div>
              <button className="w-full px-6 py-3 border-2 border-[#10b981] text-[#10b981] rounded-lg font-bold hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                {isKinyarwanda ? 'Gusaba Demo' : 'Request Demo'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <a href="#pricing" className="text-[#0ea5e9] font-semibold hover:underline">
              {isKinyarwanda ? 'Reba ibiciro byuzuye →' : 'View detailed pricing →'}
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 text-white" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isKinyarwanda ? 'Witeguye gutangira kwiga?' : 'Ready to Start Learning?'}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {isKinyarwanda
              ? 'Kwinjira mu banyeshuri 5,000+ b\'u Rwanda biga gukora code'
              : 'Join 5,000+ Rwandan students mastering programming'}
          </p>
          <button className="px-12 py-4 bg-white text-[#0ea5e9] rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center gap-2 mx-auto">
            {isKinyarwanda ? 'Tangira Kubusa' : 'Get Started Free'}
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-sm mt-4 text-blue-100">
            {isKinyarwanda ? 'Nta karita ya kirimiti ikenewe' : 'No credit card required'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e293b] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Column 1: About */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🇷🇼</span>
                <span className="text-xl font-bold">EduCode Rwanda</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                {isKinyarwanda
                  ? 'Gutuma uburezi bw\'ikode bugerwaho ku banyarwanda bose'
                  : 'Making programming education accessible to every Rwandan'}
              </p>
              <div className="flex gap-3 mb-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <Users className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <BookOpen className="w-5 h-5" />
                </a>
              </div>
              <div className="text-sm text-gray-400">
                🇷🇼 {isKinyarwanda ? 'Twubatswe mu Rwanda n\'urukundo' : 'Proudly Made in Rwanda'}
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <h3 className="font-bold mb-4">{isKinyarwanda ? 'Igicuruzwa' : 'Product'}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-all">{isKinyarwanda ? 'Ibiranga' : 'Features'}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-all">{isKinyarwanda ? 'Ibiciro' : 'Pricing'}</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-all">{isKinyarwanda ? 'Uburyo bukora' : 'How It Works'}</a></li>
                <li><a href="#schools" className="hover:text-white transition-all">{isKinyarwanda ? 'Ku mashuri' : 'For Schools'}</a></li>
                <li><a href="#" className="hover:text-white transition-all">{isKinyarwanda ? 'Ku bantu' : 'For Individuals'}</a></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="font-bold mb-4">{isKinyarwanda ? 'Isosiyete' : 'Company'}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition-all">{isKinyarwanda ? 'Abo turi' : 'About Us'}</a></li>
                <li><a href="#" className="hover:text-white transition-all">{isKinyarwanda ? 'Twandikire' : 'Contact Us'}</a></li>
                <li><a href="#" className="hover:text-white transition-all">{isKinyarwanda ? 'Akazi' : 'Careers'} <span className="text-xs text-gray-500">(soon)</span></a></li>
                <li><a href="#" className="hover:text-white transition-all">Blog <span className="text-xs text-gray-500">(soon)</span></a></li>
                <li><a href="#" className="hover:text-white transition-all">Press Kit</a></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h3 className="font-bold mb-4">{isKinyarwanda ? 'Amategeko' : 'Legal'}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-all">{isKinyarwanda ? 'Politiki y\'ibanga' : 'Privacy Policy'}</a></li>
                <li><a href="#" className="hover:text-white transition-all">{isKinyarwanda ? 'Amabwiriza' : 'Terms of Service'}</a></li>
                <li><a href="#" className="hover:text-white transition-all">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-all">Code of Conduct</a></li>
              </ul>
            </div>

            {/* Column 5: Contact */}
            <div>
              <h3 className="font-bold mb-4">{isKinyarwanda ? 'Twandikire' : 'Contact'}</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@educode.rw" className="hover:text-white transition-all">info@educode.rw</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+250" className="hover:text-white transition-all">+250 XXX XXX XXX</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Kigali, Rwanda</span>
                </li>
                <li className="mt-4">
                  <a href="#" className="text-[#0ea5e9] hover:text-[#0284c7] font-semibold">
                    {isKinyarwanda ? 'Gusaba Demo →' : 'Book a Demo →'}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 EduCode Rwanda. All rights reserved.</p>
            <p className="mt-2">
              {isKinyarwanda
                ? 'Twubatswe mu Rwanda n\'urukundo | Built with ❤️ in Rwanda'
                : 'Built with ❤️ in Rwanda | Twubatswe mu Rwanda n\'urukundo'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
