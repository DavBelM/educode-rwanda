import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/dashboard/HeroBanner';
import { ProgressOverview } from './components/dashboard/ProgressOverview';
import { AssignmentCard } from './components/dashboard/AssignmentCard';
import { AIInsights } from './components/dashboard/AIInsights';
import { AchievementBadges } from './components/dashboard/AchievementBadges';
import { useAuth } from '../lib/auth';
import { getStudentAssignments, getStudentClasses, getClassWithInviteCode, joinClass, getSubmittedAssignmentIds, getStudentGrades, recordDailyLogin, getStreak, getStudentAnnouncements, getNewGradeCount, type Assignment, type Announcement } from '../lib/db';
import { Users, ArrowRight, Loader, X, BookOpen, Megaphone, Pin, Code2 } from 'lucide-react';

interface Props {
  language: 'EN' | 'KIN';
  onLanguageChange: (lang: 'EN' | 'KIN') => void;
  onStartCoding?: (assignment?: Assignment) => void;
  onOpenAssignment?: (assignment: Assignment) => void;
  onOpenCourses?: () => void;
  onOpenResults?: () => void;
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
      setError(isKin ? 'Kode ntabwo ibonetse. Baza umwarimu wawe.' : 'Code not found. Check with your teacher.');
      setLoading(false);
      return;
    }

    const { error: joinError } = await joinClass(cls.id);
    if (joinError === 'already_enrolled') {
      setError(isKin ? 'Usanzwe uri muri iri somo.' : 'You are already in this class.');
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
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b2)', fontFamily: 'Inter, sans-serif' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: 'var(--ec-text-1)' }}>
            {isKin ? 'Injira mu Ishuri' : 'Join a Class'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--ec-text-6)' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--ec-text-4)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--ec-text-6)')}>
            <X size={18} />
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--ec-text-5)' }}>
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
          style={{ background: 'var(--ec-bg)', border: '1px solid var(--ec-b2)', color: '#00d4aa', letterSpacing: '0.15em' }}
          onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
          onBlur={e => (e.target.style.border = '1px solid var(--ec-b2)')}
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
          style={{ background: '#00d4aa', color: 'var(--ec-bg)' }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}
        >
          {loading ? <Loader size={16} className="animate-spin" /> : (
            <>{isKin ? 'Injira mu Ishuri' : 'Join Class'} <ArrowRight size={14} /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard({ language, onLanguageChange, onStartCoding, onOpenAssignment, onOpenCourses, onOpenResults, onContinueLearning }: Props) {
  const { profile } = useAuth();
  const studentName = profile?.full_name ?? 'Student';
  const isKinyarwanda = language === 'KIN';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [gradeMap, setGradeMap] = useState<Record<string, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hasClass, setHasClass] = useState<boolean | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newGradeCount, setNewGradeCount] = useState(0);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  const loadAssignments = async () => {
    setLoadingAssignments(true);
    const [{ data: classes }, { data: asgns }, submitted, grades, currentStreak, { data: ann }, newGrades] = await Promise.all([
      getStudentClasses(),
      getStudentAssignments(),
      getSubmittedAssignmentIds(),
      getStudentGrades(),
      getStreak(),
      getStudentAnnouncements(),
      getNewGradeCount(),
    ]);
    setNewGradeCount(newGrades);
    setAnnouncements(ann ?? []);
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
    const fbMap: Record<string, string> = {};
    for (const g of graded) {
      map[g.assignment_id] = `${g.marks_earned}/${g.total_marks}`;
      if (g.teacher_feedback) fbMap[g.assignment_id] = g.teacher_feedback;
    }
    setGradeMap(map);
    setFeedbackMap(fbMap);

    setLoadingAssignments(false);
  };

  useEffect(() => {
    recordDailyLogin();
    loadAssignments();
    const onVisible = () => { if (document.visibilityState === 'visible') loadAssignments(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const toggleLanguage = () => onLanguageChange(language === 'EN' ? 'KIN' : 'EN');

  // Map a DB assignment to the AssignmentCard shape
  const toCardAssignment = (a: Assignment) => {
    const now = new Date();
    const due = a.due_date ? new Date(a.due_date) : null;
    const diffMs = due ? due.getTime() - now.getTime() : null;
    const daysLeft = diffMs !== null ? Math.ceil(diffMs / 86400000) : null;

    let dueStatus: 'submitted' | 'due-soon' | 'overdue' = 'due-soon';
    let dueText = isKinyarwanda ? 'Nta tariki ntarengwa' : 'No due date';

    if (due) {
      if (daysLeft !== null && daysLeft < 0) {
        dueStatus = 'overdue';
        dueText = isKinyarwanda ? 'Igihe cyarenze' : 'Overdue';
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
      feedback: feedbackMap[a.id],
    };
  };

  const handleAssignmentClick = (assignment: Assignment) => {
    if (assignment.assignment_type === 'theoretical') {
      onOpenAssignment?.(assignment);
    } else {
      onStartCoding?.(assignment);
    }
  };

  // Level based on profile XP (real accumulated XP)
  const profileXp = profile?.xp_points ?? 0;
  const getLevel = (xp: number): string => {
    if (xp >= 500) return isKinyarwanda ? 'Inzobere' : 'Master';
    if (xp >= 200) return isKinyarwanda ? 'Injeniyeri' : 'Engineer';
    if (xp >= 100) return isKinyarwanda ? 'Inzobere II' : 'Advanced II';
    if (xp >= 50)  return isKinyarwanda ? 'Hagati II' : 'Intermediate II';
    if (xp >= 25)  return isKinyarwanda ? 'Hagati I' : 'Intermediate I';
    if (xp >= 10)  return isKinyarwanda ? 'Intangiriro II' : 'Beginner II';
    return isKinyarwanda ? 'Intangiriro I' : 'Beginner I';
  };

  // Progress = % of assignments submitted (something the student controls)
  const progressPct = assignments.length > 0
    ? Math.round((submittedIds.size / assignments.length) * 100)
    : 0;

  const insights = (() => {
    const result: Array<{ text: string; isPositive: boolean }> = [];
    const total = assignments.length;
    const submitted = submittedIds.size;
    const pending = total - submitted;
    const now = new Date();
    const overdueCount = assignments.filter(a =>
      !submittedIds.has(a.id) && a.due_date && new Date(a.due_date) < now
    ).length;

    if (total === 0) {
      result.push({ isPositive: false, text: isKinyarwanda
        ? 'Nta mikoro ufite ubu. Injira mu ishuri kugirango utangire.'
        : 'No assignments yet. Join a class to get started.' });
      return result;
    }

    if (submitted === 0) {
      result.push({ isPositive: false, text: isKinyarwanda
        ? `Ufite imishinga ${total} itaratanzwe. Tangira ugatange umwe!`
        : `You have ${total} assignment${total > 1 ? 's' : ''} to complete. Submit one to get started!` });
    } else if (submitted === total) {
      result.push({ isPositive: true, text: isKinyarwanda
        ? `Watanze imishinga yose ${total}! Biragaragara ko ukomeza! 🎉`
        : `You've submitted all ${total} assignments! Keep it up! 🎉` });
    } else {
      result.push({ isPositive: true, text: isKinyarwanda
        ? `Watanze imikoro ${submitted} kuri ${total}. Ufite ${pending} isigaye.`
        : `Submitted ${submitted} of ${total} assignments — ${pending} still pending.` });
    }

    if (overdueCount > 0) {
      result.push({ isPositive: false, text: isKinyarwanda
        ? `Ufite ${overdueCount} ${overdueCount > 1 ? 'mishinga' : 'umushinga'} yarangirije itariki. Bishoboka biragiranwa!`
        : `${overdueCount} assignment${overdueCount > 1 ? 's are' : ' is'} overdue — submit if you still can!` });
    }

    const scorePct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
    if (totalPossible > 0) {
      if (scorePct >= 80) {
        result.push({ isPositive: true, text: isKinyarwanda
          ? `Amanota meza cyane — ugera kuri ${scorePct}% by'amanota yose! 🌟`
          : `Excellent scores — you're averaging ${scorePct}% overall! 🌟` });
      } else if (scorePct >= 50) {
        result.push({ isPositive: false, text: isKinyarwanda
          ? `Ufite amanota ${scorePct}% ku mikoro yahawe amanota. Reba ibitekerezo by'umwarimu ngo ubashe kwikosora.`
          : `Scoring ${scorePct}% on graded work. Review feedback to improve.` });
      } else {
        result.push({ isPositive: false, text: isKinyarwanda
          ? `Amanota ya ${scorePct}% arakeneye iterambere. Soma ibihano by'umwarimu.`
          : `${scorePct}% score needs improvement — read your teacher's feedback.` });
      }
    }

    if (streak >= 3) {
      result.push({ isPositive: true, text: isKinyarwanda
        ? `Iminsi ${streak} ukurikirana wiga! Komeza utyo! 🔥`
        : `${streak}-day learning streak! Keep the momentum going! 🔥` });
    }

    return result.slice(0, 3);
  })();

  // Real badges derived from actual activity
  const badges = [
    { id: '1', name: isKinyarwanda ? 'Umukoro wa mbere' : 'First Submit',  icon: 'award',  earned: submittedIds.size >= 1 },
    { id: '2', name: isKinyarwanda ? `Iminsi ${streak}` : `${streak}d Streak`, icon: 'flame', earned: streak >= 1 },
    { id: '3', name: isKinyarwanda ? 'Amanota 10+' : '10+ XP',              icon: 'star',   earned: profileXp >= 10 },
    { id: '4', name: isKinyarwanda ? 'Amanota yo hejuru' : 'High Score', icon: 'trophy', earned: progressPct >= 80 },
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', background: 'var(--ec-bg)' }}>
      <Header
        language={language}
        onLanguageToggle={toggleLanguage}
        subtitle={isKinyarwanda ? 'Dashboard y\'umunyeshuri' : 'Student Dashboard'}
        hideAssignmentInfo={true}
        announcementCount={announcements.length}
        onAnnouncementsClick={() => setShowAnnouncements(true)}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <HeroBanner language={language} studentName={studentName} />

        {/* Announcements modal */}
        {showAnnouncements && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAnnouncements(false)}>
            <div className="w-full max-w-lg rounded-2xl flex flex-col"
              style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b2)', maxHeight: '80vh' }}
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid var(--ec-b1)' }}>
                <div className="flex items-center gap-2">
                  <Megaphone size={16} style={{ color: '#f59e0b' }} />
                  <h2 className="font-bold" style={{ color: 'var(--ec-text-1)', fontSize: '16px' }}>
                    {isKinyarwanda ? 'Amatangazo' : 'Announcements'}
                  </h2>
                  {announcements.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                      {announcements.length}
                    </span>
                  )}
                </div>
                <button onClick={() => setShowAnnouncements(false)}
                  style={{ color: 'var(--ec-text-6)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--ec-text-4)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--ec-text-6)')}>
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto p-5 space-y-3">
                {announcements.length === 0 ? (
                  <div className="py-10 text-center">
                    <Megaphone size={28} className="mx-auto mb-3" style={{ color: 'var(--ec-text-7)' }} />
                    <p className="font-medium" style={{ color: 'var(--ec-text-6)', fontSize: '15px' }}>
                      {isKinyarwanda ? 'Nta matangazo arahari' : 'No announcements yet'}
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--ec-text-7)' }}>
                      {isKinyarwanda ? 'Umwarimu wawe azashyira amakuru mashya hano' : 'Your teacher will post updates here'}
                    </p>
                  </div>
                ) : (
                  announcements.map(a => {
                    const cls = (a.classes as { name: string } | undefined)?.name;
                    return (
                      <div key={a.id} className="rounded-xl p-4"
                        style={{ background: a.pinned ? 'rgba(245,158,11,0.06)' : 'var(--ec-surface-2)', border: a.pinned ? '1px solid rgba(245,158,11,0.2)' : '1px solid var(--ec-b5)' }}>
                        <div className="flex items-start gap-2 mb-2">
                          {a.pinned && <Pin size={12} className="shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />}
                          <p className="font-semibold flex-1" style={{ color: 'var(--ec-text-1)', fontSize: '15px' }}>{a.title}</p>
                          {cls && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
                              style={{ background: 'rgba(0,212,170,0.08)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.15)' }}>
                              {cls}
                            </span>
                          )}
                        </div>
                        <p className="leading-relaxed mb-2" style={{ color: 'var(--ec-text-4)', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{a.body}</p>
                        <p className="text-xs" style={{ color: 'var(--ec-text-7)' }}>
                          {new Date(a.created_at).toLocaleString()}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Progress */}
          <div className="lg:col-span-3">
            <ProgressOverview
              language={language}
              progress={progressPct}
              assignmentsCompleted={submittedIds.size}
              assignmentsTotal={assignments.length}
              streak={streak}
              xpPoints={profileXp}
              level={getLevel(profileXp)}
              onContinueLearning={onContinueLearning}
            />
          </div>

          {/* Assignments */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl p-6" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: 'var(--ec-text-1)' }}>
                  {isKinyarwanda ? 'Imikoro ihari ubu' : 'Active Assignments'}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenResults?.()}
                    className="relative flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.08)')}
                  >
                    <ArrowRight size={12} />
                    {isKinyarwanda ? 'Amanota Yanjye' : 'My Results'}
                    {newGradeCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: '#ef4444', color: '#fff', fontSize: '10px' }}>
                        {newGradeCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => onOpenCourses?.()}
                    className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ color: '#8b5cf6', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.08)')}
                  >
                    <BookOpen size={13} />
                    {isKinyarwanda ? 'Amasomo' : 'Courses'}
                  </button>
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ color: '#00d4aa', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.08)')}
                  >
                    <Users size={13} />
                    {isKinyarwanda ? 'Injira mu Ishuri' : 'Join Class'}
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
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--ec-b3)', border: '1px solid var(--ec-b2)' }}>
                    <Users size={24} style={{ color: 'var(--ec-text-7)' }} />
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--ec-text-5)' }}>
                    {isKinyarwanda ? 'Ntabwo uri mu ishuri' : 'You\'re not in a class yet'}
                  </p>
                  <p className="text-xs mb-5" style={{ color: 'var(--ec-text-7)' }}>
                    {isKinyarwanda
                      ? 'Shyiramo kode wahawe n\'umwarimu wawe kugirango ubone imikoro yawe.'
                      : 'Enter the invite code from your teacher to see your assignments.'}
                  </p>
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#00d4aa', color: 'var(--ec-bg)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#00bfa0')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#00d4aa')}
                  >
                    {isKinyarwanda ? 'Injira mu Ishuri' : 'Join a Class'}
                  </button>
                </div>
              ) : assignments.length === 0 ? (
                /* Enrolled but no assignments yet */
                <div className="py-10 text-center">
                  <p className="text-sm" style={{ color: 'var(--ec-text-6)' }}>
                    {isKinyarwanda ? 'Nta mikoro urahabwa n\'umwarimu wawe.' : 'No assignments from your teacher yet.'}
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
            {/* Practice card */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--ec-gradient-practice)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <Code2 size={16} style={{ color: '#a78bfa' }} />
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--ec-text-1)' }}>
                  {isKinyarwanda ? 'Ushaka kwimenyereza?' : 'Want to Practice?'}
                </p>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--ec-text-5)' }}>
                {isKinyarwanda ? 'Fungura editor uko ushaka — AI izagufasha' : 'Open the editor freely — AI feedback included'}
              </p>
              <button
                onClick={() => onStartCoding?.()}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.15)')}
              >
                <Code2 size={13} />
                {isKinyarwanda ? 'Fungura Editor' : 'Open Editor'}
              </button>
            </div>
            <AIInsights language={language} insights={insights} />
            <AchievementBadges language={language} badges={badges} />
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t px-4 py-3 z-40" style={{ background: 'var(--ec-surface)', borderColor: 'var(--ec-b1)' }}>
        <div className="flex items-center justify-around">
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: isKinyarwanda ? 'Ahabanza' : 'Home', active: true },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="var(--ec-text-6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: isKinyarwanda ? 'Imikoro' : 'Assignments', active: false },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="var(--ec-text-6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="var(--ec-text-6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: isKinyarwanda ? 'Ibihembo' : 'Badges', active: false },
          ].map((item, i) => (
            <button key={i} className="flex flex-col items-center gap-1">
              {item.icon}
              <span className="text-xs font-medium" style={{ color: item.active ? '#00d4aa' : 'var(--ec-text-6)' }}>{item.label}</span>
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
