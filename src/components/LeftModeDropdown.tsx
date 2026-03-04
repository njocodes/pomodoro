'use client';

import { useState } from 'react';

interface LeftModeDropdownProps {
  mode: 'work' | 'shortBreak' | 'longBreak';
  onModeChange: (mode: 'work' | 'shortBreak' | 'longBreak') => void;
  theme: 'light' | 'dark';
}

export default function LeftModeDropdown({ mode, onModeChange, theme }: LeftModeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getModeText = (mode: 'work' | 'shortBreak' | 'longBreak') => {
    return mode === 'work' ? 'Arbeit' : 
           mode === 'shortBreak' ? 'Kurze Pause' : 'Lange Pause';
  };

  const getModeAccent = (modeValue: 'work' | 'shortBreak' | 'longBreak') => {
    if (theme === 'light') {
      return modeValue === 'work' ? 'text-orange-600' : modeValue === 'shortBreak' ? 'text-emerald-600' : 'text-sky-600';
    }
    return modeValue === 'work' ? 'text-orange-300' : modeValue === 'shortBreak' ? 'text-emerald-300' : 'text-sky-300';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Modusauswahl öffnen"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-md transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white/85 border border-white/70 text-gray-700 hover:bg-white'
            : 'bg-slate-900/85 border border-slate-700/70 text-gray-200 hover:bg-slate-800/95'
        }`}
      >
        <span className={`text-sm font-bold ${getModeAccent(mode)}`}>●</span>
        <span>{getModeText(mode)}</span>
        <span className={`transform transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-52 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className={`py-1 backdrop-blur-md ${
            theme === 'light'
              ? 'bg-white/95 border border-white/70'
              : 'bg-slate-900/95 border border-slate-700/70'
          }`}>
            {(['work', 'shortBreak', 'longBreak'] as const).map((modeOption) => (
              <button
                key={modeOption}
                onClick={() => {
                  onModeChange(modeOption);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200 ${
                  mode === modeOption
                    ? theme === 'light'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-slate-700 text-white'
                    : theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                <span className={`text-sm font-bold ${getModeAccent(modeOption)}`}>●</span>
                <span>{getModeText(modeOption)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
