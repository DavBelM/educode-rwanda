import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ArrowRight, MessageSquare, Globe, Users, Linkedin, Facebook, Twitter, Instagram, ChevronRight } from 'lucide-react';

export default function ContactPage() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isKinyarwanda = language === 'KIN';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const faqs = [
    {
      question: isKinyarwanda ? 'Ese nshobora guhindura ijambo ryibanga?' : 'How do I reset my password?',
      answer: isKinyarwanda
        ? 'Kanda "Wibagiwe ijambo ryibanga?" ku rupapuro rwo kwinjira, hanyuma ukurikire amabwiriza.'
        : 'Click "Forgot Password?" on the login page and follow the instructions.',
      link: '#'
    },
    {
      question: isKinyarwanda ? 'Bigutwara amafaranga angahe?' : 'How much does it cost?',
      answer: isKinyarwanda
        ? 'Kubusa kugirango utangire hamwe n\'imishinga 5. Premium ni RWF 2,000/ukwezi.'
        : 'Free to start with 5 assignments. Premium is RWF 2,000/month.',
      link: '#pricing'
    },
    {
      question: isKinyarwanda ? 'Mutanga amashuri ibiciro bidasanzwe?' : 'Do you offer school discounts?',
      answer: isKinyarwanda
        ? 'Yego! Amashuri abona trial y\'amezi 3 kubusa. Saba demo.'
        : 'Yes! Schools get a 3-month free trial. Request a demo.',
      link: '#schools'
    },
    {
      question: isKinyarwanda ? 'Nshobora kubikoresha offline?' : 'Can I use it offline?',
      answer: isKinyarwanda
        ? 'Yego! Kora code offline, sync iyo uhuye na interineti.'
        : 'Yes! Code offline and sync when you connect.',
      link: '#features'
    }
  ];

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

      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">
                {isKinyarwanda ? 'Duhamagare' : 'Get in Touch'}
              </h1>
              <p className="text-blue-100 mb-8">
                {isKinyarwanda
                  ? 'Duhe ubutumwa, tuzakusubiza vuba'
                  : "Send us a message and we'll respond soon"}
              </p>

              {/* Contact Information */}
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <a href="mailto:info@educode.rw" className="text-blue-100 hover:text-white">
                      info@educode.rw
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      {isKinyarwanda ? 'Telefoni' : 'Phone'}
                    </div>
                    <a href="tel:+250" className="text-blue-100 hover:text-white">
                      +250 XXX XXX XXX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      {isKinyarwanda ? 'Aho turi' : 'Location'}
                    </div>
                    <p className="text-blue-100">Kigali, Rwanda</p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="border-t border-white/20 pt-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6" />
                  <h3 className="font-bold text-lg">
                    {isKinyarwanda ? 'Amasaha y\'akazi' : 'Office Hours'}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-blue-100">
                  <div className="flex justify-between">
                    <span>{isKinyarwanda ? 'Kuwa mbere - Kuwa gatanu' : 'Monday - Friday'}</span>
                    <span>8 AM - 5 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isKinyarwanda ? 'Ku wa gatandatu' : 'Saturday'}</span>
                    <span>9 AM - 1 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isKinyarwanda ? 'Ku cyumweru' : 'Sunday'}</span>
                    <span>{isKinyarwanda ? 'Harafunze' : 'Closed'}</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border-t border-white/20 pt-6">
                <h3 className="font-bold mb-4">{isKinyarwanda ? 'Dukurikire' : 'Follow Us'}</h3>
                <div className="flex gap-3">
                  {[
                    { Icon: Twitter, href: '#' },
                    { Icon: Linkedin, href: '#' },
                    { Icon: Facebook, href: '#' },
                    { Icon: Instagram, href: '#' }
                  ].map(({ Icon, href }, index) => (
                    <a
                      key={index}
                      href={href}
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Illustration */}
              <div className="mt-12">
                <div className="bg-white/10 backdrop-blur rounded-xl p-8 flex items-center justify-center">
                  <MessageSquare className="w-24 h-24 text-white/40" />
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold text-[#1e293b] mb-8">
                {isKinyarwanda ? 'Twoherereze ubutumwa' : 'Send us a message'}
              </h2>

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-[#22c55e]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isKinyarwanda ? 'Murakoze!' : 'Thank you!'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {isKinyarwanda
                      ? 'Ubutumwa bwawe bwoherejwe. Tuzakusubiza mu gihe cy\'amasaha 24.'
                      : "Your message has been sent. We'll respond within 24 hours."}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', userType: '', subject: '', message: '' });
                    }}
                    className="px-6 py-2 bg-[#0ea5e9] text-white rounded-lg font-semibold hover:bg-[#0284c7] transition-all"
                  >
                    {isKinyarwanda ? 'Ohereza Ubundi Butumwa' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Amazina Yawe' : 'Your Name'} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Mugisha"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jean@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      required
                    />
                  </div>

                  {/* User Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Ndi' : 'I am a'} *
                    </label>
                    <select
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      required
                    >
                      <option value="">{isKinyarwanda ? 'Hitamo' : 'Select'}</option>
                      <option value="student">{isKinyarwanda ? 'Umunyeshuri' : 'Student'}</option>
                      <option value="teacher">{isKinyarwanda ? 'Umwarimu' : 'Teacher'}</option>
                      <option value="school">{isKinyarwanda ? 'Ishuri' : 'School Admin'}</option>
                      <option value="other">{isKinyarwanda ? 'Ikindi' : 'Other'}</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Ikibazo' : 'Subject'} *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={isKinyarwanda ? 'Ikibazo cy\'ubutumwa bwawe' : 'Subject of your message'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Ubutumwa' : 'Message'} *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isKinyarwanda ? 'Tubare uburyo dushobora gufasha...' : 'Tell us how we can help...'}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0ea5e9] text-white rounded-lg font-bold hover:bg-[#0284c7] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {isKinyarwanda ? 'Ohereza Ubutumwa' : 'Send Message'}
                      </>
                    )}
                  </button>

                  {/* Response Time */}
                  <p className="text-sm text-gray-500 text-center">
                    {isKinyarwanda
                      ? 'Mubisanzwe tusubiza mu gihe cy\'amasaha 24'
                      : 'We typically respond within 24 hours'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e293b] mb-8 text-center">
            {isKinyarwanda ? 'Ibibazo Bikunze Kubazwa' : 'Quick Answers'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm mb-3">{faq.answer}</p>
                <a href={faq.link} className="text-[#0ea5e9] text-sm font-semibold hover:underline inline-flex items-center gap-1">
                  {isKinyarwanda ? 'Menya byinshi' : 'Learn more'}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}
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
