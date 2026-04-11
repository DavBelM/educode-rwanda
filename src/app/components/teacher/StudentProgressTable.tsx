import React, { useState } from 'react';
import { Eye, AlertTriangle, Trophy, CheckCircle } from 'lucide-react';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  lastActive: string;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  aiAlert: boolean;
  isExcelling: boolean;
}

interface StudentProgressTableProps {
  students: Student[];
  language: 'EN' | 'KIN';
}

export function StudentProgressTable({ students, language }: StudentProgressTableProps) {
  const [filter, setFilter] = useState<'all' | 'struggling' | 'on-track' | 'excelling'>('all');
  const [sortBy, setSortBy] = useState<'progress' | 'lastActive' | 'name'>('progress');
  const isKinyarwanda = language === 'KIN';

  const getProgressColor = (progress: number) => {
    if (progress >= 71) return '#10b981';
    if (progress >= 41) return '#f59e0b';
    return '#ef4444';
  };

  const filteredStudents = students.filter(student => {
    if (filter === 'all') return true;
    if (filter === 'struggling') return student.progress < 40 || student.aiAlert;
    if (filter === 'on-track') return student.progress >= 40 && student.progress < 100 && !student.aiAlert;
    if (filter === 'excelling') return student.isExcelling;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {isKinyarwanda ? 'Abanyeshuri / Students' : 'Students'}
        </h2>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex gap-2">
          {(['all', 'struggling', 'on-track', 'excelling'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-[#0ea5e9] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {f === 'all' && (isKinyarwanda ? 'Byose' : 'All')}
              {f === 'struggling' && (isKinyarwanda ? 'Bakeneye Ubufasha' : 'Struggling')}
              {f === 'on-track' && (isKinyarwanda ? 'Bagenda Neza' : 'On Track')}
              {f === 'excelling' && (isKinyarwanda ? 'Bateye Imbere' : 'Excelling')}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Tondekanya:' : 'Sort by:'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <option value="progress">{isKinyarwanda ? 'Iterambere' : 'Progress'}</option>
            <option value="lastActive">{isKinyarwanda ? 'Igihe' : 'Last Active'}</option>
            <option value="name">{isKinyarwanda ? 'Izina' : 'Name'}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Umunyeshuri' : 'Student'}
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Iterambere' : 'Progress'}
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Igihe' : 'Last Active'}
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Imishinga' : 'Assignments'}
              </th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Status
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Ibikorwa' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center text-white font-semibold">
                      {student.avatar}
                    </div>
                    <span className="font-medium text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {student.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-[100px]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${student.progress}%`,
                          backgroundColor: getProgressColor(student.progress)
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold min-w-[45px]" style={{ fontFamily: 'Inter, sans-serif', color: getProgressColor(student.progress) }}>
                      {student.progress}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {student.lastActive}
                </td>
                <td className="py-4 px-2 text-sm font-medium text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {student.assignmentsCompleted}/{student.assignmentsTotal}
                </td>
                <td className="py-4 px-2 text-center">
                  {student.aiAlert ? (
                    <AlertTriangle size={20} className="text-[#8b5cf6] mx-auto" />
                  ) : student.isExcelling ? (
                    <Trophy size={20} className="text-[#fbbf24] mx-auto" />
                  ) : (
                    <CheckCircle size={20} className="text-[#10b981] mx-auto" />
                  )}
                </td>
                <td className="py-4 px-2 text-right">
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition-all text-sm font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Eye size={16} />
                    <span className="hidden sm:inline">{isKinyarwanda ? 'Reba' : 'View'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <button
          className="px-6 py-2 text-[#0ea5e9] font-semibold hover:underline"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {isKinyarwanda ? 'Reba Byinshi' : 'Load More'}
        </button>
      </div>
    </div>
  );
}
