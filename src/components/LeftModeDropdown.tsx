'use client';

import { useState } from 'react';

interface LeftModeDropdownProps {
  mode: 'work' | 'shortBreak' | 'longBreak';
  onModeChange: (mode: 'work' | 'shortBreak' | 'longBreak') => void;
}

export default function LeftModeDropdown({ mode, onModeChange }: LeftModeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getModeText = (m: 'work' | 'shortBreak' | 'longBreak') =>
    m === 'work' ? 'Arbeit' : m === 'shortBreak' ? 'Kurze Pause' : 'Lange Pause';

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Modusauswahl öffnen"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium shadow-lg backdrop-blur-md transition-all duration-200"
        style={{
          background: 'rgba(22,21,19,0.9)',
          border: '1px solid #2a2825',
          color: '#a8a29a',
        }}
      >
        <span style={{ color: '#d97757', fontSize: '0.5rem' }}>●</span>
        <span style={{ color: '#f5f0e8' }}>{getModeText(mode)}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute bottom-16 left-0 w-48 rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ background: 'rgba(22,21,19,0.97)', border: '1px solid #2a2825' }}
        >
          <div className="py-1">
            {(['work', 'shortBreak', 'longBreak'] as const).map((modeOption) => (
              <button
                key={modeOption}
                onClick={() => { onModeChange(modeOption); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200"
                style={{
                  background: mode === modeOption ? '#26241f' : 'transparent',
                  color: mode === modeOption ? '#f5f0e8' : '#a8a29a',
                }}
              >
                <span style={{ color: mode === modeOption ? '#d97757' : '#6b6862', fontSize: '0.5rem' }}>●</span>
                <span>{getModeText(modeOption)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
