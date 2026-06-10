import { useState, useEffect } from 'react';
import { Users, Plus, Copy, Check, X, ChevronDown, BookOpen, Code2, Loader, Trophy, Medal, Megaphone, Pin, Trash2, BarChart2, AlertCircle, Download } from 'lucide-react';
import { AppNav } from './components/AppNav';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../lib/auth';
import {
  createClass, getTeacherClasses, getClassAssignments, createAssignment, getClassStudentCount,
  getAssignmentSubmissions, getAssignmentSubmissionCounts, gradeSubmission, releaseGrades, getClassLeaderboard,
  getClassAnalytics, getClassGradesExport, getClassRoster, getClassPendingReviewCount,
  createAnnouncement, getClassAnnouncements, deleteAnnouncement,
  type Class, type Assignment, type Question, type Submission, type LeaderboardEntry, type Announcement, type ClassAnalytics, type RosterStudent
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { data, error } = await createClass(name.trim(), subject);
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
            <label className="label">{isKin ? 'Izina ry’Ishuri' : 'Class Name'}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isKin ? 'Urugero: JS Level 3 - IPRC Kigali' : 'e.g. JS Level 3 - IPRC Kigali'}
              className="input"
            />
          </div>

          <div className="field">
            <label className="label">{isKin ? 'Isomo' : 'Subject'}</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="select"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="HTML & CSS">HTML &amp; CSS</option>
              <option value="Python">Python</option>
              <option value="Web Development">Web Development</option>
            </select>
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
              {isKin ? 'Hitamo ubwoko bw’umukoro:' : 'Choose the type of assignment:'}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {([
                { value: 'theoretical', icon: <BookOpen size={28} />, label: isKin ? 'Ibibazo by’inyandiko' : 'Theoretical', desc: isKin ? 'Ibibazo by’inyandiko abanyeshuri basubiza mu magambo' : 'Written questions students answer in text' },
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
                <label className="label">{isKin ? 'Urwego rw’ingorabahizi' : 'Difficulty'}</label>
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
              <label className="label">{isKin ? 'Uburemere bw’amanota (%)' : 'Grade Weight (%)'}</label>
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
                    {isKin ? '🔒 Uburyo bw’Ikizamini (Exam Mode)' : '🔒 Exam Mode'}
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
                {loading ? <Loader size={16} className="animate-spin" /> : (isKin ? 'Tangaza' : 'Publish')}
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
    const { error } = await createAnnouncement({ classId: cls.id, title: title.trim(), body: body.trim(), pinned });
    if (error) { setPostError(error); setPosting(false); return; }
    setTitle(''); setBody(''); setPinned(false);
    setTab('list');
    setLoading(true);
    load();
    setPosting(false);
  };

  const handleDelete = async (id: string) => {
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
                                  style={{ width: `${(d.count / totalDist) * 100}%`, background: 'var(--text-3)', opacity: 0.8 }}
                                  title={`${d.label}: ${d.count} student${d.count !== 1 ? 's' : ''}`} />
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {a.dist.map(d => (
                                <div key={d.label} className="flex items-center gap-1">
                                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--text-3)' }} />
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

// ─── Class Card ────────────────────────────────────────────────────────────────

function ClassCard({ cls, language, onAnnouncements, onAnalytics }: { cls: Class & { studentCount?: number; assignmentCount?: number }; language: 'EN' | 'KIN'; onAnnouncements: () => void; onAnalytics: () => void }) {
  const isKin = language === 'KIN';
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(cls.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>{cls.name}</h3>
          <p className="text-xs" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>{cls.subject}</p>
        </div>
        <div className="flex gap-3 text-center">
          <div>
            <p className="text-lg font-bold" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>{cls.studentCount ?? 0}</p>
            <p className="text-xs" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>{isKin ? 'Abanyeshuri' : 'Students'}</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>{cls.assignmentCount ?? 0}</p>
            <p className="text-xs" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>{isKin ? 'Imikoro yose' : 'Assignments'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)' }}>
        <div>
          <p className="text-xs mb-0.5" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Kode yo kwinjira' : 'Invite Code'}
          </p>
          <p className="text-lg font-bold tracking-widest" style={{ color: '#00d4aa', fontFamily: 'monospace' }}>{cls.invite_code}</p>
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: copied ? 'rgba(0,212,170,0.2)' : 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)', fontFamily: 'Inter, sans-serif' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? (isKin ? 'Byakopewe!' : 'Copied!') : (isKin ? 'Kopeya' : 'Copy')}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={e => { e.stopPropagation(); onAnalytics(); }}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(0,212,170,0.08)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.18)', fontFamily: 'Inter, sans-serif' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.08)')}
        >
          <BarChart2 size={13} />
          {isKin ? 'Isesengura' : 'Analytics'}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onAnnouncements(); }}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.18)', fontFamily: 'Inter, sans-serif' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.08)')}
        >
          <Megaphone size={13} />
          {isKin ? 'Amatangazo' : 'Announcements'}
        </button>
      </div>
    </div>
  );
}

