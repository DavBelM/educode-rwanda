import React, { useState } from 'react';
import { Users, Target, Globe, ArrowRight, Mail, Linkedin } from 'lucide-react';

export default function AboutPage() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇷🇼</span>
              <span className="text-xl font-bold text-[#1e293b]">EduCode Rwanda</span>
            </div>
            <div className="flex items-center gap-4">
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
              <a href="#" className="text-gray-700 hover:text-[#0ea5e9] font-medium">
                {isKinyarwanda ? 'Injira' : 'Login'}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {isKinyarwanda
              ? 'Guhindura uburezi bwa programming kugirango bugerweho n\'umuntu wese mu Rwanda'
              : 'Making Programming Education Accessible to Every Rwandan'}
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            {isKinyarwanda
              ? 'Intego yacu ni guteza imbere uburezi bw\'ikode bufashijwe na AI mu Kinyarwanda.'
              : 'Our mission is to democratize quality coding education through AI-powered learning in Kinyarwanda.'}
          </p>

          {/* Team Photo Placeholder */}
          <div className="mt-12 bg-white/20 backdrop-blur rounded-2xl p-8">
            <div className="aspect-video bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl flex items-center justify-center">
              <Users className="w-24 h-24 text-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Story Text */}
            <div>
              <h2 className="text-3xl font-bold text-[#1e293b] mb-6">
                {isKinyarwanda ? 'Inkuru Yacu' : 'Our Story'}
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  {isKinyarwanda
                    ? 'Yashizweho mu 2026 n\'umunyeshuri w\'Informatique muri African Leadership University akaba n\'umwarimu wa JavaScript ku ishuri.'
                    : 'Founded in 2026 by a Computer Science student at African Leadership University and JavaScript teacher at a local school.'}
                </p>
                <p>
                  {isKinyarwanda
                    ? 'Ikibazo cyari gisobanutse: Abanyeshuri babananaga kwiga programming kubera:'
                    : 'The problem was clear: Students struggled to learn programming because:'}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{isKinyarwanda ? 'Amabwiriza yari mu Cyongereza gusa' : 'Instructions were only in English'}</li>
                  <li>{isKinyarwanda ? 'Abarimu bari bafite abanyeshuri 50+' : 'Teachers had 50+ students to support'}</li>
                  <li>{isKinyarwanda ? 'Nta bisubizo byihariye' : 'No personalized feedback'}</li>
                  <li>{isKinyarwanda ? 'Kugera kuri mudasobwa byari bike' : 'Limited computer lab access'}</li>
                </ul>
                <p className="font-semibold text-[#0ea5e9]">
                  {isKinyarwanda
                    ? 'EduCode Rwanda yavuye mu ishuri, yubatswe n\'umwarimu wabonye abanyeshuri bareka kode - si kuko badashoboye kwiga, ahubwo kubera ko ibikoresho bitari byubatswe kubera bo.'
                    : "EduCode Rwanda was born from the classroom, built by a teacher who saw students give up on coding—not because they couldn't learn, but because the tools weren't designed for them."}
                </p>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  number: '5,000+',
                  label: isKinyarwanda ? 'Abanyeshuri Biga' : 'Students Learning',
                  color: '#0ea5e9'
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  number: '50+',
                  label: isKinyarwanda ? 'Amashuri Akoresha' : 'Schools Using',
                  color: '#10b981'
                },
                {
                  icon: <Globe className="w-8 h-8" />,
                  number: '95%',
                  label: isKinyarwanda ? 'Gutsinda' : 'Pass Rate',
                  color: '#8b5cf6'
                },
                {
                  icon: <span className="text-4xl">🇷🇼</span>,
                  number: '#1',
                  label: isKinyarwanda ? 'Mu Rwanda' : 'in Rwanda',
                  color: '#fbbf24'
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-[#1e293b] mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e293b] mb-12 text-center">
            {isKinyarwanda ? 'Indangagaciro Zacu' : 'Our Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🇷🇼',
                title: isKinyarwanda ? 'U Rwanda Mbere' : 'Rwanda First',
                description: isKinyarwanda
                  ? 'Twubatswe ku banyeshuri b\'u Rwanda, n\'abanyanrwanda'
                  : 'Built for Rwandan students, by Rwandans',
                color: '#10b981'
              },
              {
                emoji: '🤖',
                title: isKinyarwanda ? 'Ikoranabuhanga rya AI' : 'AI-Powered',
                description: isKinyarwanda
                  ? 'Tekinoroji yumva imiterere yacu'
                  : 'Technology that understands our context',
                color: '#8b5cf6'
              },
              {
                emoji: '🌍',
                title: isKinyarwanda ? 'Gukwirakwiza' : 'Accessible',
                description: isKinyarwanda
                  ? 'Irakora offline, ihendutse, mu rurimi rwawe'
                  : 'Works offline, affordable, in your language',
                color: '#0ea5e9'
              }
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-all"
              >
                <div className="text-6xl mb-4">{value.emoji}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: value.color }}>
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e293b] mb-12 text-center">
            {isKinyarwanda ? 'Hura n\'Itsinda' : 'Meet the Team'}
          </h2>

          {/* Founder Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Photo */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                JD
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-[#1e293b] mb-2">[Your Name]</h3>
                <p className="text-[#0ea5e9] font-semibold mb-4">
                  {isKinyarwanda ? 'Umuremyi & CEO' : 'Founder & CEO'}
                </p>
                <div className="text-gray-600 space-y-2">
                  <p>{isKinyarwanda ? 'Umunyeshuri wa Software Engineering muri ALU' : 'Software Engineering Student at ALU'}</p>
                  <p>{isKinyarwanda ? 'Umwarimu wa JavaScript' : 'JavaScript Teacher'}</p>
                  <p>{isKinyarwanda ? 'Nkunda uburenganzira bw\'uburezi' : 'Passionate about education equity'}</p>
                </div>
                <div className="mt-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-[#0ea5e9] hover:underline font-semibold"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Join Team CTA */}
          <div className="bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              {isKinyarwanda ? 'Wifuza kwinjira mu itsinda?' : 'Want to join our team?'}
            </h3>
            <p className="mb-6 text-blue-100">
              {isKinyarwanda
                ? 'Turashaka abantu bafite ubushake bwo guhinduza uburezi mu Rwanda'
                : "We're looking for passionate people to transform education in Rwanda"}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0ea5e9] rounded-lg font-bold hover:bg-gray-100 transition-all"
            >
              {isKinyarwanda ? 'Reba Imyanya' : 'View Open Positions'}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-[#1e293b] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {isKinyarwanda ? 'Wifuza kumenya byinshi?' : 'Want to learn more?'}
          </h2>
          <p className="text-gray-400 mb-8">
            {isKinyarwanda
              ? 'Twandikire twakubwire byinshi kuri EduCode Rwanda'
              : 'Get in touch to learn more about EduCode Rwanda'}
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#0ea5e9] text-white rounded-lg font-bold hover:bg-[#0284c7] transition-all"
          >
            <Mail className="w-5 h-5" />
            {isKinyarwanda ? 'Twandikire' : 'Contact Us'}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>© 2026 EduCode Rwanda. All rights reserved.</p>
          <p className="mt-2">
            {isKinyarwanda
              ? 'Twubatswe mu Rwanda n\'urukundo'
              : 'Built with ❤️ in Rwanda'}
          </p>
        </div>
      </footer>
    </div>
  );
}
