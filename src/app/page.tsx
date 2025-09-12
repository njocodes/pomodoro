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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Pomodoro Timer</h1>
        
        {/* Mode selector */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'work' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Arbeit
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'shortBreak' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Kurze Pause
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'longBreak' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Lange Pause
          </button>
        </div>

        {/* Timer display */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-300">{getModeText()}</h2>
          <FlippingClock timeLeft={timeLeft} />
          <ProgressBar progress={getProgress()} color={getProgressColor()} />
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              isRunning 
                ? 'bg-yellow-600 hover:bg-yellow-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Einstellungen
          </button>
        </div>

        {/* Pomodoro counter */}
        <div className="text-lg text-gray-300">
          Pomodoros heute: <span className="font-bold text-red-400">{pomodoroCount}</span>
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