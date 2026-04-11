import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MobileAssignmentCardProps {
  language: 'EN' | 'KIN';
}

export function MobileAssignmentCard({ language }: MobileAssignmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-[#1e293b] mb-1" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
            {isKinyarwanda ? 'Umushinga: Kubara Igiciro Cyose' : 'Assignment: Calculate Total Price'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#10b981] text-white flex items-center gap-1">
              3/5 {isKinyarwanda ? 'Byatsinze' : 'Tests Passed'} ✓
            </span>
          </div>
        </div>
        <div className="ml-2">
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Intego:' : 'Objective:'}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda
                ? 'Koresha variables kugirango ubaze igiciro cyose cy\'ibicuruzwa'
                : 'Use variables to calculate the total price of products'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Ibizamini:' : 'Tests:'}
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-[#10b981] flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
                <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Gushyiraho variables' : 'Define variables'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-[#10b981] flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
                <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Kubara igiciro' : 'Calculate total'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-[#10b981] flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
                <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Kwerekana ibyavuye' : 'Display output'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-[10px]">○</span>
                </div>
                <span className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Gukoresha input validation' : 'Add input validation'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-[10px]">○</span>
                </div>
                <span className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Kugabanya igiciro' : 'Apply discount'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda
                ? '⏱️ Igihe gisigaye: 45 iminota'
                : '⏱️ Time remaining: 45 minutes'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
