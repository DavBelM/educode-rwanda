import { useState } from 'react';
import { Download, ChevronRight, Shield, Lock, Eye, Database, Users, Cookie, FileText, Mail } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

export default function PrivacyPolicyPage() {
  usePageTitle('Privacy Policy · EduCode');
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [activeSection, setActiveSection] = useState('');

  const isKinyarwanda = language === 'KIN';

  const sections = [
    {
      id: 'collection',
      icon: Database,
      title: isKinyarwanda ? 'Amakuru Dukusanya' : 'Information We Collect',
      content: (
        <div className="space-y-4">
          <p>
            {isKinyarwanda
              ? 'Dukusanya amakuru akurikira kugirango dushobore gutanga serivisi zacu:'
              : 'We collect the following information to provide our services:'}
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>{isKinyarwanda ? 'Amakuru y\'ikonti' : 'Account information'}:</strong>{' '}
              {isKinyarwanda
                ? 'Amazina, i-meyili, telefoni (niba wayitanze)'
                : 'Name, email, phone (if provided)'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Imikoro ya code watanze' : 'Code submissions'}:</strong>{' '}
              {isKinyarwanda
                ? 'Code utanga (zikoreshwa mu kwigisha AI no kuguha ibitekerezo)'
                : 'Code you submit (for AI training and feedback)'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Amakuru y\'imikoreshereze' : 'Usage data'}:</strong>{' '}
              {isKinyarwanda
                ? 'Ibiranga platform ukoresha, igihe umazeho, n\'iterambere ryawe'
                : 'Which features you use, time spent, and progress'}
            </li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              <strong>{isKinyarwanda ? 'Ntabwo tugurisha amakuru yawe' : 'We do NOT sell your data'}.</strong>{' '}
              {isKinyarwanda
                ? 'Na rimwe. Amakuru yawe ni ayawe.'
                : 'Never. Your data is yours.'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'usage',
      icon: Eye,
      title: isKinyarwanda ? 'Uburyo dukoresha amakuru yawe' : 'How We Use Your Data',
      content: (
        <div className="space-y-4">
          <p>
            {isKinyarwanda
              ? 'Dukoresha amakuru yawe kugirango:'
              : 'We use your information to:'}
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>{isKinyarwanda ? 'Duhe AI uburyo bwo kuguha ibitekerezo' : 'Provide AI feedback'}:</strong>{' '}
              {isKinyarwanda
                ? 'AI yacu isuzuma code yawe ikaguha inama n\'ibisobanuro'
                : 'Our AI analyzes your code and provides guidance'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Kunoza iyi platform' : 'Improve the platform'}:</strong>{' '}
              {isKinyarwanda
                ? 'Gusobanukirwa aho abanyeshuri bagira imbogamizi'
                : 'Understand where students struggle'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Kohereza amakuru mashya y\'ingenzi' : 'Send important updates'}:</strong>{' '}
              {isKinyarwanda
                ? 'Ibiranga platform bishya n\'amahirwe yo kwiga'
                : 'New features and training opportunities'}
            </li>
          </ul>
          <p className="text-sm text-gray-600">
            {isKinyarwanda
              ? 'Urashobora guhagarika kwakira i-meyili z\'ubucuruzi igihe cyose.'
              : 'You can opt out of marketing emails anytime.'}
          </p>
        </div>
      )
    },
    {
      id: 'storage',
      icon: Lock,
      title: isKinyarwanda ? 'Kubika no kurinda amakuru' : 'Data Storage & Security',
      content: (
        <div className="space-y-4">
          <p>
            {isKinyarwanda
              ? 'Dufata umutekano w\'amakuru yawe nk\'ikintu cy\'ingenzi:'
              : 'We take your data security seriously:'}
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>{isKinyarwanda ? 'Aho tubika amakuru hararinzwe cyane' : 'Encrypted storage'}:</strong>{' '}
              {isKinyarwanda
                ? 'Amakuru yawe yose afite uburinzi bukomeye (AES-256)'
                : 'All your data is encrypted (AES-256)'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Seriveri zacu zifite ibyemezo by\'umutekano (SOC2)' : 'SOC2-certified infrastructure'}:</strong>{' '}
              {isKinyarwanda
                ? 'Dukoresha Supabase ifite icyemezo cy\'umutekano cya SOC2 Type 2'
                : 'We use Supabase infrastructure with SOC2 Type 2 security certification'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Twandukura amakuru kenshi (Backups)' : 'Regular backups'}:</strong>{' '}
              {isKinyarwanda
                ? 'Twandukura amakuru buri munsi kugirango atazazima'
                : 'Daily backups to prevent data loss'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Kugenzura abagerera ku makuru' : 'Access controls'}:</strong>{' '}
              {isKinyarwanda
                ? 'Abakozi babifitiye uruhushya gusa nibo bemerewe kureba amakuru'
                : 'Only authorized staff can access data'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'rights',
      icon: Users,
      title: isKinyarwanda ? 'Uburenganzira bwawe' : 'Your Rights',
      content: (
        <div className="space-y-4">
          <p>
            {isKinyarwanda
              ? 'Ufite uburenganzira bwo:'
              : 'You have the right to:'}
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>{isKinyarwanda ? 'Kureba amakuru yawe' : 'Access your data'}:</strong>{' '}
              {isKinyarwanda
                ? 'Saba kopi y\'amakuru yawe yose igihe cyose'
                : 'Request a copy of all your data anytime'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Gusiba konti yawe' : 'Delete your account'}:</strong>{' '}
              {isKinyarwanda
                ? 'Gusiba konti yawe hamwe n\'amakuru yose yerekeranye na yo'
                : 'Delete your account and all associated data'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Kohereza amakuru yawe ahandi' : 'Export your data'}:</strong>{' '}
              {isKinyarwanda
                ? 'Kuramo amakuru yawe mu buryo bworoshye (JSON)'
                : 'Download your data in a portable format (JSON)'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Gukosora amakuru yawe' : 'Correct your data'}:</strong>{' '}
              {isKinyarwanda
                ? 'Hindura amakuru atari yo'
                : 'Update incorrect information'}
            </li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>{isKinyarwanda ? 'Kugirango ukoreshe uburenganzira bwawe:' : 'To exercise your rights:'}</strong>{' '}
              {isKinyarwanda
                ? 'Twandikire kuri privacy@educode.rw'
                : 'Email us at privacy@educode.rw'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'children',
      icon: Shield,
      title: isKinyarwanda ? 'Abana n\'Ibanga' : "Children's Privacy",
      content: (
        <div className="space-y-4">
          <p>
            {isKinyarwanda
              ? 'Dufasha abanyeshuri bari munsi y\'imyaka 18:'
              : 'We serve students under 18:'}
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              {isKinyarwanda
                ? 'Abanyeshuri munsi y\'imyaka 18 bakeneye uruhushya rw\'ababyeyi cyangwa ababarera'
                : 'Students under 18 need parent/guardian consent'}
            </li>
            <li>
              {isKinyarwanda
                ? 'Amashuri afatwa nk\'abarezi b\'abanyeshuri bayo'
                : 'Schools act as guardians for their students'}
            </li>
            <li>
              {isKinyarwanda
                ? 'Ntidukusanya amakuru atari ngombwa ku bato'
                : "We don't collect unnecessary data from minors"}
            </li>
            <li>
              {isKinyarwanda
                ? 'Ababyeyi bashobora gusaba kureba cyangwa gusiba amakuru y\'umwana wabo'
                : 'Parents can request to view or delete child data'}
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: 'Cookies',
      content: (
        <div className="space-y-4">
          <p>
            {isKinyarwanda
              ? 'Dukoresha cookies kugirango:'
              : 'We use cookies to:'}
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>{isKinyarwanda ? 'Twibuke ko winjiye' : 'Keep you logged in'}:</strong>{' '}
              {isKinyarwanda
                ? 'Nta kwiyandikisha buri gihe'
                : "You don't have to log in every time"}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Twibuke ururimi wahisemo' : 'Remember your language'}:</strong>{' '}
              {isKinyarwanda
                ? 'Icyongereza cyangwa Ikinyarwanda uhitamo'
                : 'English or Kinyarwanda preference'}
            </li>
            <li>
              <strong>{isKinyarwanda ? 'Gusobanukirwa uko platform ikoreshwa' : 'Understand usage'}:</strong>{' '}
              {isKinyarwanda
                ? 'Ibiranga platform bikora neza kurusha ibindi'
                : 'Which features work best'}
            </li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              {isKinyarwanda
                ? 'Ntabwo dukoresha cookies zigukurikirana ngo tuguhe amatangazo y\'ubucuruzi. Dukoresha gusa cookies z\'ingenzi.'
                : 'We do NOT use tracking cookies for ads. Only essential cookies.'}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {isKinyarwanda
              ? 'Urashobora kugenzura cookies muri browser yawe, ariko bishobora gutuma platform itakora neza.'
              : 'You can manage cookies in your browser settings, but this may affect functionality.'}
          </p>
        </div>
      )
    },
    {
      id: 'changes',
      icon: FileText,
      title: isKinyarwanda ? 'Impinduka kuri iyi politiki' : 'Changes to Policy',
      content: (
        <div className="space-y-4">
          <p>
            {isKinyarwanda
              ? 'Tushobora kuvugurura iyi politiki rimwe na rimwe:'
              : 'We may update this policy from time to time:'}
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              {isKinyarwanda
                ? 'Tuzakumenyesha ku email niba hari impinduka zikomeye'
                : "We'll notify you by email of major changes"}
            </li>
            <li>
              {isKinyarwanda
                ? 'Itariki "Last updated" izahinduka'
                : 'The "Last updated" date will change'}
            </li>
            <li>
              {isKinyarwanda
                ? 'Gukomeza kuyikoresha bivuze ko wemeye izo mpinduka'
                : 'Continued use means you accept changes'}
            </li>
          </ul>
          <p className="text-sm text-gray-600">
            {isKinyarwanda
              ? 'Niba utemeye impinduka, urashobora gusiba konti yawe.'
              : "If you don't agree with changes, you can delete your account."}
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      icon: Mail,
      title: isKinyarwanda ? 'Twandikire' : 'Contact Us',
      content: (
        <div className="space-y-4">
          <p>
            {isKinyarwanda
              ? 'Niba ufite ibibazo ku banga cyangwa amakuru yawe:'
              : 'If you have questions about privacy or your data:'}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-[#0ea5e9]" />
              <div>
                <div className="font-semibold text-gray-900">
                  {isKinyarwanda ? 'Itsinda rishinzwe ibanga' : 'Privacy Team'}
                </div>
                <a href="mailto:privacy@educode.rw" className="text-[#0ea5e9] hover:underline">
                  privacy@educode.rw
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {isKinyarwanda
                ? 'Tuzakusubiza mu gihe cy\'iminsi 5 y\'akazi.'
                : "We'll respond within 5 business days."}
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white z-40">
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

      {/* Breadcrumb */}
      <div className="bg-[#f8fafc] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="#" className="hover:text-[#0ea5e9]">{isKinyarwanda ? 'Ahabanza' : 'Home'}</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0ea5e9] font-semibold">
              {isKinyarwanda ? 'Politiki y\'ibanga' : 'Privacy Policy'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">
                      {isKinyarwanda ? 'Ibirimo muri iyi politiki' : 'Table of Contents'}
                    </h3>
                    <button className="text-[#0ea5e9] hover:underline text-sm font-semibold flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection(section.id);
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-[#0ea5e9] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <section.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-left">{index + 1}. {section.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-[#1e293b] mb-4">
                  {isKinyarwanda ? 'Politiki y\'ibanga' : 'Privacy Policy'}
                </h1>
                <p className="text-gray-600">
                  {isKinyarwanda ? 'Yavuguruwe bwa nyuma:' : 'Last updated:'} <strong>April 6, 2026</strong>
                </p>
                <p className="text-gray-600 mt-4">
                  {isKinyarwanda
                    ? 'Iyi politiki isobanura uburyo EduCode Rwanda ikusanya, ikoresha, kandi irinda amakuru yawe.'
                    : 'This policy explains how EduCode Rwanda collects, uses, and protects your information.'}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center text-white flex-shrink-0">
                        <section.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#1e293b]">
                          {index + 1}. {section.title}
                        </h2>
                      </div>
                    </div>
                    <div className="ml-16 text-gray-700 leading-relaxed text-lg">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-16 p-6 bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] rounded-xl text-white">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      {isKinyarwanda ? 'Dufata ibanga ryawe nka rishingiro' : 'We value your privacy'}
                    </h3>
                    <p className="text-blue-100 mb-4">
                      {isKinyarwanda
                        ? 'Niba ufite ibibazo ku banga cyangwa amakuru yawe, twandikire ku privacy@educode.rw. Tuzakusubiza mu gihe cy\'iminsi 5 y\'akazi.'
                        : "If you have questions about privacy or your data, email us at privacy@educode.rw. We'll respond within 5 business days."}
                    </p>
                    <a
                      href="mailto:privacy@educode.rw"
                      className="inline-flex items-center gap-2 px-6 py-2 bg-white text-[#0ea5e9] rounded-lg font-bold hover:bg-gray-100 transition-all"
                    >
                      <Mail className="w-5 h-5" />
                      {isKinyarwanda ? 'Twandikire itsinda rishinzwe ibanga' : 'Contact Privacy Team'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1e293b] text-white py-8">
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
