'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  pomodoroCount: number;
  workTime: number;
  shortBreak: number;
  longBreak: number;
  lastUpdate: number;
}

export function useTimer() {
  const [timerState, setTimerState] = useLocalStorage<TimerState>('pomodoro-timer', {
    timeLeft: 25 * 60,
    isRunning: false,
    mode: 'work',
    pomodoroCount: 0,
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    lastUpdate: Date.now()
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate elapsed time since last update
  const getElapsedTime = useCallback(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - timerState.lastUpdate) / 1000);
    return timerState.isRunning ? elapsed : 0;
  }, [timerState.lastUpdate, timerState.isRunning]);

  // Update timer state
  const updateTimerState = useCallback((updates: Partial<TimerState>) => {
    setTimerState(prev => ({
      ...prev,
      ...updates,
      lastUpdate: Date.now()
    }));
  }, [setTimerState]);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setTimerState(prev => {
      if (prev.mode === 'work') {
        const newPomodoroCount = prev.pomodoroCount + 1;
        const newMode = newPomodoroCount % 4 === 0 ? 'longBreak' : 'shortBreak';
        const newTimeLeft = newMode === 'longBreak' ? prev.longBreak * 60 : prev.shortBreak * 60;
        
        return {
          ...prev,
          isRunning: false,
          pomodoroCount: newPomodoroCount,
          mode: newMode,
          timeLeft: newTimeLeft,
          lastUpdate: Date.now()
        };
      } else {
        return {
          ...prev,
          isRunning: false,
          mode: 'work',
          timeLeft: prev.workTime * 60,
          lastUpdate: Date.now()
        };
      }
    });
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          const elapsed = Math.floor((Date.now() - prev.lastUpdate) / 1000);
          const newTimeLeft = Math.max(0, prev.timeLeft - elapsed);
          
          if (newTimeLeft <= 0) {
            // Timer finished - trigger completion
            handleTimerComplete();
            return {
              ...prev,
              timeLeft: 0,
              lastUpdate: Date.now()
            };
          }
          
          return {
            ...prev,
            timeLeft: newTimeLeft,
            lastUpdate: Date.now()
          };
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
  }, [timerState.isRunning, setTimerState]);

  // Check for timer completion
  useEffect(() => {
    if (timerState.timeLeft <= 0 && timerState.isRunning) {
      handleTimerComplete();
    }
  }, [timerState.timeLeft, timerState.isRunning, handleTimerComplete]);

  // Actions
  const toggleTimer = useCallback(() => {
    updateTimerState({ isRunning: !timerState.isRunning });
  }, [timerState.isRunning, updateTimerState]);

  const resetTimer = useCallback(() => {
    updateTimerState(currentState => {
      const timeLeft = currentState.mode === 'work' ? currentState.workTime * 60 :
                      currentState.mode === 'shortBreak' ? currentState.shortBreak * 60 :
                      currentState.longBreak * 60;
      
      return { 
        ...currentState,
        timeLeft, 
        isRunning: false 
      };
    });
  }, [updateTimerState]);

  const switchMode = useCallback((newMode: TimerMode) => {
    // Use the current state values to ensure we get the latest settings
    updateTimerState(currentState => {
      const timeLeft = newMode === 'work' ? currentState.workTime * 60 :
                      newMode === 'shortBreak' ? currentState.shortBreak * 60 :
                      currentState.longBreak * 60;
      
      return { 
        ...currentState,
        mode: newMode, 
        timeLeft, 
        isRunning: false 
      };
    });
  }, [updateTimerState]);

  const updateSettings = useCallback((workTime: number, shortBreak: number, longBreak: number) => {
    updateTimerState(currentState => {
      const newState = { 
        ...currentState,
        workTime, 
        shortBreak, 
        longBreak 
      };
      
      // Update current timer if not running
      if (!currentState.isRunning) {
        const timeLeft = currentState.mode === 'work' ? workTime * 60 :
                        currentState.mode === 'shortBreak' ? shortBreak * 60 :
                        longBreak * 60;
        newState.timeLeft = timeLeft;
      }
      
      return newState;
    });
  }, [updateTimerState]);

  return {
    ...timerState,
    toggleTimer,
    resetTimer,
    switchMode,
    updateSettings
  };
}
