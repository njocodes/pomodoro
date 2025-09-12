'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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
  onSave 
}: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();
  const [localWorkTime, setLocalWorkTime] = useState(workTime);
  const [localShortBreak, setLocalShortBreak] = useState(shortBreak);
  const [localLongBreak, setLocalLongBreak] = useState(longBreak);

  const handleSave = () => {
    onSave(localWorkTime, localShortBreak, localLongBreak);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md mx-2 sm:mx-4 shadow-2xl ${
        theme === 'light'
          ? 'bg-white border border-gray-200'
          : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50'
      }`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-center ${
          theme === 'light'
            ? 'text-gray-900'
            : 'text-white'
        }`}>
          Timer Einstellungen
        </h2>
        
        <div className="space-y-6">
          {/* Theme Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl border">
            <span className={`font-semibold ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Theme
            </span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Work Time */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Arbeitszeit (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localWorkTime}
              onChange={(e) => setLocalWorkTime(parseInt(e.target.value) || 25)}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                theme === 'light'
                  ? 'bg-gray-100 border border-gray-300 text-gray-900 focus:ring-gray-500/50 focus:border-gray-500/50'
                  : 'bg-gray-700/50 border border-gray-600/50 text-white focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm'
              }`}
            />
          </div>

          {/* Short Break */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Kurze Pause (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={localShortBreak}
              onChange={(e) => setLocalShortBreak(parseInt(e.target.value) || 5)}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                theme === 'light'
                  ? 'bg-gray-100 border border-gray-300 text-gray-900 focus:ring-gray-500/50 focus:border-gray-500/50'
                  : 'bg-gray-700/50 border border-gray-600/50 text-white focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm'
              }`}
            />
          </div>

          {/* Long Break */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Lange Pause (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localLongBreak}
              onChange={(e) => setLocalLongBreak(parseInt(e.target.value) || 15)}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                theme === 'light'
                  ? 'bg-gray-100 border border-gray-300 text-gray-900 focus:ring-gray-500/50 focus:border-gray-500/50'
                  : 'bg-gray-700/50 border border-gray-600/50 text-white focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              theme === 'light'
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              theme === 'light'
                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
