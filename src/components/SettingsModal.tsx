'use client';

import { useEffect, useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workTime: number;
  shortBreak: number;
  longBreak: number;
  onSave: (workTime: number, shortBreak: number, longBreak: number) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  workTime,
  shortBreak,
  longBreak,
  onSave,
}: SettingsModalProps) {
  const [localWorkTime, setLocalWorkTime] = useState(workTime);
  const [localShortBreak, setLocalShortBreak] = useState(shortBreak);
  const [localLongBreak, setLocalLongBreak] = useState(longBreak);

  useEffect(() => {
    if (!isOpen) return;
    setLocalWorkTime(workTime);
    setLocalShortBreak(shortBreak);
    setLocalLongBreak(longBreak);
  }, [isOpen, workTime, shortBreak, longBreak]);

  const handleSave = () => {
    onSave(
      localWorkTime === 0 ? 25 : localWorkTime,
      localShortBreak === 0 ? 5 : localShortBreak,
      localLongBreak === 0 ? 15 : localLongBreak,
    );
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all
    bg-[#1c1b19] border border-[#2a2825] text-[#f5f0e8]
    focus:border-[#d97757] focus:ring-2 focus:ring-[#d97757]/20
  `;

  const fields: { label: string; value: number; setter: (v: number) => void; min: number; max: number }[] = [
    { label: 'Arbeitszeit (Minuten)', value: localWorkTime, setter: setLocalWorkTime, min: 1, max: 60 },
    { label: 'Kurze Pause (Minuten)', value: localShortBreak, setter: setLocalShortBreak, min: 1, max: 30 },
    { label: 'Lange Pause (Minuten)', value: localLongBreak, setter: setLocalLongBreak, min: 1, max: 60 },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl"
        style={{ background: '#161513', border: '1px solid #26241f' }}
      >
        <h2 className="text-lg font-semibold tracking-tight text-[#f5f0e8] mb-6 text-center">
          Einstellungen
        </h2>

        <div className="space-y-5">
          {fields.map(({ label, value, setter, min, max }) => (
            <div key={label}>
              <label className="block text-xs font-medium mb-2 tracking-wide uppercase" style={{ color: '#6b6862' }}>
                {label}
              </label>
              <input
                type="number"
                min={min}
                max={max}
                value={value === 0 ? '' : value}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') { setter(0); return; }
                  const n = parseInt(v);
                  if (!isNaN(n) && n >= min && n <= max) setter(n);
                }}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{ color: '#a8a29a', border: '1px solid #2a2825', background: 'transparent' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f5f0e8';
              e.currentTarget.style.background = '#1c1b19';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#a8a29a';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{ background: '#d97757', color: '#1a1512' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#c96a4a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#d97757')}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
