'use client';

import { useState, useEffect } from 'react';
import FlippingClock from '@/components/FlippingClock';
import ProgressBar from '@/components/ProgressBar';
import EdgeProgressBar from '@/components/EdgeProgressBar';
import MobileModeDropdown from '@/components/MobileModeDropdown';
import CornerDropdown from '@/components/CornerDropdown';
import SettingsModal from '@/components/SettingsModal';
import { useTheme } from '@/contexts/ThemeContext';
import { useTimer } from '@/hooks/useTimer';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function Home() {
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();
  
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

  // Handle spacebar for fullscreen toggle
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setIsFullscreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle touch to start/stop on mobile
  const handleTouchStart = () => {
    if (isMobile && !isFullscreen) {
      toggleTimer();
    }
  };

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

  if (isFullscreen) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center ${
        theme === 'light' 
          ? 'bg-gray-100 text-gray-900' 
          : 'bg-black text-white'
      }`}>
        {/* Edge Progress Bars */}
        <EdgeProgressBar progress={getProgress()} theme={theme} />
        
        {/* Large Clock - 70% of screen */}
        <div className="w-full h-[70vh] flex flex-col items-center justify-center">
          <div className="scale-[2] sm:scale-[2.5] md:scale-[3]">
            <FlippingClock timeLeft={timeLeft} theme={theme} isFullscreen={true} />
          </div>
        </div>
        
        {/* Small Control Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={toggleTimer}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
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
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
              theme === 'light'
                ? 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            Reset
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
              theme === 'light'
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Einstellungen
          </button>
        </div>
        
        {/* Mode indicator */}
        <div className={`text-sm font-medium mt-2 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {getModeText()}
        </div>
        
        {/* Instructions */}
        <div className={`text-xs mt-4 ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Leertaste für Vollbildmodus
        </div>
      </div>
    );
  }

  return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 ${
      theme === 'light' 
        ? 'bg-gray-100 text-gray-900' 
        : 'bg-black text-white'
    }`}>
      <div className={`text-center w-full mx-auto px-2 sm:px-4 ${
        isMobile ? 'max-w-sm' : 'max-w-4xl'
      }`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-bold mb-2 sm:mb-3 ${
          theme === 'light'
            ? 'text-gray-900'
            : 'text-white'
        }`}>
          Pomodoro Timer
        </h1>
        <p className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base md:text-lg'} mb-6 sm:mb-8 md:mb-10 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Fokussiere dich, arbeite produktiv
        </p>
        
        {/* Mode selector */}
        {isMobile ? (
          <div className="flex justify-center mb-6">
            <MobileModeDropdown 
              mode={mode} 
              onModeChange={switchMode} 
              theme={theme} 
            />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
            <button
              onClick={() => switchMode('work')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
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
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
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
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
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
        )}

        {/* Timer display */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div 
            className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 ${
              theme === 'light'
                ? 'bg-white border border-gray-200'
                : 'bg-gray-900 border border-gray-700'
            } ${isMobile ? 'cursor-pointer' : ''}`}
            onClick={handleTouchStart}
          >
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center ${
              theme === 'light'
                ? 'text-gray-900'
                : 'text-white'
            }`}>
              {getModeText()}
            </h2>
            <FlippingClock timeLeft={timeLeft} theme={theme} isFullscreen={false} />
            <ProgressBar progress={getProgress()} color={getProgressColor()} theme={theme} />
            {isMobile && (
              <div className={`text-xs text-center mt-2 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {isRunning ? 'Tippen zum Pausieren' : 'Tippen zum Starten'}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {!isMobile && (
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
            <button
              onClick={toggleTimer}
              className={`px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 ${
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
              className={`px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              Reset
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className={`px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              Einstellungen
            </button>
          </div>
        )}

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
        
        {/* Instructions */}
        <div className={`text-xs mt-4 ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Leertaste für Vollbildmodus
        </div>
      </div>

      {/* Mobile Corner Dropdown */}
      {isMobile && (
        <CornerDropdown 
          onReset={resetTimer}
          onSettings={() => setShowSettings(true)}
          theme={theme}
        />
      )}

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