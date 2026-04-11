import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Bell, Globe, Lock, Camera, Trophy, Zap, Target, BookOpen } from 'lucide-react';

interface ProfileSettingsPageProps {
  language: 'EN' | 'KIN';
}

export function ProfileSettingsPage({ language }: ProfileSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [notificationSettings, setNotificationSettings] = useState({
    assignmentReminders: true,
    teacherMessages: true,
    achievements: true,
    weeklyReports: false
  });

  const isKinyarwanda = language === 'KIN';

  const tabs = [
    { id: 'profile', label: isKinyarwanda ? 'Profile' : 'Profile', icon: User },
    { id: 'settings', label: isKinyarwanda ? 'Igenamiterere' : 'Settings', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
            {isKinyarwanda ? 'Profile & Igenamiterere' : 'Profile & Settings'}
          </h1>
          <p className="text-gray-600">
            {isKinyarwanda ? 'Kugenzura konti yawe n\'amahitamo' : 'Manage your account and preferences'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-[#0ea5e9] border-b-2 border-[#0ea5e9]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6">
                {isKinyarwanda ? 'Amakuru yawe' : 'Personal Information'}
              </h2>

              {/* Profile Photo */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center text-white text-3xl font-bold">
                    JM
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0ea5e9] rounded-full flex items-center justify-center text-white hover:bg-[#0284c7] transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1e293b]">Jean Mugisha</h3>
                  <p className="text-gray-600">Beginner II</p>
                  <button className="text-[#0ea5e9] text-sm font-semibold hover:underline mt-1">
                    {isKinyarwanda ? 'Hindura ifoto' : 'Change Photo'}
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isKinyarwanda ? 'Izina' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      defaultValue="Jean Mugisha"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isKinyarwanda ? 'Email' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      defaultValue="jean.mugisha@educode.rw"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isKinyarwanda ? 'Italiki yo kwiyandikisha' : 'Join Date'}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      defaultValue="March 15, 2026"
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isKinyarwanda ? 'Bio' : 'Bio'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isKinyarwanda ? 'Andika ibikuneraho...' : 'Tell us about yourself...'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] resize-none"
                    defaultValue="Learning to code to build amazing apps!"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="px-6 py-2.5 bg-[#0ea5e9] text-white rounded-lg font-semibold hover:bg-[#0284c7] transition-colors shadow-md">
                  {isKinyarwanda ? 'Bika Impinduka' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6">
                {isKinyarwanda ? 'Imikorere yawe' : 'Your Statistics'}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#1e293b] mb-1">1,240</div>
                  <div className="text-sm text-gray-600">{isKinyarwanda ? 'XP Points' : 'XP Points'}</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#1e293b] mb-1">#42</div>
                  <div className="text-sm text-gray-600">{isKinyarwanda ? 'Umwanya' : 'Class Rank'}</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#1e293b] mb-1">5</div>
                  <div className="text-sm text-gray-600">{isKinyarwanda ? 'Iminsi' : 'Day Streak'}</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#22c55e] to-[#4ade80] flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#1e293b] mb-1">12/16</div>
                  <div className="text-sm text-gray-600">{isKinyarwanda ? 'Imishinga' : 'Assignments'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Language Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1e293b]">
                    {isKinyarwanda ? 'Ururimi' : 'Language'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {isKinyarwanda ? 'Hitamo ururimi rw\'ikibanza' : 'Choose your preferred language'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border-2 border-[#0ea5e9] rounded-lg cursor-pointer bg-blue-50">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="language" checked className="w-5 h-5 text-[#0ea5e9]" />
                    <div>
                      <div className="font-semibold text-[#1e293b]">English</div>
                      <div className="text-sm text-gray-600">International language</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0ea5e9] transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="language" className="w-5 h-5 text-[#0ea5e9]" />
                    <div>
                      <div className="font-semibold text-[#1e293b]">Kinyarwanda</div>
                      <div className="text-sm text-gray-600">Ururimi rw'u Rwanda</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1e293b]">
                    {isKinyarwanda ? 'Imenyesha' : 'Notifications'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {isKinyarwanda ? 'Kugenzura imenyesha yakira' : 'Control what notifications you receive'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'assignmentReminders',
                    title: isKinyarwanda ? 'Ibutsa ry\'imishinga' : 'Assignment Reminders',
                    description: isKinyarwanda ? 'Menyeshwa igihe imishinga igeze hafi yo kurangira' : 'Get notified when assignments are due soon'
                  },
                  {
                    key: 'teacherMessages',
                    title: isKinyarwanda ? 'Ubutumwa bw\'umwarimu' : 'Teacher Messages',
                    description: isKinyarwanda ? 'Menyeshwa iyo umwarimu yakohereje ubutumwa' : 'Receive messages from your teacher'
                  },
                  {
                    key: 'achievements',
                    title: isKinyarwanda ? 'Ibihembo' : 'Achievements',
                    description: isKinyarwanda ? 'Menyeshwa iyo wabonye igihembo gishya' : 'Get notified when you earn new badges'
                  },
                  {
                    key: 'weeklyReports',
                    title: isKinyarwanda ? 'Raporo z\'icyumweru' : 'Weekly Reports',
                    description: isKinyarwanda ? 'Akabonera k\'iterambere ryawe' : 'Weekly summary of your progress'
                  }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-[#1e293b] mb-1">{setting.title}</div>
                      <div className="text-sm text-gray-600">{setting.description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [setting.key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0ea5e9]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#ef4444]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1e293b]">
                    {isKinyarwanda ? 'Umutekano' : 'Security'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {isKinyarwanda ? 'Kugenzura konti yawe' : 'Manage your account security'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#0ea5e9] transition-colors text-left">
                  <div>
                    <div className="font-semibold text-[#1e293b] mb-1">
                      {isKinyarwanda ? 'Hindura ijambo ry\'ibanga' : 'Change Password'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isKinyarwanda ? 'Kurinda konti yawe' : 'Keep your account secure'}
                    </div>
                  </div>
                  <div className="text-[#0ea5e9] font-semibold">→</div>
                </button>

                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#0ea5e9] transition-colors text-left">
                  <div>
                    <div className="font-semibold text-[#1e293b] mb-1">
                      {isKinyarwanda ? 'Ibikorwa by\'konti' : 'Account Activity'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isKinyarwanda ? 'Reba aho ukoresheje konti' : 'View recent login activity'}
                    </div>
                  </div>
                  <div className="text-[#0ea5e9] font-semibold">→</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
