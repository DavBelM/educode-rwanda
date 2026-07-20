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
import TermsPage from './TermsPage';
import LegalLandingPage from './LegalLandingPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import MyResultsPage from './MyResultsPage';
import OnboardingModal from './OnboardingModal';
import EthicsModal from './EthicsModal';
import SchoolAdminDashboard from './SchoolAdminDashboard';
import SelfLearnerDashboard from './SelfLearnerDashboard';
import ChallengePage from './ChallengePage';
import ChallengeRunner from './ChallengeRunner';
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
  const { user, profile, loading, isRecoveryMode, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Legal pages are always public — bypass auth routing entirely
  if (['/terms', '/privacy', '/legal'].includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/terms"   element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/legal"   element={<LegalLandingPage />} />
      </Routes>
    );
  }
  const [showEthics, setShowEthics] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');

  useEffect(() => {
    if (user && profile) {
      const isStudent = profile.user_type === 'student' || profile.user_type === 'self_learner';
      const ethicsKey = `educode_ethics_agreed_${user.id}`;
      const onboardKey = `educode_onboarded_${user.id}`;
      const ethicsAgreed = !!localStorage.getItem(ethicsKey);
      const onboarded = !!localStorage.getItem(onboardKey);

      if (isStudent && !ethicsAgreed) {
        setShowEthics(true);
      } else if (!onboarded) {
        setShowOnboarding(true);
      }
    }
  }, [user, profile]);

  const handleEthicsAgreed = () => {
    if (user) localStorage.setItem(`educode_ethics_agreed_${user.id}`, '1');
    setShowEthics(false);
    const onboardKey = `educode_onboarded_${user.id}`;
    if (!localStorage.getItem(onboardKey)) setShowOnboarding(true);
  };

  const handleOnboardingDone = () => {
    if (user) localStorage.setItem(`educode_onboarded_${user.id}`, '1');
    setShowOnboarding(false);
  };

  const openLesson = (lesson: CourseLesson, courseTitle: string, allLessons: CourseLesson[]) => {
    navigate('/lesson', { state: { lesson, courseTitle, allLessons } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--text-2)', borderTopColor: 'transparent' }} />
          <p className="text-sm font-medium dim">
            Loading EduCode Rwanda...
          </p>
        </div>
      </div>
    );
  }

  if (isRecoveryMode) return <ResetPasswordPage onDone={() => navigate('/login')} />;

  // Deactivated account — shown instead of the full app
  if (user && profile?.is_deactivated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
        <div className="card pad-lg" style={{ maxWidth: 420, width: '100%', textAlign: 'center', animation: 'rise 0.4s ease both' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
            Account deactivation requested
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 6 }}>
            Your account has been deactivated. Your teacher can still see your work and grades during the pilot period.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 24 }}>
            Your data will be deleted after the pilot ends. If you did this by mistake, contact your teacher or{' '}
            <span style={{ color: 'var(--text-2)' }}>belamitali@gmail.com</span>.
          </p>
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  if (user && profile) {
    const ethicsModal = showEthics ? (
      <EthicsModal language={language} onAgree={handleEthicsAgreed} />
    ) : null;

    const onboardingModal = !showEthics && showOnboarding ? (
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
          {ethicsModal}
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
            <Route path="/challenges" element={<ChallengePage language={language} />} />
            <Route path="/challenges/:setId" element={<ChallengeRunner language={language} />} />
            <Route path="*" element={
              <SelfLearnerDashboard
                {...sharedCourseProps}
                onStartCoding={() => navigate('/workspace')}
                onOpenCourses={() => navigate('/courses')}
                onOpenChallenges={() => navigate('/challenges')}
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
        {ethicsModal}
        {onboardingModal}
        <Routes>
          <Route path="/workspace" element={<WorkspaceRoute language={language} />} />
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
          <Route path="/challenges" element={<ChallengePage language={language} />} />
          <Route path="/challenges/:setId" element={<ChallengeRunner language={language} />} />
          <Route path="*" element={
            <Dashboard
              language={language}
              onLanguageChange={setLanguage}
              onStartCoding={(a) => navigate('/workspace', { state: { assignment: a ?? null } })}
              onOpenAssignment={(a) => navigate('/assignment', { state: { assignment: a } })}
              onOpenCourses={() => navigate('/courses')}
              onOpenResults={() => navigate('/results')}
              onOpenChallenges={() => navigate('/challenges')}
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
      <Route path="/terms"   element={<TermsPage />} />
      <Route path="/legal"   element={<LegalLandingPage />} />
      <Route path="*" element={<LandingPage onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} onSchoolSignup={() => navigate('/school-signup')} />} />
    </Routes>
  );
}
