import { useState } from 'react';
import Dashboard from './Dashboard';
import TeacherDashboard from './TeacherDashboard';
import CodingWorkspace from './CodingWorkspace';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SchoolSignupPage from './SchoolSignupPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import { useAuth } from '../lib/auth';

type PublicView = 'landing' | 'login' | 'signup' | 'school-signup' | 'about' | 'contact' | 'privacy';
type StudentView = 'dashboard' | 'workspace';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<PublicView>('landing');
  const [studentView, setStudentView] = useState<StudentView>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            Loading EduCode Rwanda...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated users
  if (user && profile) {
    if (profile.user_type === 'teacher') return <TeacherDashboard />;
    if (studentView === 'workspace') return <CodingWorkspace onBack={() => setStudentView('dashboard')} />;
    return <Dashboard onStartCoding={() => setStudentView('workspace')} />;
  }

  // Public pages
  if (view === 'login') return <LoginPage onSuccess={() => {}} />;
  if (view === 'signup') return (
    <SignupPage
      onSuccess={() => setView('login')}
      onLoginClick={() => setView('login')}
    />
  );
  if (view === 'school-signup') return <SchoolSignupPage />;
  if (view === 'about') return <AboutPage />;
  if (view === 'contact') return <ContactPage />;
  if (view === 'privacy') return <PrivacyPolicyPage />;

  return (
    <LandingPage
      onLogin={() => setView('login')}
      onSignup={() => setView('signup')}
      onSchoolSignup={() => setView('school-signup')}
    />
  );
}
