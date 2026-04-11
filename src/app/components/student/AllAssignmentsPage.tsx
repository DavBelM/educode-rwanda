import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Grid3x3, List, Clock, AlertCircle, CheckCircle2, PlayCircle } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  dueDate: string;
  dueStatus: 'due-soon' | 'overdue' | 'on-time' | 'submitted';
  testsCompleted: number;
  testsTotal: number;
  status: 'not-started' | 'in-progress' | 'completed';
  category: string;
  xpPoints: number;
}

interface AllAssignmentsPageProps {
  language: 'EN' | 'KIN';
}

export function AllAssignmentsPage({ language }: AllAssignmentsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed' | 'overdue'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const isKinyarwanda = language === 'KIN';

  const allAssignments: Assignment[] = [
    {
      id: '1',
      title: isKinyarwanda ? 'Kubara Igiciro Cyose' : 'Calculate Total Price',
      description: isKinyarwanda ? 'Koresha variables kugirango ubaze igiciro cyose' : 'Use variables to calculate total price',
      difficulty: 'Beginner',
      dueDate: isKinyarwanda ? 'Ukwakira 8, 2026' : 'April 8, 2026',
      dueStatus: 'due-soon',
      testsCompleted: 3,
      testsTotal: 5,
      status: 'in-progress',
      category: 'Variables',
      xpPoints: 100
    },
    {
      id: '2',
      title: isKinyarwanda ? 'Imyitozo ya Loops' : 'Loops Practice',
      description: isKinyarwanda ? 'Wiga for n\'while loops' : 'Learn for and while loops',
      difficulty: 'Intermediate',
      dueDate: isKinyarwanda ? 'Ukwakira 4, 2026' : 'April 4, 2026',
      dueStatus: 'overdue',
      testsCompleted: 1,
      testsTotal: 5,
      status: 'in-progress',
      category: 'Control Flow',
      xpPoints: 150
    },
    {
      id: '3',
      title: isKinyarwanda ? 'Functions n\'Returns' : 'Functions & Returns',
      description: isKinyarwanda ? 'Kora functions zisubiza agaciro' : 'Create functions that return values',
      difficulty: 'Beginner',
      dueDate: isKinyarwanda ? 'Ukwakira 11, 2026' : 'April 11, 2026',
      dueStatus: 'on-time',
      testsCompleted: 0,
      testsTotal: 4,
      status: 'not-started',
      category: 'Functions',
      xpPoints: 120
    },
    {
      id: '4',
      title: isKinyarwanda ? 'Conditional Statements' : 'Conditional Statements',
      description: isKinyarwanda ? 'If, else, else if - gufata ibyemezo' : 'If, else, else if - making decisions',
      difficulty: 'Beginner',
      dueDate: isKinyarwanda ? 'Werurwe 30, 2026' : 'March 30, 2026',
      dueStatus: 'submitted',
      testsCompleted: 5,
      testsTotal: 5,
      status: 'completed',
      category: 'Control Flow',
      xpPoints: 100
    },
    {
      id: '5',
      title: isKinyarwanda ? 'Array Methods' : 'Array Methods',
      description: isKinyarwanda ? 'Map, filter, reduce n\'ibindi' : 'Map, filter, reduce and more',
      difficulty: 'Intermediate',
      dueDate: isKinyarwanda ? 'Ukwakira 15, 2026' : 'April 15, 2026',
      dueStatus: 'on-time',
      testsCompleted: 0,
      testsTotal: 6,
      status: 'not-started',
      category: 'Arrays',
      xpPoints: 180
    },
    {
      id: '6',
      title: isKinyarwanda ? 'String Manipulation' : 'String Manipulation',
      description: isKinyarwanda ? 'Gukora ku nyandiko' : 'Working with strings',
      difficulty: 'Beginner',
      dueDate: isKinyarwanda ? 'Werurwe 28, 2026' : 'March 28, 2026',
      dueStatus: 'submitted',
      testsCompleted: 4,
      testsTotal: 4,
      status: 'completed',
      category: 'Data Types',
      xpPoints: 100
    },
    {
      id: '7',
      title: isKinyarwanda ? 'Object Properties' : 'Object Properties',
      description: isKinyarwanda ? 'Koresha ibice by\'ibintu' : 'Working with object properties',
      difficulty: 'Intermediate',
      dueDate: isKinyarwanda ? 'Ukwakira 20, 2026' : 'April 20, 2026',
      dueStatus: 'on-time',
      testsCompleted: 2,
      testsTotal: 5,
      status: 'in-progress',
      category: 'Objects',
      xpPoints: 160
    },
    {
      id: '8',
      title: isKinyarwanda ? 'Error Handling' : 'Error Handling',
      description: isKinyarwanda ? 'Try, catch, throw - gufata amakosa' : 'Try, catch, throw - handling errors',
      difficulty: 'Advanced',
      dueDate: isKinyarwanda ? 'Ukwakira 25, 2026' : 'April 25, 2026',
      dueStatus: 'on-time',
      testsCompleted: 0,
      testsTotal: 7,
      status: 'not-started',
      category: 'Advanced',
      xpPoints: 200
    }
  ];

  const filteredAssignments = allAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'overdue' ? assignment.dueStatus === 'overdue' : assignment.status === statusFilter);
    const matchesDifficulty = difficultyFilter === 'all' || assignment.difficulty === difficultyFilter;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const getStatusIcon = (status: Assignment['status'], dueStatus: Assignment['dueStatus']) => {
    if (dueStatus === 'overdue') return <AlertCircle className="w-5 h-5 text-[#ef4444]" />;
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />;
    if (status === 'in-progress') return <PlayCircle className="w-5 h-5 text-[#0ea5e9]" />;
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = (status: Assignment['status'], dueStatus: Assignment['dueStatus']) => {
    if (dueStatus === 'overdue') return 'bg-red-50 text-[#ef4444] border-red-200';
    if (status === 'completed') return 'bg-green-50 text-[#22c55e] border-green-200';
    if (status === 'in-progress') return 'bg-blue-50 text-[#0ea5e9] border-blue-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getStatusText = (status: Assignment['status'], dueStatus: Assignment['dueStatus']) => {
    if (dueStatus === 'overdue') return isKinyarwanda ? 'Yarangirije' : 'Overdue';
    if (status === 'completed') return isKinyarwanda ? 'Byarangiye' : 'Completed';
    if (status === 'in-progress') return isKinyarwanda ? 'Urabikoze' : 'In Progress';
    return isKinyarwanda ? 'Ntabwo watangiye' : 'Not Started';
  };

  const getDifficultyColor = (difficulty: Assignment['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-amber-100 text-amber-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
            {isKinyarwanda ? 'Imishinga Yose / All Assignments' : 'All Assignments'}
          </h1>
          <p className="text-gray-600">
            {isKinyarwanda ? `${filteredAssignments.length} imishinga yabonetse` : `${filteredAssignments.length} assignments found`}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={isKinyarwanda ? 'Shakisha imishinga...' : 'Search assignments...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {isKinyarwanda ? 'Filters' : 'Filters'}
            </button>

            {/* View Toggle */}
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-[#0ea5e9] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-[#0ea5e9] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {isKinyarwanda ? 'Uko Bimeze' : 'Status'}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                >
                  <option value="all">{isKinyarwanda ? 'Byose' : 'All'}</option>
                  <option value="not-started">{isKinyarwanda ? 'Ntabwo watangiye' : 'Not Started'}</option>
                  <option value="in-progress">{isKinyarwanda ? 'Urabikoze' : 'In Progress'}</option>
                  <option value="completed">{isKinyarwanda ? 'Byarangiye' : 'Completed'}</option>
                  <option value="overdue">{isKinyarwanda ? 'Yarangirije' : 'Overdue'}</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {isKinyarwanda ? 'Ingorabahizi' : 'Difficulty'}
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
                >
                  <option value="all">{isKinyarwanda ? 'Byose' : 'All'}</option>
                  <option value="Beginner">{isKinyarwanda ? 'Intangiriro' : 'Beginner'}</option>
                  <option value="Intermediate">{isKinyarwanda ? 'Hagati' : 'Intermediate'}</option>
                  <option value="Advanced">{isKinyarwanda ? 'Bigoye' : 'Advanced'}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Assignments Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(assignment.status, assignment.dueStatus)}
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getDifficultyColor(assignment.difficulty)}`}>
                      {assignment.difficulty}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{assignment.xpPoints} XP</span>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-bold text-[#1e293b] mb-2">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>{isKinyarwanda ? 'Iterambere' : 'Progress'}</span>
                    <span>{assignment.testsCompleted}/{assignment.testsTotal} {isKinyarwanda ? 'tests' : 'tests'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0ea5e9] h-2 rounded-full transition-all"
                      style={{ width: `${(assignment.testsCompleted / assignment.testsTotal) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusColor(assignment.status, assignment.dueStatus)}`}>
                    {getStatusText(assignment.status, assignment.dueStatus)}
                  </span>
                  <span className="text-xs text-gray-500">{assignment.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  {/* Left Section */}
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(assignment.status, assignment.dueStatus)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-[#1e293b]">{assignment.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getDifficultyColor(assignment.difficulty)}`}>
                          {assignment.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{assignment.description}</p>
                    </div>
                  </div>

                  {/* Middle Section - Progress */}
                  <div className="hidden md:block w-48 px-6">
                    <div className="text-xs text-gray-600 mb-1 text-center">
                      {assignment.testsCompleted}/{assignment.testsTotal} {isKinyarwanda ? 'tests' : 'tests'}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#0ea5e9] h-2 rounded-full transition-all"
                        style={{ width: `${(assignment.testsCompleted / assignment.testsTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700">{assignment.xpPoints} XP</div>
                      <div className="text-xs text-gray-500">{assignment.dueDate}</div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-semibold whitespace-nowrap ${getStatusColor(assignment.status, assignment.dueStatus)}`}>
                      {getStatusText(assignment.status, assignment.dueStatus)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {isKinyarwanda ? 'Nta mushinga wabonetse' : 'No assignments found'}
            </h3>
            <p className="text-gray-500">
              {isKinyarwanda ? 'Gerageza guhindura filters zawe' : 'Try adjusting your filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
