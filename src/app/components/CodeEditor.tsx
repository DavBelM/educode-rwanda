import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: 'EN' | 'KIN';
  errorLine?: number;
}

export function CodeEditor({ code, onChange, language, errorLine }: CodeEditorProps) {
  const isKinyarwanda = language === 'KIN';
  const lines = code.split('\n');

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Wandika kode yawe' : 'Code Editor'}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isKinyarwanda ? 'Imyitozo: Gukoresha ibihwanye' : 'Variables Practice'}
          </span>
          <div className="flex gap-2 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          JavaScript
        </span>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* Line numbers with grid lines and error highlighting */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#181825] flex flex-col items-center py-4 border-r border-gray-700 z-10">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="text-xs leading-6 relative w-full text-center"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                color: errorLine === i + 1 ? '#ef4444' : 'rgba(148, 163, 184, 0.4)',
                fontWeight: errorLine === i + 1 ? 600 : 400,
                backgroundColor: errorLine === i + 1 ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
              }}
            >
              {i + 1}
              {/* Grid line every 5 lines */}
              {(i + 1) % 5 === 0 && (
                <div className="absolute right-0 top-1/2 w-screen h-px bg-gray-700 opacity-20"></div>
              )}
            </div>
          ))}
        </div>

        {/* Code content with error highlighting */}
        <div className="absolute inset-0 pl-12">
          <div className="relative h-full">
            <textarea
              value={code}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full bg-transparent text-gray-100 pl-4 pr-4 py-4 resize-none focus:outline-none relative z-20"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px',
                lineHeight: '24px'
              }}
              placeholder={isKinyarwanda ? '// Andika kode yawe hano...' : '// Write your code here...'}
              spellCheck={false}
            />
            {/* Error underline overlay */}
            {errorLine && (
              <div
                className="absolute left-0 right-0 pointer-events-none z-10"
                style={{
                  top: `${(errorLine - 1) * 24 + 16}px`,
                  height: '24px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)'
                }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: '2px',
                    backgroundImage: 'repeating-linear-gradient(90deg, #ef4444 0px, #ef4444 4px, transparent 4px, transparent 8px)',
                    backgroundSize: '8px 2px'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
