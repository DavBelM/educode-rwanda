import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router';
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

// ── Route wrappers that read complex objects from location.state ──────────────

function WorkspaceRoute({ language }: { language: 'EN' | 'KIN' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const assignment: Assignment | null = location.state?.assignment ?? null;
  return (
    <CodingWorkspace
      assignment={assignment}
      language={language}
      onBack={() => navigate(-1)}
    />
  );
}

function TheoreticalRoute({ language }: { language: 'EN' | 'KIN' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const assignment: Assignment | null = location.state?.assignment ?? null;
  if (!assignment) return <Navigate to="/dashboard" replace />;
  return (
    <TheoreticalAssignment
      assignment={assignment}
      language={language}
      onBack={() => navigate(-1)}
    />
  );
}

function LessonRoute({ language }: { language: 'EN' | 'KIN' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { lesson: CourseLesson; courseTitle: string; allLessons: CourseLesson[] } | null;
  if (!state?.lesson) return <Navigate to="/courses" replace />;
  const { lesson, courseTitle, allLessons } = state;
  const currentIdx = allLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = allLessons[currentIdx + 1] ?? null;
  return (
    <LessonViewer
      key={lesson.id}
      lesson={lesson}
      courseTitle={courseTitle}
      language={language}
      nextLesson={nextLesson}
      onBack={() => navigate('/courses')}
      onCompleted={() => navigate('/courses')}
      onNextLesson={(next) => navigate('/lesson', { state: { lesson: next, courseTitle, allLessons }, replace: true })}
    />
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const { user, profile, loading, isRecoveryMode } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');

  useEffect(() => {
    if (user && profile) {
      const key = `educode_onboarded_${user.id}`;
      if (!localStorage.getItem(key)) setShowOnboarding(true);
    }
  }, [user, profile]);

  const handleOnboardingDone = () => {
    if (user) localStorage.setItem(`educode_onboarded_${user.id}`, '1');
    setShowOnboarding(false);
  };

  const openLesson = (lesson: CourseLesson, courseTitle: string, allLessons: CourseLesson[]) => {
    navigate('/lesson', { state: { lesson, courseTitle, allLessons } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ec-bg)', fontFamily: 'Inter, sans-serif' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#00d4aa', borderTopColor: 'transparent' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--ec-text-6)' }}>
            Loading EduCode Rwanda...
          </p>
        </div>
      </div>
    );
  }

  if (isRecoveryMode) return <ResetPasswordPage onDone={() => navigate('/login')} />;

  // ── Authenticated ──────────────────────────────────────────────────────────
  if (user && profile) {
    const onboardingModal = showOnboarding ? (
      <OnboardingModal
        userType={profile.user_type as 'student' | 'teacher' | 'self_learner'}
        userName={profile.full_name ?? user.email ?? 'User'}
        language={language}
        onDone={handleOnboardingDone}
      />
    ) : null;

    if (profile.user_type === 'school_admin') return <SchoolAdminDashboard />;
    if (profile.user_type === 'teacher') return <>{<TeacherDashboard />}{onboardingModal}</>;

    const sharedCourseProps = {
      language,
      onLanguageChange: setLanguage,
      onOpenLesson: openLesson,
    };

    if (profile.user_type === 'self_learner') {
      return (
        <>
          {onboardingModal}
          <Routes>
            <Route path="/workspace" element={<WorkspaceRoute language={language} />} />
            <Route path="/courses" element={
              <CoursesPage
                {...sharedCourseProps}
                onBack={() => navigate('/learn')}
              />
            } />
            <Route path="/lesson" element={<LessonRoute language={language} />} />
            <Route path="*" element={
              <SelfLearnerDashboard
                {...sharedCourseProps}
                onStartCoding={() => navigate('/workspace')}
                onOpenCourses={() => navigate('/courses')}
                onContinueLearning={async () => {
                  const resume = await getResumeLesson();
                  if (resume) navigate('/lesson', { state: resume });
                  else navigate('/courses');
                }}
              />
            } />
          </Routes>
        </>
      );
    }

    // Student
    return (
      <>
        {onboardingModal}
        <Routes>
          <Route path="/workspace" element={<WorkspaceRoute language={language} onLanguageChange={setLanguage} />} />
          <Route path="/assignment" element={<TheoreticalRoute language={language} />} />
          <Route path="/courses" element={
            <CoursesPage
              {...sharedCourseProps}
              onBack={() => navigate('/dashboard')}
            />
          } />
          <Route path="/lesson" element={<LessonRoute language={language} />} />
          <Route path="/results" element={
            <MyResultsPage
              language={language}
              onBack={() => navigate('/dashboard')}
            />
          } />
          <Route path="*" element={
            <Dashboard
              language={language}
              onLanguageChange={setLanguage}
              onStartCoding={(a) => navigate('/workspace', { state: { assignment: a ?? null } })}
              onOpenAssignment={(a) => navigate('/assignment', { state: { assignment: a } })}
              onOpenCourses={() => navigate('/courses')}
              onOpenResults={() => navigate('/results')}
              onContinueLearning={async () => {
                const resume = await getResumeLesson();
                if (resume) navigate('/lesson', { state: resume });
                else navigate('/courses');
              }}
            />
          } />
        </Routes>
      </>
    );
  }

  // ── Public ─────────────────────────────────────────────────────────────────
  return (
    <Routes>
      <Route path="/login" element={<LoginPage onSuccess={() => {}} onSignupClick={() => navigate('/signup')} onForgotPassword={() => navigate('/forgot-password')} />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage onBack={() => navigate('/login')} />} />
      <Route path="/signup" element={<SignupPage onSuccess={() => navigate('/login')} onLoginClick={() => navigate('/login')} />} />
      <Route path="/school-signup" element={<SchoolSignupPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="*" element={<LandingPage onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} onSchoolSignup={() => navigate('/school-signup')} />} />
    </Routes>
  );
}
