import React from 'react';
import { Play } from 'lucide-react';

interface RunCodeButtonProps {
  onClick: () => void;
  isRunning: boolean;
  language: 'EN' | 'KIN';
  isMobile?: boolean;
}

export function RunCodeButton({ onClick, isRunning, language, isMobile = false }: RunCodeButtonProps) {
  const isKinyarwanda = language === 'KIN';

  return (
    <div className={`flex flex-col gap-2 ${isMobile ? 'items-center w-full' : 'items-start'}`}>
      <button
        onClick={onClick}
        disabled={isRunning}
        className={`flex items-center justify-center gap-3 rounded-lg transition-all disabled:opacity-60 ${isMobile ? 'w-full' : ''}`}
        style={{
          backgroundColor: '#0ea5e9',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          color: 'white',
          padding: '14px 28px',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
          fontSize: '17px'
        }}
      >
        {isRunning ? (
          <>
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 19.07L16.24 16.24M19.07 4.93L16.24 7.76M4.93 19.07L7.76 16.24M4.93 4.93L7.76 7.76" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{isKinyarwanda ? 'Irakora...' : 'Running...'}</span>
          </>
        ) : (
          <>
            <Play size={20} fill="white" />
            <span>{isKinyarwanda ? 'Kora Code' : 'Run Code'}</span>
          </>
        )}
      </button>

      {/* Keyboard shortcut hint */}
      {!isRunning && (
        <div className="flex items-center gap-1 px-2 text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#94a3b8' }}>
          <kbd className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Enter
          </kbd>
        </div>
      )}
    </div>
  );
}
