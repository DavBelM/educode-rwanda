import { useState, useEffect } from 'react';
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
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import MyResultsPage from './MyResultsPage';
import OnboardingModal from './OnboardingModal';
import SchoolAdminDashboard from './SchoolAdminDashboard';
import SelfLearnerDashboard from './SelfLearnerDashboard';
import { useAuth } from '../lib/auth';
import { getResumeLesson, type Assignment, type CourseLesson } from '../lib/db';

type PublicView = 'landing' | 'login' | 'signup' | 'school-signup' | 'about' | 'contact' | 'privacy' | 'forgot-password';
type StudentView = 'dashboard' | 'workspace' | 'theoretical' | 'courses' | 'lesson' | 'results';

export default function App() {
  const { user, profile, loading, isRecoveryMode } = useAuth();
  const [view, setView] = useState<PublicView>('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [studentView, setStudentView] = useState<StudentView>('dashboard');
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const [openAssignment, setOpenAssignment] = useState<Assignment | null>(null);
  const [openCodingAssignment, setOpenCodingAssignment] = useState<Assignment | null>(null);
  const [openLesson, setOpenLesson] = useState<{ lesson: CourseLesson; courseTitle: string; allLessons: CourseLesson[] } | null>(null);

  useEffect(() => {
    if (user && profile) {
      const key = `educode_onboarded_${user.id}`;
      if (!localStorage.getItem(key)) {
        setShowOnboarding(true);
      }
    }
  }, [user, profile]);

  const handleOnboardingDone = () => {
    if (user) localStorage.setItem(`educode_onboarded_${user.id}`, '1');
    setShowOnboarding(false);
  };

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
  if (user && profile) {
    const onboardingModal = showOnboarding ? (
      <OnboardingModal
        userType={profile.user_type as 'student' | 'teacher' | 'self_learner'}
        userName={profile.full_name ?? user.email ?? 'User'}
        language={language}
        onDone={handleOnboardingDone}
      />
    ) : null;

    if (profile?.user_type === 'school_admin') return <SchoolAdminDashboard />;
    if (profile?.user_type === 'teacher') return <>{<TeacherDashboard />}{onboardingModal}</>;

    if (studentView === 'workspace') return (
      <CodingWorkspace
        assignment={openCodingAssignment}
        language={language}
        onBack={() => { setStudentView('dashboard'); setOpenCodingAssignment(null); }}
      />
    );

    if (studentView === 'theoretical' && openAssignment) {
      return (
        <TheoreticalAssignment
          assignment={openAssignment}
          language={language}
          onBack={() => { setStudentView('dashboard'); setOpenAssignment(null); }}
        />
      );
    }

    if (studentView === 'results') {
      return (
        <MyResultsPage
          language={language}
          onBack={() => setStudentView('dashboard')}
        />
      );
    }

    if (studentView === 'courses') {
      return (
        <CoursesPage
          language={language}
          onBack={() => setStudentView('dashboard')}
          onOpenLesson={(lesson, courseTitle, allLessons) => {
            setOpenLesson({ lesson, courseTitle, allLessons });
            setStudentView('lesson');
          }}
        />
      );
    }

    if (studentView === 'lesson' && openLesson) {
      const currentIdx = openLesson.allLessons.findIndex(l => l.id === openLesson.lesson.id);
      const nextLesson = openLesson.allLessons[currentIdx + 1] ?? null;
      return (
        <LessonViewer
          key={openLesson.lesson.id}
          lesson={openLesson.lesson}
          courseTitle={openLesson.courseTitle}
          language={language}
          nextLesson={nextLesson}
          onBack={() => setStudentView('courses')}
          onCompleted={() => setStudentView('courses')}
          onNextLesson={(next) => setOpenLesson({ ...openLesson, lesson: next })}
        />
      );
    }

    const sharedProps = {
      language,
      onLanguageChange: setLanguage,
      onStartCoding: () => { setOpenCodingAssignment(null); setStudentView('workspace'); },
      onOpenCourses: () => setStudentView('courses'),
      onOpenLesson: (lesson: CourseLesson, courseTitle: string, allLessons: CourseLesson[]) => {
        setOpenLesson({ lesson, courseTitle, allLessons });
        setStudentView('lesson');
      },
    };

    if (profile.user_type === 'self_learner') {
      return (
        <>
          <SelfLearnerDashboard
            {...sharedProps}
            onContinueLearning={async () => {
              const resume = await getResumeLesson();
              if (resume) { setOpenLesson(resume); setStudentView('lesson'); }
              else setStudentView('courses');
            }}
          />
          {onboardingModal}
        </>
      );
    }

    return (
      <>
        <Dashboard
          language={language}
          onLanguageChange={setLanguage}
          onStartCoding={(a) => { setOpenCodingAssignment(a ?? null); setStudentView('workspace'); }}
          onOpenAssignment={(a) => { setOpenAssignment(a); setStudentView('theoretical'); }}
          onOpenCourses={() => setStudentView('courses')}
          onOpenResults={() => setStudentView('results')}
          onContinueLearning={async () => {
            const resume = await getResumeLesson();
            if (resume) {
              setOpenLesson(resume);
              setStudentView('lesson');
            } else {
              setStudentView('courses');
            }
          }}
        />
        {onboardingModal}
      </>
    );
  }

  // Password recovery — Supabase redirects back with a session in recovery mode
  if (isRecoveryMode) return <ResetPasswordPage onDone={() => setView('login')} />;

  // Public pages
  if (view === 'login') return <LoginPage onSuccess={() => {}} onSignupClick={() => setView('signup')} onForgotPassword={() => setView('forgot-password')} />;
  if (view === 'forgot-password') return <ForgotPasswordPage onBack={() => setView('login')} />;
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
