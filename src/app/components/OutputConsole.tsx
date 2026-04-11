import React from 'react';
import { Terminal } from 'lucide-react';

interface OutputConsoleProps {
  output: string;
  isRunning: boolean;
  language: 'EN' | 'KIN';
}

export function OutputConsole({ output, isRunning, language }: OutputConsoleProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className="h-full flex flex-col bg-[#f1f5f9] border-l border-t border-[#e2e8f0]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e2e8f0] bg-white">
        <Terminal size={16} className="text-[#1e293b]" />
        <span className="font-bold text-[#1e293b]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
          {isKinyarwanda ? 'Ibyavuye' : 'Output Console'}
        </span>
        <div className="w-2 h-2 rounded-full ml-2" style={{ backgroundColor: isRunning ? '#10b981' : '#94a3b8' }}></div>
        {isRunning && (
          <span className="text-xs text-gray-500 ml-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Irakora...' : 'Running...'}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isRunning && !output ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="animate-spin text-2xl">⏳</span>
              <p className="text-center font-medium" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
                {isKinyarwanda ? 'Kode yawe irakora...' : 'Running your code...'}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : output ? (
          <pre
            className="text-sm text-[#1e293b] whitespace-pre-wrap"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', lineHeight: '1.6' }}
          >
            {output}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
              {isKinyarwanda
                ? 'Nta byavuye. Kurura kode yawe hanyuma urebe ibyavuye hano.'
                : 'No output yet. Run your code to see results here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
