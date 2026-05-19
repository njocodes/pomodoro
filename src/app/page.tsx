'use client';

import { useState, useEffect, useRef } from 'react';
import FlippingClock from '@/components/FlippingClock';
import EdgeProgressBar from '@/components/EdgeProgressBar';
import LeftModeDropdown from '@/components/LeftModeDropdown';
import CornerDropdown from '@/components/CornerDropdown';
import SettingsModal from '@/components/SettingsModal';
import { useTimer } from '@/hooks/useTimer';
import { useIsMobile } from '@/hooks/useIsMobile';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const MODES: { key: TimerMode; label: string }[] = [
  { key: 'work', label: 'Arbeit' },
  { key: 'shortBreak', label: 'Kurze Pause' },
  { key: 'longBreak', label: 'Lange Pause' },
];

const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Arbeitszeit',
  shortBreak: 'Kurze Pause',
  longBreak: 'Lange Pause',
};

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const isMobile = useIsMobile();
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousCompletionCountRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    timeLeft,
    isRunning,
    mode,
    pomodoroCount,
    completionCount,
    workTime,
    shortBreak,
    longBreak,
    toggleTimer,
    resetTimer,
    switchMode,
    updateSettings,
  } = useTimer();

  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Could not play notification sound:', e);
    }
  };

  useEffect(() => {
    if (previousCompletionCountRef.current === null) {
      previousCompletionCountRef.current = completionCount;
      return;
    }
    if (completionCount > previousCompletionCountRef.current) {
      setIsCompleted(true);
      if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = setTimeout(() => setIsCompleted(false), 2000);
      playNotificationSound();
    }
    previousCompletionCountRef.current = completionCount;
  }, [completionCount]);

  useEffect(() => {
    return () => { if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current); };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showSettings) {
        e.preventDefault();
        e.stopPropagation();
        setIsFullscreen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyPress, true);
    return () => document.removeEventListener('keydown', handleKeyPress, true);
  }, [showSettings]);

  const getProgress = () => {
    const total = mode === 'work' ? workTime * 60 : mode === 'shortBreak' ? shortBreak * 60 : longBreak * 60;
    return Math.min(100, Math.max(0, ((total - timeLeft) / total) * 100));
  };

  // Dot indicator — 4-pomodoro cycle
  const completedInCycle = pomodoroCount % 4;

  // --- Fullscreen ---
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: '#0d0c0b' }}>
        <EdgeProgressBar progress={getProgress()} isCompleted={isCompleted} />

        <div className="w-full h-[70vh] flex flex-col items-center justify-center px-3">
          <FlippingClock timeLeft={timeLeft} isFullscreen={true} />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={toggleTimer}
            className="px-5 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={isRunning
              ? { background: 'transparent', border: '1px solid #2a2825', color: '#a8a29a' }
              : { background: '#d97757', color: '#1a1512' }
            }
            onMouseEnter={e => {
              if (isRunning) { e.currentTarget.style.color = '#f5f0e8'; e.currentTarget.style.background = '#1c1b19'; }
              else e.currentTarget.style.background = '#c96a4a';
            }}
            onMouseLeave={e => {
              if (isRunning) { e.currentTarget.style.color = '#a8a29a'; e.currentTarget.style.background = 'transparent'; }
              else e.currentTarget.style.background = '#d97757';
            }}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{ background: 'transparent', border: '1px solid #2a2825', color: '#a8a29a' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f5f0e8'; e.currentTarget.style.background = '#1c1b19'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#a8a29a'; e.currentTarget.style.background = 'transparent'; }}
          >
            Reset
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200"
            style={{ background: 'transparent', border: '1px solid #2a2825', color: '#6b6862' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f5f0e8'; e.currentTarget.style.background = '#1c1b19'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6b6862'; e.currentTarget.style.background = 'transparent'; }}
          >
            ⚙
          </button>
        </div>

        <div className="text-xs mt-3 tracking-[0.2em] uppercase" style={{ color: '#6b6862' }}>
          {MODE_LABELS[mode]}
        </div>

        <div className="text-xs mt-5" style={{ color: '#3a3835' }}>
          Leertaste für Vollbildmodus
        </div>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          workTime={workTime}
          shortBreak={shortBreak}
          longBreak={longBreak}
          onSave={updateSettings}
        />
      </div>
    );
  }

  // --- Normal ---
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
      style={{ background: '#0d0c0b' }}
    >
      <div className={`text-center w-full mx-auto ${isMobile ? 'max-w-sm' : 'max-w-2xl'}`}>

        {/* Title */}
        <h1 className={`font-semibold tracking-tight mb-1 ${isMobile ? 'text-2xl' : 'text-3xl'}`}
          style={{ color: '#f5f0e8' }}>
          Tempo
        </h1>
        <p className={`mb-8 sm:mb-10 ${isMobile ? 'text-xs' : 'text-sm'}`}
          style={{ color: '#6b6862', letterSpacing: '0.05em' }}>
          Fokussiere dich, arbeite produktiv
        </p>

        {/* Mode segmented control */}
        {!isMobile && (
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex p-1 rounded-full gap-1"
              style={{ background: '#161513', border: '1px solid #26241f' }}
            >
              {MODES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => switchMode(key)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={mode === key
                    ? { background: '#2a2825', color: '#f5f0e8' }
                    : { background: 'transparent', color: '#6b6862' }
                  }
                  onMouseEnter={e => { if (mode !== key) e.currentTarget.style.color = '#a8a29a'; }}
                  onMouseLeave={e => { if (mode !== key) e.currentTarget.style.color = '#6b6862'; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clock housing */}
        <div className="mb-8 sm:mb-10">
          <div
            className={`rounded-2xl sm:rounded-3xl overflow-hidden ${isMobile ? 'cursor-pointer' : ''}`}
            style={{
              background: '#161513',
              boxShadow: '0 24px 70px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)',
            }}
            onClick={isMobile ? toggleTimer : undefined}
          >
            <div className="px-6 py-7 sm:px-10 sm:py-9 flex flex-col items-center">
              <div
                className="text-[0.6rem] sm:text-[0.65rem] font-medium mb-5 sm:mb-7 select-none"
                style={{ color: '#6b6862', letterSpacing: '0.35em', textTransform: 'uppercase' }}
              >
                {MODE_LABELS[mode]}
              </div>
              <FlippingClock timeLeft={timeLeft} isFullscreen={false} />
              {isMobile && (
                <div className="text-xs mt-4 select-none" style={{ color: '#3a3835' }}>
                  {isRunning ? 'Tippen zum Pausieren' : 'Tippen zum Starten'}
                </div>
              )}
            </div>

            {/* Progress strip */}
            <div className="h-[2px]" style={{ background: '#211f1d' }}>
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{ width: `${getProgress()}%`, background: '#d97757' }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        {!isMobile && (
          <div className="flex justify-center items-center gap-3 mb-10">
            <button
              onClick={toggleTimer}
              className="px-8 py-3 rounded-full font-medium text-sm transition-all duration-200"
              style={isRunning
                ? { background: 'transparent', border: '1px solid #2a2825', color: '#a8a29a' }
                : { background: '#d97757', color: '#1a1512' }
              }
              onMouseEnter={e => {
                if (isRunning) { e.currentTarget.style.color = '#f5f0e8'; e.currentTarget.style.background = '#1c1b19'; }
                else e.currentTarget.style.background = '#c96a4a';
              }}
              onMouseLeave={e => {
                if (isRunning) { e.currentTarget.style.color = '#a8a29a'; e.currentTarget.style.background = 'transparent'; }
                else e.currentTarget.style.background = '#d97757';
              }}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="px-6 py-3 rounded-full font-medium text-sm transition-all duration-200"
              style={{ background: 'transparent', border: '1px solid #2a2825', color: '#a8a29a' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f5f0e8'; e.currentTarget.style.background = '#1c1b19'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#a8a29a'; e.currentTarget.style.background = 'transparent'; }}
            >
              Reset
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ background: 'transparent', border: '1px solid #2a2825', color: '#6b6862' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f5f0e8'; e.currentTarget.style.background = '#1c1b19'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b6862'; e.currentTarget.style.background = 'transparent'; }}
              title="Einstellungen"
            >
              ⚙
            </button>
          </div>
        )}

        {/* Dot indicator */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i < completedInCycle ? '0.45rem' : '0.4rem',
                  height: i < completedInCycle ? '0.45rem' : '0.4rem',
                  background: i < completedInCycle ? '#d97757' : 'transparent',
                  border: `1px solid ${i < completedInCycle ? '#d97757' : '#3a3835'}`,
                }}
              />
            ))}
          </div>
          {pomodoroCount > 0 && (
            <div className="text-[0.65rem]" style={{ color: '#6b6862' }}>
              Pomodoros heute · {pomodoroCount}
            </div>
          )}
        </div>

        {/* Hint */}
        <div className="text-[0.6rem] mt-6" style={{ color: '#3a3835', letterSpacing: '0.05em' }}>
          Leertaste für Vollbildmodus
        </div>
      </div>

      {/* Mobile dropdowns */}
      {isMobile && (
        <>
          <LeftModeDropdown mode={mode} onModeChange={switchMode} />
          <CornerDropdown onReset={resetTimer} onSettings={() => setShowSettings(true)} />
        </>
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        workTime={workTime}
        shortBreak={shortBreak}
        longBreak={longBreak}
        onSave={updateSettings}
      />
    </div>
  );
}
