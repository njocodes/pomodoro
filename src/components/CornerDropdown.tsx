'use client';

import { useState } from 'react';

interface CornerDropdownProps {
  onReset: () => void;
  onSettings: () => void;
}

export default function CornerDropdown({ onReset, onSettings }: CornerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Schnellaktionen öffnen"
        aria-expanded={isOpen}
        className="w-12 h-12 rounded-full shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(22,21,19,0.9)',
          border: '1px solid #2a2825',
          color: '#a8a29a',
        }}
      >
        <span className={`text-xl leading-none transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2">
          <button
            onClick={() => { onReset(); setIsOpen(false); }}
            className="w-11 h-11 rounded-full shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(22,21,19,0.9)',
              border: '1px solid #2a2825',
              color: '#a8a29a',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f5f0e8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#a8a29a')}
            title="Reset"
          >
            <span className="text-base">↻</span>
          </button>
          <button
            onClick={() => { onSettings(); setIsOpen(false); }}
            className="w-11 h-11 rounded-full shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(22,21,19,0.9)',
              border: '1px solid #2a2825',
              color: '#a8a29a',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f5f0e8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#a8a29a')}
            title="Einstellungen"
          >
            <span className="text-base">⚙</span>
          </button>
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
