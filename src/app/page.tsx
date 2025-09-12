'use client';

import { useState, useEffect } from 'react';
import FlippingClock from '@/components/FlippingClock';
import ProgressBar from '@/components/ProgressBar';
import SettingsModal from '@/components/SettingsModal';
import { useTheme } from '@/contexts/ThemeContext';
import { useTimer } from '@/hooks/useTimer';

export default function Home() {
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    timeLeft,
    isRunning,
    mode,
    pomodoroCount,
    workTime,
    shortBreak,
    longBreak,
    toggleTimer,
    resetTimer,
    switchMode,
    updateSettings
  } = useTimer();

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Play sound when timer completes
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      playNotificationSound();
    }
  }, [timeLeft, isRunning]);

  const handleSaveSettings = (newWorkTime: number, newShortBreak: number, newLongBreak: number) => {
    updateSettings(newWorkTime, newShortBreak, newLongBreak);
  };

  const getProgress = () => {
    const totalTime = mode === 'work' ? workTime * 60 : 
                     mode === 'shortBreak' ? shortBreak * 60 : longBreak * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getProgressColor = () => {
    return mode === 'work' ? 'bg-red-500' : 
           mode === 'shortBreak' ? 'bg-green-500' : 'bg-blue-500';
  };

  const getModeText = () => {
    return mode === 'work' ? 'Arbeitszeit' : 
           mode === 'shortBreak' ? 'Kurze Pause' : 'Lange Pause';
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900' 
        : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
    }`}>
      <div className="text-center max-w-4xl mx-auto">
        <h1 className={`text-5xl font-bold mb-2 ${
          theme === 'light'
            ? 'text-gray-900'
            : 'text-white'
        }`}>
          Pomodoro Timer
        </h1>
        <p className={`text-lg mb-12 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Fokussiere dich, arbeite produktiv
        </p>
        
        {/* Mode selector */}
        <div className="flex justify-center space-x-3 mb-12">
          <button
            onClick={() => switchMode('work')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              mode === 'work' 
                ? theme === 'light'
                  ? 'bg-gray-900 text-white shadow-gray-900/25'
                  : 'bg-gray-600 text-white shadow-gray-600/25'
                : theme === 'light'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50'
            }`}
          >
            Arbeit
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              mode === 'shortBreak' 
                ? theme === 'light'
                  ? 'bg-gray-900 text-white shadow-gray-900/25'
                  : 'bg-gray-600 text-white shadow-gray-600/25'
                : theme === 'light'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50'
            }`}
          >
            Kurze Pause
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              mode === 'longBreak' 
                ? theme === 'light'
                  ? 'bg-gray-900 text-white shadow-gray-900/25'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25'
                : theme === 'light'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50'
            }`}
          >
            Lange Pause
          </button>
        </div>

        {/* Timer display */}
        <div className="mb-12">
          <div className={`backdrop-blur-sm rounded-3xl p-8 shadow-2xl ${
            theme === 'light'
              ? 'bg-white/80 border border-gray-200'
              : 'bg-gray-800/30 border border-gray-700/50'
          }`}>
            <h2 className={`text-3xl font-bold mb-8 text-center ${
              theme === 'light'
                ? 'text-gray-900'
                : 'bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent'
            }`}>
              {getModeText()}
            </h2>
            <FlippingClock timeLeft={timeLeft} theme={theme} />
            <ProgressBar progress={getProgress()} color={getProgressColor()} theme={theme} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={toggleTimer}
            className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
              isRunning 
                ? theme === 'light'
                  ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/25'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-yellow-500/25'
                : theme === 'light'
                  ? 'bg-gray-700 hover:bg-gray-800 text-white shadow-gray-700/25'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/25'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
              theme === 'light'
                ? 'bg-gray-300 hover:bg-gray-400 text-gray-900 shadow-gray-300/25'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-gray-600/25'
            }`}
          >
            Reset
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
              theme === 'light'
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 shadow-gray-200/25'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-500/25'
            }`}
          >
            Einstellungen
          </button>
        </div>

        {/* Pomodoro counter */}
        <div className={`backdrop-blur-sm rounded-2xl px-8 py-4 ${
          theme === 'light'
            ? 'bg-white/60 border border-gray-200'
            : 'bg-gray-800/20 border border-gray-700/30'
        }`}>
          <div className={`text-xl font-semibold ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Pomodoros heute: <span className={`font-bold ${
              theme === 'light'
                ? 'text-gray-900'
                : 'bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent'
            }`}>{pomodoroCount}</span>
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        workTime={workTime}
        shortBreak={shortBreak}
        longBreak={longBreak}
        onSave={handleSaveSettings}
      />
    </div>
  );
}