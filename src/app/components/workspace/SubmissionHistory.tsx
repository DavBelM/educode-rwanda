import React from 'react';
import { Clock, CheckCircle, XCircle, Eye, Download } from 'lucide-react';

interface Submission {
  id: string;
  date: string;
  time: string;
  grade: number;
  testsPassed: number;
  testsTotal: number;
  status: 'passed' | 'failed' | 'partial';
}

interface SubmissionHistoryProps {
  language: 'EN' | 'KIN';
  assignmentTitle: string;
  submissions: Submission[];
  bestGrade: number;
  onViewSubmission: (id: string) => void;
  onDownloadCode: (id: string) => void;
}

export function SubmissionHistory({
  language,
  assignmentTitle,
  submissions,
  bestGrade,
  onViewSubmission,
  onDownloadCode
}: SubmissionHistoryProps) {
  const isKinyarwanda = language === 'KIN';

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'passed':
        return { bg: '#f0fdf4', text: '#10b981', icon: CheckCircle };
      case 'failed':
        return { bg: '#fef2f2', text: '#ef4444', icon: XCircle };
      case 'partial':
        return { bg: '#fef3c7', text: '#f59e0b', icon: CheckCircle };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Amateka y\'Gutanga' : 'Submission History'}
          </h1>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            {assignmentTitle}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Card */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Amanota Meza' : 'Best Grade'}
            </p>
            <p className="text-4xl font-bold text-[#10b981]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {bestGrade}
              <span className="text-xl text-gray-400">/100</span>
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Umubare w\'Ibigeragezo' : 'Total Attempts'}
            </p>
            <p className="text-4xl font-bold text-[#0ea5e9]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {submissions.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Igihe cya Nyuma' : 'Latest Attempt'}
            </p>
            <p className="text-xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {submissions[0]?.date || 'N/A'}
            </p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibigeragezo Byose' : 'All Attempts'}
            </h2>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-3 bg-[#f8fafc] border-b border-gray-200 text-sm font-semibold text-gray-600">
            <div style={{ fontFamily: 'Inter, sans-serif' }}>#</div>
            <div className="col-span-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Itariki & Igihe' : 'Date & Time'}
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif' }}>{isKinyarwanda ? 'Amanota' : 'Grade'}</div>
            <div style={{ fontFamily: 'Inter, sans-serif' }}>{isKinyarwanda ? 'Ibizamini' : 'Tests'}</div>
            <div style={{ fontFamily: 'Inter, sans-serif' }}>Status</div>
            <div className="text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibikorwa' : 'Actions'}
            </div>
          </div>

          {/* Submissions */}
          <div className="divide-y divide-gray-100">
            {submissions.map((submission, index) => {
              const statusBadge = getStatusBadge(submission.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={submission.id}
                  className="grid md:grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Attempt Number */}
                  <div className="flex items-center">
                    <span className="font-semibold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {submissions.length - index}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="col-span-2 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {submission.date}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {submission.time}
                      </p>
                    </div>
                  </div>

                  {/* Grade */}
                  <div className="flex items-center">
                    <span className="text-2xl font-bold" style={{
                      fontFamily: 'Inter, sans-serif',
                      color: submission.grade >= 80 ? '#10b981' : submission.grade >= 60 ? '#f59e0b' : '#ef4444'
                    }}>
                      {submission.grade}
                    </span>
                  </div>

                  {/* Tests */}
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {submission.testsPassed}/{submission.testsTotal}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <div
                      className="flex items-center gap-2 px-3 py-1 rounded-lg"
                      style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}
                    >
                      <StatusIcon size={16} />
                      <span className="text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {submission.status === 'passed' && (isKinyarwanda ? 'Byatsinze' : 'Passed')}
                        {submission.status === 'failed' && (isKinyarwanda ? 'Byanze' : 'Failed')}
                        {submission.status === 'partial' && (isKinyarwanda ? 'Bimwe' : 'Partial')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewSubmission(submission.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                      title={isKinyarwanda ? 'Reba' : 'View'}
                    >
                      <Eye size={18} className="text-[#0ea5e9]" />
                    </button>
                    <button
                      onClick={() => onDownloadCode(submission.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                      title={isKinyarwanda ? 'Kuramo' : 'Download'}
                    >
                      <Download size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {submissions.length === 0 && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#1e293b] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Nta mateka' : 'No Submissions Yet'}
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda
                ? 'Uzabona amateka yawe hano iyo utanze umushinga wawe wa mbere'
                : 'Your submission history will appear here after you submit'}
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-[#0ea5e9] rounded-xl p-6">
          <h3 className="font-bold text-[#0ea5e9] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Menya' : 'Good to Know'}
          </h3>
          <ul className="space-y-1 text-sm text-[#0369a1]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <li>• {isKinyarwanda ? 'Ushobora gutanga inshuro nyinshi' : 'You can submit multiple times'}</li>
            <li>• {isKinyarwanda ? 'Amanota yawe meza azakurikirwa' : 'Your best grade will be recorded'}</li>
            <li>• {isKinyarwanda ? 'Ushobora kureba ibigeragezo byawe byose' : 'You can review all your past attempts'}</li>
            <li>• {isKinyarwanda ? 'Umwarimu azareba gusa ibigeragezo bya nyuma' : 'Teacher will review your latest submission'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
