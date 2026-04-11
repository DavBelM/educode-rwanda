import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle2, XCircle, Smartphone, Globe, ArrowRight } from 'lucide-react';
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

  // Map form values to DB values
  const langMap: Record<string, 'en' | 'kin' | 'both'> = {
    english: 'en', kinyarwanda: 'kin', both: 'both'
  };
  const typeMap: Record<string, 'student' | 'teacher' | 'self_learner'> = {
    student: 'student', teacher: 'teacher', 'self-learner': 'self_learner'
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left Side - Hero (same as login) */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-3xl">🇷🇼</span>
          <span className="text-2xl font-bold">EduCode Rwanda</span>
        </div>

        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="relative">
            <div className="absolute inset-0 opacity-20">
              <div className="w-64 h-64 border-4 border-[#8b5cf6] rounded-full animate-pulse" />
              <div className="absolute top-10 left-10 w-40 h-40 border-4 border-[#0ea5e9] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-[#10b981] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            <div className="relative text-center">
              <div className="text-8xl font-mono text-[#8b5cf6] mb-4">&lt;/&gt;</div>
              <div className="flex items-center justify-center gap-4 text-4xl">
                <span className="text-[#0ea5e9]">{ }</span>
                <span className="text-[#10b981]">[ ]</span>
                <span className="text-[#fbbf24]">( )</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-lg font-semibold mb-2">
            5,000+ {isKinyarwanda ? 'abanyeshuri biga programming mu Kinyarwanda' : 'students learning to code in Kinyarwanda'}
          </p>
          <p className="text-sm text-gray-400">
            {isKinyarwanda ? 'Kwiga programming mu rurimi rwawe' : 'Learn programming in your language'}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <span className="text-3xl">🇷🇼</span>
            <span className="text-2xl font-bold text-[#1e293b]">EduCode Rwanda</span>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-end mb-8">
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
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
            {isKinyarwanda ? 'Tangira Kwiga None' : 'Start Learning Today'}
          </h1>
          <p className="text-gray-600 mb-8">
            {isKinyarwanda
              ? 'Kora konti yawe kubusa mu masegonda 30'
              : 'Create your free account in 30 seconds'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isKinyarwanda ? 'Amazina Yose' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={isKinyarwanda ? 'Jean Mugisha' : 'Jean Mugisha'}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  style={{ height: '48px' }}
                />
              </div>
            </div>

            {/* Email or Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isKinyarwanda ? 'Email cyangwa Telefoni' : 'Email or Phone'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean@example.com"
                  className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  style={{ height: '48px' }}
                />
                {formData.email && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {formData.email.includes('@') && formData.email.includes('.') ? (
                      <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#ef4444]" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isKinyarwanda ? 'Ijambo ryibanga' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                  style={{ height: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          level <= passwordStrength.strength
                            ? passwordStrength.strength === 1
                              ? 'bg-[#ef4444]'
                              : passwordStrength.strength === 2
                              ? 'bg-[#f59e0b]'
                              : 'bg-[#22c55e]'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {passwordStrength.label} {isKinyarwanda ? 'imbaraga' : 'strength'}
                  </p>
                </div>
              )}
            </div>

            {/* User Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {isKinyarwanda ? 'Ndi:' : 'I am a:'}
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'student', label: isKinyarwanda ? 'Umunyeshuri' : 'Student' },
                  { value: 'teacher', label: isKinyarwanda ? 'Umwarimu' : 'Teacher' },
                  { value: 'self-learner', label: isKinyarwanda ? 'Nwiga wenyine' : 'Self-Learner' }
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                      formData.userType === type.value
                        ? 'border-[#0ea5e9] bg-blue-50 text-[#0ea5e9]'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={formData.userType === type.value}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {isKinyarwanda ? 'Ururimi nkunda:' : 'Preferred language:'}
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'english', label: 'English' },
                  { value: 'kinyarwanda', label: 'Kinyarwanda' },
                  { value: 'both', label: isKinyarwanda ? 'Byombi' : 'Both' }
                ].map((lang) => (
                  <label
                    key={lang.value}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                      formData.preferredLanguage === lang.value
                        ? 'border-[#0ea5e9] bg-blue-50 text-[#0ea5e9]'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredLanguage"
                      value={lang.value}
                      checked={formData.preferredLanguage === lang.value}
                      onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{lang.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                />
                <span className="text-sm text-gray-700">
                  {isKinyarwanda ? 'Nemera' : 'I agree to'}{' '}
                  <a href="#" className="text-[#0ea5e9] hover:underline font-semibold">
                    {isKinyarwanda ? 'Amabwiriza' : 'Terms of Service'}
                  </a>{' '}
                  {isKinyarwanda ? 'na' : 'and'}{' '}
                  <a href="#" className="text-[#0ea5e9] hover:underline font-semibold">
                    {isKinyarwanda ? 'Politiki y\'ibanga' : 'Privacy Policy'}
                  </a>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {isKinyarwanda
                  ? 'Konti yakozwe! Reba email yawe kugirango wemeze.'
                  : 'Account created! Check your email to confirm.'}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full py-3 bg-[#0ea5e9] text-white rounded-lg font-bold text-lg hover:bg-[#0284c7] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ height: '48px' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isKinyarwanda ? "Iyandikishe - Ni ubuntu!" : "Sign Up - It's Free!"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isKinyarwanda ? 'CYANGWA' : 'OR'}
                </span>
              </div>
            </div>

            {/* Alternative Signup */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                {isKinyarwanda ? 'Iyandikishe ukoresheje Telefoni' : 'Sign up with Phone'}
              </button>
              <button
                type="button"
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                {isKinyarwanda ? 'Iyandikishe ukoresheje Google' : 'Sign up with Google'}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-gray-600">
                {isKinyarwanda ? 'Usanzwe ufite konti?' : 'Already have an account?'}{' '}
              </span>
              <button
                type="button"
                onClick={onLoginClick}
                className="text-[#0ea5e9] font-semibold hover:underline"
              >
                {isKinyarwanda ? 'Injira' : 'Log In'}
              </button>
            </div>
          </form>

          {/* Benefits Callout */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                <span>{isKinyarwanda ? 'Nta karita ya kirimiti ikenewe' : 'No credit card required'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                <span>{isKinyarwanda ? 'Imishinga 5 kubusa kugirango utangire' : '5 free assignments to start'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                <span>{isKinyarwanda ? 'Hagarika igihe cyose' : 'Cancel anytime'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
