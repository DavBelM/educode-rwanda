import React from 'react';

interface StateSelectorProps {
  currentState: 'empty' | 'success' | 'error' | 'loading';
  onStateChange: (state: 'empty' | 'success' | 'error' | 'loading') => void;
}

export function StateSelector({ currentState, onStateChange }: StateSelectorProps) {
  const states = [
    { id: 'empty' as const, label: 'Empty', color: '#94a3b8' },
    { id: 'success' as const, label: 'Success', color: '#10b981' },
    { id: 'error' as const, label: 'Error', color: '#ef4444' },
    { id: 'loading' as const, label: 'Loading', color: '#8b5cf6' }
  ];

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-3 z-50 hidden lg:block">
      <p className="text-xs font-semibold text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        Demo States
      </p>
      <div className="flex gap-2">
        {states.map((state) => (
          <button
            key={state.id}
            onClick={() => onStateChange(state.id)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: currentState === state.id ? state.color : 'transparent',
              color: currentState === state.id ? 'white' : state.color,
              border: `2px solid ${state.color}`,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {state.label}
          </button>
        ))}
      </div>
    </div>
  );
}
