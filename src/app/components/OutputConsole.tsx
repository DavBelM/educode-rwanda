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
    <div className="h-full flex flex-col" style={{ background: '#0d0f14', borderLeft: '1px solid rgba(255,255,255,0.06)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Tab bar */}
      <div className="flex items-center shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#13161e' }}>
        <button
          onClick={() => setTab('console')}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
          style={{
            fontFamily: 'Inter, sans-serif',
            borderBottomColor: tab === 'console' ? '#0ea5e9' : 'transparent',
            color: tab === 'console' ? '#0ea5e9' : '#475569',
          }}
        >
          <Terminal size={14} />
          {isKinyarwanda ? 'Konsole (Console)' : 'Console'}
        </button>
        <button
          onClick={() => setTab('preview')}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
          style={{
            fontFamily: 'Inter, sans-serif',
            borderBottomColor: tab === 'preview' ? '#f97316' : 'transparent',
            color: tab === 'preview' ? '#f97316' : '#475569',
          }}
        >
          <Monitor size={14} />
          {isKinyarwanda ? 'Reba' : 'Preview'}
        </button>

        <div className="ml-auto flex items-center gap-2 pr-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isRunning ? '#10b981' : '#334155' }} />
          {isRunning && (
            <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#475569' }}>
              {isKinyarwanda ? 'Biratangira...' : 'Running...'}
            </span>
          )}
        </div>
      </div>

      {/* Console tab */}
      {tab === 'console' && (
        <div className="flex-1 overflow-y-auto p-4">
          {isRunning && !output ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center gap-2">
                <span className="animate-spin text-2xl">⏳</span>
                <p className="font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8' }}>
                  {isKinyarwanda ? 'Code yawe irimo gukora...' : 'Running your code...'}
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
              className="text-sm whitespace-pre-wrap"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0' }}
            >
              {output}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-sm" style={{ fontFamily: 'Inter, sans-serif', color: '#334155' }}>
                {isKinyarwanda
                  ? 'Nta gisubizo kirahoneka. Tangiza code yawe ubone ibisubizo hano.'
                  : 'No output yet. Run your code to see results here.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview tab — keep white background intentionally since it renders HTML */}
      {tab === 'preview' && (
        <div className="flex-1 overflow-hidden" style={{ background: '#1a1e2a' }}>
          {previewSrc ? (
            <iframe
              srcDoc={previewSrc}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
              title="preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-sm" style={{ fontFamily: 'Inter, sans-serif', color: '#334155' }}>
                {isKinyarwanda
                  ? 'Tangiza code yawe ubone uko bimeze hano.'
                  : 'Run your code to see the preview here.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
