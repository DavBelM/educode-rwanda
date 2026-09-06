import { useState, useEffect, useRef } from 'react';
import { AppNav } from './components/AppNav';
import { XPLeaderboard } from './components/XPLeaderboard';
import { PeerActivityFeed } from './components/PeerActivityFeed';
import { useAuth } from '../lib/auth';
import { getStudentAssignments, getStudentClasses, getClassWithInviteCode, joinClass, getSubmittedAssignmentIds, getStudentGrades, recordDailyLogin, getStreak, getStudentAnnouncements, getNewGradeCount, getLessonProgress, hasPilotSurveyResponse, getStudentAttendanceForClass, type Assignment, type Announcement } from '../lib/db';
import PilotSurvey from './PilotSurvey';
import { getMwarimuWeekCount } from '../lib/quiz-db';
import { getLessonAIHelp, translateToKinyarwanda } from '../lib/ai';
import { Users, ArrowRight, Loader, X, Megaphone, Pin, Code2, AlertTriangle, Check, MessageCircle, Send } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  language: 'EN' | 'KIN';
  onLanguageChange: (lang: 'EN' | 'KIN') => void;
  onStartCoding?: (assignment?: Assignment) => void;
  onOpenAssignment?: (assignment: Assignment) => void;
  onOpenCourses?: () => void;
  onOpenResults?: () => void;
  onContinueLearning?: () => void;
  onOpenChallenges?: () => void;
}

// ─── Floating Mwarimu Chat ─────────────────────────────────────────────────────

type ChatMsg = { role: 'user' | 'ai'; text: string };

