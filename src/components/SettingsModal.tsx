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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Timer Einstellungen</h2>
        
        <div className="space-y-4">
          {/* Work Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Arbeitszeit (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localWorkTime}
              onChange={(e) => setLocalWorkTime(parseInt(e.target.value) || 25)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Short Break */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kurze Pause (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={localShortBreak}
              onChange={(e) => setLocalShortBreak(parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Long Break */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lange Pause (Minuten)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localLongBreak}
              onChange={(e) => setLocalLongBreak(parseInt(e.target.value) || 15)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
