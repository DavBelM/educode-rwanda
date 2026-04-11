import { useState } from 'react';
import Dashboard from './Dashboard';
import CodingWorkspace from './CodingWorkspace';
import TeacherDashboard from './TeacherDashboard';
import WorkspacePages from './WorkspacePages';
import StudentPages from './StudentPages';
import TeacherPages from './TeacherPages';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SchoolSignupPage from './SchoolSignupPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import { useAuth } from '../lib/auth';

type ViewMode = 'dashboard' | 'workspace' | 'teacher' | 'workspace-pages' | 'student-pages' | 'teacher-pages' | 'landing' | 'login' | 'signup' | 'school-signup' | 'about' | 'contact' | 'privacy';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('landing');

  // Show spinner while checking auth session
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

  // Authenticated users — route to their dashboard
  if (user && profile) {
    if (profile.user_type === 'teacher') return <TeacherDashboard />;
    return <Dashboard />;
  }

  return (
    <>
      {/* View Mode Selector - Only visible on desktop */}
      <div className="hidden lg:block fixed top-24 left-6 bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-2 z-50">
        <p className="text-xs font-semibold text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          View Mode
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setViewMode('landing')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'landing' ? '#fbbf24' : 'transparent',
              color: viewMode === 'landing' ? 'white' : '#fbbf24',
              border: `2px solid #fbbf24`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Landing
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'teacher' ? '#10b981' : 'transparent',
              color: viewMode === 'teacher' ? 'white' : '#10b981',
              border: `2px solid #10b981`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Teacher
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'dashboard' ? '#0ea5e9' : 'transparent',
              color: viewMode === 'dashboard' ? 'white' : '#0ea5e9',
              border: `2px solid #0ea5e9`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Student
          </button>
          <button
            onClick={() => setViewMode('workspace')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'workspace' ? '#8b5cf6' : 'transparent',
              color: viewMode === 'workspace' ? 'white' : '#8b5cf6',
              border: `2px solid #8b5cf6`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Workspace
          </button>
          <button
            onClick={() => setViewMode('workspace-pages')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'workspace-pages' ? '#f59e0b' : 'transparent',
              color: viewMode === 'workspace-pages' ? 'white' : '#f59e0b',
              border: `2px solid #f59e0b`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            W.Pages
          </button>
          <button
            onClick={() => setViewMode('student-pages')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'student-pages' ? '#ec4899' : 'transparent',
              color: viewMode === 'student-pages' ? 'white' : '#ec4899',
              border: `2px solid #ec4899`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            S.Pages
          </button>
          <button
            onClick={() => setViewMode('teacher-pages')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'teacher-pages' ? '#10b981' : 'transparent',
              color: viewMode === 'teacher-pages' ? 'white' : '#10b981',
              border: `2px solid #10b981`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            T.Pages
          </button>
          <div className="border-t border-gray-300 my-2" />
          <button
            onClick={() => setViewMode('login')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'login' ? '#6366f1' : 'transparent',
              color: viewMode === 'login' ? 'white' : '#6366f1',
              border: `2px solid #6366f1`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setViewMode('signup')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'signup' ? '#6366f1' : 'transparent',
              color: viewMode === 'signup' ? 'white' : '#6366f1',
              border: `2px solid #6366f1`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Signup
          </button>
          <button
            onClick={() => setViewMode('school-signup')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'school-signup' ? '#059669' : 'transparent',
              color: viewMode === 'school-signup' ? 'white' : '#059669',
              border: `2px solid #059669`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            School
          </button>
          <button
            onClick={() => setViewMode('about')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'about' ? '#6b7280' : 'transparent',
              color: viewMode === 'about' ? 'white' : '#6b7280',
              border: `2px solid #6b7280`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            About
          </button>
          <button
            onClick={() => setViewMode('contact')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'contact' ? '#6b7280' : 'transparent',
              color: viewMode === 'contact' ? 'white' : '#6b7280',
              border: `2px solid #6b7280`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Contact
          </button>
          <button
            onClick={() => setViewMode('privacy')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              backgroundColor: viewMode === 'privacy' ? '#6b7280' : 'transparent',
              color: viewMode === 'privacy' ? 'white' : '#6b7280',
              border: `2px solid #6b7280`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Privacy
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === 'landing' ? (
        <LandingPage />
      ) : viewMode === 'login' ? (
        <LoginPage onSuccess={() => {}} />
      ) : viewMode === 'signup' ? (
        <SignupPage
          onSuccess={() => setViewMode('login')}
          onLoginClick={() => setViewMode('login')}
        />
      ) : viewMode === 'school-signup' ? (
        <SchoolSignupPage />
      ) : viewMode === 'about' ? (
        <AboutPage />
      ) : viewMode === 'contact' ? (
        <ContactPage />
      ) : viewMode === 'privacy' ? (
        <PrivacyPolicyPage />
      ) : viewMode === 'teacher' ? (
        <TeacherDashboard />
      ) : viewMode === 'dashboard' ? (
        <Dashboard />
      ) : viewMode === 'workspace' ? (
        <CodingWorkspace />
      ) : viewMode === 'workspace-pages' ? (
        <WorkspacePages />
      ) : viewMode === 'student-pages' ? (
        <StudentPages />
      ) : (
        <TeacherPages />
      )}
    </>
  );
}
