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
        aria-label="Schnellaktionen öffnen"
        aria-expanded={isOpen}
        className={`w-12 h-12 rounded-full shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white/85 border border-white/70 text-gray-700 hover:bg-white'
            : 'bg-slate-900/85 border border-slate-700/70 text-gray-200 hover:bg-slate-800/95'
        }`}
      >
        <span className={`text-xl leading-none transform transition-transform duration-200 ${
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
            className={`w-11 h-11 rounded-full shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 ${
              theme === 'light'
                ? 'bg-orange-100/95 border border-orange-200 text-orange-700 hover:bg-orange-200'
                : 'bg-orange-500/20 border border-orange-400/30 text-orange-200 hover:bg-orange-500/30'
            }`}
            title="Reset"
          >
            <span className="text-base">↻</span>
          </button>
          <button
            onClick={() => {
              onSettings();
              setIsOpen(false);
            }}
            className={`w-11 h-11 rounded-full shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 ${
              theme === 'light'
                ? 'bg-sky-100/95 border border-sky-200 text-sky-700 hover:bg-sky-200'
                : 'bg-sky-500/20 border border-sky-400/30 text-sky-200 hover:bg-sky-500/30'
            }`}
            title="Einstellungen"
          >
            <span className="text-base">⚙</span>
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
