import React, { useState } from 'react';
import { Plus, Filter, Search, Edit2, Copy, Archive, Trash2, Eye, BarChart3, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

interface AssignmentManagementPageProps {
  language: 'EN' | 'KIN';
}

interface Assignment {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dueDate: string;
  status: 'active' | 'upcoming' | 'completed' | 'draft';
  studentsCompleted: number;
  studentsTotal: number;
  avgGrade: number;
  avgTimeSpent: string;
  testsTotal: number;
}

export function AssignmentManagementPage({ language }: AssignmentManagementPageProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);

  const isKinyarwanda = language === 'KIN';

  const assignments: Assignment[] = [
    {
      id: '1',
      title: isKinyarwanda ? 'Kubara Igiciro Cyose' : 'Calculate Total Price',
      difficulty: 'Beginner',
      dueDate: isKinyarwanda ? 'Ukwakira 8, 2026' : 'April 8, 2026',
      status: 'active',
      studentsCompleted: 38,
      studentsTotal: 52,
      avgGrade: 76,
      avgTimeSpent: '1h 15m',
      testsTotal: 5
    },
    {
      id: '2',
      title: isKinyarwanda ? 'Imyitozo ya Loops' : 'Loops Practice',
      difficulty: 'Intermediate',
      dueDate: isKinyarwanda ? 'Ukwakira 10, 2026' : 'April 10, 2026',
      status: 'active',
      studentsCompleted: 25,
      studentsTotal: 52,
      avgGrade: 68,
      avgTimeSpent: '2h 5m',
      testsTotal: 5
    },
    {
      id: '3',
      title: isKinyarwanda ? 'Functions n\'Arrays' : 'Functions & Arrays',
      difficulty: 'Intermediate',
      dueDate: isKinyarwanda ? 'Ukwakira 15, 2026' : 'April 15, 2026',
      status: 'upcoming',
      studentsCompleted: 0,
      studentsTotal: 52,
      avgGrade: 0,
      avgTimeSpent: '-',
      testsTotal: 8
    },
    {
      id: '4',
      title: isKinyarwanda ? 'Conditional Statements' : 'Conditional Statements',
      difficulty: 'Beginner',
      dueDate: isKinyarwanda ? 'Werurwe 30, 2026' : 'March 30, 2026',
      status: 'completed',
      studentsCompleted: 52,
      studentsTotal: 52,
      avgGrade: 84,
      avgTimeSpent: '55m',
      testsTotal: 5
    },
    {
      id: '5',
      title: isKinyarwanda ? 'API Integration Project' : 'API Integration Project',
      difficulty: 'Advanced',
      dueDate: isKinyarwanda ? 'Ukwakira 20, 2026' : 'April 20, 2026',
      status: 'draft',
      studentsCompleted: 0,
      studentsTotal: 52,
      avgGrade: 0,
      avgTimeSpent: '-',
      testsTotal: 10
    }
  ];

  const filteredAssignments = assignments.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    upcoming: assignments.filter(a => a.status === 'upcoming').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    draft: assignments.filter(a => a.status === 'draft').length
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-[#0ea5e9] border-blue-200';
      case 'upcoming': return 'bg-purple-100 text-[#8b5cf6] border-purple-200';
      case 'completed': return 'bg-green-100 text-[#22c55e] border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: Assignment['status']) => {
    if (isKinyarwanda) {
      switch (status) {
        case 'active': return 'Kirakora';
        case 'upcoming': return 'Bizaza';
        case 'completed': return 'Byarangiye';
        case 'draft': return 'Igishushanyo';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getDifficultyColor = (difficulty: Assignment['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-50 text-[#22c55e] border-green-200';
      case 'Intermediate': return 'bg-amber-50 text-[#f59e0b] border-amber-200';
      case 'Advanced': return 'bg-red-50 text-[#ef4444] border-red-200';
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedAssignments(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAssignments.length === filteredAssignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(filteredAssignments.map(a => a.id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
              {isKinyarwanda ? 'Gucunga Imishinga' : 'Assignment Management'}
            </h1>
            <p className="text-gray-600">
              {isKinyarwanda ? 'Kora, guhindura, no gucunga imishinga yose' : 'Create, edit, and manage all assignments'}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-[#10b981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            {isKinyarwanda ? 'Umushinga Mushya' : 'New Assignment'}
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: isKinyarwanda ? 'Byose' : 'All', count: statusCounts.all, color: 'gray' },
            { label: isKinyarwanda ? 'Kirakora' : 'Active', count: statusCounts.active, color: 'blue' },
            { label: isKinyarwanda ? 'Bizaza' : 'Upcoming', count: statusCounts.upcoming, color: 'purple' },
            { label: isKinyarwanda ? 'Byarangiye' : 'Completed', count: statusCounts.completed, color: 'green' },
            { label: isKinyarwanda ? 'Igishushanyo' : 'Draft', count: statusCounts.draft, color: 'gray' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-2xl font-bold text-[#1e293b] mb-1">{stat.count}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={isKinyarwanda ? 'Shakisha imishinga...' : 'Search assignments...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: isKinyarwanda ? 'Byose' : 'All' },
                { id: 'active', label: isKinyarwanda ? 'Kirakora' : 'Active' },
                { id: 'upcoming', label: isKinyarwanda ? 'Bizaza' : 'Upcoming' },
                { id: 'completed', label: isKinyarwanda ? 'Byarangiye' : 'Completed' },
                { id: 'draft', label: isKinyarwanda ? 'Igishushanyo' : 'Draft' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id as any)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    statusFilter === filter.id
                      ? 'bg-[#10b981] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAssignments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#0ea5e9]">
              {selectedAssignments.length} {isKinyarwanda ? 'imishinga yatoranyijwe' : 'assignments selected'}
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white text-[#0ea5e9] border border-blue-300 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2">
                <Copy className="w-4 h-4" />
                {isKinyarwanda ? 'Guhuza' : 'Duplicate'}
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                <Archive className="w-4 h-4" />
                {isKinyarwanda ? 'Kubika' : 'Archive'}
              </button>
              <button className="px-4 py-2 bg-white text-[#ef4444] border border-red-300 rounded-lg font-semibold hover:bg-red-50 transition-all flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {isKinyarwanda ? 'Gusiba' : 'Delete'}
              </button>
            </div>
          </div>
        )}

        {/* Assignments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedAssignments.length === filteredAssignments.length && filteredAssignments.length > 0}
                      onChange={selectAll}
                      className="w-4 h-4 text-[#10b981] rounded focus:ring-2 focus:ring-[#10b981]"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {isKinyarwanda ? 'Umushinga' : 'Assignment'}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {isKinyarwanda ? 'Uko bigoye' : 'Difficulty'}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {isKinyarwanda ? 'Itariki' : 'Due Date'}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {isKinyarwanda ? 'Uko bimeze' : 'Status'}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {isKinyarwanda ? 'Iterambere' : 'Progress'}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {isKinyarwanda ? 'Amanota' : 'Avg Grade'}
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    {isKinyarwanda ? 'Ibikorwa' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedAssignments.includes(assignment.id)}
                        onChange={() => toggleSelection(assignment.id)}
                        className="w-4 h-4 text-[#10b981] rounded focus:ring-2 focus:ring-[#10b981]"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{assignment.title}</div>
                      <div className="text-xs text-gray-500">{assignment.testsTotal} tests</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getDifficultyColor(assignment.difficulty)}`}>
                        {assignment.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{assignment.dueDate}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getStatusColor(assignment.status)}`}>
                        {getStatusLabel(assignment.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#10b981] h-2 rounded-full"
                            style={{ width: `${(assignment.studentsCompleted / assignment.studentsTotal) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {assignment.studentsCompleted}/{assignment.studentsTotal}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {assignment.avgGrade > 0 ? (
                        <span className={`text-sm font-bold ${
                          assignment.avgGrade >= 80 ? 'text-[#22c55e]' : assignment.avgGrade >= 60 ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                        }`}>
                          {assignment.avgGrade}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all" title={isKinyarwanda ? 'Reba' : 'View'}>
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all" title={isKinyarwanda ? 'Hindura' : 'Edit'}>
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all" title={isKinyarwanda ? 'Isesengura' : 'Analytics'}>
                          <BarChart3 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all" title={isKinyarwanda ? 'Gusiba' : 'Delete'}>
                          <Trash2 className="w-4 h-4 text-[#ef4444]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {isKinyarwanda ? 'Nta mushinga uboneka' : 'No assignments found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {isKinyarwanda ? 'Gerageza guhindura amakosa yawe' : 'Try adjusting your filters or search query'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-6 py-2 bg-[#10b981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all"
            >
              {isKinyarwanda ? 'Gusubira' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
