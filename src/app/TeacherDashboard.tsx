import { useState, useEffect } from 'react';
import { Users, FileText, Plus, Copy, Check, X, ChevronDown, BookOpen, Code2, Loader } from 'lucide-react';
import { Header } from './components/Header';
import {
  createClass, getTeacherClasses, getClassAssignments, createAssignment, getClassStudentCount,
  type Class, type Assignment, type Question
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

// ─── Invite Code Card ──────────────────────────────────────────────────────────

function ClassCard({ cls, language }: { cls: Class & { studentCount?: number; assignmentCount?: number }; language: 'EN' | 'KIN' }) {
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
    </div>
  );
}

// ─── Assignment Row ────────────────────────────────────────────────────────────

function AssignmentRow({ assignment, language }: { assignment: Assignment; language: 'EN' | 'KIN' }) {
  const isKin = language === 'KIN';
  const diffColors: Record<string, string> = { beginner: '#00d4aa', intermediate: '#f59e0b', advanced: '#8b5cf6' };
  const typeColor = assignment.assignment_type === 'theoretical' ? { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa', border: 'rgba(139,92,246,0.2)' } : { bg: 'rgba(0,212,170,0.1)', text: '#00d4aa', border: 'rgba(0,212,170,0.2)' };
  const title = isKin ? (assignment.title_kin || assignment.title) : assignment.title;

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl transition-all" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
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
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: typeColor.bg, color: typeColor.text, border: `1px solid ${typeColor.border}` }}>
          {assignment.assignment_type === 'theoretical' ? (isKin ? 'Inyandiko' : 'Theory') : 'Code'}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: diffColors[assignment.difficulty], background: `${diffColors[assignment.difficulty]}18`, border: `1px solid ${diffColors[assignment.difficulty]}30` }}>
          {assignment.difficulty}
        </span>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [language, setLanguage] = useState<'EN' | 'KIN'>('EN');
  const isKin = language === 'KIN';

  const [classes, setClasses] = useState<Array<Class & { studentCount?: number; assignmentCount?: number }>>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

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
    }

    setLoadingData(false);
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedClassId) return;
    getClassAssignments(selectedClassId).then(({ data }) => setAssignments(data));
  }, [selectedClassId]);

  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount ?? 0), 0);

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
                { label: isKin ? 'Byatanzwe' : 'Submissions', value: '-', color: '#0ea5e9' },
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
                      <ClassCard cls={cls} language={language} />
                    </div>
                  ))
                )}
              </div>

              {/* Assignments column */}
              <div className="lg:col-span-7">
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
                      {assignments.map(a => <AssignmentRow key={a.id} assignment={a} language={language} />)}
                    </div>
                  )}
                </div>
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
    </div>
  );
}
