import React, { useState } from 'react';
import { Bot, Lightbulb, MessageSquare, BookOpen, Video, Users, ChevronRight } from 'lucide-react';

interface HelpPageProps {
  language: 'EN' | 'KIN';
  assignmentTitle: string;
  commonIssues: Array<{ question: string; answer: string }>;
  onAskAI: () => void;
  onContactTeacher: () => void;
}

export function HelpPage({
  language,
  assignmentTitle,
  commonIssues,
  onAskAI,
  onContactTeacher
}: HelpPageProps) {
  const isKinyarwanda = language === 'KIN';
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <Lightbulb size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda ? 'Ubufasha & Amabwiriza' : 'Help & Hints'}
              </h1>
              <p className="text-lg opacity-90" style={{ fontFamily: 'Inter, sans-serif' }}>
                {assignmentTitle}
              </p>
            </div>
          </div>
          <p className="text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda
              ? 'Niba wafashe ibibazo, dufite uburyo butandukanye bwo guha ubufasha'
              : 'Stuck on the assignment? We have several ways to help you succeed'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Quick Help Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Assistant */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all cursor-pointer" onClick={onAskAI}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#8b5cf6] flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <ChevronRight size={24} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-[#1e293b] text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Baza AI' : 'Ask AI Assistant'}
            </h3>
            <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda
                ? 'Baza ibibazo by\'ihariye ku kode yawe ugahabwa ibisubizo by\'agateganyo'
                : 'Get instant help with specific questions about your code'}
            </p>
            <span className="text-[#8b5cf6] font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Igihe: By\'agateganyo' : 'Response: Instant'}
            </span>
          </div>

          {/* Contact Teacher */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all cursor-pointer" onClick={onContactTeacher}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#0ea5e9] flex items-center justify-center">
                <MessageSquare size={24} className="text-white" />
              </div>
              <ChevronRight size={24} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-[#1e293b] text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Vugana n\'Umwarimu' : 'Contact Teacher'}
            </h3>
            <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda
                ? 'Ohereza ubutumwa ku mwarimu wawe kugirango ubone ubufasha bwihariye'
                : 'Send a message to your teacher for personalized guidance'}
            </p>
            <span className="text-[#0ea5e9] font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Igihe: Isaha 1-24' : 'Response: 1-24 hours'}
            </span>
          </div>
        </div>

        {/* Common Issues FAQ */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={24} className="text-[#10b981]" />
            <h2 className="text-xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibibazo Bikunze Kubazwa' : 'Common Issues'}
            </h2>
          </div>
          <div className="space-y-3">
            {commonIssues.map((issue, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all"
                >
                  <span className="font-semibold text-[#1e293b] text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {issue.question}
                  </span>
                  <ChevronRight
                    size={20}
                    className={`text-gray-400 transition-transform ${expandedIndex === index ? 'rotate-90' : ''}`}
                  />
                </button>
                {expandedIndex === index && (
                  <div className="px-4 pb-4 pt-2 bg-[#f8fafc] border-t border-gray-200">
                    <p className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {issue.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Learning Resources */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Video size={24} className="text-[#f59e0b]" />
            <h2 className="text-xl font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibikoresho byo Kwiga' : 'Learning Resources'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#0ea5e9] hover:bg-blue-50 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0ea5e9] flex items-center justify-center flex-shrink-0">
                <Video size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#1e293b] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Amashusho' : 'Video Tutorial'}
                </p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  15 {isKinyarwanda ? 'iminota' : 'minutes'}
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#10b981] hover:bg-green-50 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#10b981] flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#1e293b] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Inyandiko' : 'Written Guide'}
                </p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  5 {isKinyarwanda ? 'iminota gusoma' : 'min read'}
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#8b5cf6] hover:bg-purple-50 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#1e293b] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Itsinda ry\'Abanyeshuri' : 'Study Group'}
                </p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Vugana n\'abandi' : 'Connect with peers'}
                </p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#f59e0b] hover:bg-amber-50 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b] flex items-center justify-center flex-shrink-0">
                <Lightbulb size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#1e293b] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Ingero z\'Urugero' : 'Code Examples'}
                </p>
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Reba ingero' : 'View examples'}
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-xl border-2 border-[#10b981] p-6">
          <h3 className="font-bold text-[#10b981] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Inama zo Gukemura Ibibazo' : 'Problem-Solving Tips'}
          </h3>
          <ul className="space-y-2 text-sm text-[#166534]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <li>• {isKinyarwanda ? 'Soma neza ibisabwa by\'umushinga' : 'Carefully read the assignment requirements'}</li>
            <li>• {isKinyarwanda ? 'Tangira n\'ibihugu by\'ibanze hanyuma wongere' : 'Start with basic functionality, then add more'}</li>
            <li>• {isKinyarwanda ? 'Gerageza kode yawe kenshi' : 'Test your code frequently as you write'}</li>
            <li>• {isKinyarwanda ? 'Koresha console.log() kugirango urebe ibikora' : 'Use console.log() to debug and check values'}</li>
            <li>• {isKinyarwanda ? 'Ntutinye gusaba ubufasha!' : 'Don\'t hesitate to ask for help!'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
