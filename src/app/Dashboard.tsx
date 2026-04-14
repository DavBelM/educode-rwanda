import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { ProgressOverview } from './components/dashboard/ProgressOverview';
import { AssignmentCard } from './components/dashboard/AssignmentCard';
import { AIInsights } from './components/dashboard/AIInsights';
import { AchievementBadges } from './components/dashboard/AchievementBadges';
import { useAuth } from '../lib/auth';
import { getStudentAssignments, getStudentClasses, getClassWithInviteCode, joinClass, getSubmittedAssignmentIds, getStudentGrades, recordDailyLogin, getStreak, type Assignment } from '../lib/db';
import { Users, ArrowRight, Loader, X, BookOpen } from 'lucide-react';

interface Props {
  language: 'EN' | 'KIN';
  onLanguageChange: (lang: 'EN' | 'KIN') => void;
  onStartCoding?: () => void;
  onOpenAssignment?: (assignment: Assignment) => void;
  onOpenCourses?: () => void;
  onContinueLearning?: () => void;
}

// ─── Join Class Modal ──────────────────────────────────────────────────────────

function JoinClassModal({ language, onClose, onJoined }: {
  language: 'EN' | 'KIN';
  onClose: () => void;
  onJoined: () => void;
}) {
  const isKin = language === 'KIN';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (code.trim().length < 4) return;
    setLoading(true);
    setError('');

    const { data: cls, error: lookupError } = await getClassWithInviteCode(code.trim());
    if (lookupError || !cls) {
      setError(isKin ? 'Kode ntabwo ibonetse. Reba neza.' : 'Code not found. Check with your teacher.');
      setLoading(false);
      return;
    }

    const { error: joinError } = await joinClass(cls.id);
    if (joinError === 'already_enrolled') {
      setError(isKin ? 'Usanzwe uri muri iryo somo.' : 'You are already in this class.');
      setLoading(false);
      return;
    }
    if (joinError) {
      setError(joinError);
      setLoading(false);
      return;
    }

    onJoined();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: '#f1f5f9' }}>
            {isKin ? 'Injira mu Isomo' : 'Join a Class'}
          </h2>
          <button onClick={onClose} style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
            <X size={18} />
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: '#64748b' }}>
          {isKin
            ? 'Shyiramo kode yo kwinjira wahawe n\'umwarimu wawe.'
            : 'Enter the invite code your teacher shared with you.'}
        </p>

        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. A3F8K2"
          maxLength={8}
          className="w-full px-4 py-3 rounded-xl text-center text-xl font-bold tracking-widest focus:outline-none mb-4"
          style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#00d4aa', letterSpacing: '0.15em' }}
          onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
          onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
        />

        {error && (
          <p className="text-xs p-3 rounded-xl mb-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleJoin}
          disabled={code.trim().length < 4 || loading}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
          style={{ background: '#00d4aa', color: '#0d0f14' }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}
        >
          {loading ? <Loader size={16} className="animate-spin" /> : (
            <>{isKin ? 'Injira' : 'Join Class'} <ArrowRight size={14} /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard({ language, onLanguageChange, onStartCoding, onOpenAssignment, onOpenCourses, onContinueLearning }: Props) {
  const { profile } = useAuth();
  const studentName = profile?.full_name ?? 'Student';
  const isKinyarwanda = language === 'KIN';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [gradeMap, setGradeMap] = useState<Record<string, string>>({});
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hasClass, setHasClass] = useState<boolean | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  const loadAssignments = async () => {
    setLoadingAssignments(true);
    const [{ data: classes }, { data: asgns }, submitted, grades, currentStreak] = await Promise.all([
      getStudentClasses(),
      getStudentAssignments(),
      getSubmittedAssignmentIds(),
      getStudentGrades(),
      getStreak(),
    ]);
    setStreak(currentStreak);
    setHasClass(classes.length > 0);
    setAssignments(asgns);
    setSubmittedIds(submitted);

    // Calculate real progress from graded assignments
    const graded = grades.filter(g => g.marks_earned !== null);
    setTotalEarned(graded.reduce((s, g) => s + (g.marks_earned ?? 0), 0));
    setTotalPossible(graded.reduce((s, g) => s + g.total_marks, 0));

    // Build grade badge map: assignmentId -> "15/20"
    const map: Record<string, string> = {};
    for (const g of graded) {
      map[g.assignment_id] = `${g.marks_earned}/${g.total_marks}`;
    }
    setGradeMap(map);

    setLoadingAssignments(false);
  };

  useEffect(() => { recordDailyLogin(); loadAssignments(); }, []);

  const toggleLanguage = () => onLanguageChange(language === 'EN' ? 'KIN' : 'EN');

  // Map a DB assignment to the AssignmentCard shape
  const toCardAssignment = (a: Assignment) => {
    const now = new Date();
    const due = a.due_date ? new Date(a.due_date) : null;
    const diffMs = due ? due.getTime() - now.getTime() : null;
    const daysLeft = diffMs !== null ? Math.ceil(diffMs / 86400000) : null;

    let dueStatus: 'submitted' | 'due-soon' | 'overdue' = 'due-soon';
    let dueText = isKinyarwanda ? 'Nta itariki' : 'No due date';

    if (due) {
      if (daysLeft !== null && daysLeft < 0) {
        dueStatus = 'overdue';
        dueText = isKinyarwanda ? 'Yarangirije' : 'Overdue';
      } else if (daysLeft !== null && daysLeft <= 3) {
        dueStatus = 'due-soon';
        dueText = isKinyarwanda ? `Iminsi ${daysLeft} isigaye` : `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
      } else {
        dueStatus = 'due-soon';
        dueText = due.toLocaleDateString();
      }
    }

    const capDiff = (d: string) => d.charAt(0).toUpperCase() + d.slice(1) as 'Beginner' | 'Intermediate' | 'Advanced';

    const isSubmitted = submittedIds.has(a.id);

    return {
      id: a.id,
      title: isKinyarwanda ? (a.title_kin || a.title) : a.title,
      description: isKinyarwanda ? (a.description_kin || a.description || '') : (a.description || ''),
      dueStatus: (isSubmitted ? 'submitted' : dueStatus) as 'submitted' | 'due-soon' | 'overdue',
      dueText: isSubmitted ? (isKinyarwanda ? 'Byatanzwe' : 'Submitted') : dueText,
      difficulty: capDiff(a.difficulty),
      testsCompleted: isSubmitted ? (a.questions?.length ?? 1) : 0,
      testsTotal: a.assignment_type === 'theoretical' ? (a.questions?.length ?? 1) : 5,
      status: isSubmitted ? 'completed' as const : 'not-started' as const,
      grade: gradeMap[a.id],
    };
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    if (assignment.assignment_type === 'theoretical') {
      onOpenAssignment?.(assignment);
    } else {
      onStartCoding?.();
    }
  };

  // Compute level from total XP (marks earned)
  const getLevel = (xp: number): string => {
    if (xp >= 100) return 'Advanced';
    if (xp >= 50)  return 'Intermediate II';
    if (xp >= 25)  return 'Intermediate I';
    if (xp >= 10)  return 'Beginner II';
    return 'Beginner I';
  };

  const progressPct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  const insights = [
    { text: isKinyarwanda ? 'Wiga cyane loops - uzazikenera mu mashusho' : "Practice more with loops - you'll need them in projects", isPositive: false },
    { text: isKinyarwanda ? 'Suzuma syntax ya functions' : 'Review function syntax', isPositive: false },
    { text: isKinyarwanda ? 'Urakora neza kuri variables! ✅' : 'Great progress on variables! ✅', isPositive: true },
  ];

  // Real badges derived from actual activity
  const badges = [
    { id: '1', name: isKinyarwanda ? 'Umushinga wa mbere' : 'First Submit',  icon: 'award',  earned: submittedIds.size >= 1 },
    { id: '2', name: isKinyarwanda ? `Iminsi ${streak}` : `${streak}d Streak`, icon: 'flame', earned: streak >= 1 },
    { id: '3', name: isKinyarwanda ? 'Amanota 10+' : '10+ XP',              icon: 'star',   earned: totalEarned >= 10 },
    { id: '4', name: isKinyarwanda ? 'Igihembo cy\'Iterambere' : 'High Score', icon: 'trophy', earned: progressPct >= 80 },
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', background: '#0d0f14' }}>
      <Header
        language={language}
        onLanguageToggle={toggleLanguage}
        subtitle={isKinyarwanda ? 'Ikibanza cy\'abanyeshuri' : 'Student Dashboard'}
        hideAssignmentInfo={true}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <HeroBanner language={language} studentName={studentName} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Progress */}
          <div className="lg:col-span-3">
            <ProgressOverview
              language={language}
              progress={progressPct}
              assignmentsCompleted={submittedIds.size}
              assignmentsTotal={assignments.length}
              streak={streak}
              xpPoints={totalEarned}
              level={getLevel(totalEarned)}
              onContinueLearning={onContinueLearning}
            />
          </div>

          {/* Assignments */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold" style={{ color: '#f1f5f9' }}>
                  {isKinyarwanda ? 'Ibisabwa' : 'Active Assignments'}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenCourses?.()}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.08)')}
                  >
                    <BookOpen size={12} />
                    {isKinyarwanda ? 'Amasomo' : 'Courses'}
                  </button>
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ color: '#00d4aa', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.08)')}
                  >
                    <Users size={12} />
                    {isKinyarwanda ? 'Injira mu Somo' : 'Join Class'}
                  </button>
                </div>
              </div>

              {loadingAssignments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size={20} className="animate-spin" style={{ color: '#00d4aa' }} />
                </div>
              ) : hasClass === false ? (
                /* No class enrolled */
                <div className="py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Users size={24} style={{ color: '#334155' }} />
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#64748b' }}>
                    {isKinyarwanda ? 'Ntabwo uri mu ishuri' : 'You\'re not in a class yet'}
                  </p>
                  <p className="text-xs mb-5" style={{ color: '#334155' }}>
                    {isKinyarwanda
                      ? 'Shyiramo kode wahawe n\'umwarimu wawe kugirango ubone imishinga.'
                      : 'Enter the invite code from your teacher to see your assignments.'}
                  </p>
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#00d4aa', color: '#0d0f14' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#00bfa0')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#00d4aa')}
                  >
                    {isKinyarwanda ? 'Injira mu Ishuri' : 'Join a Class'}
                  </button>
                </div>
              ) : assignments.length === 0 ? (
                /* Enrolled but no assignments yet */
                <div className="py-10 text-center">
                  <p className="text-sm" style={{ color: '#475569' }}>
                    {isKinyarwanda ? 'Nta mishinga igeze uhawe n\'umwarimu' : 'No assignments from your teacher yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {assignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={toCardAssignment(assignment)}
                      language={language}
                      onClick={() => handleAssignmentClick(assignment)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Insights & Badges */}
          <div className="lg:col-span-3 space-y-6">
            <AIInsights language={language} insights={insights} />
            <AchievementBadges language={language} badges={badges} />
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t px-4 py-3 z-40" style={{ background: '#13161e', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-around">
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: isKinyarwanda ? 'Ahabanza' : 'Home', active: true },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: isKinyarwanda ? 'Imishinga' : 'Assignments', active: false },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: isKinyarwanda ? 'Ibihembo' : 'Badges', active: false },
          ].map((item, i) => (
            <button key={i} className="flex flex-col items-center gap-1">
              {item.icon}
              <span className="text-xs font-medium" style={{ color: item.active ? '#00d4aa' : '#475569' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showJoinModal && (
        <JoinClassModal
          language={language}
          onClose={() => setShowJoinModal(false)}
          onJoined={() => {
            setShowJoinModal(false);
            loadAssignments();
          }}
        />
      )}
    </div>
  );
}
