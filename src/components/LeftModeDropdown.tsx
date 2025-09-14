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


  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          theme === 'light'
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <span className="text-sm font-bold">●</span>
        <span>{getModeText(mode)}</span>
        <span className={`transform transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-48 rounded-lg shadow-lg z-50">
          <div className={`py-1 ${
            theme === 'light'
              ? 'bg-white border border-gray-200'
              : 'bg-gray-800 border border-gray-700'
          }`}>
            {(['work', 'shortBreak', 'longBreak'] as const).map((modeOption) => (
              <button
                key={modeOption}
                onClick={() => {
                  onModeChange(modeOption);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 ${
                  mode === modeOption
                    ? theme === 'light'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-gray-700 text-white'
                    : theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-sm font-bold">●</span>
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
