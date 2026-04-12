import { useState } from 'react';
import Dashboard from './Dashboard';
import TeacherDashboard from './TeacherDashboard';
import CodingWorkspace from './CodingWorkspace';
import TheoreticalAssignment from './TheoreticalAssignment';
import CoursesPage from './CoursesPage';
import LessonViewer from './LessonViewer';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SchoolSignupPage from './SchoolSignupPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import { useAuth } from '../lib/auth';
import type { Assignment, CourseLesson } from '../lib/db';

type PublicView = 'landing' | 'login' | 'signup' | 'school-signup' | 'about' | 'contact' | 'privacy';
type StudentView = 'dashboard' | 'workspace' | 'theoretical' | 'courses' | 'lesson';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<PublicView>('landing');
  const [studentView, setStudentView] = useState<StudentView>('dashboard');
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [openAssignment, setOpenAssignment] = useState<Assignment | null>(null);
  const [openLesson, setOpenLesson] = useState<{ lesson: CourseLesson; courseTitle: string } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0f14', fontFamily: 'Inter, sans-serif' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#00d4aa', borderTopColor: 'transparent' }} />
          <p className="text-sm font-medium" style={{ color: '#475569' }}>
            Loading EduCode Rwanda...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated users
  if (user) {
    if (profile?.user_type === 'teacher') return <TeacherDashboard />;

    if (studentView === 'workspace') return <CodingWorkspace onBack={() => setStudentView('dashboard')} />;

    if (studentView === 'theoretical' && openAssignment) {
      return (
        <TheoreticalAssignment
          assignment={openAssignment}
          language={language}
          onBack={() => { setStudentView('dashboard'); setOpenAssignment(null); }}
        />
      );
    }

    if (studentView === 'courses') {
      return (
        <CoursesPage
          language={language}
          onBack={() => setStudentView('dashboard')}
          onOpenLesson={(lesson, courseTitle) => {
            setOpenLesson({ lesson, courseTitle });
            setStudentView('lesson');
          }}
        />
      );
    }

    if (studentView === 'lesson' && openLesson) {
      return (
        <LessonViewer
          lesson={openLesson.lesson}
          courseTitle={openLesson.courseTitle}
          language={language}
          onBack={() => setStudentView('courses')}
          onCompleted={() => setStudentView('courses')}
        />
      );
    }

    return (
      <Dashboard
        language={language}
        onLanguageChange={setLanguage}
        onStartCoding={() => setStudentView('workspace')}
        onOpenAssignment={(a) => { setOpenAssignment(a); setStudentView('theoretical'); }}
        onOpenCourses={() => setStudentView('courses')}
      />
    );
  }

  // Public pages
  if (view === 'login') return <LoginPage onSuccess={() => {}} onSignupClick={() => setView('signup')} />;
  if (view === 'signup') return (
    <SignupPage onSuccess={() => setView('login')} onLoginClick={() => setView('login')} />
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
