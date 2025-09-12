'use client';

import { useState } from 'react';

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
  const [localWorkTime, setLocalWorkTime] = useState(workTime);
  const [localShortBreak, setLocalShortBreak] = useState(shortBreak);
  const [localLongBreak, setLocalLongBreak] = useState(longBreak);

  const handleSave = () => {
    onSave(localWorkTime, localShortBreak, localLongBreak);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 w-full max-w-md mx-4 border border-gray-700/50 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ⚙️ Timer Einstellungen
        </h2>
        
        <div className="space-y-6">
          {/* Work Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              ⚡ Arbeitszeit (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localWorkTime}
              onChange={(e) => setLocalWorkTime(parseInt(e.target.value) || 25)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all backdrop-blur-sm"
            />
          </div>

          {/* Short Break */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              ☕ Kurze Pause (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={localShortBreak}
              onChange={(e) => setLocalShortBreak(parseInt(e.target.value) || 5)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all backdrop-blur-sm"
            />
          </div>

          {/* Long Break */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              🍃 Lange Pause (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localLongBreak}
              onChange={(e) => setLocalLongBreak(parseInt(e.target.value) || 15)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 hover:bg-gray-700/50 rounded-xl font-semibold"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            💾 Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
