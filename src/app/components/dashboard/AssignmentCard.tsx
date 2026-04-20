import { ArrowRight } from 'lucide-react';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueStatus: 'submitted' | 'due-soon' | 'overdue';
  dueText: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  testsCompleted: number;
  testsTotal: number;
  status: 'not-started' | 'in-progress' | 'completed';
  grade?: string; // e.g. "15/20"
  feedback?: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
  language: 'EN' | 'KIN';
  onClick?: () => void;
}

const statusStyles = {
  submitted:  { bg: 'rgba(16,185,129,0.1)',  text: '#10b981', border: 'rgba(16,185,129,0.25)' },
  'due-soon': { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  overdue:    { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444', border: 'rgba(239,68,68,0.25)' },
};

const difficultyStyles = {
  Beginner:     { bg: 'rgba(0,212,170,0.1)',   text: '#00d4aa', border: 'rgba(0,212,170,0.2)' },
  Intermediate: { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  Advanced:     { bg: 'rgba(139,92,246,0.1)',  text: '#8b5cf6', border: 'rgba(139,92,246,0.2)' },
};

export function AssignmentCard({ assignment, language, onClick }: AssignmentCardProps) {
  const isKinyarwanda = language === 'KIN';
  const due = statusStyles[assignment.dueStatus];
  const diff = difficultyStyles[assignment.difficulty];

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-5 cursor-pointer transition-all group"
      style={{
        background: '#13161e',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(0,212,170,0.2)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px rgba(0,212,170,0.06)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <h3 className="text-base font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif', color: '#f1f5f9' }}>
        {assignment.title}
      </h3>
      <p className="text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}>
        {assignment.description}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: due.bg, color: due.text, border: `1px solid ${due.border}` }}>
          {assignment.dueText}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
          {assignment.difficulty}
        </span>
        {assignment.grade && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
            {assignment.grade}
          </span>
        )}
      </div>

      {assignment.feedback && (
        <div className="mb-4 px-3 py-2 rounded-lg text-xs leading-relaxed" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', color: '#a78bfa', fontFamily: 'Inter, sans-serif' }}>
          <span className="font-semibold" style={{ color: '#8b5cf6' }}>{isKinyarwanda ? 'Igitekerezo cy\'umwarimu: ' : 'Teacher feedback: '}</span>
          {assignment.feedback}
        </div>
      )}

      {/* Progress + action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: assignment.testsTotal }, (_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i < assignment.testsCompleted ? '#00d4aa' : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}>
            {assignment.status === 'completed'
              ? (isKinyarwanda ? 'Byatanzwe' : 'Submitted')
              : `${assignment.testsCompleted}/${assignment.testsTotal} ${isKinyarwanda ? 'byatsinze' : 'passed'}`}
          </span>
        </div>

        <button className="flex items-center gap-1 text-sm font-semibold transition-all" style={{ color: '#00d4aa', fontFamily: 'Inter, sans-serif' }}>
          {assignment.status === 'not-started'
            ? (isKinyarwanda ? 'Tangira' : 'Start')
            : assignment.status === 'completed'
            ? (isKinyarwanda ? 'Reba' : 'Review')
            : (isKinyarwanda ? 'Komeza' : 'Continue')}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
