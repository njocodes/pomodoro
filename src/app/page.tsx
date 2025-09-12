'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import FlippingClock from '@/components/FlippingClock';
import ProgressBar from '@/components/ProgressBar';
import SettingsModal from '@/components/SettingsModal';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings
  const [workTime, setWorkTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    
    if (mode === 'work') {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      
      // Every 4 pomodoros, take a long break
      if (newPomodoroCount % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(longBreak * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(shortBreak * 60);
      }
    } else {
      // Break finished, back to work
      setMode('work');
      setTimeLeft(workTime * 60);
    }
  }, [mode, pomodoroCount, longBreak, shortBreak, workTime]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            playNotificationSound();
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);

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

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(workTime * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreak * 60);
    } else {
      setTimeLeft(longBreak * 60);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') {
      setTimeLeft(workTime * 60);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(shortBreak * 60);
    } else {
      setTimeLeft(longBreak * 60);
    }
  };

  const handleSaveSettings = (newWorkTime: number, newShortBreak: number, newLongBreak: number) => {
    setWorkTime(newWorkTime);
    setShortBreak(newShortBreak);
    setLongBreak(newLongBreak);
    
    // Update current timer if it's not running
    if (!isRunning) {
      if (mode === 'work') {
        setTimeLeft(newWorkTime * 60);
      } else if (mode === 'shortBreak') {
        setTimeLeft(newShortBreak * 60);
      } else {
        setTimeLeft(newLongBreak * 60);
      }
    }
  };

  const getProgress = () => {
    const totalTime = mode === 'work' ? workTime * 60 : 
                     mode === 'shortBreak' ? shortBreak * 60 : longBreak * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Pomodoro Timer
        </h1>
        <p className="text-gray-400 text-lg mb-12">Fokussiere dich, arbeite produktiv</p>
        
        {/* Mode selector */}
        <div className="flex justify-center space-x-3 mb-12">
          <button
            onClick={() => switchMode('work')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              mode === 'work' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/25' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50'
            }`}
          >
            ⚡ Arbeit
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              mode === 'shortBreak' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/25' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50'
            }`}
          >
            ☕ Kurze Pause
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              mode === 'longBreak' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50'
            }`}
          >
            🍃 Lange Pause
          </button>
        </div>

        {/* Timer display */}
        <div className="mb-12">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              {getModeText()}
            </h2>
            <FlippingClock timeLeft={timeLeft} />
            <ProgressBar progress={getProgress()} color={getProgressColor()} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={toggleTimer}
            className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
              isRunning 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-yellow-500/25' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/25'
            }`}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-10 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl text-white"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl text-white shadow-purple-500/25"
          >
            ⚙️ Einstellungen
          </button>
        </div>

        {/* Pomodoro counter */}
        <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-gray-700/30">
          <div className="text-xl font-semibold text-gray-300">
            🍅 Pomodoros heute: <span className="font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">{pomodoroCount}</span>
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