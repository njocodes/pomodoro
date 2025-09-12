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
    if (theme === 'light') {
      return mode === 'work' ? 'bg-red-500' : 
             mode === 'shortBreak' ? 'bg-green-500' : 'bg-blue-500';
    } else {
      return mode === 'work' ? 'bg-gray-600' : 
             mode === 'shortBreak' ? 'bg-gray-500' : 'bg-gray-700';
    }
  };

  const getModeText = () => {
    return mode === 'work' ? 'Arbeitszeit' : 
           mode === 'shortBreak' ? 'Kurze Pause' : 'Lange Pause';
  };

  return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 ${
      theme === 'light' 
        ? 'bg-gray-100 text-gray-900' 
        : 'bg-black text-white'
    }`}>
      <div className="text-center w-full max-w-4xl mx-auto px-2 sm:px-4">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 ${
          theme === 'light'
            ? 'text-gray-900'
            : 'text-white'
        }`}>
          Pomodoro Timer
        </h1>
        <p className={`text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Fokussiere dich, arbeite produktiv
        </p>
        
        {/* Mode selector */}
        <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 md:mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
              mode === 'work' 
                ? theme === 'light'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-white'
                : theme === 'light'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Arbeit
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
              mode === 'shortBreak' 
                ? theme === 'light'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-white'
                : theme === 'light'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Kurze Pause
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
              mode === 'longBreak' 
                ? theme === 'light'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-white'
                : theme === 'light'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Lange Pause
          </button>
        </div>

        {/* Timer display */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 ${
            theme === 'light'
              ? 'bg-white border border-gray-200'
              : 'bg-gray-900 border border-gray-700'
          }`}>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-center ${
              theme === 'light'
                ? 'text-gray-900'
                : 'text-white'
            }`}>
              {getModeText()}
            </h2>
            <FlippingClock timeLeft={timeLeft} theme={theme} />
            <ProgressBar progress={getProgress()} color={getProgressColor()} theme={theme} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
          <button
            onClick={toggleTimer}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
              isRunning 
                ? theme === 'light'
                  ? 'bg-gray-900 hover:bg-gray-800 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
                : theme === 'light'
                  ? 'bg-gray-700 hover:bg-gray-800 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
              theme === 'light'
                ? 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            Reset
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
              theme === 'light'
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Einstellungen
          </button>
        </div>

        {/* Pomodoro counter */}
        <div className={`rounded-lg px-4 py-3 ${
          theme === 'light'
            ? 'bg-gray-100 border border-gray-200'
            : 'bg-gray-800 border border-gray-700'
        }`}>
          <div className={`text-sm font-medium ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Pomodoros heute: <span className={`font-bold ${
              theme === 'light'
                ? 'text-gray-900'
                : 'text-white'
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