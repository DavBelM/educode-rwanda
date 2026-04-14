import { useState, useEffect } from 'react';
import { Users, FileText, Plus, Copy, Check, X, ChevronDown, BookOpen, Code2, Loader, Trophy, Medal, Megaphone, Pin, Trash2 } from 'lucide-react';
import { Header } from './components/Header';
import {
  createClass, getTeacherClasses, getClassAssignments, createAssignment, getClassStudentCount,
  getAssignmentSubmissions, getAssignmentSubmissionCounts, gradeSubmission, getClassLeaderboard,
  createAnnouncement, getClassAnnouncements, deleteAnnouncement,
  type Class, type Assignment, type Question, type Submission, type LeaderboardEntry, type Announcement
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
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Kora Ishuri Rishya' : 'Create New Class'}
          </h2>
          <button onClick={onClose} style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
              {isKin ? 'Izina ry\'Ishuri' : 'Class Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isKin ? 'Urugero: JS Level 3 - Ishuri IPRC Kigali' : 'e.g. JS Level 3 - IPRC Kigali'}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
              style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
              onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
              onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
              {isKin ? 'Isomo' : 'Subject'}
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
              style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="HTML & CSS">HTML &amp; CSS</option>
              <option value="Python">Python</option>
              <option value="Web Development">Web Development</option>
            </select>
          </div>

          {error && (
            <p className="text-sm p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Reka' : 'Cancel'}
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#00d4aa', color: '#0d0f14', fontFamily: 'Inter, sans-serif' }}
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
    });
    if (error) { setError(error); setLoading(false); return; }
    onCreate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
              {isKin ? 'Kora Umushinga Mushya' : 'Create New Assignment'}
            </h2>
            <button onClick={onClose} style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
              <X size={20} />
            </button>
          </div>

          {step === 'type' ? (
            <>
              <p className="text-sm mb-5" style={{ color: '#64748b', fontFamily: 'Inter, sans-serif' }}>
                {isKin ? 'Hitamo ubwoko bw\'umushinga:' : 'Choose the type of assignment:'}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {([
                  { value: 'theoretical', icon: <BookOpen size={28} />, label: isKin ? 'Ibibazo bya Inyandiko' : 'Theoretical', desc: isKin ? 'Ibibazo by\'inyandiko abanyeshuri baza mu magambo' : 'Written questions students answer in text', color: '#8b5cf6' },
                  { value: 'coding', icon: <Code2 size={28} />, label: isKin ? 'Umushinga wa Code' : 'Coding', desc: isKin ? 'Abanyeshuri bandika kode kandi bayigerageza' : 'Students write and run JavaScript code', color: '#00d4aa' },
                ] as const).map(type => (
                  <button
                    key={type.value}
                    onClick={() => setAssignmentType(type.value)}
                    className="p-5 rounded-xl text-left transition-all"
                    style={{
                      background: assignmentType === type.value ? `rgba(${type.color === '#8b5cf6' ? '139,92,246' : '0,212,170'},0.08)` : 'rgba(255,255,255,0.02)',
                      border: assignmentType === type.value ? `1px solid ${type.color}50` : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="mb-3" style={{ color: assignmentType === type.value ? type.color : '#475569' }}>{type.icon}</div>
                    <p className="text-sm font-bold mb-1" style={{ color: assignmentType === type.value ? '#f1f5f9' : '#94a3b8', fontFamily: 'Inter, sans-serif' }}>{type.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>{type.desc}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('form')}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: '#00d4aa', color: '#0d0f14', fontFamily: 'Inter, sans-serif' }}
              >
                {isKin ? 'Komeza' : 'Continue'}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              {/* Class selector */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Ishuri' : 'Class'}
                </label>
                <div className="relative">
                  <select
                    value={classId}
                    onChange={e => setClassId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none appearance-none"
                    style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  >
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
                </div>
              </div>

              {/* Title EN */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Umutwe (Icyongereza)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={isKin ? 'Urugero: Introduction to Variables' : 'e.g. Introduction to Variables'}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
              </div>

              {/* Title KIN */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Umutwe (Ikinyarwanda)' : 'Title (Kinyarwanda)'}
                </label>
                <input
                  type="text"
                  value={titleKin}
                  onChange={e => setTitleKin(e.target.value)}
                  placeholder={isKin ? 'Urugero: Intangiriro ya Variables' : 'e.g. Intangiriro ya Variables'}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Ibisobanuro (Icyongereza)' : 'Instructions (English)'}
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={isKin ? 'Sobanura umushinga...' : 'Describe what students should do...'}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                  style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
              </div>

              {/* Description KIN */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Ibisobanuro (Ikinyarwanda)' : 'Instructions (Kinyarwanda)'}
                </label>
                <textarea
                  value={descriptionKin}
                  onChange={e => setDescriptionKin(e.target.value)}
                  placeholder={isKin ? 'Sobanura umushinga mu Kinyarwanda...' : 'Instructions in Kinyarwanda...'}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                  style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
              </div>

              {/* Total Marks */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Amanota Yose (urugero: /20)' : 'Total Marks (e.g. /20)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={totalMarks}
                  onChange={e => setTotalMarks(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
              </div>

              {/* Difficulty + Due date row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                    {isKin ? 'Urwego' : 'Difficulty'}
                  </label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as typeof difficulty)}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none appearance-none"
                    style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="beginner">{isKin ? 'Intangiriro' : 'Beginner'}</option>
                    <option value="intermediate">{isKin ? 'Hagati' : 'Intermediate'}</option>
                    <option value="advanced">{isKin ? 'Ufite Ubunararibonye' : 'Advanced'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                    {isKin ? 'Itariki yo Kurangiza' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif', colorScheme: 'dark' }}
                    onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                    onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                  />
                </div>
              </div>

              {/* Questions (theoretical only) */}
              {assignmentType === 'theoretical' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                      {isKin ? 'Ibibazo' : 'Questions'}
                    </label>
                    <button onClick={addQuestion} className="flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: '#00d4aa', fontFamily: 'Inter, sans-serif' }}>
                      <Plus size={14} />
                      {isKin ? 'Ongeraho Ikibazo' : 'Add Question'}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {questions.map((q, i) => (
                      <div key={q.id} className="rounded-xl p-4" style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold uppercase" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                            {isKin ? `Ikibazo ${i + 1}` : `Q${i + 1}`}
                          </span>
                          {questions.length > 1 && (
                            <button onClick={() => removeQuestion(q.id)} style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={q.text}
                          onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                          placeholder={isKin ? 'Ikibazo mu Cyongereza...' : 'Question in English...'}
                          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none mb-2"
                          style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                        />
                        <input
                          type="text"
                          value={q.text_kin}
                          onChange={e => updateQuestion(q.id, 'text_kin', e.target.value)}
                          placeholder={isKin ? 'Ikibazo mu Kinyarwanda...' : 'Question in Kinyarwanda...'}
                          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                          style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontFamily: 'Inter, sans-serif' }}>
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('type')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Subira Inyuma' : 'Back'}
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!title.trim() || !classId || loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: '#00d4aa', color: '#0d0f14', fontFamily: 'Inter, sans-serif' }}
                >
                  {loading ? <Loader size={16} className="animate-spin" /> : (isKin ? 'Tangaza' : 'Publish')}
                </button>
              </div>
            </div>
          )}
        </div>
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
      <div className="w-full max-w-lg rounded-2xl flex flex-col" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '80vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Megaphone size={16} style={{ color: '#f59e0b' }} />
            <div>
              <h2 className="text-base font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
                {isKin ? 'Inyandiko z\'Umwarimu' : 'Announcements'}
              </h2>
              <p className="text-xs" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>{cls.name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pt-4 gap-2">
          {(['list', 'new'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: tab === t ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: tab === t ? '#f59e0b' : '#475569',
                border: tab === t ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {t === 'list' ? (isKin ? 'Reba' : 'View All') : (isKin ? 'Shyiraho Rishya' : 'Post New')}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 flex-1">
          {tab === 'list' ? (
            loading ? (
              <div className="flex justify-center py-10">
                <Loader size={18} className="animate-spin" style={{ color: '#f59e0b' }} />
              </div>
            ) : announcements.length === 0 ? (
              <div className="py-10 text-center">
                <Megaphone size={28} className="mx-auto mb-3" style={{ color: '#334155' }} />
                <p className="text-sm" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Nta nyandiko zihari' : 'No announcements yet'}
                </p>
                <button
                  onClick={() => setTab('new')}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', fontFamily: 'Inter, sans-serif' }}
                >
                  {isKin ? 'Tangaza ubutumwa' : 'Post first announcement'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="rounded-xl p-4" style={{ background: a.pinned ? 'rgba(245,158,11,0.05)' : '#1a1e2a', border: a.pinned ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {a.pinned && <Pin size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />}
                        <p className="text-sm font-semibold truncate" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{a.title}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deleting === a.id}
                        style={{ color: '#475569', flexShrink: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                      >
                        {deleting === a.id ? <Loader size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif', whiteSpace: 'pre-wrap' }}>{a.body}</p>
                    <p className="text-xs" style={{ color: '#334155', fontFamily: 'Inter, sans-serif' }}>
                      {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Umutwe' : 'Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={isKin ? 'Urugero: Isomo rya ejo hazaza rihagaritswe' : 'e.g. Tomorrow\'s class is cancelled'}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(245,158,11,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Ubutumwa' : 'Message'}
                </label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={5}
                  placeholder={isKin ? 'Andika ubutumwa hano...' : 'Write your message here...'}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                  style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                  onFocus={e => (e.target.style.border = '1px solid rgba(245,158,11,0.4)')}
                  onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.08)')}
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setPinned(p => !p)}
                  className="w-4 h-4 rounded flex items-center justify-center transition-all"
                  style={{ background: pinned ? '#f59e0b' : 'transparent', border: pinned ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)' }}
                >
                  {pinned && <Check size={10} style={{ color: '#0d0f14' }} />}
                </div>
                <span className="text-xs font-medium" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                  {isKin ? 'Shyira hejuru (pinned)' : 'Pin to top'}
                </span>
              </label>
              {postError && (
                <p className="text-xs p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontFamily: 'Inter, sans-serif' }}>
                  {postError}
                </p>
              )}
              <button
                onClick={handlePost}
                disabled={!title.trim() || !body.trim() || posting}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                style={{ background: '#f59e0b', color: '#0d0f14', fontFamily: 'Inter, sans-serif' }}
              >
                {posting ? <Loader size={16} className="animate-spin" /> : <Megaphone size={15} />}
                {isKin ? 'Tangaza' : 'Post Announcement'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Invite Code Card ──────────────────────────────────────────────────────────

function ClassCard({ cls, language, onAnnouncements }: { cls: Class & { studentCount?: number; assignmentCount?: number }; language: 'EN' | 'KIN'; onAnnouncements: () => void }) {
  const isKin = language === 'KIN';
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(cls.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold mb-0.5" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{cls.name}</h3>
          <p className="text-xs" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>{cls.subject}</p>
        </div>
        <div className="flex gap-3 text-center">
          <div>
            <p className="text-lg font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{cls.studentCount ?? 0}</p>
            <p className="text-xs" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>{isKin ? 'Abanyeshuri' : 'Students'}</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{cls.assignmentCount ?? 0}</p>
            <p className="text-xs" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>{isKin ? 'Imishinga' : 'Assignments'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)' }}>
        <div>
          <p className="text-xs mb-0.5" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
            {isKin ? 'Kode yo Kwinjira' : 'Invite Code'}
          </p>
          <p className="text-lg font-bold tracking-widest" style={{ color: '#00d4aa', fontFamily: 'monospace' }}>{cls.invite_code}</p>
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: copied ? 'rgba(0,212,170,0.2)' : 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.25)', fontFamily: 'Inter, sans-serif' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? (isKin ? 'Nakopiwemo!' : 'Copied!') : (isKin ? 'Kopi' : 'Copy')}
        </button>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onAnnouncements(); }}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
        style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.18)', fontFamily: 'Inter, sans-serif' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.15)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.08)')}
      >
        <Megaphone size={13} />
        {isKin ? 'Inyandiko' : 'Announcements'}
      </button>
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
  const [grading, setGrading] = useState<Record<string, boolean>>({});
  const [gradeError, setGradeError] = useState<Record<string, string>>({});

  useEffect(() => {
    getAssignmentSubmissions(assignment.id).then(({ data }) => {
      setSubmissions(data);
      // Pre-fill mark inputs from already-graded submissions
      const prefilled: Record<string, string> = {};
      for (const s of data) {
        if (s.marks_earned !== null && s.marks_earned !== undefined) {
          prefilled[s.id] = String(s.marks_earned);
        }
      }
      setMarkInputs(prefilled);
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
    const { error } = await gradeSubmission(subId, val);
    if (error) {
      setGradeError(prev => ({ ...prev, [subId]: error }));
    } else {
      setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, marks_earned: val } : s));
    }
    setGrading(prev => ({ ...prev, [subId]: false }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{title}</h2>
            <p className="text-xs mt-0.5" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
              {submissions.length} {isKin ? 'byatanzwe' : 'submission(s)'}
            </p>
          </div>
          <button onClick={onClose} style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader size={20} className="animate-spin" style={{ color: '#00d4aa' }} />
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                {isKin ? 'Nta nyandiko zatanzwe' : 'No submissions yet'}
              </p>
            </div>
          ) : submissions.map(sub => {
            const studentName = (sub.profiles as { full_name: string } | undefined)?.full_name ?? 'Student';
            const initials = studentName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
            const isOpen = expanded === sub.id;

            return (
              <div key={sub.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Student row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : sub.id)}
                  className="w-full flex items-center justify-between p-4 text-left transition-all"
                  style={{ background: isOpen ? 'rgba(0,212,170,0.05)' : 'transparent' }}
                  onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{studentName}</p>
                      <p className="text-xs" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                        {new Date(sub.submitted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.marks_earned !== null && sub.marks_earned !== undefined ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                        {sub.marks_earned}/{totalMarks}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
                        ✓ {isKin ? 'Byatanzwe' : 'Submitted'}
                      </span>
                    )}
                    <ChevronDown size={14} style={{ color: '#475569', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </button>

                {/* Answers + Grade */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    {/* Answers (theoretical) */}
                    {assignment.assignment_type === 'theoretical' && sub.text_answers && questions.map((q, i) => {
                      const answer = (sub.text_answers ?? []).find(a => a.question_id === q.id)?.answer ?? '';
                      const qText = isKin ? (q.text_kin || q.text) : q.text;
                      return (
                        <div key={q.id} className="pt-3">
                          <p className="text-xs font-semibold mb-1" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                            {isKin ? `Ikibazo ${i + 1}` : `Q${i + 1}`}: {qText}
                          </p>
                          <p className="text-sm leading-relaxed px-3 py-2.5 rounded-lg" style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', fontFamily: 'Inter, sans-serif' }}>
                            {answer || <span style={{ color: '#334155' }}>{isKin ? '(Nta gisubizo)' : '(No answer)'}</span>}
                          </p>
                        </div>
                      );
                    })}

                    {/* Grading row */}
                    <div className="pt-3 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <label className="text-xs font-semibold shrink-0" style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                        {isKin ? `Amanota (/${totalMarks})` : `Grade (/${totalMarks})`}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={totalMarks}
                        value={markInputs[sub.id] ?? ''}
                        onChange={e => setMarkInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                        placeholder={`0 – ${totalMarks}`}
                        className="w-24 px-3 py-1.5 rounded-lg text-sm text-center focus:outline-none"
                        style={{ background: '#0d0f14', border: gradeError[sub.id] ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}
                        onFocus={e => (e.target.style.border = '1px solid rgba(0,212,170,0.4)')}
                        onBlur={e => (e.target.style.border = gradeError[sub.id] ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)')}
                      />
                      <button
                        onClick={() => handleGrade(sub.id)}
                        disabled={grading[sub.id] || !markInputs[sub.id]}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40"
                        style={{ background: '#00d4aa', color: '#0d0f14', fontFamily: 'Inter, sans-serif' }}
                      >
                        {grading[sub.id] ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
                        {isKin ? 'Saba' : 'Save'}
                      </button>
                      {gradeError[sub.id] && (
                        <span className="text-xs" style={{ color: '#f87171', fontFamily: 'Inter, sans-serif' }}>{gradeError[sub.id]}</span>
                      )}
                      {sub.marks_earned !== null && sub.marks_earned !== undefined && !gradeError[sub.id] && (
                        <span className="text-xs" style={{ color: '#00d4aa', fontFamily: 'Inter, sans-serif' }}>
                          ✓ {sub.marks_earned}/{totalMarks} {isKin ? 'byabitswe' : 'saved'}
                        </span>
                      )}
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
      className="w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all text-left"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: typeColor.bg, border: `1px solid ${typeColor.border}` }}>
          {assignment.assignment_type === 'theoretical' ? <BookOpen size={14} style={{ color: typeColor.text }} /> : <Code2 size={14} style={{ color: typeColor.text }} />}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{title}</p>
          {assignment.due_date && (
            <p className="text-xs" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
              {isKin ? 'Kurangira' : 'Due'}: {new Date(assignment.due_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,212,170,0.08)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.15)', fontFamily: 'Inter, sans-serif' }}>
          {submissionCount} {isKin ? 'byatanzwe' : submissionCount === 1 ? 'submission' : 'submissions'}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: typeColor.bg, color: typeColor.text, border: `1px solid ${typeColor.border}` }}>
          {assignment.assignment_type === 'theoretical' ? (isKin ? 'Inyandiko' : 'Theory') : 'Code'}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: diffColors[assignment.difficulty], background: `${diffColors[assignment.difficulty]}18`, border: `1px solid ${diffColors[assignment.difficulty]}30` }}>
          {assignment.difficulty}
        </span>
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
    if (rank === 2) return <Medal size={14} style={{ color: '#94a3b8' }} />;
    if (rank === 3) return <Medal size={14} style={{ color: '#cd7c2e' }} />;
    return <span className="text-xs font-bold" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>#{rank}</span>;
  };

  return (
    <div className="rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={16} style={{ color: '#f59e0b' }} />
        <h2 className="text-base font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
          {isKin ? 'Urutonde rw\'Amanota' : 'Class Leaderboard'}
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-6"><Loader size={18} className="animate-spin" style={{ color: '#00d4aa' }} /></div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-center py-6" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
          {isKin ? 'Nta manota yashyizweho' : 'No grades yet'}
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => {
            const initials = e.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const isTop = e.rank <= 3;
            return (
              <div key={e.student_id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: isTop ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)', border: isTop ? '1px solid rgba(245,158,11,0.12)' : '1px solid rgba(255,255,255,0.04)' }}>
                <div className="w-6 flex items-center justify-center shrink-0">{rankIcon(e.rank)}</div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)' }}>
                  {initials}
                </div>
                <p className="flex-1 text-sm font-semibold truncate" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>{e.full_name}</p>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ color: isTop ? '#f59e0b' : '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
                    {e.total_marks_earned} pts
                  </p>
                  {e.submissions_graded > 0 && (
                    <p className="text-xs" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>{e.percentage}%</p>
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

export default function TeacherDashboard() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
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
      const counts = await getAssignmentSubmissionCounts(aData.map(a => a.id));
      setSubmissionCounts(counts);
    }

    setLoadingData(false);
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedClassId) return;
    getClassAssignments(selectedClassId).then(async ({ data }) => {
      setAssignments(data);
      const counts = await getAssignmentSubmissionCounts(data.map(a => a.id));
      setSubmissionCounts(counts);
    });
  }, [selectedClassId]);

  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount ?? 0), 0);
  const totalSubmissions = Object.values(submissionCounts).reduce((s, n) => s + n, 0);

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', background: '#0d0f14' }}>
      <Header
        language={language}
        onLanguageToggle={() => setLanguage(prev => prev === 'EN' ? 'KIN' : 'EN')}
        subtitle={isKin ? 'Ikibanza cy\'Umwarimu' : 'Teacher Dashboard'}
        hideAssignmentInfo={true}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loadingData ? (
          <div className="flex items-center justify-center py-24">
            <Loader size={24} className="animate-spin" style={{ color: '#00d4aa' }} />
          </div>
        ) : (
          <div className="space-y-8">

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: isKin ? 'Amasomo' : 'Classes', value: classes.length, color: '#00d4aa' },
                { label: isKin ? 'Abanyeshuri' : 'Students', value: totalStudents, color: '#8b5cf6' },
                { label: isKin ? 'Imishinga Yose' : 'Assignments', value: classes.reduce((s, c) => s + (c.assignmentCount ?? 0), 0), color: '#f59e0b' },
                { label: isKin ? 'Byatanzwe' : 'Submissions', value: totalSubmissions, color: '#0ea5e9' },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl p-5" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-2xl font-bold mb-1" style={{ color: stat.color, fontFamily: 'Inter, sans-serif' }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Classes column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
                    {isKin ? 'Amasomo Yanjye' : 'My Classes'}
                  </h2>
                  <button
                    onClick={() => setShowCreateClass(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.18)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,170,0.1)')}
                  >
                    <Plus size={14} />
                    {isKin ? 'Ongera Ishuri' : 'New Class'}
                  </button>
                </div>

                {classes.length === 0 ? (
                  <div className="rounded-2xl p-8 text-center" style={{ background: '#13161e', border: '1px dashed rgba(255,255,255,0.08)' }}>
                    <Users size={32} className="mx-auto mb-3" style={{ color: '#334155' }} />
                    <p className="text-sm font-medium mb-1" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                      {isKin ? 'Nta masomo ufite' : 'No classes yet'}
                    </p>
                    <p className="text-xs mb-4" style={{ color: '#334155', fontFamily: 'Inter, sans-serif' }}>
                      {isKin ? 'Kora ishuri kugirango utangire' : 'Create a class to get started'}
                    </p>
                    <button
                      onClick={() => setShowCreateClass(true)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa', border: '1px solid rgba(0,212,170,0.2)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {isKin ? 'Kora Ishuri' : 'Create Class'}
                    </button>
                  </div>
                ) : (
                  classes.map(cls => (
                    <div key={cls.id} onClick={() => setSelectedClassId(cls.id)} className="cursor-pointer" style={{ outline: selectedClassId === cls.id ? '2px solid rgba(0,212,170,0.3)' : 'none', borderRadius: '16px' }}>
                      <ClassCard cls={cls} language={language} onAnnouncements={() => setAnnouncementsClass(cls)} />
                    </div>
                  ))
                )}
              </div>

              {/* Assignments column */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl p-6" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold" style={{ color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
                      {isKin ? 'Imishinga' : 'Assignments'}
                      {selectedClassId && classes.find(c => c.id === selectedClassId) && (
                        <span className="ml-2 text-xs font-normal" style={{ color: '#475569' }}>
                          — {classes.find(c => c.id === selectedClassId)?.name}
                        </span>
                      )}
                    </h2>
                    <button
                      onClick={() => setShowCreateAssignment(true)}
                      disabled={classes.length === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                      style={{ background: '#00d4aa', color: '#0d0f14', fontFamily: 'Inter, sans-serif' }}
                      onMouseEnter={e => { if (classes.length > 0) (e.currentTarget as HTMLButtonElement).style.background = '#00bfa0'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00d4aa'; }}
                    >
                      <Plus size={14} />
                      {isKin ? 'Kora Umushinga' : 'New Assignment'}
                    </button>
                  </div>

                  {assignments.length === 0 ? (
                    <div className="py-10 text-center">
                      <FileText size={28} className="mx-auto mb-3" style={{ color: '#334155' }} />
                      <p className="text-sm" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                        {classes.length === 0
                          ? (isKin ? 'Kora ishuri mbere' : 'Create a class first')
                          : (isKin ? 'Nta mishinga iri muri iri somo' : 'No assignments in this class yet')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {assignments.map(a => (
                        <AssignmentRow
                          key={a.id}
                          assignment={a}
                          submissionCount={submissionCounts[a.id] ?? 0}
                          language={language}
                          onClick={() => setViewingAssignment(a)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Leaderboard column */}
              <div className="lg:col-span-3">
                {selectedClassId
                  ? <Leaderboard classId={selectedClassId} language={language} />
                  : (
                    <div className="rounded-2xl p-6 text-center" style={{ background: '#13161e', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Trophy size={24} className="mx-auto mb-2" style={{ color: '#334155' }} />
                      <p className="text-sm" style={{ color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                        {isKin ? 'Hitamo ishuri' : 'Select a class'}
                      </p>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
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
    </div>
  );
}
