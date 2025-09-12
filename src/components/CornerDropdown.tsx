'use client';

import { useState } from 'react';

interface CornerDropdownProps {
  onReset: () => void;
  onSettings: () => void;
  theme: 'light' | 'dark';
}

export default function CornerDropdown({ onReset, onSettings, theme }: CornerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          theme === 'light'
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <span className={`transform transition-transform duration-200 ${
          isOpen ? 'rotate-45' : ''
        }`}>
          +
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2">
          <button
            onClick={() => {
              onReset();
              setIsOpen(false);
            }}
            className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
              theme === 'light'
                ? 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title="Reset"
          >
            ↻
          </button>
          <button
            onClick={() => {
              onSettings();
              setIsOpen(false);
            }}
            className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
              theme === 'light'
                ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title="Einstellungen"
          >
            ⚙️
          </button>
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
