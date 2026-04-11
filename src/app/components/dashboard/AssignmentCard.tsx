import React from 'react';
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
}

interface AssignmentCardProps {
  assignment: Assignment;
  language: 'EN' | 'KIN';
  onClick?: () => void;
}

export function AssignmentCard({ assignment, language, onClick }: AssignmentCardProps) {
  const isKinyarwanda = language === 'KIN';

  const getDueStatusColor = () => {
    switch (assignment.dueStatus) {
      case 'submitted':
        return { bg: '#f0fdf4', text: '#10b981', border: '#10b981' };
      case 'due-soon':
        return { bg: '#fef3c7', text: '#f59e0b', border: '#f59e0b' };
      case 'overdue':
        return { bg: '#fef2f2', text: '#ef4444', border: '#ef4444' };
    }
  };

  const getDifficultyColor = () => {
    switch (assignment.difficulty) {
      case 'Beginner':
        return { bg: '#dbeafe', text: '#0ea5e9' };
      case 'Intermediate':
        return { bg: '#fef3c7', text: '#f59e0b' };
      case 'Advanced':
        return { bg: '#fce7f3', text: '#ec4899' };
    }
  };

  const statusColor = getDueStatusColor();
  const difficultyColor = getDifficultyColor();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#0ea5e9] hover:shadow-lg transition-all cursor-pointer" onClick={onClick}>
      {/* Title */}
      <h3 className="text-lg font-bold text-[#1e293b] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        {assignment.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        {assignment.description}
      </p>

      {/* Badges Row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: statusColor.bg,
            color: statusColor.text,
            border: `1px solid ${statusColor.border}`,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {assignment.dueText}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: difficultyColor.bg,
            color: difficultyColor.text,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {assignment.difficulty}
        </span>
      </div>

      {/* Progress Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Progress Dots */}
          <div className="flex gap-1">
            {Array.from({ length: assignment.testsTotal }, (_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i < assignment.testsCompleted ? '#10b981' : '#e2e8f0'
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {assignment.testsCompleted}/{assignment.testsTotal} {isKinyarwanda ? 'byatsinze' : 'tests passed'}
          </span>
        </div>

        {/* Action Button */}
        <button
          className="flex items-center gap-1 text-[#0ea5e9] font-semibold text-sm hover:gap-2 transition-all"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {assignment.status === 'not-started' ? (isKinyarwanda ? 'Tangira' : 'Start') : (isKinyarwanda ? 'Komeza' : 'Continue')}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