function MwarimuFloat({ language, studentName }: { language: 'EN' | 'KIN'; studentName: string }) {
  const isKin = language === 'KIN';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 120); } }, [open]);

  const greeting: ChatMsg = {
    role: 'ai',
    text: isKin
      ? `Muraho ${studentName.split(' ')[0]}! Ndi Mwarimu, umufasha wawe mu gukora code. Ufite ikibazo cyose ku JavaScript, imishinga, cyangwa amasomo? Baza!`
      : `Hi ${studentName.split(' ')[0]}! I'm Mwarimu, your coding assistant. Got a question about JavaScript, your assignments, or any concept? Just ask!`,
  };

  const visibleMessages = messages.length === 0 ? [greeting] : messages;

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    const userMsg: ChatMsg = { role: 'user', text: q };
    setMessages(prev => (prev.length === 0 ? [greeting, userMsg] : [...prev, userMsg]));
    setLoading(true);
    const raw = await getLessonAIHelp(q, '', '', language, 'reading');
    let finalText = raw;
    if (isKin) {
      try { finalText = await translateToKinyarwanda(raw); } catch { /* keep EN */ }
    }
    setMessages(prev => [...prev, { role: 'ai', text: finalText }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Ask Mwarimu"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 200,
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--text)', color: 'var(--bg)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open ? <X size={20} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 199,
          width: 'min(380px, calc(100vw - 40px))',
          height: 'min(520px, calc(100vh - 140px))',
          display: 'flex', flexDirection: 'column',
          borderRadius: 'var(--radius)', overflow: 'hidden',
          background: 'var(--surface)', border: '1px solid var(--line)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--text)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>M</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.2 }}>Mwarimu</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{isKin ? 'Umufasha w\'AI wa Coding' : 'AI Coding Tutor'}</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visibleMessages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', fontSize: 13.5, lineHeight: 1.6,
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? 'var(--text)' : 'var(--surface-2)',
                  color: m.role === 'user' ? 'var(--bg)' : 'var(--text)',
                  border: m.role === 'ai' ? '1px solid var(--line)' : 'none',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '18px 18px 18px 4px', background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-3)', animation: 'pulse 1s ease-in-out 0s infinite' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-3)', animation: 'pulse 1s ease-in-out 0.2s infinite' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-3)', animation: 'pulse 1s ease-in-out 0.4s infinite' }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--line)', display: 'flex', gap: 8, background: 'var(--surface)' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={isKin ? 'Baza ikibazo...' : 'Ask a question...'}
              style={{
                flex: 1, padding: '9px 13px', fontSize: 13.5,
                background: 'var(--bg)', color: 'var(--text)',
                border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
                outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: 'var(--radius-sm)',
                background: input.trim() && !loading ? 'var(--text)' : 'var(--surface-2)',
                color: input.trim() && !loading ? 'var(--bg)' : 'var(--text-3)',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.15s',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
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
      <div className="card pad-lg w-full max-w-sm">
        <div className="card-head">
          <h2 className="card-title">{isKin ? 'Injira mu Ishuri' : 'Join a Class'}</h2>
          <button onClick={onClose} className="iconbtn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm mb-4 dim">
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
          className="input mb-4"
          style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600, letterSpacing: '0.15em' }}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
        />

        {error && (
          <p className="text-sm mb-4" style={{ color: 'var(--error)', background: 'var(--error-dim)', border: '1px solid var(--error)', borderRadius: 'var(--radius)', padding: '10px 13px' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleJoin}
          disabled={code.trim().length < 4 || loading}
          className="btn btn-primary btn-block"
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

export default function Dashboard({ language, onStartCoding, onOpenAssignment, onOpenCourses, onOpenResults, onContinueLearning, onOpenChallenges }: Props) {
  usePageTitle('Dashboard · EduCode');
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
  const [lessonProgress, setLessonProgress] = useState({ completed: 0, total: 0, pct: 0 });
  const [classId, setClassId] = useState<string | null>(null);
  const [mwarimuWeekCount, setMwarimuWeekCount] = useState(0);
  const [attendancePct, setAttendancePct] = useState<number | null>(null);
  const [surveyDone, setSurveyDone] = useState(true); // default true to avoid flash
  const [showSurvey, setShowSurvey] = useState(false);

  const loadAssignments = async () => {
    setLoadingAssignments(true);
    const [{ data: classes }, { data: asgns }, submitted, grades, currentStreak, { data: ann }, newGrades, lessonProg, weekCount, alreadySurveyed] = await Promise.all([
      getStudentClasses(),
      getStudentAssignments(),
      getSubmittedAssignmentIds(),
      getStudentGrades(),
      getStreak(),
      getStudentAnnouncements(),
      getNewGradeCount(),
      getLessonProgress(),
      getMwarimuWeekCount(),
      hasPilotSurveyResponse(),
    ]);
    setSurveyDone(alreadySurveyed);
    setNewGradeCount(newGrades);
    setLessonProgress(lessonProg);
    setAnnouncements(ann ?? []);
    setStreak(currentStreak);
    setHasClass(classes.length > 0);
    const firstClassId = classes[0]?.id ?? null;
    setClassId(firstClassId);
    if (firstClassId) {
      getStudentAttendanceForClass(firstClassId).then(a => setAttendancePct(a.total > 0 ? a.pct : null));
    }
    setMwarimuWeekCount(weekCount);
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

  // Progress = % of course lessons completed
  const progressPct = lessonProgress.pct;

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

  const firstName = studentName.split(' ')[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <AppNav streak={streak} />

      <main className="wrap page">
        {/* Welcome header */}
        <div className="welcome rise">
          <div>
            <h1>
              {profileXp === 0
                ? (isKinyarwanda ? `Murakaza neza, ${firstName}.` : `Welcome, ${firstName}.`)
                : `${firstName}.`}
            </h1>
            <p className="sub">
              {streak > 0
                ? (isKinyarwanda
                    ? `Iminsi ${streak} ukurikirana. Isomo rimwe ririnda igihe cyawe uyu munsi.`
                    : `You're on a ${streak}-day streak. One lesson keeps it alive today.`)
                : (isKinyarwanda ? 'Tangira kwiga uyu munsi.' : 'Start learning today.')}
            </p>
          </div>
          <button className="btn btn-primary" onClick={onContinueLearning}>
            {isKinyarwanda ? 'Komeza isomo' : 'Continue lesson'}
          </button>
        </div>

        <div className="dash">
          {/* LEFT column */}
          <div className="stack" style={{ ['--gap' as string]: '22px' }}>

            {/* Continue card */}
            <section className="card pad-lg continue rise-2">
              <div>
                <div className="meta">
                  {isKinyarwanda ? 'Amahugurwa ya JavaScript · Igice 3' : 'JavaScript Foundations · Module 3'}
                </div>
                <h2>{isKinyarwanda ? 'Imirimo n\'Impano' : 'Functions & Parameters'}</h2>
                <p className="desc">
                  {isKinyarwanda
                    ? 'Wahagaritse hagati ya "Default parameters". Komeza aho Mwarimu yakusigiye note.'
                    : 'You stopped halfway through "Default parameters". Pick up where Mwarimu left a note.'}
                </p>
                <div className="row" style={{ marginTop: 18, gap: 10 }}>
                  <button className="btn btn-primary sm" onClick={onContinueLearning}>
                    {isKinyarwanda ? 'Subira isomo' : 'Resume lesson'}
                  </button>
                  <button className="btn btn-tertiary sm" onClick={onOpenCourses}>
                    {isKinyarwanda ? 'Reba igice' : 'View module'}
                  </button>
                </div>
              </div>
              <div className="progress-ring">
                <svg width="92" height="92" viewBox="0 0 92 92" aria-label={`${progressPct}% complete`}>
                  <circle cx="46" cy="46" r="40" fill="none" stroke="var(--surface-2)" strokeWidth="6"/>
                  <circle cx="46" cy="46" r="40" fill="none" stroke="var(--text-2)" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="251"
                    strokeDashoffset={251 - (251 * progressPct) / 100}
                    transform="rotate(-90 46 46)"
                    className="ring-anim"/>
                  <text x="46" y="51" textAnchor="middle" fill="var(--text)" fontSize="20" fontWeight="600" fontFamily="var(--font)">{progressPct}%</text>
                </svg>
              </div>
            </section>

            {/* Active assignments */}
            <section className="card pad-lg rise-2">
              <div className="card-head">
                <h3 className="card-title">{isKinyarwanda ? 'Imikoro ihari' : 'Active assignments'}</h3>
                <div className="row" style={{ gap: 8 }}>
                  {newGradeCount > 0 && (
                    <button className="btn btn-tertiary sm" onClick={onOpenResults} style={{ position: 'relative' }}>
                      {isKinyarwanda ? 'Amanota' : 'Results'}
                      <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: 'var(--error)', color: 'var(--bg)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                        {newGradeCount}
                      </span>
                    </button>
                  )}
                  <button className="btn btn-tertiary sm" onClick={() => setShowJoinModal(true)}>
                    {isKinyarwanda ? 'Injira mu ishuri' : 'Join class'}
                  </button>
                </div>
              </div>

              {loadingAssignments ? (
                <div style={{ padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
                  <Loader size={20} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-2)' }} />
                </div>
              ) : hasClass === false ? (
                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                  <Users size={28} style={{ color: 'var(--text-3)', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6 }}>
                    {isKinyarwanda ? 'Ntabwo uri mu ishuri' : "You're not in a class yet"}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
                    {isKinyarwanda ? 'Shyiramo kode wahawe n\'umwarimu.' : 'Enter your teacher\'s invite code.'}
                  </p>
                  <button className="btn btn-primary sm" onClick={() => setShowJoinModal(true)}>
                    {isKinyarwanda ? 'Injira mu Ishuri' : 'Join a Class'}
                  </button>
                </div>
              ) : assignments.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
                    {isKinyarwanda ? 'Nta mikoro urahabwa.' : 'No assignments yet.'}
                  </p>
                </div>
              ) : (
                <div className="alist">
                  {[...assignments].sort((a, b) => {
                    // Sort: overdue not submitted → due soon → submitted/returned → no date
                    const aOver = !submittedIds.has(a.id) && !!a.due_date && new Date(a.due_date) < new Date();
                    const bOver = !submittedIds.has(b.id) && !!b.due_date && new Date(b.due_date) < new Date();
                    if (aOver && !bOver) return -1;
                    if (!aOver && bOver) return 1;
                    const aDate = a.due_date ? new Date(a.due_date).getTime() : Infinity;
                    const bDate = b.due_date ? new Date(b.due_date).getTime() : Infinity;
                    return aDate - bDate;
                  }).map(a => {
                    const card = toCardAssignment(a);
                    const hasGrade = !!gradeMap[a.id];
                    const hasFeedback = !!feedbackMap[a.id];
                    const isOverdue = card.dueStatus === 'overdue';
                    const isDueToday = !submittedIds.has(a.id) && a.due_date && (() => {
                      const d = new Date(a.due_date!); const n = new Date();
                      return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
                    })();

                    return (
                      <div
                        key={a.id}
                        className="arow lift"
                        style={{
                          cursor: 'pointer',
                          borderLeft: isOverdue ? '3px solid var(--error, #ef4444)' : isDueToday ? '3px solid #f59e0b' : hasGrade ? '3px solid #22c55e' : '3px solid transparent'
                        }}
                        onClick={() => handleAssignmentClick(a)}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="at" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {card.title}
                            {isOverdue && <AlertTriangle size={13} style={{ color: 'var(--error, #ef4444)', flexShrink: 0 }} />}
                            {isDueToday && !isOverdue && <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', padding: '1px 5px', background: 'rgba(245,158,11,0.12)', borderRadius: 99 }}>TODAY</span>}
                          </div>
                          {hasFeedback && (
                            <div style={{ fontSize: 11.5, color: '#16a34a', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Check size={11} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
                                {feedbackMap[a.id]}
                              </span>
                            </div>
                          )}
                          {!hasFeedback && card.description && (
                            <div className="ad" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{card.description}</div>
                          )}
                        </div>
                        <div className="right" style={{ flexShrink: 0 }}>
                          {hasGrade ? (
                            <span className="pill solid" style={{ background: '#22c55e', color: '#fff', border: 'none' }}>
                              {gradeMap[a.id]}
                            </span>
                          ) : (
                            <span className={`pill${isOverdue ? ' error' : card.dueStatus === 'submitted' ? ' solid' : ''}`}>
                              {card.dueStatus === 'submitted' && <span className="dot" />}
                              {card.dueText}
                            </span>
                          )}
                          <button className="btn btn-secondary sm" onClick={e => { e.stopPropagation(); handleAssignmentClick(a); }}>
                            {card.dueStatus === 'submitted' ? (isKinyarwanda ? 'Reba' : 'Review') : (isKinyarwanda ? 'Fungura' : 'Open')}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Mwarimu insights */}
            <section className="card pad-lg rise-3">
              <div className="card-head">
                <h3 className="card-title">{isKinyarwanda ? 'Ubutumwa bwa Mwarimu' : 'From Mwarimu'}</h3>
                <span className="pill"><span className="dot"></span>{isKinyarwanda ? 'Iki cyumweru' : 'This week'}</span>
              </div>
              <div className="stack" style={{ ['--gap' as string]: '16px' }}>
                {insights.length === 0 ? (
                  <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
                    {isKinyarwanda ? 'Nta makuru arahari ubu.' : 'No insights yet — keep coding!'}
                  </p>
                ) : (
                  insights.map((ins, i) => (
                    <div key={i}>
                      {i > 0 && <div className="divider"></div>}
                      <div className="insight" style={{ marginTop: i > 0 ? 16 : 0 }}>
                        <span className="ic">
                          {ins.isPositive ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="9"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>
                            </svg>
                          )}
                        </span>
                        <p dangerouslySetInnerHTML={{ __html: ins.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* RIGHT sidebar */}
          <aside className="stack" style={{ ['--gap' as string]: '22px' }}>
            {/* XP + stats */}
            <section className="card pad-lg rise-3">
              <div className="level-row">
                <span className="lv">{getLevel(profileXp)}</span>
                <span className="xp">{profileXp} XP</span>
              </div>
              <div className="bar on-card">
                <i style={{ width: `${Math.min(100, (profileXp % 100))}%` }}></i>
              </div>
              <p className="dim" style={{ fontSize: 12.5, marginTop: 10 }}>
                {100 - (profileXp % 100)} XP {isKinyarwanda ? 'kugeza iry\'ubuninahazwa' : 'to next level'}
              </p>
              <div className="stat-grid">
                <div className="stat"><b>{streak}</b><span>{isKinyarwanda ? 'Iminsi ikurikirana' : 'Day streak'}</span></div>
                <div className="stat"><b>{lessonProgress.completed}</b><span>{isKinyarwanda ? 'Amasomo yarangiye' : 'Lessons done'}</span></div>
                <div className="stat"><b>{totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0}%</b><span>{isKinyarwanda ? 'Amanota y\'averaze' : 'Avg. score'}</span></div>
                <div className="stat"><b>{attendancePct !== null ? `${attendancePct}%` : '—'}</b><span>{isKinyarwanda ? 'Ibyicaro' : 'Attendance'}</span></div>
              </div>
            </section>

            {/* Challenge Mode card */}
            <section className="card pad-lg lift rise-4">
              <div className="card-head">
                <h3 className="card-title">{isKinyarwanda ? 'Imikino yo Gukora' : 'Challenge Mode'}</h3>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 14 }}>
                {isKinyarwanda
                  ? 'Gukora challenges za JavaScript kandi ube uronka XP.'
                  : 'Solve challenges, earn XP. Fix bugs, complete code, write from scratch.'}
              </p>
              <button className="btn btn-secondary btn-block" onClick={() => onOpenChallenges?.()}>
                {isKinyarwanda ? 'Tangira Challenge' : 'Start challenges'}
              </button>
            </section>

            {/* Achievements */}
            <section className="card pad-lg rise-4">
              <div className="card-head">
                <h3 className="card-title">{isKinyarwanda ? 'Ibyagezweho' : 'Achievements'}</h3>
                <span className="dim" style={{ fontSize: 12.5 }}>
                  {badges.filter(b => b.earned).length} / {badges.length}
                </span>
              </div>
              <div className="ach-grid">
                {badges.map((badge, bi) => (
                  <div key={badge.id} className={`ach ${badge.earned ? 'un' : 'lock'}`} title={badge.name}
                    style={badge.earned ? { animationDelay: `${0.08 * bi}s` } : undefined}>
                    {badge.icon === 'flame' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3c1 3-1 5-1 5s4 1 4 5a4 4 0 0 1-8 .5C7 10 9 9 9 9s-1-4 3-6z"/>
                      </svg>
                    )}
                    {badge.icon === 'star' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8-4.3-4.1 5.9-.9z"/>
                      </svg>
                    )}
                    {badge.icon === 'award' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                    )}
                    {badge.icon === 'trophy' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4M12 17v4M8 21h8M12 17a6 6 0 0 1-6-6V3h12v8a6 6 0 0 1-6 6z"/>
                      </svg>
                    )}
                    {!badge.earned && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
                      </svg>
                    )}
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Practice card */}
            <section className="card pad-lg lift rise-5">
              <div className="card-head">
                <h3 className="card-title">{isKinyarwanda ? 'Imenyereze' : 'Free practice'}</h3>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 14 }}>
                {isKinyarwanda
                  ? 'Fungura editor uko ushaka — AI izagufasha.'
                  : 'Open the editor freely — AI feedback included.'}
              </p>
              <button className="btn btn-secondary btn-block" onClick={() => onStartCoding?.()}>
                <Code2 size={14} />
                {isKinyarwanda ? 'Fungura Editor' : 'Open Editor'}
              </button>
            </section>

            {/* Class leaderboard + activity feed (only when enrolled) */}
            {classId && (
              <>
                <XPLeaderboard classId={classId} language={language} />
                <PeerActivityFeed classId={classId} language={language} />
              </>
            )}

          </aside>
        </div>

        {/* Pilot survey banner — at the bottom of page content */}
        {!surveyDone && (
          <div className="card" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12, padding: '16px 20px', marginTop: 8,
          }}>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>
                {isKinyarwanda ? 'Twereke ibitekerezo byawe kuri EduCode Rwanda' : 'Share your feedback on EduCode Rwanda'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {isKinyarwanda ? 'Bihita — iminota 2 gusa' : 'Quick — takes about 2 minutes'}
              </p>
            </div>
            <button
              className="btn btn-primary"
              style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
              onClick={() => setShowSurvey(true)}
            >
              {isKinyarwanda ? 'Tangira' : 'Start survey'} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </main>

      {/* Announcements modal */}
      {showAnnouncements && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAnnouncements(false)}
        >
          <div
            style={{ width: '100%', maxWidth: 520, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Megaphone size={16} style={{ color: 'var(--text-2)' }} />
                <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
                  {isKinyarwanda ? 'Amatangazo' : 'Announcements'}
                </h2>
                {announcements.length > 0 && <span className="pill">{announcements.length}</span>}
              </div>
              <button className="iconbtn" onClick={() => setShowAnnouncements(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {announcements.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
                    {isKinyarwanda ? 'Nta matangazo arahari' : 'No announcements yet'}
                  </p>
                </div>
              ) : (
                announcements.map(a => {
                  const cls = (a.classes as { name: string } | undefined)?.name;
                  return (
                    <div key={a.id} className="card pad-sm" style={{ borderColor: a.pinned ? 'var(--line-strong)' : undefined }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                        {a.pinned && <Pin size={12} style={{ color: 'var(--text-2)', flexShrink: 0, marginTop: 2 }} />}
                        <p style={{ fontWeight: 500, color: 'var(--text)', fontSize: 15, flex: 1 }}>{a.title}</p>
                        {cls && <span className="pill" style={{ flexShrink: 0 }}>{cls}</span>}
                      </div>
                      <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.55, whiteSpace: 'pre-wrap', marginBottom: a.resource_url ? 10 : 8 }}>{a.body}</p>
                      {a.resource_url && (
                        <a
                          href={a.resource_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 8 }}
                        >
                          <ArrowRight size={13} style={{ flexShrink: 0 }} />
                          {a.resource_label || a.resource_url}
                        </a>
                      )}
                      <p style={{ color: 'var(--text-3)', fontSize: 12 }}>{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <JoinClassModal
          language={language}
          onClose={() => setShowJoinModal(false)}
          onJoined={() => { setShowJoinModal(false); loadAssignments(); }}
        />
      )}

      {showSurvey && (
        <PilotSurvey
          language={language}
          onDone={() => { setShowSurvey(false); setSurveyDone(true); }}
        />
      )}

      <MwarimuFloat language={language} studentName={studentName} />
    </div>
  );
}
