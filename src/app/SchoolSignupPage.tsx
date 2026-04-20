import { useState } from 'react';
import { School, Users, Target, CheckCircle2, ArrowRight, Mail, Phone, ChevronDown, ChevronRight, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createSchool, linkProfileToSchool } from '../lib/db';

export default function SchoolSignupPage() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: '',
    location: '',
    studentCount: '',
    fullName: '',
    position: '',
    email: '',
    phone: '',
    password: '',
    challenges: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isKinyarwanda = language === 'KIN';

  const faqs = [
    {
      question: isKinyarwanda ? 'Bigutwara amafaranga angahe?' : 'How much does it cost?',
      answer: isKinyarwanda
        ? 'Tuha trial y\'amezi 3 kubusa. Nyuma y\'ibyo, ni RWF 100,000 ku mwaka ku banyeshuri badahagarika.'
        : "We offer a free 3-month trial. After that, it's RWF 100,000/year for unlimited students."
    },
    {
      question: isKinyarwanda ? 'Trial imara igihe kingana iki?' : 'How long is the trial?',
      answer: isKinyarwanda
        ? 'Trial imara amezi 3 kubusa, nta karita ya kirimiti ikenewe.'
        : '3 months completely free, no credit card required.'
    },
    {
      question: isKinyarwanda ? 'Dukeneye mudasobwa zidasanzwe?' : 'Do we need special computers?',
      answer: isKinyarwanda
        ? 'Oya. Igicuruzwa kirakora kuri mudasobwa zose n\'amatefoni. Gikora na offline.'
        : 'No. Works on any computer or phone. Even works offline.'
    },
    {
      question: isKinyarwanda ? 'Abanyeshuri barashobora kubikoresha iwabo?' : 'Can students use it at home?',
      answer: isKinyarwanda
        ? 'Yego! Abanyeshuri barashobora gukora code iwabo cyangwa ishuriro. Sync yose igihe bahuye na interineti.'
        : 'Yes! Students can code at home or at school. Syncs whenever they connect.'
    },
    {
      question: isKinyarwanda ? 'Ubufasha tubona bute?' : 'What support do we get?',
      answer: isKinyarwanda
        ? 'Ubufasha bwihuse bwa email na telefoni, imyitozo y\'abarimu, na demo y\'ishuri.'
        : 'Priority email and phone support, teacher training, and in-school demos.'
    }
  ];

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true); setError('');

    // 1. Create school record
    const { data: school, error: schoolErr } = await createSchool({
      name: formData.schoolName,
      location: formData.location,
      contactEmail: formData.email,
    });
    if (schoolErr || !school) { setError(schoolErr ?? 'Failed to create school'); setLoading(false); return; }

    // 2. Sign up the admin user
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.fullName, user_type: 'school_admin', preferred_language: 'en' } },
    });
    if (authErr || !authData.user) { setError(authErr?.message ?? 'Signup failed'); setLoading(false); return; }

    // 3. Link admin profile to school
    await linkProfileToSchool(authData.user.id, school.id);

    setLoading(false);
    setSuccess(true);
  };

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

      {/* Breadcrumb */}
      <div className="bg-[#f8fafc] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="#" className="hover:text-[#0ea5e9]">{isKinyarwanda ? 'Ahabanza' : 'Home'}</a>
            <ChevronRight className="w-4 h-4" />
            <a href="#" className="hover:text-[#0ea5e9]">{isKinyarwanda ? 'Ku Mashuri' : 'For Schools'}</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0ea5e9] font-semibold">{isKinyarwanda ? 'Kwiyandikisha' : 'Sign Up'}</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isKinyarwanda ? 'Zana EduCode mu Ishuri Ryanyu' : 'Bring EduCode to Your School'}
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            {isKinyarwanda
              ? 'Kwinjira mu mashuri 50+ akoresha uburezi bw\'ikode bufashijwe na AI'
              : 'Join 50+ schools using AI-powered coding education'}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
              <School className="w-5 h-5" />
              <span className="font-semibold">{isKinyarwanda ? '50+ Amashuri' : '50+ Schools'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
              <Users className="w-5 h-5" />
              <span className="font-semibold">{isKinyarwanda ? '5,000+ Abanyeshuri' : '5,000+ Students'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
              <Target className="w-5 h-5" />
              <span className="font-semibold">95% {isKinyarwanda ? 'Gutsinda' : 'Success Rate'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-[#1e293b] mb-3">
                  {isKinyarwanda ? 'Konto yawe yashyizweho!' : 'Account created!'}
                </h2>
                <p className="text-gray-600 mb-2">
                  {isKinyarwanda
                    ? 'Injira ukoresheje email na ijambo banga wahinze.'
                    : 'Log in with the email and password you just set.'}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {isKinyarwanda ? 'Uzabona dashboard ya konti y\'ishuri ryawe.' : "You'll see your school admin dashboard after logging in."}
                </p>
                <a
                  href="/"
                  className="inline-block px-8 py-3 bg-[#10b981] text-white rounded-lg font-bold hover:bg-[#059669] transition-all">
                  {isKinyarwanda ? 'Injira' : 'Go to Login'}
                </a>
              </div>
            ) : (
            <>
            <h2 className="text-3xl font-bold text-[#1e293b] mb-2 text-center">
              {isKinyarwanda ? 'Saba Trial yawe y\'Amezi 3 Kubusa' : 'Request Your Free 3-Month Trial'}
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              {isKinyarwanda ? 'Uzuzanya uyu form tuzakuhamagara mu gihe cy\'amasaha 24' : "Fill out this form and we'll contact you within 24 hours"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Information Section */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-[#1e293b] mb-4">
                  {isKinyarwanda ? 'Amakuru y\'Ishuri' : 'School Information'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Izina ry\'Ishuri' : 'School Name'} *
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="IPRC Kigali"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Ubwoko bw\'Ishuri' : 'School Type'} *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.schoolType}
                        onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] appearance-none"
                        required
                      >
                        <option value="">{isKinyarwanda ? 'Hitamo ubwoko' : 'Select type'}</option>
                        <option value="tvet">TVET</option>
                        <option value="secondary">{isKinyarwanda ? 'Ishuri ryisumbuye' : 'Secondary School'}</option>
                        <option value="university">{isKinyarwanda ? 'Kaminuza' : 'University'}</option>
                        <option value="training">{isKinyarwanda ? 'Ikigo cy\'amahugurwa' : 'Training Center'}</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Akarere' : 'Location (District)'} *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] appearance-none"
                        required
                      >
                        <option value="">{isKinyarwanda ? 'Hitamo akarere' : 'Select district'}</option>
                        <option value="kigali">Kigali</option>
                        <option value="huye">Huye</option>
                        <option value="musanze">Musanze</option>
                        <option value="rubavu">Rubavu</option>
                        <option value="other">{isKinyarwanda ? 'Ikindi' : 'Other'}</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Umubare w\'Abanyeshuri' : 'Number of Students'} *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.studentCount}
                        onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] appearance-none"
                        required
                      >
                        <option value="">{isKinyarwanda ? 'Hitamo umubare' : 'Select count'}</option>
                        <option value="1-50">1-50</option>
                        <option value="50-100">50-100</option>
                        <option value="100-200">100-200</option>
                        <option value="200-500">200-500</option>
                        <option value="500+">500+</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person Section */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-[#1e293b] mb-4">
                  {isKinyarwanda ? 'Umuntu wo guhamagara' : 'Contact Person'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Amazina Yose' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Umwanya' : 'Position'} *
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder={isKinyarwanda ? 'Umuyobozi w\'amasomo' : 'Dean of Studies'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@school.ac.rw"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Ijambo Banga' : 'Password'} *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min. 8 characters"
                        minLength={8}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Nimero ya Telefoni' : 'Phone Number'} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+250 XXX XXX XXX"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenges */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {isKinyarwanda ? 'Ibibazo muhuye na byo?' : 'What challenges do you face?'} ({isKinyarwanda ? 'Ntibikenewe' : 'Optional'})
                </label>
                <textarea
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  placeholder={isKinyarwanda
                    ? 'Tubare ibibazo mufite mu kwigisha programming...'
                    : 'Tell us about your current challenges with programming education...'}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#10b981] text-white rounded-lg font-bold text-lg hover:bg-[#059669] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isKinyarwanda ? 'Saba Trial Kubusa' : 'Request Free Trial'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Benefits */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <span>{isKinyarwanda ? 'Nta kwiyemeza bikenewe' : 'No commitment required'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <span>{isKinyarwanda ? 'Tuzakuhamagara mu masaha 24' : "We'll contact you within 24 hours"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <span>{isKinyarwanda ? 'Kubusa amezi 3, hanyuma RWF 100,000/umwaka' : 'Free for 3 months, then RWF 100,000/year'}</span>
                  </div>
                </div>
              </div>
            </form>
            </>
            )}
          </div>

          {/* What Happens Next */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[#1e293b] mb-8 text-center">
              {isKinyarwanda ? 'Iki Kizakurikira?' : 'What Happens Next'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: isKinyarwanda ? 'Tuzakuhamagara' : "We'll Call You",
                  description: isKinyarwanda ? 'Mu masaha 24 tuzakuhamagara tuganire' : "Within 24 hours we'll give you a call"
                },
                {
                  step: '2',
                  title: isKinyarwanda ? 'Shiraho Demo' : 'Schedule Demo',
                  description: isKinyarwanda ? 'Tuza ku ishuri duherekeze abarimu' : 'We come to your school for a teacher demo'
                },
                {
                  step: '3',
                  title: isKinyarwanda ? 'Tangira Trial' : 'Start Trial',
                  description: isKinyarwanda ? 'Tangira trial y\'amezi 3 kubusa' : 'Begin your free 3-month trial'
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-[#1e293b] mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-[#1e293b] mb-8 text-center">
              {isKinyarwanda ? 'Ibibazo Bikunze Kubazwa' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-all"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedFAQ === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              {isKinyarwanda ? 'Ufite ibibazo?' : 'Have questions?'}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#10b981] text-[#10b981] rounded-lg font-bold hover:bg-green-50 transition-all"
            >
              {isKinyarwanda ? 'Hamagara Amagurisha' : 'Contact Sales'}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
