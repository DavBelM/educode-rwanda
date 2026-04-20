import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, CheckCircle, Clock, BookOpen, AlertTriangle } from 'lucide-react';
import type { Assignment } from '../lib/db';
import { submitTheoreticalAssignment, getStudentSubmissions } from '../lib/db';
import { useExamMode } from '../hooks/useExamMode';

interface Props {
  assignment: Assignment;
  language: 'EN' | 'KIN';
  onBack: () => void;
}

export default function TheoreticalAssignment({ assignment, language, onBack }: Props) {
  const isKin = language === 'KIN';
  const questions = assignment.questions ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [violationWarning, setViolationWarning] = useState('');

  const title = isKin ? (assignment.title_kin || assignment.title) : assignment.title;
  const description = isKin ? (assignment.description_kin || assignment.description) : assignment.description;

  // Exam mode
  const examMode = !!(assignment.exam_mode);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    assignment.duration_minutes ? assignment.duration_minutes * 60 : 0
  );
  const autoSubmitRef = useRef(false);

  const { violations, isFullscreen, requestFullscreen, onPaste } = useExamMode({
    enabled: examMode,
    onViolation: (type) => {
      const msg = type === 'tabSwitches'
        ? (isKin ? '⚠️ Guhindura tab byarabonye!' : '⚠️ Tab switch detected!')
        : type === 'pasteCount'
        ? (isKin ? '⚠️ Gukopya ibisubizo byarabonye!' : '⚠️ Paste detected!')
        : (isKin ? '⚠️ Gusohoka ku screen nzima byarabonye!' : '⚠️ Fullscreen exit detected!');
      setViolationWarning(msg);
      setTimeout(() => setViolationWarning(''), 3000);
    },
  });

  useEffect(() => {
    if (examMode && !submitted) requestFullscreen();
  }, [examMode, submitted, requestFullscreen]);

  useEffect(() => {
    if (!examMode || submitted || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examMode, submitted, secondsLeft]);

  // Auto-submit on timer end
  useEffect(() => {
    if (examMode && secondsLeft === 0 && !submitted && !autoSubmitRef.current) {
      autoSubmitRef.current = true;
      const textAnswers = questions.map(q => ({ question_id: q.id, answer: answers[q.id] ?? '' }));
      submitTheoreticalAssignment({
        assignmentId: assignment.id,
        textAnswers,
        violations: { tabSwitches: violations.current.tabSwitches, pasteCount: violations.current.pasteCount, fullscreenExits: violations.current.fullscreenExits },
      }).then(() => setSubmitted(true));
    }
  }, [secondsLeft, examMode, submitted, assignment.id, questions, answers, violations]);

  const timerColor = secondsLeft > 60 ? '#00d4aa' : secondsLeft > 30 ? '#f59e0b' : '#ef4444';
  const timerDisplay = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  useEffect(() => {
    getStudentSubmissions(assignment.id).then(({ submitted }) => {
      if (submitted) setSubmitted(true);
    });
  }, [assignment.id]);

  const allAnswered = questions.length > 0 && questions.every(q => (answers[q.id] ?? '').trim().length > 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const textAnswers = questions.map(q => ({ question_id: q.id, answer: answers[q.id] ?? '' }));
    const { error } = await submitTheoreticalAssignment({
      assignmentId: assignment.id,
      textAnswers,
      violations: examMode ? { tabSwitches: violations.current.tabSwitches, pasteCount: violations.current.pasteCount, fullscreenExits: violations.current.fullscreenExits } : undefined,
    });
    if (error) {
      setError(error);
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  const difficultyColor: Record<string, { bg: string; text: string; border: string }> = {
    beginner:     { bg: 'rgba(0,212,170,0.1)',   text: '#00d4aa', border: 'rgba(0,212,170,0.2)' },
    intermediate: { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    advanced:     { bg: 'rgba(139,92,246,0.1)',  text: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
  };
  const diff = difficultyColor[assignment.difficulty] ?? difficultyColor.beginner;

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', background: '#0d0f14' }} onPaste={examMode ? onPaste : undefined}>

      {/* Violation warning toast */}
      {violationWarning && (
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle size={14} style={{ color: '#f87171' }} />
          <p className="text-xs font-semibold" style={{ color: '#f87171' }}>{violationWarning}</p>
        </div>
      )}

      {/* Exam mode — enter fullscreen nudge */}
      {examMode && !isFullscreen && !submitted && (
        <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
            {isKin ? '⚠️ Injira mu screen yuzuye kugirango utangire' : '⚠️ Enter fullscreen to continue the exam'}
          </p>
          <button onClick={requestFullscreen} className="text-xs font-bold px-3 py-1 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
            {isKin ? 'Injira' : 'Go Fullscreen'}
          </button>
        </div>
      )}

      {/* Top bar */}
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(13,15,20,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: '#94a3b8' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
          onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
        >
          <ArrowLeft size={16} />
          {isKin ? 'Subira Inyuma' : 'Back to Dashboard'}
        </button>

        <div className="flex items-center gap-3">
          {examMode && !submitted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${timerColor}40`, color: timerColor }}>
              <Clock size={14} />
              {timerDisplay}
            </div>
          )}
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
            {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: examMode ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.1)', color: examMode ? '#f87171' : '#a78bfa', border: examMode ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(139,92,246,0.2)' }}>
            {examMode ? (isKin ? '🔒 Ikizamini' : '🔒 Exam') : (<><BookOpen size={11} className="inline mr-1" />{isKin ? 'Ibibazo bya Inyandiko' : 'Theoretical'}</>)}
          </span>
          {!examMode && assignment.due_date && (
            <span className="hidden sm:flex items-center gap-1 text-xs" style={{ color: '#475569' }}>
              <Clock size={12} />
              {new Date(assignment.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
            {title}
          </h1>
          {description && (
            <p className="text-base leading-relaxed" style={{ color: '#64748b' }}>
              {description}
            </p>
          )}
        </div>

        {/* Submitted state */}
        {submitted ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: '#13161e', border: '1px solid rgba(0,212,170,0.2)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)' }}>
              <CheckCircle size={32} style={{ color: '#00d4aa' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
              {isKin ? 'Byatanzwe!' : 'Submitted!'}
            </h2>
            <p className="text-sm" style={{ color: '#64748b' }}>
              {isKin
                ? 'Ibisubizo byawe byoherejwe neza. Umwarimu azabona.'
                : 'Your answers have been submitted. Your teacher will review them.'}
            </p>
            <button
              onClick={onBack}
              className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.12)')}
            >
              {isKin ? 'Garuka ku Dashibodi' : 'Back to Dashboard'}
            </button>
          </div>
        ) : (
          <>
            {/* Questions */}
            <div className="space-y-6 mb-8">
              {questions.map((q, index) => {
                const questionText = isKin ? (q.text_kin || q.text) : q.text;
                return (
                  <div key={q.id} className="rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <label className="block mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#475569' }}>
                        {isKin ? `Ikibazo ${index + 1}` : `Question ${index + 1}`}
                      </span>
                      <p className="text-base font-medium mt-1" style={{ color: '#f1f5f9' }}>
                        {questionText}
                      </p>
                    </label>
                    <textarea
                      value={answers[q.id] ?? ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder={isKin ? 'Andika igisubizo cyawe hano...' : 'Write your answer here...'}
                      rows={4}
                      className="w-full rounded-xl p-4 text-sm resize-none transition-all focus:outline-none"
                      style={{
                        background: '#0d0f14',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#f1f5f9',
                        lineHeight: '1.6',
                      }}
                      onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                      onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                    />
                    <div className="mt-1.5 flex justify-end">
                      <span className="text-xs" style={{ color: (answers[q.id] ?? '').trim().length > 0 ? '#475569' : '#334155' }}>
                        {(answers[q.id] ?? '').trim().split(/\s+/).filter(Boolean).length} {isKin ? 'amagambo' : 'words'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm" style={{ color: '#475569' }}>
                {questions.filter(q => (answers[q.id] ?? '').trim().length > 0).length} / {questions.length} {isKin ? 'bisubijwe' : 'answered'}
              </span>
              <div className="flex gap-1">
                {questions.map(q => (
                  <div
                    key={q.id}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ background: (answers[q.id] ?? '').trim().length > 0 ? '#00d4aa' : 'rgba(255,255,255,0.1)' }}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="w-full rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ height: '52px', background: '#00d4aa', color: '#0d0f14', boxShadow: allAnswered ? '0 0 24px rgba(0,212,170,0.25)' : 'none' }}
              onMouseEnter={e => { if (allAnswered) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0d0f14', borderTopColor: 'transparent' }} />
              ) : (
                <>
                  <Send size={16} />
                  {isKin ? 'Ohereza Ibisubizo' : 'Submit Answers'}
                </>
              )}
            </button>

            {!allAnswered && (
              <p className="text-center text-xs mt-3" style={{ color: '#334155' }}>
                {isKin ? 'Subiza ibibazo byose mbere yo kohereza' : 'Answer all questions before submitting'}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
