import { useState, useEffect, useRef } from 'react';
import { Users, Plus, Check, X, ChevronDown, BookOpen, Code2, Loader, Megaphone, Pin, Trash2, BarChart2, AlertCircle, Download, Sparkles, Activity, AlertTriangle, UserPlus, Table2, Eye, EyeOff, ClipboardCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateStudentAssessment, generateClassSummary } from '../lib/ai';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../lib/auth';
import {
  createClass, getTeacherClasses, getClassAssignments, createAssignment, getClassStudentCount,
  getAssignmentSubmissions, getAssignmentSubmissionCounts, gradeSubmission, releaseGrades,
  getClassAnalytics, getClassGradesExport, getClassRoster, getClassPendingReviewCount,
  createAnnouncement, getClassAnnouncements, deleteAnnouncement,
  getStudentAIProfile, getClassRatingsSummary,
  saveMwarimuEvaluation, getMwarimuEvalSummary,
  getSchoolAnnouncementsForTeacher,
  getClassLiveSignals, getStudentEventTimeline, getCompetencySummary,
  getGradeBook, toggleAssignmentPublished,
  saveAttendance, getAttendanceSessions, getSessionAttendance,
  type Class, type Assignment, type Question, type Submission, type Announcement, type ClassAnalytics, type RosterStudent, type StudentAIProfile, type ClassRatingsSummary, type SchoolAnnouncement,
  type LiveSignal, type EventRow, type CompetencyRow, type GradeBook,
  type AttendanceStatus, type AttendanceSessionSummary, type AttendanceStudentRecord,
} from '../lib/db';

// ─── Create Class Modal ────────────────────────────────────────────────────────

