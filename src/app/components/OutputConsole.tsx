import { useState } from 'react';
import { Terminal, Monitor } from 'lucide-react';

interface OutputConsoleProps {
  output: string;
  previewSrc: string;
  isRunning: boolean;
  language: 'EN' | 'KIN';
}

type Tab = 'console' | 'preview';

export function OutputConsole({ output, previewSrc, isRunning, language }: OutputConsoleProps) {
  const isKinyarwanda = language === 'KIN';
  const [tab, setTab] = useState<Tab>('console');

  return (
    <div className="h-full flex flex-col bg-[#f1f5f9] border-l border-t border-[#e2e8f0]">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#e2e8f0] bg-white shrink-0">
        <button
          onClick={() => setTab('console')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'console'
              ? 'border-[#0ea5e9] text-[#0ea5e9]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Terminal size={14} />
          {isKinyarwanda ? 'Ibyavuye' : 'Console'}
        </button>
        <button
          onClick={() => setTab('preview')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'preview'
              ? 'border-[#f97316] text-[#f97316]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Monitor size={14} />
          {isKinyarwanda ? 'Reba' : 'Preview'}
        </button>

        <div className="ml-auto flex items-center gap-2 pr-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isRunning ? '#10b981' : '#94a3b8' }} />
          {isRunning && (
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isKinyarwanda ? 'Irakora...' : 'Running...'}
            </span>
          )}
        </div>
      </div>

      {/* Console tab */}
      {tab === 'console' && (
        <div className="flex-1 overflow-y-auto p-4">
          {isRunning && !output ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="animate-spin text-2xl">⏳</span>
                <p className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isKinyarwanda ? 'Kode yawe irakora...' : 'Running your code...'}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
              <p className="text-gray-400 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda
                  ? 'Nta byavuye. Kurura kode yawe hanyuma urebe ibyavuye hano.'
                  : 'No output yet. Run your code to see results here.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview tab */}
      {tab === 'preview' && (
        <div className="flex-1 bg-white overflow-hidden">
          {previewSrc ? (
            <iframe
              srcDoc={previewSrc}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
              title="preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isKinyarwanda
                  ? 'Kurura kode yawe kugirango urebe preview.'
                  : 'Run your code to see the preview here.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
