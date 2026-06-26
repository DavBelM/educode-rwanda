import { AppNav } from './components/AppNav';
import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Clock, BookOpen, AlertTriangle } from 'lucide-react';
import type { Assignment } from '../lib/db';
import { submitTheoreticalAssignment, getStudentSubmissions } from '../lib/db';
import { useExamMode } from '../hooks/useExamMode';
import { usePageTitle } from '../hooks/usePageTitle';

interface Props {
  assignment: Assignment;
  language: 'EN' | 'KIN';
  onBack: () => void;
}

export default function TheoreticalAssignment({ assignment, language, onBack }: Props) {
  const isKin = language === 'KIN';
  const assignmentTitle = isKin && assignment.title_kin ? assignment.title_kin : assignment.title;
  usePageTitle(`${assignmentTitle} · EduCode`);
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
        ? (isKin ? '⚠️ Twabonye ko hari ibyo wakopeye ukabishyiramo!' : '⚠️ Paste detected!')
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

  const timerColor = secondsLeft > 60 ? '#9eaa84' : secondsLeft > 30 ? '#cda86a' : 'var(--error)';
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }} onPaste={examMode ? onPaste : undefined}>
      <AppNav />

      {/* Violation warning toast */}
      {violationWarning && (
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'var(--error-dim)', borderBottom: '1px solid color-mix(in srgb, var(--error) 40%, transparent)' }}>
          <AlertTriangle size={14} style={{ color: 'var(--error)' }} />
          <p className="text-xs font-semibold" style={{ color: 'var(--error)' }}>{violationWarning}</p>
        </div>
      )}

      {/* Exam mode — enter fullscreen nudge */}
      {examMode && !isFullscreen && !submitted && (
        <div className="flex items-center justify-between px-4 py-2" style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--line)' }}>
          <p className="text-xs font-semibold" style={{ color: '#cda86a' }}>
            {isKin ? '⚠️ Injira mu screen yuzuye kugirango utangire' : '⚠️ Enter fullscreen to continue the exam'}
          </p>
          <button onClick={requestFullscreen} className="btn btn-secondary sm">
            {isKin ? 'Injira' : 'Go Fullscreen'}
          </button>
        </div>
      )}

      {/* Content */}
      <main className="wrap page" style={{ maxWidth: '920px' }}>

        {/* Header */}
        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <div className="flex items-center gap-2 flex-wrap">
            {examMode && !submitted && (
              <span className="pill solid" style={{ color: timerColor, borderColor: timerColor }}>
                <Clock size={12} />
                {timerDisplay}
              </span>
            )}
            <span className="pill">
              {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
            </span>
            <span className={`pill${examMode ? ' error' : ''}`}>
              {examMode ? (isKin ? '🔒 Ikizamini' : '🔒 Exam') : (<><BookOpen size={11} />{isKin ? 'Ibibazo bya Inyandiko' : 'Theoretical'}</>)}
            </span>
            {!examMode && assignment.due_date && (
              <span className="flex items-center gap-1 text-xs dim">
                <Clock size={12} />
                {new Date(assignment.due_date).toLocaleDateString()}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {title}
          </h1>
          {description && (
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-2)' }}>
              {description}
            </p>
          )}
        </div>

        {/* Submitted state */}
        {submitted ? (
          <div className="card pad-lg text-center" style={{ marginTop: '32px' }}>
            <div className="iconbtn" style={{ width: 56, height: 56, margin: '0 auto 16px', pointerEvents: 'none' }}>
              <CheckCircle size={26} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
              {isKin ? 'Byatanzwe!' : 'Submitted!'}
            </h2>
            <p className="text-sm dim">
              {isKin
                ? 'Ibisubizo byawe byoherejwe neza. Umwarimu wawe azabisuzuma.'
                : 'Your answers have been submitted. Your teacher will review them.'}
            </p>
            <button onClick={onBack} className="btn btn-secondary" style={{ marginTop: 24 }}>
              {isKin ? 'Garuka kuri Dashboard' : 'Back to Dashboard'}
            </button>
          </div>
        ) : (
          <div className="stack" style={{ ['--gap' as string]: '24px', marginTop: '32px' }}>
            {/* Questions */}
            <div className="stack" style={{ ['--gap' as string]: '16px' }}>
              {questions.map((q, index) => {
                const questionText = isKin ? (q.text_kin || q.text) : q.text;
                return (
                  <div key={q.id} className="card pad-lg">
                    <label className="block mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wide dim">
                        {isKin ? `Ikibazo cya ${index + 1}` : `Question ${index + 1}`}
                      </span>
                      <p className="text-base font-medium mt-1" style={{ color: 'var(--text)' }}>
                        {questionText}
                      </p>
                    </label>
                    <textarea
                      value={answers[q.id] ?? ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder={isKin ? 'Andika igisubizo cyawe hano...' : 'Write your answer here...'}
                      rows={4}
                      className="textarea"
                    />
                    <div className="mt-1.5 flex justify-end">
                      <span className="text-xs dim">
                        {(answers[q.id] ?? '').trim().split(/\s+/).filter(Boolean).length} {isKin ? 'amagambo' : 'words'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', background: 'var(--error-dim)', color: 'var(--error)', fontSize: 14 }}>
                {error}
              </div>
            )}

            {/* Progress indicator */}
            <div className="flex items-center justify-between">
              <span className="text-sm dim">
                {questions.filter(q => (answers[q.id] ?? '').trim().length > 0).length} / {questions.length} {isKin ? 'byasubijwe' : 'answered'}
              </span>
              <div className="flex gap-1">
                {questions.map(q => (
                  <div
                    key={q.id}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ background: (answers[q.id] ?? '').trim().length > 0 ? 'var(--text)' : 'var(--line-strong)' }}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="btn btn-primary btn-block lg"
            >
              {submitting ? (
                <svg style={{ animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity=".85"/>
                </svg>
              ) : (
                <>
                  <Send size={16} />
                  {isKin ? 'Ohereza Ibisubizo' : 'Submit Answers'}
                </>
              )}
            </button>

            {!allAnswered && (
              <p className="text-center text-xs dim" style={{ marginTop: '-12px' }}>
                {isKin ? 'Subiza ibibazo byose mbere yo kohereza' : 'Answer all questions before submitting'}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