function CreateClassModal({ language, onClose, onCreate }: {
  language: 'EN' | 'KIN';
  onClose: () => void;
  onCreate: (cls: Class) => void;
}) {
  const isKin = language === 'KIN';
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('JavaScript');
  const [level, setLevel] = useState('');
  const [cohortTag, setCohortTagLocal] = useState('intango_t1_2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { data, error } = await createClass(name.trim(), subject, {
      level: level.trim() || undefined,
      cohort_tag: cohortTag.trim() || undefined,
    });
    if (error) { setError(error); setLoading(false); return; }
    onCreate(data!);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg w-full max-w-md">
        <div className="card-head">
          <h2 className="card-title">{isKin ? 'Kora ishuri rishya' : 'Create New Class'}</h2>
          <button onClick={onClose} className="iconbtn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="stack" style={{ ['--gap' as string]: '16px' }}>
          <div className="field">
            <label className="label">{isKin ? "Izina ry'Ishuri" : 'Class Name'}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isKin ? 'Urugero: JS Level 3 - IPRC Kigali' : 'e.g. JS Level 3 - IPRC Kigali'}
              className="input"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label className="label">{isKin ? 'Isomo' : 'Subject'}</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="select">
                <option value="JavaScript">JavaScript</option>
                <option value="HTML & CSS">HTML &amp; CSS</option>
                <option value="Python">Python</option>
                <option value="Web Development">Web Development</option>
              </select>
            </div>
            <div className="field">
              <label className="label">{isKin ? 'Urwego' : 'Level'}</label>
              <input
                type="text"
                value={level}
                onChange={e => setLevel(e.target.value)}
                placeholder="e.g. Level 3"
                className="input"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Cohort tag</label>
            <input
              type="text"
              value={cohortTag}
              onChange={e => setCohortTagLocal(e.target.value)}
              placeholder="e.g. intango_t1_2026"
              className="input"
              style={{ fontFamily: 'var(--mono)', fontSize: 13 }}
            />
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              Tags all events from students in this class. Use the same tag across all classes in a cohort.
            </p>
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--error)', background: 'var(--error-dim)', border: '1px solid var(--error)', borderRadius: 'var(--radius)', padding: '10px 13px' }}>
              {error}
            </p>
          )}
        </div>

        <div className="row" style={{ gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            {isKin ? 'Reka' : 'Cancel'}
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {loading ? <Loader size={16} className="animate-spin" /> : (isKin ? 'Kora' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Assignment Modal ───────────────────────────────────────────────────

function CreateAssignmentModal({ language, classes, onClose, onCreate }: {
  language: 'EN' | 'KIN';
  classes: Class[];
  onClose: () => void;
  onCreate: () => void;
}) {
  const isKin = language === 'KIN';
  const [step, setStep] = useState<'type' | 'form'>('type');
  const [assignmentType, setAssignmentType] = useState<'theoretical' | 'coding'>('theoretical');
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [titleKin, setTitleKin] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionKin, setDescriptionKin] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [totalMarks, setTotalMarks] = useState(10);
  const [dueDate, setDueDate] = useState('');
  const [examMode, setExamMode] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [weightPct, setWeightPct] = useState(100);
  const [questions, setQuestions] = useState<Question[]>([{ id: '1', text: '', text_kin: '' }]);
  const [publishNow, setPublishNow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions(prev => [...prev, { id: String(prev.length + 1), text: '', text_kin: '' }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: 'text' | 'text_kin', value: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleCreate = async () => {
    if (!title.trim() || !classId) return;
    setLoading(true);
    const { error } = await createAssignment({
      classId,
      title: title.trim(),
      titleKin: titleKin.trim(),
      description: description.trim(),
      descriptionKin: descriptionKin.trim(),
      assignmentType,
      difficulty,
      totalMarks,
      questions: assignmentType === 'theoretical' ? questions.filter(q => q.text.trim()) : undefined,
      dueDate: dueDate || undefined,
      examMode,
      durationMinutes: examMode ? durationMinutes : undefined,
      weightPct,
      isPublished: publishNow,
    });
    if (error) { setError(error); setLoading(false); return; }
    onCreate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg w-full max-w-2xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="card-head">
          <h2 className="card-title">{isKin ? 'Tanga umukoro mushya' : 'Create New Assignment'}</h2>
          <button onClick={onClose} className="iconbtn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {step === 'type' ? (
          <>
            <p className="muted text-sm mb-5">
              {isKin ? "Hitamo ubwoko bw'umukoro:" : 'Choose the type of assignment:'}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {([
                { value: 'theoretical', icon: <BookOpen size={28} />, label: isKin ? "Ibibazo by'inyandiko" : 'Theoretical', desc: isKin ? "Ibibazo by'inyandiko abanyeshuri basubiza mu magambo" : 'Written questions students answer in text' },
                { value: 'coding', icon: <Code2 size={28} />, label: isKin ? 'Umukoro wa code' : 'Coding', desc: isKin ? 'Abanyeshuri bandika kandi bagatangiza (run) code ya JavaScript' : 'Students write and run JavaScript code' },
              ] as const).map(type => (
                <button
                  key={type.value}
                  onClick={() => setAssignmentType(type.value)}
                  className="text-left transition-all"
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius)',
                    background: assignmentType === type.value ? 'var(--accent-soft)' : 'var(--surface-2)',
                    border: assignmentType === type.value ? '1px solid var(--accent)' : '1px solid var(--line)',
                  }}
                >
                  <div className="mb-3" style={{ color: assignmentType === type.value ? 'var(--text)' : 'var(--text-3)' }}>{type.icon}</div>
                  <p className="text-sm font-bold mb-1" style={{ color: assignmentType === type.value ? 'var(--text)' : 'var(--text-2)' }}>{type.label}</p>
                  <p className="text-xs leading-relaxed dim">{type.desc}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('form')}
              className="btn btn-primary btn-block"
            >
              {isKin ? 'Komeza' : 'Continue'}
            </button>
          </>
        ) : (
          <div className="stack" style={{ ['--gap' as string]: '16px' }}>
            {/* Class selector */}
            <div className="field">
              <label className="label">{isKin ? 'Ishuri' : 'Class'}</label>
              <select
                value={classId}
                onChange={e => setClassId(e.target.value)}
                className="select"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {/* Title EN */}
            <div className="field">
              <label className="label">{isKin ? 'Umutwe (mu Cyongereza)' : 'Title (English)'}</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={isKin ? 'Urugero: Introduction to Variables' : 'e.g. Introduction to Variables'}
                className="input"
              />
            </div>

            {/* Title KIN */}
            <div className="field">
              <label className="label">{isKin ? 'Umutwe (mu Kinyarwanda)' : 'Title (Kinyarwanda)'}</label>
              <input
                type="text"
                value={titleKin}
                onChange={e => setTitleKin(e.target.value)}
                placeholder={isKin ? 'Urugero: Intangiriro ya Variables' : 'e.g. Intangiriro ya Variables'}
                className="input"
              />
            </div>

            {/* Description */}
            <div className="field">
              <label className="label">{isKin ? 'Amabwiriza (mu Cyongereza)' : 'Instructions (English)'}</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={isKin ? 'Sobanura icyo abanyeshuri bagomba gukora...' : 'Describe what students should do...'}
                rows={2}
                className="textarea"
              />
            </div>

            {/* Description KIN */}
            <div className="field">
              <label className="label">{isKin ? 'Amabwiriza (mu Kinyarwanda)' : 'Instructions (Kinyarwanda)'}</label>
              <textarea
                value={descriptionKin}
                onChange={e => setDescriptionKin(e.target.value)}
                placeholder={isKin ? 'Amabwiriza mu Kinyarwanda...' : 'Instructions in Kinyarwanda...'}
                rows={2}
                className="textarea"
              />
            </div>

            {/* Total Marks */}
            <div className="field">
              <label className="label">{isKin ? 'Amanota yose (urugero: /20)' : 'Total Marks (e.g. /20)'}</label>
              <input
                type="number"
                min={1}
                max={200}
                value={totalMarks}
                onChange={e => setTotalMarks(Math.max(1, Number(e.target.value)))}
                className="input"
              />
            </div>

            {/* Difficulty + Due date row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="field">
                <label className="label">{isKin ? "Urwego rw'ingorabahizi" : 'Difficulty'}</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as typeof difficulty)}
                  className="select"
                >
                  <option value="beginner">{isKin ? 'Intangiriro' : 'Beginner'}</option>
                  <option value="intermediate">{isKin ? 'Urwego ruringaniye' : 'Intermediate'}</option>
                  <option value="advanced">{isKin ? 'Urwego rwo hejuru' : 'Advanced'}</option>
                </select>
              </div>
              <div className="field">
                <label className="label">{isKin ? 'Itariki ntarengwa' : 'Due Date'}</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="input"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Weight % */}
            <div className="field">
              <label className="label">{isKin ? "Uburemere bw'amanota (%)" : 'Grade Weight (%)'}</label>
              <div className="row">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={weightPct}
                  onChange={e => setWeightPct(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="input"
                  style={{ width: '96px', textAlign: 'center' }}
                />
                <p className="text-xs dim">
                  {isKin
                    ? weightPct === 100 ? 'Ibarwa yuzuye mu manota ya term' : `Ibarwa ${weightPct}% mu manota ya term`
                    : weightPct === 100 ? 'Counts fully toward term grade' : `Counts as ${weightPct}% toward term grade`}
                </p>
              </div>
            </div>

            {/* Exam Mode */}
            <div style={{ borderRadius: 'var(--radius)', padding: '16px', background: examMode ? 'var(--error-dim)' : 'var(--surface-2)', border: examMode ? '1px solid var(--error)' : '1px solid var(--line)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: examMode ? 'var(--error)' : 'var(--text)' }}>
                    {isKin ? "🔒 Uburyo bw'Ikizamini (Exam Mode)" : '🔒 Exam Mode'}
                  </p>
                  <p className="text-xs mt-0.5 dim">
                    {isKin ? 'Gufunga screen, gukurikirana niba bahinduye paji, no kohereza mu buryo bwikora igihe cyangiye' : 'Fullscreen lock, tab-switch tracking, auto-submit on timeout'}
                  </p>
                </div>
                <button
                  onClick={() => setExamMode(p => !p)}
                  className="relative w-11 h-6 rounded-full transition-all shrink-0"
                  style={{ background: examMode ? 'var(--error)' : 'var(--line-strong)' }}
                >
                  <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ left: examMode ? '22px' : '2px', background: 'var(--surface)' }} />
                </button>
              </div>
              {examMode && (
                <div className="mt-3 flex items-center gap-3">
                  <label className="text-xs font-semibold shrink-0" style={{ color: 'var(--error)' }}>
                    {isKin ? 'Igihe (iminota)' : 'Duration (minutes)'}
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={240}
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Math.max(5, Math.min(240, Number(e.target.value))))}
                    className="input"
                    style={{ width: '96px', textAlign: 'center' }}
                  />
                </div>
              )}
            </div>

            {/* Questions (theoretical only) */}
            {assignmentType === 'theoretical' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="label">{isKin ? 'Ibibazo' : 'Questions'}</label>
                  <button onClick={addQuestion} className="btn-tertiary flex items-center gap-1 text-xs font-semibold">
                    <Plus size={14} />
                    {isKin ? 'Ongeraho ikibazo' : 'Add Question'}
                  </button>
                </div>
                <div className="stack" style={{ ['--gap' as string]: '12px' }}>
                  {questions.map((q, i) => (
                    <div key={q.id} style={{ borderRadius: 'var(--radius)', padding: '16px', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase dim">
                          {isKin ? `Ikibazo cya ${i + 1}` : `Q${i + 1}`}
                        </span>
                        {questions.length > 1 && (
                          <button onClick={() => removeQuestion(q.id)} className="iconbtn" style={{ width: 24, height: 24 }} aria-label="Remove question">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={q.text}
                        onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                        placeholder={isKin ? 'Ikibazo mu Cyongereza...' : 'Question in English...'}
                        className="input mb-2"
                      />
                      <input
                        type="text"
                        value={q.text_kin}
                        onChange={e => updateQuestion(q.id, 'text_kin', e.target.value)}
                        placeholder={isKin ? 'Ikibazo mu Kinyarwanda...' : 'Question in Kinyarwanda...'}
                        className="input"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm" style={{ color: 'var(--error)', background: 'var(--error-dim)', border: '1px solid var(--error)', borderRadius: 'var(--radius)', padding: '10px 13px' }}>
                {error}
              </p>
            )}

            {/* Publish toggle */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius)', background: publishNow ? 'var(--accent-soft)' : 'var(--surface-2)', border: `1px solid ${publishNow ? 'var(--accent)' : 'var(--line)'}`, cursor: 'pointer' }}
              onClick={() => setPublishNow(p => !p)}
            >
              <div style={{ width: 36, height: 20, borderRadius: 10, background: publishNow ? 'var(--accent)' : 'var(--line)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: publishNow ? 18 : 2, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  {publishNow ? (isKin ? 'Tangaza ubu — abanyeshuri bazabona' : 'Publish immediately — students will see this now') : (isKin ? 'Bika nk\'icyitegererezo — ntabanyeshuri bazabona' : 'Save as draft — students won\'t see this yet')}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
                  {isKin ? 'Ushobora guhindura ibi nyuma' : 'You can publish or unpublish anytime from the assignment list'}
                </div>
              </div>
            </div>

            <div className="row" style={{ gap: '12px', paddingTop: '8px' }}>
              <button onClick={() => setStep('type')} className="btn btn-secondary" style={{ flex: 1 }}>
                {isKin ? 'Subira Inyuma' : 'Back'}
              </button>
              <button
                onClick={handleCreate}
                disabled={!title.trim() || !classId || loading}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : publishNow ? (isKin ? 'Tangaza' : 'Publish') : (isKin ? 'Bika' : 'Save Draft')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Announcements Modal ──────────────────────────────────────────────────────

function AnnouncementsModal({ cls, language, onClose }: {
  cls: Class;
  language: 'EN' | 'KIN';
  onClose: () => void;
}) {
  const isKin = language === 'KIN';
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'list' | 'new'>('list');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceLabel, setResourceLabel] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    getClassAnnouncements(cls.id).then(({ data }) => {
      setAnnouncements(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return;
    setPosting(true);
    setPostError('');
    const { error } = await createAnnouncement({ classId: cls.id, title: title.trim(), body: body.trim(), pinned, resourceUrl, resourceLabel });
    if (error) { setPostError(error); setPosting(false); return; }
    setTitle(''); setBody(''); setPinned(false); setResourceUrl(''); setResourceLabel('');
    setTab('list');
    setLoading(true);
    load();
    setPosting(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement? This cannot be undone.')) return;
    setDeleting(id);
    await deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setDeleting(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-lg flex flex-col" style={{ maxHeight: '80vh', padding: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center gap-2">
            <Megaphone size={16} style={{ color: 'var(--text-2)' }} />
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                {isKin ? 'Amatangazo' : 'Announcements'}
              </h2>
              <p className="text-xs dim">{cls.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="iconbtn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pt-4 gap-2">
          {(['list', 'new'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 text-xs font-semibold transition-all"
              style={{
                borderRadius: 'var(--radius-sm)',
                background: tab === t ? 'var(--accent-soft)' : 'transparent',
                color: tab === t ? 'var(--text)' : 'var(--text-2)',
                border: tab === t ? '1px solid var(--accent)' : '1px solid transparent',
              }}
            >
              {t === 'list' ? (isKin ? 'Reba byose' : 'View All') : (isKin ? 'Shyiraho rishya' : 'Post New')}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 flex-1">
          {tab === 'list' ? (
            loading ? (
              <div className="flex justify-center py-10">
                <Loader size={18} className="animate-spin" style={{ color: 'var(--text-2)' }} />
              </div>
            ) : announcements.length === 0 ? (
              <div className="py-10 text-center">
                <Megaphone size={28} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
                <p className="text-sm dim">
                  {isKin ? 'Nta matangazo arahari ubu' : 'No announcements yet'}
                </p>
                <button
                  onClick={() => setTab('new')}
                  className="btn btn-secondary sm mt-4"
                >
                  {isKin ? 'Shyiraho itangazo rya mbere' : 'Post first announcement'}
                </button>
              </div>
            ) : (
              <div className="stack" style={{ ['--gap' as string]: '12px' }}>
                {announcements.map(a => (
                  <div key={a.id} style={{ borderRadius: 'var(--radius)', padding: '16px', background: a.pinned ? 'var(--accent-soft)' : 'var(--surface-2)', border: a.pinned ? '1px solid var(--accent)' : '1px solid var(--line)' }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {a.pinned && <Pin size={12} style={{ color: 'var(--text)', flexShrink: 0 }} />}
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{a.title}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deleting === a.id}
                        className="iconbtn"
                        style={{ width: 28, height: 28, flexShrink: 0 }}
                        aria-label="Delete announcement"
                      >
                        {deleting === a.id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>{a.body}</p>
                    {a.resource_url && (
                      <a
                        href={a.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        style={{ marginBottom: 8, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'flex' }}
                      >
                        <BookOpen size={12} style={{ flexShrink: 0 }} />
                        {a.resource_label || a.resource_url}
                        <span style={{ marginLeft: 'auto', color: 'var(--text-3)', fontSize: 10 }}>↗</span>
                      </a>
                    )}
                    <p className="text-xs dim">
                      {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="stack" style={{ ['--gap' as string]: '16px' }}>
              <div className="field">
                <label className="label">{isKin ? 'Umutwe' : 'Title'}</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={isKin ? 'Urugero: Isomo rya ejo hazaza rihagaritswe' : 'e.g. Tomorrow\'s class is cancelled'}
                  className="input"
                />
              </div>
              <div className="field">
                <label className="label">{isKin ? 'Ubutumwa' : 'Message'}</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={5}
                  placeholder={isKin ? 'Andika ubutumwa bwawe hano...' : 'Write your message here...'}
                  className="textarea"
                />
              </div>
              {/* Resource attachment */}
              <div style={{ borderRadius: 'var(--radius)', border: '1px solid var(--line)', padding: '14px', background: 'var(--surface-2)' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-2)' }}>
                  {isKin ? 'Ifite aho ihurira? (bitagenzuwe)' : 'Attach a resource link (optional)'}
                </p>
                <div className="stack" style={{ ['--gap' as string]: '10px' }}>
                  <input
                    type="url"
                    value={resourceUrl}
                    onChange={e => setResourceUrl(e.target.value)}
                    className="input"
                    placeholder="https://..."
                  />
                  <input
                    type="text"
                    value={resourceLabel}
                    onChange={e => setResourceLabel(e.target.value)}
                    className="input"
                    placeholder={isKin ? 'Izina (urugero: Agakuru k\'isomo)' : 'Link label (e.g. Lesson slides)'}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={() => setPinned(p => !p)}
                  className="checkbox"
                />
                <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
                  {isKin ? 'Shyira hejuru' : 'Pin to top'}
                </span>
              </label>
              {postError && (
                <p className="text-sm" style={{ color: 'var(--error)', background: 'var(--error-dim)', border: '1px solid var(--error)', borderRadius: 'var(--radius)', padding: '10px 13px' }}>
                  {postError}
                </p>
              )}
              <button
                onClick={handlePost}
                disabled={!title.trim() || !body.trim() || posting}
                className="btn btn-primary btn-block"
              >
                {posting ? <Loader size={16} className="animate-spin" /> : <Megaphone size={15} />}
                {isKin ? 'Tangaza itangazo' : 'Post Announcement'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Invite Code Card ──────────────────────────────────────────────────────────

// ─── Class Analytics Modal ─────────────────────────────────────────────────────

function ClassAnalyticsModal({ cls, language, onClose }: { cls: Class & { studentCount?: number }; language: 'EN' | 'KIN'; onClose: () => void }) {
  const isKin = language === 'KIN';
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getClassAnalytics(cls.id).then(data => { setAnalytics(data); setLoading(false); });
  }, [cls.id]);

  const handleExportCSV = async () => {
    setDownloading(true);
    const rows = await getClassGradesExport(cls.id);
    const header = ['Student Name', 'Assignment', 'Type', 'Marks Earned', 'Total Marks', 'Score %', 'Weight %', 'Weighted Score', 'Submitted', 'Submitted At', 'Teacher Feedback'];
    const csvRows = rows.map(r => [
      `"${r.student_name}"`,
      `"${r.assignment_title}"`,
      r.assignment_type,
      r.marks_earned ?? '',
      r.total_marks,
      r.score_pct !== null ? `${r.score_pct}%` : '',
      `${r.weight_pct}%`,
      r.weighted_score !== null ? `${r.weighted_score}%` : '',
      r.submitted ? 'Yes' : 'No',
      r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : '',
      `"${(r.teacher_feedback ?? '').replace(/"/g, '""')}"`,
    ]);
    const csv = [header.join(','), ...csvRows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cls.name.replace(/\s+/g, '_')}_grades.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-2xl flex flex-col" style={{ maxHeight: '88vh', padding: 0 }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 shrink-0" style={{ borderBottom: '1px solid var(--line)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{cls.name}</h2>
            <p className="text-xs mt-0.5 dim">
              {isKin ? 'Isesengura ry\'ishuri' : 'Class analytics'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={downloading || loading}
              className="btn btn-secondary sm flex items-center gap-1.5"
            >
              {downloading ? <Loader size={12} className="animate-spin" /> : <Download size={12} />}
              {isKin ? 'Pakurura (CSV)' : 'Export CSV'}
            </button>
            <button onClick={onClose} className="iconbtn" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-5 stack" style={{ ['--gap' as string]: '16px' }}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size={22} className="animate-spin" style={{ color: 'var(--text-2)' }} />
            </div>
          ) : !analytics ? null : (
            <>
              {/* ── Summary row ── */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: isKin ? 'Abanyeshuri' : 'Students',        value: analytics.total_students },
                  { label: isKin ? 'Ikigereranyo cy\'amanota y\'ishuri' : 'Class avg',  value: analytics.class_avg_pct !== null ? `${analytics.class_avg_pct}%` : '—' },
                  { label: isKin ? 'Igipimo cy\'imitangire y\'imikoro' : 'Submit rate', value: analytics.overall_submission_rate !== null ? `${analytics.overall_submission_rate}%` : '—' },
                ].map(s => (
                  <div key={s.label} style={{ borderRadius: 'var(--radius)', padding: '16px', background: 'var(--surface-2)', border: '1px solid var(--line)' }} className="text-center">
                    <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{s.value}</p>
                    <p className="text-xs dim">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* ── Per-assignment list ── */}
              {analytics.assignments.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm dim">
                    {isKin ? 'Nta mikoro arahari' : 'No assignments yet'}
                  </p>
                </div>
              ) : analytics.assignments.map(a => {
                const isOpen = expanded === a.id;
                const subRate = analytics.total_students > 0 ? Math.round((a.submitted_count / analytics.total_students) * 100) : 0;
                const totalDist = a.dist.reduce((s, d) => s + d.count, 0);

                return (
                  <div key={a.id} className="overflow-hidden" style={{ borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                    {/* Row */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : a.id)}
                      className="w-full flex items-center justify-between p-4 text-left transition-all"
                      style={{ background: isOpen ? 'var(--surface-2)' : 'transparent' }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {a.assignment_type === 'coding'
                          ? <Code2 size={14} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
                          : <BookOpen size={14} style={{ color: 'var(--text-2)', flexShrink: 0 }} />}
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                          {isKin && a.title_kin ? a.title_kin : a.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        {/* Submission count */}
                        <span className="text-xs font-semibold dim">
                          {a.submitted_count}/{analytics.total_students}
                        </span>
                        {/* Avg score */}
                        {a.avg_pct !== null && (
                          <span className="pill solid">
                            {a.avg_pct}%
                          </span>
                        )}
                        <ChevronDown size={14} style={{ color: 'var(--text-3)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="px-4 pb-4 stack" style={{ ['--gap' as string]: '16px', borderTop: '1px solid var(--line)' }}>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-2 pt-3">
                          {[
                            { label: isKin ? 'Amanota y\'ikigereranyo' : 'Avg score', value: a.avg_score !== null ? `${a.avg_score}/${a.total_marks}` : '—' },
                            { label: isKin ? 'Amanota yo hejuru' : 'Top score',    value: a.top_score !== null ? `${a.top_score}/${a.total_marks}` : '—' },
                            { label: isKin ? 'Amanota yo hasi' : 'Low score',      value: a.low_score !== null ? `${a.low_score}/${a.total_marks}` : '—' },
                          ].map(s => (
                            <div key={s.label} className="text-center" style={{ borderRadius: 'var(--radius-sm)', padding: '12px', background: 'var(--surface-2)' }}>
                              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{s.value}</p>
                              <p className="text-xs mt-0.5 dim">{s.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Submission rate bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1.5 dim">
                            <span>{isKin ? 'Igipimo cy\'imitangire y\'imikoro' : 'Submission rate'}</span>
                            <span style={{ color: 'var(--text)', fontWeight: 600 }}>{a.submitted_count} / {analytics.total_students} ({subRate}%)</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
                            <div className="h-full rounded-full" style={{ width: `${subRate}%`, background: 'var(--text)', transition: 'width 0.6s ease' }} />
                          </div>
                        </div>

                        {/* Score distribution */}
                        {totalDist > 0 && (
                          <div>
                            <p className="text-xs font-semibold mb-2 dim">
                              {isKin ? 'Isaranganywa ry\'amanota' : 'Score distribution'}
                            </p>
                            <div className="flex h-6 rounded-lg overflow-hidden gap-px">
                              {a.dist.filter(d => d.count > 0).map(d => (
                                <div key={d.label} className="relative group flex-shrink-0"
                                  style={{ width: `${(d.count / totalDist) * 100}%`, background: d.color }}
                                  title={`${d.label}: ${d.count} student${d.count !== 1 ? 's' : ''}`} />
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {a.dist.map(d => (
                                <div key={d.label} className="flex items-center gap-1">
                                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                                  <span className="text-xs dim">{d.label}: {d.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing students */}
                        {a.missing_students.length > 0 && (
                          <div style={{ borderRadius: 'var(--radius)', padding: '12px', background: 'var(--error-dim)', border: '1px solid var(--error)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle size={13} style={{ color: 'var(--error)' }} />
                              <p className="text-xs font-semibold" style={{ color: 'var(--error)' }}>
                                {isKin ? `Ntibatanze (${a.missing_students.length})` : `Not submitted (${a.missing_students.length})`}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {a.missing_students.map(name => (
                                <span key={name} className="pill error">
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Submissions Panel ─────────────────────────────────────────────────────────

function SubmissionsPanel({ assignment, language, onClose }: {
  assignment: Assignment;
  language: 'EN' | 'KIN';
  onClose: () => void;
}) {
  const isKin = language === 'KIN';
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [markInputs, setMarkInputs] = useState<Record<string, string>>({});
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});
  const [grading, setGrading] = useState<Record<string, boolean>>({});
  const [gradeError, setGradeError] = useState<Record<string, string>>({});
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(!!assignment.grades_released);

  useEffect(() => {
    getAssignmentSubmissions(assignment.id).then(({ data }) => {
      setSubmissions(data);
      // Pre-fill mark inputs from already-graded submissions
      const prefilled: Record<string, string> = {};
      const preFeedback: Record<string, string> = {};
      for (const s of data) {
        if (s.marks_earned !== null && s.marks_earned !== undefined) {
          prefilled[s.id] = String(s.marks_earned);
        }
        if (s.teacher_feedback) preFeedback[s.id] = s.teacher_feedback;
      }
      setMarkInputs(prefilled);
      setFeedbackInputs(preFeedback);
      setLoading(false);
    });
  }, [assignment.id]);

  const title = isKin ? (assignment.title_kin || assignment.title) : assignment.title;
  const questions = assignment.questions ?? [];
  const totalMarks = assignment.total_marks ?? 10;

  const handleGrade = async (subId: string) => {
    const val = Number(markInputs[subId]);
    if (isNaN(val) || val < 0 || val > totalMarks) {
      setGradeError(prev => ({ ...prev, [subId]: `0 – ${totalMarks}` }));
      return;
    }
    setGrading(prev => ({ ...prev, [subId]: true }));
    setGradeError(prev => ({ ...prev, [subId]: '' }));
    const fb = feedbackInputs[subId]?.trim() || undefined;
    const { error } = await gradeSubmission(subId, val, fb);
    if (error) {
      setGradeError(prev => ({ ...prev, [subId]: error }));
    } else {
      setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, marks_earned: val, teacher_feedback: fb ?? null } : s));
    }
    setGrading(prev => ({ ...prev, [subId]: false }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-2xl" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--line)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{title}</h2>
            <p className="text-xs mt-0.5 dim">
              {submissions.length} {isKin ? 'imikoro yatanzwe' : 'submission(s)'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {released ? (
              <span className="pill solid">
                ✓ {isKin ? 'Amanota yasohotse' : 'Grades Released'}
              </span>
            ) : (
              <button
                onClick={async () => {
                  setReleasing(true);
                  const { error } = await releaseGrades(assignment.id);
                  if (!error) setReleased(true);
                  setReleasing(false);
                }}
                disabled={releasing || submissions.filter(s => s.marks_earned !== null).length === 0}
                className="btn btn-secondary sm flex items-center gap-1.5"
              >
                {releasing ? <Loader size={12} className="animate-spin" /> : null}
                {isKin ? 'Sohoka amanota' : 'Release Grades'}
              </button>
            )}
            <button onClick={onClose} className="iconbtn" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 stack" style={{ ['--gap' as string]: '12px' }}>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader size={20} className="animate-spin" style={{ color: 'var(--text-2)' }} />
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm dim">
                {isKin ? 'Nta mikoro yari yatangwa' : 'No submissions yet'}
              </p>
            </div>
          ) : submissions.map(sub => {
            const studentName = (sub.profiles as { full_name: string } | undefined)?.full_name ?? 'Student';
            const initials = studentName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
            const isOpen = expanded === sub.id;
            const flagCount = (sub.tab_switches ?? 0) + (sub.paste_count ?? 0) + (sub.fullscreen_exits ?? 0);

            return (
              <div key={sub.id} className="overflow-hidden" style={{ borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                {/* Student row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : sub.id)}
                  className="w-full flex items-center justify-between p-4 text-left transition-all"
                  style={{ background: isOpen ? 'var(--surface-2)' : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--line-strong)' }}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{studentName}</p>
                      <p className="text-xs dim">
                        {new Date(sub.submitted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.marks_earned !== null && sub.marks_earned !== undefined ? (
                      <span className="pill solid">
                        {sub.marks_earned}/{totalMarks}
                      </span>
                    ) : (
                      <span className="pill">
                        ✓ {isKin ? 'Byatanzwe' : 'Submitted'}
                      </span>
                    )}
                    {flagCount > 0 && (
                      <span className="pill error">
                        ⚠️ {flagCount}
                      </span>
                    )}
                    <ChevronDown size={14} style={{ color: 'var(--text-3)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </button>

                {/* Answers + Grade */}
                {isOpen && (
                  <div className="px-4 pb-4 stack" style={{ ['--gap' as string]: '12px', borderTop: '1px solid var(--line)' }}>
                    {/* Answers (theoretical) */}
                    {assignment.assignment_type === 'theoretical' && sub.text_answers && questions.map((q, i) => {
                      const answer = (sub.text_answers ?? []).find(a => a.question_id === q.id)?.answer ?? '';
                      const qText = isKin ? (q.text_kin || q.text) : q.text;
                      return (
                        <div key={q.id} className="pt-3">
                          <p className="text-xs font-semibold mb-1 dim">
                            {isKin ? `Ikibazo cya ${i + 1}` : `Q${i + 1}`}: {qText}
                          </p>
                          <p className="text-sm leading-relaxed px-3 py-2.5" style={{ color: 'var(--text-2)', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)' }}>
                            {answer || <span style={{ color: 'var(--text-3)' }}>{isKin ? '(Nta gisubizo)' : '(No answer)'}</span>}
                          </p>
                        </div>
                      );
                    })}

                    {/* Violation summary */}
                    {flagCount > 0 && (
                      <div className="pt-3 px-3 py-2.5" style={{ borderRadius: 'var(--radius)', background: 'var(--error-dim)', border: '1px solid var(--error)' }}>
                        <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--error)' }}>
                          ⚠️ {isKin ? 'Ibimenyetso by\'ubunyangamugayo' : 'Integrity Flags'}
                        </p>
                        <div className="flex gap-4">
                          {(sub.tab_switches ?? 0) > 0 && (
                            <span className="text-xs" style={{ color: 'var(--text-2)' }}>
                              🔀 {isKin ? `Inshuro bahinduye paji: ${sub.tab_switches}` : `Tab switches: ${sub.tab_switches}`}
                            </span>
                          )}
                          {(sub.paste_count ?? 0) > 0 && (
                            <span className="text-xs" style={{ color: 'var(--text-2)' }}>
                              📋 {isKin ? `Inshuro bakopeye: ${sub.paste_count}` : `Pastes: ${sub.paste_count}`}
                            </span>
                          )}
                          {(sub.fullscreen_exits ?? 0) > 0 && (
                            <span className="text-xs" style={{ color: 'var(--text-2)' }}>
                              ↙️ {isKin ? `Inshuro basohotse muri screen yuzuye: ${sub.fullscreen_exits}` : `Fullscreen exits: ${sub.fullscreen_exits}`}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Grading row */}
                    <div className="pt-3 stack" style={{ ['--gap' as string]: '10px', borderTop: '1px solid var(--line)' }}>
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold shrink-0" style={{ color: 'var(--text-2)' }}>
                          {isKin ? `Amanota (/${totalMarks})` : `Grade (/${totalMarks})`}
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={totalMarks}
                          value={markInputs[sub.id] ?? ''}
                          onChange={e => setMarkInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          placeholder={`0 – ${totalMarks}`}
                          className="input"
                          style={{ width: '96px', textAlign: 'center', borderColor: gradeError[sub.id] ? 'var(--error)' : undefined }}
                        />
                        <button
                          onClick={() => handleGrade(sub.id)}
                          disabled={grading[sub.id] || !markInputs[sub.id]}
                          className="btn btn-primary sm flex items-center gap-1.5"
                        >
                          {grading[sub.id] ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
                          {isKin ? 'Bika' : 'Save'}
                        </button>
                        {gradeError[sub.id] && (
                          <span className="text-xs" style={{ color: 'var(--error)' }}>{gradeError[sub.id]}</span>
                        )}
                        {sub.marks_earned !== null && sub.marks_earned !== undefined && !gradeError[sub.id] && (
                          <span className="text-xs dim">
                            ✓ {sub.marks_earned}/{totalMarks} {isKin ? 'byabitswe' : 'saved'}
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        value={feedbackInputs[sub.id] ?? ''}
                        onChange={e => setFeedbackInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                        placeholder={isKin ? 'Andika igitekerezo ku munyeshuri (si itegeko)...' : 'Write feedback for the student (optional)...'}
                        className="textarea text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

// ─── Overview helpers ──────────────────────────────────────────────────────────

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function greeting(isKin: boolean): string {
  const hour = new Date().getHours();
  if (hour < 12) return isKin ? 'Mwaramutse' : 'Good morning';
  if (hour < 17) return isKin ? 'Mwiriwe' : 'Good afternoon';
  return isKin ? 'Mwiriwe' : 'Good evening';
}

function formatRelativeTime(iso: string | null, isKin: boolean): string {
  if (!iso) return isKin ? 'Nta na rimwe' : 'Never';
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return isKin ? 'Nonaha' : 'Just now';
  if (diffHours < 1) return isKin ? `Iminota ${diffMins} ishize` : `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffDays < 1) return isKin ? `Amasaha ${diffHours} ashize` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return isKin ? 'Ejo' : 'Yesterday';
  return isKin ? `Iminsi ${diffDays} ishize` : `${diffDays} days ago`;
}

// ── Student AI Profile Modal ──────────────────────────────────────────────────

function StudentProfileModal({ student, classId, language, onClose }: {
  student: RosterStudent;
  classId: string;
  language: 'EN' | 'KIN';
  onClose: () => void;
}) {
  const isKin = language === 'KIN';
  const [modalTab, setModalTab] = useState<'profile' | 'timeline'>('profile');
  const [profile, setProfile] = useState<StudentAIProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<string | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState(false);
  const [timeline, setTimeline] = useState<EventRow[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  useEffect(() => {
    getStudentAIProfile(student.student_id, classId).then(p => {
      setProfile(p);
      setLoading(false);
    });
  }, [student.student_id, classId]);

  useEffect(() => {
    if (modalTab !== 'timeline' || timeline.length > 0) return;
    setTimelineLoading(true);
    getStudentEventTimeline(student.student_id, classId).then(rows => {
      setTimeline(rows);
      setTimelineLoading(false);
    });
  }, [modalTab, student.student_id, classId, timeline.length]);

  async function handleGenerateAssessment() {
    if (!profile) return;
    setAssessmentLoading(true);
    setAssessmentError(false);
    try {
      const result = await generateStudentAssessment({
        name: student.full_name,
        progress_pct: student.progress_pct,
        current_module: student.current_module,
        challenges_passed: student.challenges_passed,
        challenges_attempted: student.challenges_attempted,
        status: student.status,
        last_active: student.last_active,
        totalInteractions: profile.totalInteractions,
        weekInteractions: profile.weekInteractions,
        challengeInteractions: profile.challengeInteractions,
        topErrors: profile.topErrors,
        recentQuestions: profile.recentQuestions,
        languageSplit: profile.languageSplit,
      }, language);
      setAssessment(result);
    } catch {
      setAssessmentError(true);
    } finally {
      setAssessmentLoading(false);
    }
  }

  const ERROR_COLORS: Record<string, string> = {
    TypeError: '#d2887b',
    ReferenceError: '#cda86a',
    SyntaxError: '#7eb8cf',
    RangeError: '#9eaa84',
  };

  const total = (profile?.languageSplit.en ?? 0) + (profile?.languageSplit.kin ?? 0);
  const enPct = total > 0 ? Math.round(((profile?.languageSplit.en ?? 0) / total) * 100) : 50;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="card-head" style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="av" style={{ width: 40, height: 40, fontSize: 15 }}>{initials(student.full_name)}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{student.full_name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>@{student.username}</div>
            </div>
          </div>
          <button onClick={onClose} className="iconbtn"><X size={18} /></button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', padding: '0 20px' }}>
          {(['profile', 'timeline'] as const).map(t => (
            <button
              key={t}
              onClick={() => setModalTab(t)}
              style={{
                padding: '10px 14px 9px',
                fontSize: 13,
                fontWeight: modalTab === t ? 600 : 400,
                color: modalTab === t ? 'var(--text)' : 'var(--text-3)',
                background: 'none',
                border: 'none',
                borderBottom: modalTab === t ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: -1,
              }}
            >
              {t === 'profile' ? (isKin ? 'Umwirondoro' : 'AI Profile') : (isKin ? 'Ibikorwa' : 'Timeline')}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px' }}>
          {modalTab === 'timeline' ? (
            timelineLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                <Loader size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-3)' }} />
              </div>
            ) : timeline.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)' }}>
                <Activity size={28} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ fontSize: 14 }}>
                  {isKin ? 'Nta bikorwa byabonetse.' : 'No activity recorded yet.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {timeline.map(ev => {
                  const outcomeDot = ev.outcome === 'pass' ? '#4ade80'
                    : ev.outcome === 'fail' ? '#f87171'
                    : ev.outcome === 'complete' ? '#60a5fa'
                    : 'var(--text-3)';
                  const label = ev.event_type.replace(/_/g, ' ');
                  return (
                    <div key={ev.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: outcomeDot, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>
                          {label}
                          {ev.entity_type && <span style={{ color: 'var(--text-3)', fontWeight: 400 }}> · {ev.entity_type}</span>}
                          {ev.outcome && <span style={{ color: outcomeDot, fontWeight: 600 }}> {ev.outcome}</span>}
                          {ev.attempt_number != null && ev.attempt_number > 1 && (
                            <span style={{ color: 'var(--text-3)', fontSize: 11 }}> (attempt {ev.attempt_number})</span>
                          )}
                        </div>
                        {ev.competency_code && (
                          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{ev.competency_code}</div>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>
                        {formatRelativeTime(ev.created_at, isKin)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
              <Loader size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-3)' }} />
            </div>
          ) : !profile || profile.totalInteractions === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)' }}>
              <BarChart2 size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>
                {isKin ? 'Uyu munyeshuri ntiyabajije Mwarimu ubu.' : "This student hasn't used Mwarimu yet."}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: isKin ? 'Ibibazo byose' : 'Total asks', value: profile.totalInteractions },
                  { label: isKin ? 'Iki cyumweru' : 'This week', value: profile.weekInteractions },
                  { label: isKin ? 'Mu bigeragezo' : 'In challenges', value: profile.challengeInteractions },
                ].map(s => (
                  <div key={s.label} className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em' }}>{s.value}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Top errors */}
              {profile.topErrors.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    {isKin ? 'Amakosa akunze kugaragara' : 'Most frequent errors'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {profile.topErrors.map(e => {
                      const maxCount = profile.topErrors[0].count;
                      const barW = Math.round((e.count / maxCount) * 100);
                      return (
                        <div key={e.type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 110, fontSize: 12.5, fontFamily: 'var(--mono)', color: ERROR_COLORS[e.type] ?? 'var(--text-2)', flexShrink: 0 }}>
                            {e.type}
                          </div>
                          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--surface)' }}>
                            <div style={{ width: `${barW}%`, height: '100%', borderRadius: 3, background: ERROR_COLORS[e.type] ?? 'var(--text-3)', opacity: 0.7 }} />
                          </div>
                          <div style={{ width: 24, textAlign: 'right', fontSize: 12, color: 'var(--text-3)', flexShrink: 0 }}>{e.count}×</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Language preference */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  {isKin ? 'Ururimi rukozwe' : 'Language used'}
                </p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', width: 28, flexShrink: 0 }}>EN</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--surface)', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${enPct}%`, background: '#7eb8cf', height: '100%' }} />
                    <div style={{ flex: 1, background: '#9eaa84', height: '100%' }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', width: 28, textAlign: 'right', flexShrink: 0 }}>RW</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-3)', marginTop: 4 }}>
                  <span>{enPct}% English</span>
                  <span>{100 - enPct}% Kinyarwanda</span>
                </div>
              </div>

              {/* Recent questions */}
              {profile.recentQuestions.length > 0 && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    {isKin ? 'Ibibazo byahise' : 'Recent questions'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {profile.recentQuestions.map((q, i) => (
                      <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          {q.in_challenge && (
                            <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 99, background: 'rgba(205,168,106,0.12)', color: '#cda86a', border: '1px solid rgba(205,168,106,0.25)' }}>
                              {isKin ? 'Ikigeragezo' : 'Challenge'}
                            </span>
                          )}
                          <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 'auto' }}>
                            {formatRelativeTime(q.created_at, isKin)}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.45, margin: 0 }}>
                          {q.question}{q.question.length === 140 ? '…' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Assessment */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                    {isKin ? 'Isuzuma rya AI' : 'AI Assessment'}
                  </p>
                  {!assessment && (
                    <button
                      onClick={handleGenerateAssessment}
                      disabled={assessmentLoading || !profile}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 'var(--radius)',
                        background: 'var(--surface)', border: '1px solid var(--line)',
                        color: 'var(--text-2)', fontSize: 12.5, cursor: 'pointer',
                        opacity: assessmentLoading ? 0.7 : 1,
                      }}
                    >
                      {assessmentLoading
                        ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
                        : <Sparkles size={12} />}
                      {isKin ? 'Tanga isuzuma' : 'Generate assessment'}
                    </button>
                  )}
                  {assessment && (
                    <button
                      onClick={() => { setAssessment(null); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 12 }}
                    >
                      {isKin ? 'Subiramo' : 'Regenerate'}
                    </button>
                  )}
                </div>

                {assessmentError && (
                  <p style={{ fontSize: 13, color: 'var(--text-3)', fontStyle: 'italic' }}>
                    {isKin ? 'Habaye ikosa. Gerageza nanone.' : 'Could not generate assessment. Try again.'}
                  </p>
                )}

                {assessment && (
                  <div style={{
                    padding: '14px 16px', borderRadius: 'var(--radius)',
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {assessment}
                  </div>
                )}

                {!assessment && !assessmentError && (
                  <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.55 }}>
                    {isKin
                      ? 'Kanda hejuru kugira ngo AI isuzume imyitwarire y\'uyu munyeshuri hifashishijwe amakuru yose.'
                      : "Click above to have the AI synthesize this student's full learning profile into a teacher-readable assessment."}
                  </p>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status, isKin, isStuck }: { status: RosterStudent['status']; isKin: boolean; isStuck?: boolean }) {
  if (isStuck) return (
    <span className="pill" style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.35)', color: '#f97316', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <AlertTriangle size={11} />{isKin ? 'Arananiwe' : 'Stuck'}
    </span>
  );
  if (status === 'on-track') return <span className="pill solid"><span className="dot" />{isKin ? 'Biri neza' : 'On track'}</span>;
  if (status === 'behind') return <span className="pill error">{isKin ? 'Birasubira inyuma' : 'Behind'}</span>;
  return <span className="pill"><span className="dot" />{isKin ? 'Akeneye ubufasha' : 'Needs help'}</span>;
}

function attentionNote(s: RosterStudent, isKin: boolean): string {
  if (s.status === 'behind') {
    const days = s.last_active ? Math.floor((Date.now() - new Date(s.last_active).getTime()) / 86400000) : null;
    return isKin
      ? `${days !== null ? `Nta gikorwa mu minsi ${days}.` : 'Ntiyatangiye.'} Ubu ari kuri "${s.current_module}".`
      : `${days !== null ? `No activity in ${days} day${days === 1 ? '' : 's'}.` : 'Hasn\'t started yet.'} Currently on "${s.current_module}".`;
  }
  return isKin
    ? `Ageze kuri ${s.progress_pct}% muri "${s.current_module}" — yakwifuza kuganirwaho.`
    : `At ${s.progress_pct}% in "${s.current_module}" — may need a check-in.`;
}

function CompetencyPanel({ rows, isKin }: { rows: CompetencyRow[]; isKin: boolean }) {
  if (rows.length === 0) return (
    <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
      {isKin ? 'Nta makuru y\'ubushobozi abonetse.' : 'No competency data yet — will populate once students start lessons.'}
    </p>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {rows.map(r => (
        <div key={r.competency_code}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{r.competency_code}</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>
              {r.pass_count}/{r.attempt_count} · {r.pass_rate}%
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: 'var(--surface-2)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${r.pass_rate}%`,
              background: r.pass_rate >= 70 ? 'var(--success, #4ade80)' : r.pass_rate >= 40 ? '#facc15' : '#f87171',
              borderRadius: 99,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function dueText(assignment: Assignment, isKin: boolean): string {
  if (!assignment.due_date) return isKin ? 'Nta gihe ntarengwa' : 'No due date';
  const diffDays = Math.ceil((new Date(assignment.due_date).getTime() - Date.now()) / 86400000);
  const dateStr = new Date(assignment.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (diffDays < 0) return isKin ? `Byafunzwe ${dateStr}` : `Closed ${dateStr}`;
  if (diffDays === 0) return isKin ? 'Bigomba kuba uyu munsi' : 'Due today';
  if (diffDays === 1) return isKin ? 'Bigomba kuba ejo' : 'Due tomorrow';
  return isKin ? `Bigomba kuba ${dateStr}` : `Due ${dateStr}`;
}

// ─── Mwarimu Accuracy Evaluation Modal ────────────────────────────────────────

function MwarimuEvalModal({ onClose }: { onClose: () => void }) {
  const [errorInput, setErrorInput] = useState('');
  const [codeContext, setCodeContext] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<'accurate' | 'partially_accurate' | 'inaccurate' | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [summary, setSummary] = useState<{ total: number; accuracyPct: number | null } | null>(null);

  useEffect(() => {
    getMwarimuEvalSummary().then(s => setSummary({ total: s.total, accuracyPct: s.accuracyPct }));
  }, [saved]);

  const askMwarimu = async () => {
    if (!errorInput.trim()) return;
    setLoading(true);
    setAiResponse('');
    setRating(null);
    setSaved(false);
    try {
      const message = codeContext.trim()
        ? `Code:\n\`\`\`js\n${codeContext.trim()}\n\`\`\`\n\nError: ${errorInput.trim()}`
        : `Error: ${errorInput.trim()}`;
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: AbortSignal.timeout(60_000),
      });
      const json = await res.json();
      setAiResponse(json.text ?? 'No response returned.');
    } catch {
      setAiResponse('Request timed out or failed. Try again.');
    }
    setLoading(false);
  };

  const submitRating = async () => {
    if (!rating || !aiResponse) return;
    setSaving(true);
    setSaveError('');
    const { error } = await saveMwarimuEvaluation({
      error_input: errorInput.trim(),
      code_context: codeContext.trim(),
      ai_response: aiResponse,
      rating,
      notes: notes.trim(),
    });
    if (error) { setSaveError(error); setSaving(false); return; }
    setSaved(true);
    setSaving(false);
    setErrorInput('');
    setCodeContext('');
    setAiResponse('');
    setRating(null);
    setNotes('');
  };

  const ratingBtn = (value: 'accurate' | 'partially_accurate' | 'inaccurate', label: string, color: string) => (
    <button
      onClick={() => setRating(value)}
      style={{
        flex: 1, padding: '9px 8px', border: `1.5px solid`,
        borderColor: rating === value ? color : 'var(--line)',
        borderRadius: 6, background: rating === value ? color + '18' : 'transparent',
        color: rating === value ? color : 'var(--text-2)',
        fontSize: 12.5, fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
      }}
    >{label}</button>
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg w-full" style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="card-head" style={{ marginBottom: 16 }}>
          <div>
            <h2 className="card-title">Test Mwarimu Accuracy</h2>
            {summary !== null && summary.total > 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>
                {summary.total} evaluation{summary.total !== 1 ? 's' : ''} recorded
                {summary.accuracyPct !== null && ` · ${summary.accuracyPct}% accuracy so far`}
              </p>
            )}
          </div>
          <button onClick={onClose} className="iconbtn" aria-label="Close"><X size={18} /></button>
        </div>

        {saved && (
          <div style={{ background: 'var(--success-dim, #f0fdf4)', border: '1px solid var(--success, #22c55e)', borderRadius: 6, padding: '10px 13px', marginBottom: 14, fontSize: 13, color: 'var(--success, #16a34a)', fontWeight: 500 }}>
            ✓ Rating saved. Enter another error to continue testing.
          </div>
        )}

        <div className="stack" style={{ ['--gap' as string]: '14px' }}>
          <div className="field">
            <label className="label">Error message <span style={{ color: 'var(--error)' }}>*</span></label>
            <textarea
              className="input"
              rows={2}
              value={errorInput}
              onChange={e => setErrorInput(e.target.value)}
              placeholder="e.g. ReferenceError: x is not defined at line 5"
              style={{ resize: 'vertical', fontFamily: 'var(--mono)', fontSize: 13 }}
            />
          </div>

          <div className="field">
            <label className="label">Code context <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 400 }}>(optional — paste the student's code)</span></label>
            <textarea
              className="input"
              rows={4}
              value={codeContext}
              onChange={e => setCodeContext(e.target.value)}
              placeholder="let x = 10&#10;console.log(y)"
              style={{ resize: 'vertical', fontFamily: 'var(--mono)', fontSize: 12.5 }}
            />
          </div>

          <button
            className="btn"
            onClick={askMwarimu}
            disabled={loading || !errorInput.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
          >
            {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Asking Mwarimu…</> : <><Sparkles size={15} /> Get Mwarimu's Response</>}
          </button>

          {aiResponse && (
            <>
              <div style={{ background: 'var(--surface, var(--bg))', border: '1px solid var(--line)', borderRadius: 6, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>Mwarimu's response</p>
                <p style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
              </div>

              <div className="field">
                <label className="label">Rate this response</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ratingBtn('accurate', '✓ Accurate', '#16a34a')}
                  {ratingBtn('partially_accurate', '~ Partial', '#b85a16')}
                  {ratingBtn('inaccurate', '✗ Inaccurate', '#dc2626')}
                </div>
              </div>

              {rating && (
                <div className="field">
                  <label className="label">Notes <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></label>
                  <textarea
                    className="input"
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. The hint was correct but too vague about which variable"
                    style={{ resize: 'vertical', fontSize: 13 }}
                  />
                </div>
              )}

              {saveError && <p style={{ fontSize: 12.5, color: 'var(--error)' }}>{saveError}</p>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Done</button>
                <button
                  className="btn"
                  style={{ flex: 1 }}
                  onClick={submitRating}
                  disabled={!rating || saving}
                >
                  {saving ? 'Saving…' : 'Save rating'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Students Modal ───────────────────────────────────────────────────────

function AddStudentsModal({ cls, language, onClose }: { cls: Class; language: 'EN' | 'KIN'; onClose: () => void }) {
  const isKin = language === 'KIN';
  const [namesInput, setNamesInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ name: string; login_email: string; initial_password: string; error?: string }> | null>(null);
  const [error, setError] = useState('');

  async function handleCreate() {
    const names = namesInput.split('\n').map(n => n.trim()).filter(n => n.length >= 2);
    if (names.length === 0) return;
    setLoading(true);
    setError('');
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/create-roster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token ?? ''}` },
      body: JSON.stringify({ class_id: cls.id, students: names.map(name => ({ name })) }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error ?? 'Failed to create accounts'); setLoading(false); return; }
    setResults(json.results);
    setLoading(false);
  }

  function handleDownload() {
    if (!results) return;
    const header = 'Name,Login Email,Initial Password,Status\n';
    const rows = results.map(r => `"${r.name}","${r.login_email}","${r.initial_password}","${r.error ?? 'OK'}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cls.name.replace(/\s+/g, '_')}_credentials.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="card pad-lg w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="card-head">
          <h2 className="card-title">{isKin ? 'Ongeraho abanyeshuri' : 'Add students'}</h2>
          <button onClick={onClose} className="iconbtn"><X size={18} /></button>
        </div>

        {!results ? (
          <>
            <p className="text-sm" style={{ color: 'var(--text-2)', marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>
              {isKin
                ? "Andika amazina y'abanyeshuri, umwe ku murongo. Konti zizashyirwaho. Buri munyeshuri azashyira password ye bwa mbere akinjira."
                : "Enter student names, one per line. Accounts will be created automatically. Each student sets their own password on first login."}
            </p>
            <div className="field">
              <label className="label">{isKin ? "Amazina y'abanyeshuri" : 'Student names'}</label>
              <textarea
                className="input"
                style={{ minHeight: 180, fontFamily: 'var(--mono)', fontSize: 13, resize: 'vertical' }}
                value={namesInput}
                onChange={e => setNamesInput(e.target.value)}
                placeholder={'Jean Dupont\nMarie Uwase\nAlice Nzeyimana'}
              />
            </div>
            {error && <p style={{ fontSize: 13, color: 'var(--error)', marginTop: 8 }}>{error}</p>}
            <div className="row" style={{ gap: 12, marginTop: 20 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>{isKin ? 'Reka' : 'Cancel'}</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={loading || !namesInput.trim()}>
                {loading ? <Loader size={16} className="animate-spin" /> : (isKin ? 'Kora konti' : 'Create accounts')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 12px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: results.every(r => !r.error) ? 'var(--success, #22c55e)' : 'var(--text-2)' }}>
                {results.filter(r => !r.error).length} / {results.length} {isKin ? 'barakozwe neza' : 'created'}
              </p>
              <button className="btn btn-tertiary sm" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Download size={13} />{isKin ? 'Pakurura CSV' : 'Download CSV'}
              </button>
            </div>
            <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden', fontSize: 12 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px', fontWeight: 600 }}>{isKin ? 'Izina' : 'Name'}</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600 }}>{isKin ? 'Email yo kwinjira' : 'Login email'}</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600 }}>{isKin ? 'Password ya mbere' : 'Password'}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--line)', background: r.error ? 'var(--error-dim)' : undefined }}>
                      <td style={{ padding: '8px 10px', color: 'var(--text)' }}>{r.name}</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'var(--mono)', color: r.error ? 'var(--error)' : 'var(--text-2)', fontSize: 11.5 }}>
                        {r.error ? r.error : r.login_email}
                      </td>
                      <td style={{ padding: '8px 10px', fontFamily: 'var(--mono)', color: 'var(--text-2)', letterSpacing: '0.05em' }}>
                        {r.error ? '—' : r.initial_password}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-3)', marginTop: 10, lineHeight: 1.5 }}>
              {isKin
                ? 'Sohora CSV maze ugabane abanyeshuri. Bazashyira password yabo bwa mbere bakinjira.'
                : 'Download the CSV and hand out credentials. Students will be prompted to set their own password on first login.'}
            </p>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 14 }} onClick={onClose}>
              {isKin ? 'Gufunga' : 'Done'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Grade Book Modal ─────────────────────────────────────────────────────────

function GradeBookModal({ classId, className, onClose, onViewSubmission }: {
  classId: string;
  className: string;
  onClose: () => void;
  onViewSubmission: (assignment: Assignment) => void;
}) {
  const [book, setBook] = useState<GradeBook | null>(null);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getGradeBook(classId).then(b => { setBook(b); setLoading(false); });
  }, [classId]);

  const handleExportCSV = () => {
    if (!book) return;
    const header = ['Student', ...book.assignments.map(a => `"${a.title} (${a.total_marks})"`).join(',')];
    const rows = book.students.map(s => {
      const cells = book.assignments.map(a => {
        const c = book.cells[s.student_id]?.[a.id];
        if (!c?.submitted) return 'NS';
        if (!c.graded) return 'SUB';
        return String(c.marks_earned ?? '');
      });
      return [`"${s.full_name}"`, ...cells].join(',');
    });
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${className.replace(/\s+/g, '_')}_gradebook.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const classAvg = (assignmentId: string): string => {
    if (!book) return '—';
    const graded = book.students
      .map(s => book.cells[s.student_id]?.[assignmentId])
      .filter(c => c?.graded && c.marks_earned !== null);
    if (graded.length === 0) return '—';
    const avg = graded.reduce((sum, c) => sum + (c!.marks_earned ?? 0), 0) / graded.length;
    return avg.toFixed(1);
  };

  const submissionRate = (assignmentId: string): number => {
    if (!book || book.students.length === 0) return 0;
    const submitted = book.students.filter(s => book.cells[s.student_id]?.[assignmentId]?.submitted).length;
    return Math.round((submitted / book.students.length) * 100);
  };

  const totalPct = (studentId: string): string => {
    if (!book) return '—';
    let earned = 0, possible = 0;
    for (const a of book.assignments) {
      if (!a.grades_released) continue;
      const c = book.cells[studentId]?.[a.id];
      if (c?.graded && c.marks_earned !== null) {
        earned += c.marks_earned;
        possible += a.total_marks;
      }
    }
    if (possible === 0) return '—';
    return `${Math.round((earned / possible) * 100)}%`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="card" style={{ width: '96vw', maxWidth: 1100, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div className="card-head" style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
          <div>
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Table2 size={16} style={{ color: 'var(--text-3)' }} />
              Grade Book — {className}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>
              NS = Not submitted · SUB = Submitted, awaiting grade · grey = grades not yet released to students
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-secondary sm" onClick={handleExportCSV} disabled={!book}>
              <Download size={13} style={{ marginRight: 4 }} />Export CSV
            </button>
            <button onClick={onClose} className="iconbtn" aria-label="Close"><X size={18} /></button>
          </div>
        </div>

        {/* Table */}
        <div ref={tableRef} style={{ overflow: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <Loader size={22} className="animate-spin" style={{ color: 'var(--text-3)' }} />
            </div>
          ) : !book || book.students.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-2)', fontSize: 14 }}>
              No students enrolled in this class yet.
            </div>
          ) : (
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', position: 'sticky', top: 0, zIndex: 2 }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, minWidth: 160, position: 'sticky', left: 0, background: 'var(--surface-2)', borderRight: '1px solid var(--line)' }}>
                    Student
                  </th>
                  {book.assignments.map(a => (
                    <th
                      key={a.id}
                      style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, minWidth: 110, borderLeft: '1px solid var(--line)', cursor: 'pointer' }}
                      title={`Click to view submissions for "${a.title}"`}
                      onClick={() => onViewSubmission(a as unknown as Assignment)}
                    >
                      <div style={{ fontSize: 11.5, color: 'var(--text)', lineHeight: 1.3, marginBottom: 2 }}>{a.title}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 400 }}>/{a.total_marks} pts</div>
                      {!a.grades_released && (
                        <div style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginTop: 2 }}>
                          <EyeOff size={9} />unreleased
                        </div>
                      )}
                    </th>
                  ))}
                  <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, minWidth: 80, borderLeft: '2px solid var(--line)', background: 'var(--surface-2)' }}>
                    Total %
                  </th>
                </tr>
                {/* Class averages row */}
                <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--line)' }}>
                  <td style={{ padding: '6px 14px', fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic', position: 'sticky', left: 0, background: 'var(--surface)', borderRight: '1px solid var(--line)' }}>
                    Class avg / submission rate
                  </td>
                  {book.assignments.map(a => (
                    <td key={a.id} style={{ padding: '6px 12px', textAlign: 'center', borderLeft: '1px solid var(--line)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>{classAvg(a.id)}</div>
                      <div style={{ fontSize: 10.5, color: submissionRate(a.id) < 60 ? 'var(--error, #ef4444)' : 'var(--text-3)' }}>
                        {submissionRate(a.id)}% submitted
                      </div>
                    </td>
                  ))}
                  <td style={{ borderLeft: '2px solid var(--line)' }} />
                </tr>
              </thead>
              <tbody>
                {book.students.map((s, i) => (
                  <tr key={s.student_id} style={{ borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                    <td style={{ padding: '8px 14px', position: 'sticky', left: 0, background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)', borderRight: '1px solid var(--line)', zIndex: 1 }}>
                      <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: 13 }}>{s.full_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.username}</div>
                    </td>
                    {book.assignments.map(a => {
                      const c = book.cells[s.student_id]?.[a.id];
                      const bg = !c?.submitted
                        ? 'var(--error-dim, rgba(239,68,68,0.08))'
                        : !c.graded
                        ? 'var(--warning-dim, rgba(251,191,36,0.12))'
                        : 'transparent';
                      const textColor = !c?.submitted
                        ? 'var(--error, #ef4444)'
                        : !c.graded
                        ? '#b45309'
                        : a.grades_released
                        ? 'var(--text)'
                        : 'var(--text-3)';
                      return (
                        <td
                          key={a.id}
                          style={{ padding: '8px 12px', textAlign: 'center', borderLeft: '1px solid var(--line)', background: bg, fontVariantNumeric: 'tabular-nums' }}
                        >
                          {!c?.submitted ? (
                            <span style={{ fontSize: 11, color: textColor, fontWeight: 500 }}>NS</span>
                          ) : !c.graded ? (
                            <span style={{ fontSize: 11, color: textColor }}>SUB</span>
                          ) : (
                            <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>
                              {c.marks_earned ?? 0}/{a.total_marks}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ padding: '8px 12px', textAlign: 'center', borderLeft: '2px solid var(--line)', fontWeight: 600, color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>
                      {totalPct(s.student_id)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Attendance Modal ─────────────────────────────────────────────────────────

const STATUS_LABELS: Record<AttendanceStatus, { short: string; color: string; bg: string }> = {
  present: { short: 'P', color: '#16a34a', bg: '#dcfce7' },
  late:    { short: 'L', color: '#d97706', bg: '#fef3c7' },
  absent:  { short: 'A', color: '#dc2626', bg: '#fee2e2' },
  excused: { short: 'E', color: '#7c3aed', bg: '#ede9fe' },
};

function AttendanceModal({ cls, language, onClose }: {
  cls: Class;
  language: 'EN' | 'KIN';
  onClose: () => void;
}) {
  const isKin = language === 'KIN';
  const [tab, setTab] = useState<'take' | 'history'>('take');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [roster, setRoster] = useState<{ studentId: string; name: string; status: AttendanceStatus }[]>([]);
  const [sessions, setSessions] = useState<AttendanceSessionSummary[]>([]);
  const [historyDetail, setHistoryDetail] = useState<{ session: AttendanceSessionSummary; records: AttendanceStudentRecord[] } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingRoster, setLoadingRoster] = useState(true);

  useEffect(() => {
    // Load roster
    import('../lib/db').then(({ getClassRoster }) => {
      getClassRoster(cls.id).then(students => {
        setRoster(students.map(s => ({ studentId: s.student_id, name: s.full_name, status: 'present' })));
        setLoadingRoster(false);
      });
    });
    // Load past sessions
    getAttendanceSessions(cls.id).then(setSessions);
  }, [cls.id]);

  function setStatus(studentId: string, status: AttendanceStatus) {
    setRoster(prev => prev.map(r => r.studentId === studentId ? { ...r, status } : r));
  }

  function markAll(status: AttendanceStatus) {
    setRoster(prev => prev.map(r => ({ ...r, status })));
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await saveAttendance(
      cls.id, date, topic.trim() || null,
      roster.map(r => ({ studentId: r.studentId, status: r.status }))
    );
    setSaving(false);
    if (!error) {
      setSaved(true);
      getAttendanceSessions(cls.id).then(setSessions);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  async function loadHistory(session: AttendanceSessionSummary) {
    const records = await getSessionAttendance(session.id);
    setHistoryDetail({ session, records });
  }

  const presentCount = roster.filter(r => r.status === 'present').length;
  const lateCount    = roster.filter(r => r.status === 'late').length;

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ maxWidth: 600, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4" style={{ flexShrink: 0 }}>
          <div>
            <h2 className="font-bold" style={{ color: 'var(--text)', fontSize: '17px' }}>
              {isKin ? 'Kwandika Ibyicaro' : 'Attendance Register'}
            </h2>
            <p className="dim" style={{ fontSize: '13px' }}>{cls.name}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost sm"><X size={16} /></button>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: 16, flexShrink: 0, padding: 0, background: 'transparent' }}>
          <button onClick={() => setTab('take')} className={`tab${tab === 'take' ? ' on' : ''}`}>
            <ClipboardCheck size={14} />
            {isKin ? 'Andika uyu munsi' : 'Take attendance'}
          </button>
          <button onClick={() => setTab('history')} className={`tab${tab === 'history' ? ' on' : ''}`}>
            <BarChart2 size={14} />
            {isKin ? 'Amateka' : 'History'}
            {sessions.length > 0 && <span className="pill" style={{ marginLeft: 4, fontSize: 11 }}>{sessions.length}</span>}
          </button>
        </div>

        {/* ── Take Attendance tab ── */}
        {tab === 'take' && (
          <div style={{ overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="dim" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  {isKin ? 'Itariki' : 'Date'}
                </span>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="form-input" style={{ width: '100%' }} />
              </label>
              <label>
                <span className="dim" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  {isKin ? 'Insanganyamatsiko (bitagenzuwe)' : 'Topic (optional)'}
                </span>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
                  className="form-input" style={{ width: '100%' }}
                  placeholder={isKin ? 'Urugero: HTML Basics' : 'e.g. HTML Basics'} />
              </label>
            </div>

            {/* Quick mark all */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="dim" style={{ fontSize: 12 }}>{isKin ? 'Sobanuza bose nka:' : 'Mark all as:'}</span>
              {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map(s => (
                <button key={s} onClick={() => markAll(s)} className="pill" style={{ cursor: 'pointer', fontSize: 12, background: STATUS_LABELS[s].bg, color: STATUS_LABELS[s].color, border: 'none' }}>
                  {isKin
                    ? { present: 'Bahari', absent: 'Batagaragaye', late: 'Baje guhera', excused: 'Baretse' }[s]
                    : { present: 'Present', absent: 'Absent', late: 'Late', excused: 'Excused' }[s]
                  }
                </button>
              ))}
            </div>

            {/* Roster */}
            {loadingRoster ? (
              <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--line-strong)', borderTopColor: 'var(--text-2)' }} /></div>
            ) : roster.length === 0 ? (
              <p className="dim text-sm text-center py-6">{isKin ? 'Nta banyeshuri' : 'No students enrolled'}</p>
            ) : (
              <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {roster.map((s, i) => (
                  <div key={s.studentId} className="flex items-center justify-between gap-3"
                    style={{ padding: '10px 14px', borderBottom: i < roster.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 14, color: 'var(--text)', truncate: true }}>{s.name}</span>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map(status => {
                        const lbl = STATUS_LABELS[status];
                        const active = s.status === status;
                        return (
                          <button key={status} onClick={() => setStatus(s.studentId, status)}
                            style={{
                              width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 700,
                              cursor: 'pointer', border: active ? `2px solid ${lbl.color}` : '2px solid transparent',
                              background: active ? lbl.bg : 'var(--surface-2)', color: active ? lbl.color : 'var(--text-3)',
                              transition: 'all 0.12s',
                            }}>
                            {lbl.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary + Save */}
            <div className="flex items-center justify-between gap-4" style={{ flexShrink: 0 }}>
              <div className="flex gap-3 text-sm">
                {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map(s => (
                  <span key={s} style={{ color: STATUS_LABELS[s].color, fontWeight: 600 }}>
                    {roster.filter(r => r.status === s).length} {STATUS_LABELS[s].short}
                  </span>
                ))}
              </div>
              <button onClick={handleSave} disabled={saving || roster.length === 0} className="btn btn-primary">
                {saving ? <Loader size={14} className="animate-spin" /> : saved ? <><Check size={14} /> {isKin ? 'Byabitswe' : 'Saved!'}</> : isKin ? 'Bika' : 'Save'}
              </button>
            </div>

            {roster.length > 0 && (
              <p className="dim text-center" style={{ fontSize: 12 }}>
                {isKin
                  ? `${presentCount + lateCount} / ${roster.length} bahari`
                  : `${presentCount + lateCount} / ${roster.length} present or late`}
              </p>
            )}
          </div>
        )}

        {/* ── History tab ── */}
        {tab === 'history' && (
          <div style={{ overflow: 'auto', flex: 1 }}>
            {historyDetail ? (
              <div>
                <button onClick={() => setHistoryDetail(null)} className="btn btn-ghost sm" style={{ marginBottom: 12 }}>
                  ← {isKin ? 'Subira inyuma' : 'Back'}
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <h3 style={{ fontWeight: 700, color: 'var(--text)' }}>
                    {new Date(historyDetail.session.session_date).toLocaleDateString(isKin ? 'fr-RW' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  {historyDetail.session.topic && <span className="pill">{historyDetail.session.topic}</span>}
                </div>
                <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  {historyDetail.records.map((r, i) => {
                    const lbl = STATUS_LABELS[r.status];
                    return (
                      <div key={r.student_id} className="flex items-center justify-between gap-3"
                        style={{ padding: '10px 14px', borderBottom: i < historyDetail.records.length - 1 ? '1px solid var(--line)' : 'none' }}>
                        <span style={{ fontSize: 14, color: 'var(--text)' }}>{r.full_name}</span>
                        <span style={{ fontWeight: 700, fontSize: 13, color: lbl.color, background: lbl.bg, padding: '2px 10px', borderRadius: 6 }}>
                          {{ present: 'Present', late: 'Late', absent: 'Absent', excused: 'Excused' }[r.status]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardCheck size={32} style={{ margin: '0 auto 12px', color: 'var(--text-3)' }} />
                <p className="dim text-sm">{isKin ? 'Nta makuru y\'ibyicaro arahari' : 'No attendance records yet'}</p>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {sessions.map((s, i) => {
                  const rate = s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0;
                  return (
                    <button key={s.id} onClick={() => loadHistory(s)} className="flex items-center gap-4 w-full text-left"
                      style={{ padding: '12px 16px', borderBottom: i < sessions.length - 1 ? '1px solid var(--line)' : 'none', background: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                          {new Date(s.session_date).toLocaleDateString(isKin ? 'fr-RW' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          {s.topic && <span className="dim font-normal" style={{ marginLeft: 8 }}>· {s.topic}</span>}
                        </p>
                        <div className="flex gap-3 mt-1" style={{ fontSize: 12 }}>
                          <span style={{ color: STATUS_LABELS.present.color }}>{s.present}P</span>
                          <span style={{ color: STATUS_LABELS.late.color }}>{s.late}L</span>
                          <span style={{ color: STATUS_LABELS.absent.color }}>{s.absent}A</span>
                          {s.excused > 0 && <span style={{ color: STATUS_LABELS.excused.color }}>{s.excused}E</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: rate >= 80 ? '#16a34a' : rate >= 60 ? '#d97706' : '#dc2626' }}>
                          {rate}%
                        </span>
                        <p className="dim" style={{ fontSize: 11 }}>{isKin ? 'Bahari' : 'attendance'}</p>
                      </div>
                      <ChevronDown size={14} style={{ color: 'var(--text-3)', transform: 'rotate(-90deg)' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  usePageTitle('Teacher Dashboard · EduCode');
  const [language] = useState<'EN' | 'KIN'>('EN');
  const isKin = language === 'KIN';

  const [classes, setClasses] = useState<Array<Class & { studentCount?: number; assignmentCount?: number }>>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissionCounts, setSubmissionCounts] = useState<Record<string, number>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);
  const [announcementsClass, setAnnouncementsClass] = useState<Class | null>(null);
  const [analyticsClass, setAnalyticsClass] = useState<Class | null>(null);
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [pendingReview, setPendingReview] = useState(0);
  const [selectedRosterStudent, setSelectedRosterStudent] = useState<RosterStudent | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [cohortTag, setCohortTag] = useState('intango_t1_2026');
  const [liveSignals, setLiveSignals] = useState<LiveSignal[]>([]);
  const [competency, setCompetency] = useState<CompetencyRow[]>([]);
  const [ratingsSummary, setRatingsSummary] = useState<ClassRatingsSummary | null>(null);
  const [classSummary, setClassSummary] = useState<string | null>(null);
  const [classSummaryLoading, setClassSummaryLoading] = useState(false);
  const [classSummaryError, setClassSummaryError] = useState(false);
  const [showMwarimuEval, setShowMwarimuEval] = useState(false);
  const [showGradeBook, setShowGradeBook] = useState(false);
  const [attendanceClass, setAttendanceClass] = useState<Class | null>(null);
  const [schoolAnnouncements, setSchoolAnnouncements] = useState<SchoolAnnouncement[]>([]);
  const [dismissedAnnIds, setDismissedAnnIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('educode_dismissed_school_anns') ?? '[]')); }
    catch { return new Set(); }
  });
  const { profile } = useAuth();

  const dismissSchoolAnn = (id: string) => {
    setDismissedAnnIds(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('educode_dismissed_school_anns', JSON.stringify([...next]));
      return next;
    });
  };

  const loadData = async () => {
    setLoadingData(true);
    getSchoolAnnouncementsForTeacher().then(setSchoolAnnouncements);
    const { data: classData } = await getTeacherClasses();

    // Load student counts + assignment counts for each class in parallel
    const enriched = await Promise.all(classData.map(async cls => {
      const [count, { data: asgns }] = await Promise.all([
        getClassStudentCount(cls.id),
        getClassAssignments(cls.id),
      ]);
      return { ...cls, studentCount: count, assignmentCount: asgns.length };
    }));
    setClasses(enriched);

    // Load assignments for selected or first class
    const targetId = selectedClassId ?? classData[0]?.id;
    if (targetId) {
      setSelectedClassId(targetId);
      const { data: aData } = await getClassAssignments(targetId);
      setAssignments(aData);
      const [counts, rosterData, pending, ratings, signals, comp] = await Promise.all([
        getAssignmentSubmissionCounts(aData.map(a => a.id)),
        getClassRoster(targetId),
        getClassPendingReviewCount(targetId),
        getClassRatingsSummary(targetId),
        getClassLiveSignals(targetId, cohortTag || undefined),
        getCompetencySummary(targetId, cohortTag || undefined),
      ]);
      setSubmissionCounts(counts);
      setRoster(rosterData);
      setPendingReview(pending);
      setRatingsSummary(ratings);
      setLiveSignals(signals);
      setCompetency(comp);
    }

    setLoadingData(false);
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedClassId) return;
    getClassLiveSignals(selectedClassId, cohortTag || undefined).then(setLiveSignals);
    getCompetencySummary(selectedClassId, cohortTag || undefined).then(setCompetency);
  }, [cohortTag, selectedClassId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedClassId) return;
    getClassAssignments(selectedClassId).then(async ({ data }) => {
      setAssignments(data);
      const [counts, rosterData, pending, ratings, signals, comp] = await Promise.all([
        getAssignmentSubmissionCounts(data.map(a => a.id)),
        getClassRoster(selectedClassId),
        getClassPendingReviewCount(selectedClassId),
        getClassRatingsSummary(selectedClassId),
        getClassLiveSignals(selectedClassId, cohortTag || undefined),
        getCompetencySummary(selectedClassId, cohortTag || undefined),
      ]);
      setSubmissionCounts(counts);
      setRoster(rosterData);
      setPendingReview(pending);
      setRatingsSummary(ratings);
      setLiveSignals(signals);
      setCompetency(comp);
    });
  }, [selectedClassId]);

  const selectedClass = classes.find(c => c.id === selectedClassId) ?? null;
  const activeThisWeek = roster.filter(s => s.last_active && (Date.now() - new Date(s.last_active).getTime()) < 7 * 86400000).length;
  const classProgress = roster.length > 0 ? Math.round(roster.reduce((sum, s) => sum + s.progress_pct, 0) / roster.length) : 0;
  const fallingBehind = roster.filter(s => s.status === 'behind').length;

  const signalMap = new Map(liveSignals.map(s => [s.student_id, s]));
  const stuckCount = liveSignals.filter(s => s.is_stuck).length;

  // Sort roster: Stuck → Inactive (7+ days) → everything else
  const sortedRoster = [...roster].sort((a, b) => {
    const aStuck = signalMap.get(a.student_id)?.is_stuck ?? false;
    const bStuck = signalMap.get(b.student_id)?.is_stuck ?? false;
    const aInactive = a.last_active ? (Date.now() - new Date(a.last_active).getTime()) > 7 * 86400000 : true;
    const bInactive = b.last_active ? (Date.now() - new Date(b.last_active).getTime()) > 7 * 86400000 : true;
    const score = (stuck: boolean, inactive: boolean) => stuck ? 0 : inactive ? 1 : 2;
    return score(aStuck, aInactive) - score(bStuck, bInactive);
  });

  async function handleGenerateClassSummary() {
    if (!roster.length || !selectedClass) return;
    setClassSummaryLoading(true);
    setClassSummaryError(false);
    try {
      const totalChallengesPassed = roster.reduce((s, r) => s + r.challenges_passed, 0);
      const totalChallengesAttempted = roster.reduce((s, r) => s + r.challenges_attempted, 0);
      const studentsOnTrack = roster.filter(r => r.status === 'on-track').length;
      const studentsBehind = roster.filter(r => r.status === 'behind').length;
      const studentsNeedHelp = roster.filter(r => r.status === 'needs-help').length;
      const result = await generateClassSummary({
        className: selectedClass.name,
        studentCount: roster.length,
        avgProgress: classProgress,
        totalChallengesPassed,
        totalChallengesAttempted,
        studentsOnTrack,
        studentsBehind,
        studentsNeedHelp,
        commonErrors: [],
        avgInteractionsPerStudent: 0,
        kinUsagePct: 0,
      }, language);
      setClassSummary(result);
    } catch {
      setClassSummaryError(true);
    } finally {
      setClassSummaryLoading(false);
    }
  }
  const needsAttention = [...roster]
    .filter(s => s.status !== 'on-track')
    .sort((a, b) => (a.status !== b.status ? (a.status === 'behind' ? -1 : 1) : a.progress_pct - b.progress_pct))
    .slice(0, 3);

  const handleExportEvents = () => {
    const header = ['Name', 'Username', 'Last Event At', 'Lesson Completions', 'Challenge Passes', 'Challenge Fails', 'AI Questions', 'Stuck'];
    const rows = sortedRoster.map(s => {
      const sig = signalMap.get(s.student_id);
      return [
        `"${s.full_name}"`,
        s.username,
        sig?.last_event_at ? new Date(sig.last_event_at).toLocaleString() : 'No events',
        sig?.lesson_count ?? 0,
        sig?.challenge_passes ?? 0,
        sig?.challenge_fails ?? 0,
        sig?.ai_questions ?? 0,
        sig?.is_stuck ? 'yes' : 'no',
      ];
    });
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(selectedClass?.name ?? 'class').replace(/\s+/g, '_')}_events_${cohortTag || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportRoster = () => {
    const header = ['Name', 'Username', 'Progress %', 'Current Module', 'Last Active', 'Status'];
    const rows = roster.map(s => [
      `"${s.full_name}"`,
      s.username,
      s.progress_pct,
      `"${s.current_module}"`,
      s.last_active ? new Date(s.last_active).toLocaleString() : 'Never',
      s.status,
    ]);
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(selectedClass?.name ?? 'class').replace(/\s+/g, '_')}_roster.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    if (!selectedClass || roster.length === 0) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const statusColor: Record<string, string> = { 'on-track': '#16a34a', 'behind': '#d97706', 'needs-help': '#dc2626' };
    const statusLabel: Record<string, string> = { 'on-track': 'On Track', 'behind': 'Behind', 'needs-help': 'Needs Help' };
    const rows = roster.map(s => `
      <tr>
        <td>${s.full_name}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="flex:1;background:#e5e7eb;border-radius:4px;height:8px">
              <div style="width:${s.progress_pct}%;background:#3b82f6;border-radius:4px;height:8px"></div>
            </div>
            <span style="font-weight:600;color:#1f2937;min-width:36px">${s.progress_pct}%</span>
          </div>
        </td>
        <td>${s.challenges_passed} / ${s.challenges_attempted}</td>
        <td style="color:${statusColor[s.status] ?? '#6b7280'};font-weight:600">${statusLabel[s.status] ?? s.status}</td>
        <td style="color:#6b7280">${s.last_active ? new Date(s.last_active).toLocaleDateString() : 'Never'}</td>
      </tr>
    `).join('');
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Progress Report — ${selectedClass.name}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 32px; color: #111; background: #fff; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .meta { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
  .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; border-radius: 6px; padding: 2px 10px; font-size: 12px; font-weight: 600; margin-right: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 8px 12px; background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151; }
  td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  tr:hover td { background: #f9fafb; }
  .footer { margin-top: 32px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
<h1>Class Progress Report</h1>
<div class="meta">
  <span class="badge">${selectedClass.name}</span>
  <span class="badge">${selectedClass.subject ?? ''}</span>
  Generated: ${dateStr} &nbsp;·&nbsp; ${roster.length} students
</div>
<table>
  <thead>
    <tr>
      <th>Student</th>
      <th>Course Progress</th>
      <th>Challenges (P/A)</th>
      <th>Status</th>
      <th>Last Active</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">EduCode Rwanda · RTB TVET Digital Learning Platform · ${dateStr}</div>
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };

  const visibleSchoolAnns = schoolAnnouncements.filter(a => !dismissedAnnIds.has(a.id));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNav />

      {/* School admin announcements banner */}
      {visibleSchoolAnns.length > 0 && (
        <div style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--line)' }}>
          <div className="wrap" style={{ padding: '0 var(--wrap-px)' }}>
            {visibleSchoolAnns.map(ann => (
              <div key={ann.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                <Megaphone size={15} style={{ color: 'var(--text-2)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginRight: 8 }}>{ann.title}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{ann.body}</span>
                </div>
                <button
                  onClick={() => dismissSchoolAnn(ann.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 2, flexShrink: 0 }}
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="wrap page">
        {loadingData ? (
          <div className="flex items-center justify-center py-24">
            <Loader size={24} className="animate-spin" style={{ color: 'var(--text-2)' }} />
          </div>
        ) : classes.length === 0 ? (
          <div className="rounded-2xl p-8 text-center rise" style={{ background: 'var(--surface)', border: '1px dashed var(--line)' }}>
            <Users size={32} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-2)' }}>
              {isKin ? 'Nta mashuri uragira' : 'No classes yet'}
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>
              {isKin ? 'Kora ishuri kugirango utangire' : 'Create a class to get started'}
            </p>
            <button onClick={() => setShowCreateClass(true)} className="btn btn-primary sm">
              {isKin ? 'Kora ishuri' : 'Create Class'}
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="thead rise">
              <div>
                <h1>{greeting(isKin)}, {(profile?.full_name ?? '').split(' ')[0] || (isKin ? 'Mwarimu' : 'Teacher')}.</h1>
                <p className="sub">
                  {needsAttention.length > 0
                    ? (isKin
                        ? `Abanyeshuri ${needsAttention.length} bakeneye kurebwa mbere y'isomo ryawe ryo uyu munsi.`
                        : `${needsAttention.length} student${needsAttention.length === 1 ? '' : 's'} need a look before today's class.`)
                    : (isKin ? 'Byose biri neza muri iri shuri.' : 'Everything looks on track in this class.')}
                </p>
              </div>
              <div className="row" style={{ gap: '12px' }}>
                <div className="classsel">
                  <select value={selectedClassId ?? ''} onChange={e => setSelectedClassId(e.target.value)}>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name} · {cls.subject}</option>
                    ))}
                  </select>
                </div>
                <div className="classsel">
                  <select value={cohortTag} onChange={e => setCohortTag(e.target.value)} title="Filter by cohort">
                    <option value="">All cohorts</option>
                    <option value="intango_t1_2026">intango_t1_2026</option>
                  </select>
                </div>
                <button className="btn btn-secondary sm" onClick={() => setShowCreateClass(true)} title={isKin ? 'Ishuri rishya' : 'New class'}>
                  <Plus size={14} />
                </button>
                <button className="btn btn-secondary sm" onClick={() => selectedClass && setAnnouncementsClass(selectedClass)} title={isKin ? 'Amatangazo' : 'Announcements'}>
                  <Megaphone size={14} />
                </button>
                <button className="btn btn-secondary sm" onClick={() => selectedClass && setAnalyticsClass(selectedClass)} title={isKin ? 'Isesengura' : 'Analytics'}>
                  <BarChart2 size={14} />
                </button>
                <button className="btn btn-secondary sm" onClick={() => setShowGradeBook(true)} title={isKin ? 'Ibitabo by\'amanota' : 'Grade Book'}>
                  <Table2 size={14} />
                </button>
                <button className="btn btn-secondary sm" onClick={() => selectedClass && setAttendanceClass(selectedClass)} title={isKin ? 'Kwandika ibyicaro' : 'Attendance'}>
                  <ClipboardCheck size={14} />
                </button>
                <button className="btn btn-primary" onClick={() => setShowCreateAssignment(true)}>
                  {isKin ? 'Umukoro mushya' : 'New assignment'}
                </button>
              </div>
            </div>

            {/* CLASS JOIN CODE */}
            {selectedClass?.invite_code && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)', width: 'fit-content' }}>
                <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
                  {isKin ? 'Kode yo kwinjira' : 'Class join code'}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text)' }}>
                  {selectedClass.invite_code}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedClass.invite_code);
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2000);
                  }}
                  className="btn btn-tertiary sm"
                  style={{ fontSize: 12, padding: '3px 10px' }}
                >
                  {codeCopied ? (isKin ? '✓ Nakopiye' : '✓ Copied') : (isKin ? 'Kopa' : 'Copy')}
                </button>
              </div>
            )}

            {/* STATS */}
            <div className="stats rise-2">
              <div className="stat">
                <div className="sl">{isKin ? 'Abanyeshuri' : 'Students'}</div>
                <div className="sv">{roster.length}</div>
                <div className="sd">{isKin ? `${activeThisWeek} bakora iki cyumweru` : `${activeThisWeek} active this week`}</div>
              </div>
              <div className="stat">
                <div className="sl">{isKin ? 'Aho ishuri rigeze' : 'Class progress'}</div>
                <div className="sv">{classProgress}%</div>
                <div className="sd">{isKin ? "impuzandengo y'ishuri" : 'class average'}</div>
              </div>
              <div className="stat">
                <div className="sl">{isKin ? 'Bitegereje gusuzumwa' : 'To review'}</div>
                <div className="sv">{pendingReview}</div>
                <div className="sd">{isKin ? 'imikoro itegereje' : 'submissions waiting'}</div>
              </div>
              <div className="stat">
                <div className="sl">{isKin ? 'Basubira inyuma' : 'Falling behind'}</div>
                <div className="sv">{fallingBehind}</div>
                <div className="sd warn">{isKin ? 'nta gikorwa mu minsi 5+' : 'no activity in 5+ days'}</div>
              </div>
              <div className="stat">
                <div className="sl">{isKin ? 'Barananiwe' : 'Stuck'}</div>
                <div className="sv" style={{ color: stuckCount > 0 ? '#f97316' : 'var(--text)' }}>{stuckCount}</div>
                <div className="sd warn">{isKin ? 'barakosa inshuro 3+ nta gutsinda' : '3+ fails, no pass on same exercise'}</div>
              </div>
            </div>

            <div className="tgrid">
              {/* ROSTER */}
              <section className="card roster rise-2">
                <div className="rhead">
                  <h3 className="card-title">{isKin ? "Abanyeshuri b'ishuri" : 'Class roster'}</h3>
                  <div className="row" style={{ gap: '8px' }}>
                    <span className="pill"><span className="dot" />{roster.length} {isKin ? 'abanyeshuri' : 'students'}</span>
                    <button className="btn btn-secondary sm" onClick={() => setShowAddStudents(true)} title={isKin ? 'Ongeraho abanyeshuri' : 'Add students'} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <UserPlus size={13} />{isKin ? 'Ongeraho' : 'Add students'}
                    </button>
                    <button className="btn btn-tertiary sm" onClick={handleExportRoster} disabled={roster.length === 0}>
                      {isKin ? 'Pakurura' : 'Roster CSV'}
                    </button>
                    <button className="btn btn-tertiary sm" onClick={handleExportEvents} disabled={liveSignals.length === 0} title={isKin ? 'Pakurura ibikorwa' : 'Export events CSV'}>
                      <Download size={13} style={{ marginRight: 4 }} />{isKin ? 'Ibikorwa' : 'Events CSV'}
                    </button>
                    <button className="btn btn-tertiary sm" onClick={handlePrintReport} disabled={roster.length === 0} title={isKin ? 'Shyira hanze raporo' : 'Print progress report'}>
                      <Download size={13} style={{ marginRight: 4 }} />{isKin ? 'Raporo' : 'Print Report'}
                    </button>
                  </div>
                </div>
                {roster.length === 0 ? (
                  <div className="py-10 text-center">
                    <Users size={28} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                      {isKin ? 'Nta munyeshuri urahari muri iri shuri' : 'No students enrolled in this class yet'}
                    </p>
                  </div>
                ) : (
                  <div className="tbl-scroll">
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>{isKin ? 'Umunyeshuri' : 'Student'}</th>
                          <th>{isKin ? 'Aho agejeje' : 'Progress'}</th>
                          <th>{isKin ? 'Ibigeragezo' : 'Challenges'}</th>
                          <th className="th-roster-opt">Mwarimu</th>
                          <th className="th-roster-opt">{isKin ? 'Igice agezeho' : 'Module'}</th>
                          <th>{isKin ? 'Igihe yagaragaye' : 'Last active'}</th>
                          <th>{isKin ? 'Imiterere' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRoster.map(s => (
                          <tr
                            key={s.student_id}
                            onClick={() => setSelectedRosterStudent(s)}
                            style={{ cursor: 'pointer' }}
                            title={isKin ? 'Reba umwirondoro w\'umunyeshuri' : "View student's AI profile"}
                          >
                            <td>
                              <div className="stu">
                                <span className="av">{initials(s.full_name)}</span>
                                <div>
                                  <div className="nm">{s.full_name}</div>
                                  <div className="un">{s.username}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="pcell">
                                <div className="bar"><i style={{ width: `${s.progress_pct}%` }} /></div>
                                <span className="pv">{s.progress_pct}%</span>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
                                {s.challenges_passed}
                                {s.challenges_attempted > 0 && (
                                  <span style={{ color: 'var(--text-3)' }}>/{s.challenges_attempted}</span>
                                )}
                              </span>
                            </td>
                            <td className="td-roster-opt">
                              <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 13, color: s.ai_interactions > 0 ? 'var(--text-2)' : 'var(--text-3)' }}>
                                {s.ai_interactions > 0 ? `${s.ai_interactions}×` : '—'}
                              </span>
                            </td>
                            <td className="td-roster-opt td-module" title={s.current_module}>{s.current_module}</td>
                            <td><span className="when">{formatRelativeTime(s.last_active, isKin)}</span></td>
                            <td><StatusPill status={s.status} isKin={isKin} isStuck={signalMap.get(s.student_id)?.is_stuck} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* SIDE */}
              <aside className="stack" style={{ ['--gap' as string]: '22px' }}>
                <section className="card pad-lg rise-3">
                  <div className="card-head">
                    <h3 className="card-title">{isKin ? 'Abakeneye kurebwa' : 'Needs attention'}</h3>
                    {needsAttention.length > 0 && <span className="pill error">{needsAttention.length}</span>}
                  </div>
                  {needsAttention.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                      {isKin ? 'Nta munyeshuri ukeneye kurebwa ubu.' : 'No students need attention right now.'}
                    </p>
                  ) : (
                    needsAttention.map(s => (
                      <div className="att-item" key={s.student_id}>
                        <span className="av">{initials(s.full_name)}</span>
                        <div className="ab">
                          <div className="t">{s.full_name}</div>
                          <div className="d">{attentionNote(s, isKin)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </section>

                <section className="card pad-lg rise-3">
                  <div className="card-head">
                    <h3 className="card-title">{isKin ? 'Imikoro' : 'Assignments'}</h3>
                    <button className="btn btn-tertiary sm" onClick={() => setShowCreateAssignment(true)}>
                      {isKin ? 'Ongeraho' : 'New'}
                    </button>
                  </div>
                  {assignments.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                      {isKin ? 'Nta mukoro urahari muri iri shuri' : 'No assignments in this class yet'}
                    </p>
                  ) : (
                    assignments.map(a => (
                      <div className="asg" key={a.id} onClick={() => setViewingAssignment(a)} style={{ cursor: 'pointer', opacity: a.is_published ? 1 : 0.7 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="at" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isKin && a.title_kin ? a.title_kin : a.title}
                            {!a.is_published && (
                              <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 99, background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--text-3)' }}>
                                DRAFT
                              </span>
                            )}
                          </div>
                          <div className="ad">{dueText(a, isKin)}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                          <button
                            className="btn btn-tertiary sm"
                            style={{ fontSize: 11, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                            title={a.is_published ? 'Unpublish (hide from students)' : 'Publish to students'}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await toggleAssignmentPublished(a.id, !a.is_published);
                              loadData();
                            }}
                          >
                            {a.is_published ? <EyeOff size={11} /> : <Eye size={11} />}
                            {a.is_published ? (isKin ? 'Hisha' : 'Unpublish') : (isKin ? 'Tangaza' : 'Publish')}
                          </button>
                          {a.grades_released ? (
                            <span className="pill solid"><span className="dot" />{isKin ? 'Byasuzumwe' : 'Graded'}</span>
                          ) : a.is_published ? (
                            <span className="pill">{submissionCounts[a.id] ?? 0} / {roster.length} {isKin ? 'batanze' : 'in'}</span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </section>

                {/* AI CLASS SUMMARY */}
                {roster.length > 0 && (
                  <section className="card pad-lg rise-3">
                    <div className="card-head" style={{ marginBottom: 12 }}>
                      <h3 className="card-title">{isKin ? 'Isuzuma rya AI ry\'itorero' : 'AI Class Summary'}</h3>
                      {classSummary ? (
                        <button
                          onClick={() => { setClassSummary(null); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 12 }}
                        >
                          {isKin ? 'Subiramo' : 'Refresh'}
                        </button>
                      ) : (
                        <button
                          onClick={handleGenerateClassSummary}
                          disabled={classSummaryLoading}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '4px 10px', borderRadius: 'var(--radius)',
                            background: 'var(--surface)', border: '1px solid var(--line)',
                            color: 'var(--text-2)', fontSize: 12, cursor: 'pointer',
                            opacity: classSummaryLoading ? 0.7 : 1,
                          }}
                        >
                          {classSummaryLoading
                            ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} />
                            : <Sparkles size={11} />}
                          {isKin ? 'Tanga' : 'Generate'}
                        </button>
                      )}
                    </div>

                    {classSummaryError && (
                      <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                        {isKin ? 'Habaye ikosa. Gerageza nanone.' : 'Could not generate summary. Try again.'}
                      </p>
                    )}

                    {classSummary ? (
                      <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65, whiteSpace: 'pre-wrap', margin: 0 }}>
                        {classSummary}
                      </p>
                    ) : !classSummaryError && (
                      <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                        {isKin
                          ? 'Kanda "Tanga" kugira ngo AI isuzume abo muri itorero ryose.'
                          : 'Click "Generate" to get an AI-written narrative of your entire class\'s current status.'}
                      </p>
                    )}
                  </section>
                )}

                {/* MWARIMU ACCURACY EVAL */}
                <section className="card pad-lg rise-3">
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <h3 className="card-title">Mwarimu accuracy</h3>
                    <button className="btn btn-tertiary sm" onClick={() => setShowMwarimuEval(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={13} /> Test Mwarimu
                    </button>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55 }}>
                    Rate Mwarimu's responses on real JavaScript errors to measure feedback accuracy. Enter any error message and code, then mark the response as accurate, partial, or inaccurate.
                  </p>
                </section>

                {/* PILOT FEEDBACK */}
                {ratingsSummary !== null && (
                  <section className="card pad-lg rise-3">
                    <div className="card-head" style={{ marginBottom: 14 }}>
                      <h3 className="card-title">{isKin ? 'Ibitekerezo by\'abanyeshuri' : 'Pilot feedback'}</h3>
                      <span className="pill">{ratingsSummary.totalResponses} {isKin ? 'igisubizo' : 'responses'}</span>
                    </div>
                    {ratingsSummary.totalResponses === 0 ? (
                      <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                        {isKin ? 'Nta bitekerezo byakiriwe.' : 'No feedback collected yet.'}
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Avg difficulty */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>
                            {isKin ? 'Uburemere bw\'isomo' : 'Avg difficulty'}
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                            {ratingsSummary.avgDifficulty ?? '—'} / 5
                          </span>
                        </div>
                        {/* Mwarimu used */}
                        {ratingsSummary.mwarimuUsedPct !== null && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>
                              {isKin ? 'Bakoresheje Mwarimu' : 'Used Mwarimu'}
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                              {ratingsSummary.mwarimuUsedPct}%
                            </span>
                          </div>
                        )}
                        {/* Mwarimu helped */}
                        {ratingsSummary.mwarimuHelpedPct !== null && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>
                              {isKin ? 'Mwarimu yabafashije' : 'Mwarimu helped'}
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: ratingsSummary.mwarimuHelpedPct >= 70 ? 'var(--success, #22c55e)' : 'var(--text)', fontFamily: 'var(--mono)' }}>
                              {ratingsSummary.mwarimuHelpedPct}%
                            </span>
                          </div>
                        )}
                        {/* Language split */}
                        {ratingsSummary.kinPct !== null && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>
                              {isKin ? 'Bakoresheje Ikinyarwanda' : 'Used Kinyarwanda'}
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
                              {ratingsSummary.kinPct}%
                            </span>
                          </div>
                        )}
                        {/* Type breakdown */}
                        <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 4, borderTop: '1px solid var(--line)', paddingTop: 10, display: 'flex', gap: 16 }}>
                          <span>{isKin ? 'Amasomo' : 'Lessons'}: {ratingsSummary.lessonCount}</span>
                          <span>{isKin ? 'Ibigeragezo' : 'Challenges'}: {ratingsSummary.challengeCount}</span>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* COMPETENCY */}
                <section className="card pad-lg rise-3">
                  <div className="card-head" style={{ marginBottom: 14 }}>
                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Activity size={14} style={{ color: 'var(--text-3)' }} />
                      {isKin ? 'Ubushobozi' : 'Competency'}
                    </h3>
                    {cohortTag && <span className="pill" style={{ fontSize: 11 }}>{cohortTag}</span>}
                  </div>
                  <CompetencyPanel rows={competency} isKin={isKin} />
                </section>
              </aside>
            </div>
          </>
        )}
      </div>

      {showCreateClass && (
        <CreateClassModal
          language={language}
          onClose={() => setShowCreateClass(false)}
          onCreate={(cls) => {
            setClasses(prev => [{ ...cls, studentCount: 0, assignmentCount: 0 }, ...prev]);
            setSelectedClassId(cls.id);
            setShowCreateClass(false);
          }}
        />
      )}

      {showCreateAssignment && classes.length > 0 && (
        <CreateAssignmentModal
          language={language}
          classes={classes}
          onClose={() => setShowCreateAssignment(false)}
          onCreate={() => {
            setShowCreateAssignment(false);
            loadData();
          }}
        />
      )}

      {viewingAssignment && (
        <SubmissionsPanel
          assignment={viewingAssignment}
          language={language}
          onClose={() => setViewingAssignment(null)}
        />
      )}

      {announcementsClass && (
        <AnnouncementsModal
          cls={announcementsClass}
          language={language}
          onClose={() => setAnnouncementsClass(null)}
        />
      )}

      {analyticsClass && (
        <ClassAnalyticsModal
          cls={analyticsClass}
          language={language}
          onClose={() => setAnalyticsClass(null)}
        />
      )}

      {selectedRosterStudent && selectedClassId && (
        <StudentProfileModal
          student={selectedRosterStudent}
          classId={selectedClassId}
          language={language}
          onClose={() => setSelectedRosterStudent(null)}
        />
      )}

      {showMwarimuEval && (
        <MwarimuEvalModal onClose={() => setShowMwarimuEval(false)} />
      )}

      {showGradeBook && selectedClassId && selectedClass && (
        <GradeBookModal
          classId={selectedClassId}
          className={selectedClass.name}
          onClose={() => setShowGradeBook(false)}
          onViewSubmission={(a) => {
            setShowGradeBook(false);
            setViewingAssignment(a);
          }}
        />
      )}

      {attendanceClass && (
        <AttendanceModal
          cls={attendanceClass}
          language={language}
          onClose={() => setAttendanceClass(null)}
        />
      )}

      {showAddStudents && selectedClass && (
        <AddStudentsModal
          cls={selectedClass}
          language={language}
          onClose={() => { setShowAddStudents(false); loadData(); }}
        />
      )}
    </div>
  );
}