// ─── Assignment Row ────────────────────────────────────────────────────────────

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

// ─── Assignment Row ────────────────────────────────────────────────────────────

function AssignmentRow({ assignment, submissionCount, language, onClick }: {
  assignment: Assignment;
  submissionCount: number;
  language: 'EN' | 'KIN';
  onClick: () => void;
}) {
  const isKin = language === 'KIN';
  const diffColors: Record<string, string> = { beginner: '#00d4aa', intermediate: '#f59e0b', advanced: '#8b5cf6' };
  const typeColor = assignment.assignment_type === 'theoretical'
    ? { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa', border: 'rgba(139,92,246,0.2)' }
    : { bg: 'rgba(0,212,170,0.1)', text: '#00d4aa', border: 'rgba(0,212,170,0.2)' };
  const title = isKin ? (assignment.title_kin || assignment.title) : assignment.title;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 py-3 px-4 rounded-xl transition-all text-left"
      style={{ borderBottom: '1px solid var(--ec-b3)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--ec-b6)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Type icon */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: typeColor.bg, border: `1px solid ${typeColor.border}` }}>
        {assignment.assignment_type === 'theoretical' ? <BookOpen size={14} style={{ color: typeColor.text }} /> : <Code2 size={14} style={{ color: typeColor.text }} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>{title}</p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,212,170,0.08)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.15)', fontFamily: 'Inter, sans-serif' }}>
            {submissionCount} {isKin ? 'byatanzwe' : submissionCount === 1 ? 'submission' : 'submissions'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: typeColor.bg, color: typeColor.text, border: `1px solid ${typeColor.border}`, fontFamily: 'Inter, sans-serif' }}>
            {assignment.assignment_type === 'theoretical' ? (isKin ? 'Inyandiko (Theory)' : 'Theory') : 'Code'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ color: diffColors[assignment.difficulty], background: `${diffColors[assignment.difficulty]}18`, border: `1px solid ${diffColors[assignment.difficulty]}30`, fontFamily: 'Inter, sans-serif' }}>
            {assignment.difficulty}
          </span>
          {assignment.due_date && (
            <span className="text-xs" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
              · {isKin ? 'Itariki ntarengwa' : 'Due'}: {new Date(assignment.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

function Leaderboard({ classId, language }: { classId: string; language: 'EN' | 'KIN' }) {
  const isKin = language === 'KIN';
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClassLeaderboard(classId).then(data => { setEntries(data); setLoading(false); });
  }, [classId]);

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={14} style={{ color: '#f59e0b' }} />;
    if (rank === 2) return <Medal size={14} style={{ color: 'var(--ec-text-4)' }} />;
    if (rank === 3) return <Medal size={14} style={{ color: '#cd7c2e' }} />;
    return <span className="text-xs font-bold" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>#{rank}</span>;
  };

  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--ec-surface)', border: '1px solid var(--ec-b1)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={16} style={{ color: '#f59e0b' }} />
        <h2 className="text-base font-bold" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>
          {isKin ? 'Urutonde rw\'amanota mu ishuri' : 'Class Leaderboard'}
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-6"><Loader size={18} className="animate-spin" style={{ color: '#00d4aa' }} /></div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-center py-6" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>
          {isKin ? 'Nta manota arahagaragara' : 'No grades yet'}
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => {
            const initials = e.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const isTop = e.rank <= 3;
            return (
              <div key={e.student_id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: isTop ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)', border: isTop ? '1px solid rgba(245,158,11,0.12)' : '1px solid var(--ec-b3)' }}>
                <div className="w-6 flex items-center justify-center shrink-0">{rankIcon(e.rank)}</div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
                  {initials}
                </div>
                <p className="flex-1 text-sm font-semibold truncate" style={{ color: 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>{e.full_name}</p>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ color: isTop ? '#f59e0b' : 'var(--ec-text-1)', fontFamily: 'Inter, sans-serif' }}>
                    {e.total_marks_earned} pts
                  </p>
                  {e.submissions_graded > 0 && (
                    <p className="text-xs" style={{ color: 'var(--ec-text-6)', fontFamily: 'Inter, sans-serif' }}>{e.percentage}%</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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

function StatusPill({ status, isKin }: { status: RosterStudent['status']; isKin: boolean }) {
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

function dueText(assignment: Assignment, isKin: boolean): string {
  if (!assignment.due_date) return isKin ? 'Nta gihe ntarengwa' : 'No due date';
  const diffDays = Math.ceil((new Date(assignment.due_date).getTime() - Date.now()) / 86400000);
  const dateStr = new Date(assignment.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (diffDays < 0) return isKin ? `Byafunzwe ${dateStr}` : `Closed ${dateStr}`;
  if (diffDays === 0) return isKin ? 'Bigomba kuba uyu munsi' : 'Due today';
  if (diffDays === 1) return isKin ? 'Bigomba kuba ejo' : 'Due tomorrow';
  return isKin ? `Bigomba kuba ${dateStr}` : `Due ${dateStr}`;
}

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
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);
  const [announcementsClass, setAnnouncementsClass] = useState<Class | null>(null);
  const [analyticsClass, setAnalyticsClass] = useState<Class | null>(null);
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [pendingReview, setPendingReview] = useState(0);
  const { profile } = useAuth();

  const loadData = async () => {
    setLoadingData(true);
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
      const [counts, rosterData, pending] = await Promise.all([
        getAssignmentSubmissionCounts(aData.map(a => a.id)),
        getClassRoster(targetId),
        getClassPendingReviewCount(targetId),
      ]);
      setSubmissionCounts(counts);
      setRoster(rosterData);
      setPendingReview(pending);
    }

    setLoadingData(false);
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedClassId) return;
    getClassAssignments(selectedClassId).then(async ({ data }) => {
      setAssignments(data);
      const [counts, rosterData, pending] = await Promise.all([
        getAssignmentSubmissionCounts(data.map(a => a.id)),
        getClassRoster(selectedClassId),
        getClassPendingReviewCount(selectedClassId),
      ]);
      setSubmissionCounts(counts);
      setRoster(rosterData);
      setPendingReview(pending);
    });
  }, [selectedClassId]);

  const selectedClass = classes.find(c => c.id === selectedClassId) ?? null;
  const activeThisWeek = roster.filter(s => s.last_active && (Date.now() - new Date(s.last_active).getTime()) < 7 * 86400000).length;
  const classProgress = roster.length > 0 ? Math.round(roster.reduce((sum, s) => sum + s.progress_pct, 0) / roster.length) : 0;
  const fallingBehind = roster.filter(s => s.status === 'behind').length;
  const needsAttention = [...roster]
    .filter(s => s.status !== 'on-track')
    .sort((a, b) => (a.status !== b.status ? (a.status === 'behind' ? -1 : 1) : a.progress_pct - b.progress_pct))
    .slice(0, 3);

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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNav />

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
                <button className="btn btn-secondary sm" onClick={() => setShowCreateClass(true)} title={isKin ? 'Ishuri rishya' : 'New class'}>
                  <Plus size={14} />
                </button>
                <button className="btn btn-secondary sm" onClick={() => selectedClass && setAnnouncementsClass(selectedClass)} title={isKin ? 'Amatangazo' : 'Announcements'}>
                  <Megaphone size={14} />
                </button>
                <button className="btn btn-secondary sm" onClick={() => selectedClass && setAnalyticsClass(selectedClass)} title={isKin ? 'Isesengura' : 'Analytics'}>
                  <BarChart2 size={14} />
                </button>
                <button className="btn btn-primary" onClick={() => setShowCreateAssignment(true)}>
                  {isKin ? 'Umukoro mushya' : 'New assignment'}
                </button>
              </div>
            </div>

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
            </div>

            <div className="tgrid">
              {/* ROSTER */}
              <section className="card roster rise-2">
                <div className="rhead">
                  <h3 className="card-title">{isKin ? "Abanyeshuri b'ishuri" : 'Class roster'}</h3>
                  <div className="row" style={{ gap: '8px' }}>
                    <span className="pill"><span className="dot" />{roster.length} {isKin ? 'abanyeshuri' : 'students'}</span>
                    <button className="btn btn-tertiary sm" onClick={handleExportRoster} disabled={roster.length === 0}>
                      {isKin ? 'Pakurura' : 'Export'}
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
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>{isKin ? 'Umunyeshuri' : 'Student'}</th>
                        <th>{isKin ? 'Aho agejeje' : 'Course progress'}</th>
                        <th>{isKin ? 'Igice agezeho' : 'Current module'}</th>
                        <th>{isKin ? 'Igihe yagaragaye' : 'Last active'}</th>
                        <th>{isKin ? 'Imiterere' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roster.map(s => (
                        <tr key={s.student_id}>
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
                          <td>{s.current_module}</td>
                          <td><span className="when">{formatRelativeTime(s.last_active, isKin)}</span></td>
                          <td><StatusPill status={s.status} isKin={isKin} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    assignments.slice(0, 4).map(a => (
                      <div className="asg" key={a.id} onClick={() => setViewingAssignment(a)} style={{ cursor: 'pointer' }}>
                        <div>
                          <div className="at">{isKin && a.title_kin ? a.title_kin : a.title}</div>
                          <div className="ad">{dueText(a, isKin)}</div>
                        </div>
                        {a.grades_released ? (
                          <span className="pill solid"><span className="dot" />{isKin ? 'Byasuzumwe' : 'Graded'}</span>
                        ) : (
                          <span className="pill">{submissionCounts[a.id] ?? 0} / {roster.length} {isKin ? 'batanze' : 'in'}</span>
                        )}
                      </div>
                    ))
                  )}
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
    </div>
  );
}
