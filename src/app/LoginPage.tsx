import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function LoginPage({ onSuccess }: { onSuccess?: () => void }) {
  const { signIn } = useAuth();
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isKinyarwanda = language === 'KIN';

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(isKinyarwanda
        ? 'Email cyangwa ijambo ryibanga ntibikora'
        : 'Email or password is incorrect'
      );
      setLoading(false);
      return;
    }

    onSuccess?.();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left Side - Hero */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <span className="text-3xl">🇷🇼</span>
          <span className="text-2xl font-bold">EduCode Rwanda</span>
        </div>

        {/* Center Illustration */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="relative">
            {/* Abstract coding pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-64 h-64 border-4 border-[#8b5cf6] rounded-full animate-pulse" />
              <div className="absolute top-10 left-10 w-40 h-40 border-4 border-[#0ea5e9] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-[#10b981] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Code symbols */}
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

        {/* Quote */}
        <div className="relative z-10">
          <p className="text-lg font-semibold mb-2">
            5,000+ {isKinyarwanda ? 'abanyeshuri biga programming mu Kinyarwanda' : 'students learning to code in Kinyarwanda'}
          </p>
          <p className="text-sm text-gray-400">
            {isKinyarwanda
              ? 'Kwiga programming mu rurimi rwawe'
              : 'Learn programming in your language'}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
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
            {isKinyarwanda ? 'Mwaramutse! Murakaza Neza' : 'Mwaramutse! Welcome Back'}
          </h1>
          <p className="text-gray-600 mb-8">
            {isKinyarwanda ? 'Injira kugirango ukomeze kwiga' : 'Log in to continue learning'}
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email/Phone Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isKinyarwanda ? 'Email cyangwa Telefoni' : 'Email or Phone'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isKinyarwanda ? 'jean@example.com' : 'jean@example.com'}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#0ea5e9]'
                  }`}
                  style={{ height: '48px' }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isKinyarwanda ? 'Ijambo ryibanga' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#0ea5e9]'
                  }`}
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#0ea5e9] border-gray-300 rounded focus:ring-[#0ea5e9]"
                />
                <span className="text-sm text-gray-700">
                  {isKinyarwanda ? 'Nzibuke' : 'Remember me'}
                </span>
              </label>
              <a href="#" className="text-sm text-[#0ea5e9] hover:underline font-semibold">
                {isKinyarwanda ? 'Wibagiwe ijambo ryibanga?' : 'Forgot Password?'}
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0ea5e9] text-white rounded-lg font-bold text-lg hover:bg-[#0284c7] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ height: '48px' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isKinyarwanda ? 'Injira' : 'Log In'}
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

            {/* Alternative Login Methods */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                {isKinyarwanda ? 'Injira ukoresheje Telefoni' : 'Login with Phone'}
              </button>
              <button
                type="button"
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                {isKinyarwanda ? 'Injira ukoresheje Google' : 'Login with Google'}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-600">
                {isKinyarwanda ? 'Ntabwo ufite konti?' : "Don't have an account?"}{' '}
              </span>
              <a href="#" className="text-[#0ea5e9] font-semibold hover:underline">
                {isKinyarwanda ? 'Iyandikishe' : 'Sign Up'}
              </a>
            </div>
          </form>

          {/* Security Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>
              {isKinyarwanda
                ? 'Amakuru yawe arafite umutekano kandi yasobanuwe'
                : 'Your data is secure and encrypted'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
