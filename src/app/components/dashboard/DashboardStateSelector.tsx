import React from 'react';

interface DashboardStateSelectorProps {
  currentState: 'full' | 'new-student' | 'high-achiever';
  onStateChange: (state: 'full' | 'new-student' | 'high-achiever') => void;
}

export function DashboardStateSelector({ currentState, onStateChange }: DashboardStateSelectorProps) {
  const states = [
    { id: 'full' as const, label: 'Full Dashboard', color: '#0ea5e9' },
    { id: 'new-student' as const, label: 'New Student', color: '#8b5cf6' },
    { id: 'high-achiever' as const, label: 'High Achiever', color: '#10b981' }
  ];

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-3 z-50 hidden lg:block">
      <p className="text-xs font-semibold text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        Dashboard States
      </p>
      <div className="flex flex-col gap-2">
        {states.map((state) => (
          <button
            key={state.id}
            onClick={() => onStateChange(state.id)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all text-left"
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
