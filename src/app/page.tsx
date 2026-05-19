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

// Shared button styles
const primaryBtn: React.CSSProperties = { background: '#d97757', color: '#1a1512' };
const primaryBtnHover: React.CSSProperties = { background: '#c96a4a', color: '#1a1512' };
const ghostBtn: React.CSSProperties = { background: 'transparent', border: '1px solid #2a2825', color: '#a8a29a' };
const ghostBtnHover: React.CSSProperties = { background: '#1c1b19', border: '1px solid #2a2825', color: '#f5f0e8' };

function GhostBtn({ onClick, children, className = '', title }: {
  onClick: () => void; children: React.ReactNode; className?: string; title?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title} className={`transition-all duration-200 ${className}`}
      style={hov ? ghostBtnHover : ghostBtn}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} className="px-8 py-3 rounded-full font-medium text-sm transition-all duration-200"
      style={hov ? primaryBtnHover : primaryBtn}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [isMinimal, setIsMinimal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const isMobile = useIsMobile();
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousCompletionCountRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { timeLeft, isRunning, mode, pomodoroCount, completionCount,
    workTime, shortBreak, longBreak, toggleTimer, resetTimer, switchMode, updateSettings } = useTimer();

  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current)
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.warn('Could not play sound:', e); }
  };

  useEffect(() => {
    if (previousCompletionCountRef.current === null) {
      previousCompletionCountRef.current = completionCount; return;
    }
    if (completionCount > previousCompletionCountRef.current) {
      setIsCompleted(true);
      if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = setTimeout(() => setIsCompleted(false), 2000);
      playNotificationSound();
    }
    previousCompletionCountRef.current = completionCount;
  }, [completionCount]);

  useEffect(() => () => { if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current); }, []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showSettings) {
        e.preventDefault(); e.stopPropagation();
        setIsMinimal(prev => !prev);
      }
    };
    document.addEventListener('keydown', handle, true);
    return () => document.removeEventListener('keydown', handle, true);
  }, [showSettings]);

  const getProgress = () => {
    const total = mode === 'work' ? workTime * 60 : mode === 'shortBreak' ? shortBreak * 60 : longBreak * 60;
    return Math.min(100, Math.max(0, ((total - timeLeft) / total) * 100));
  };

  const completedInCycle = pomodoroCount % 4;

  // --- Minimal mode (spacebar) — just the clock ---
  if (isMinimal) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer"
        style={{ background: '#0d0c0b' }}
        onClick={toggleTimer}
      >
        <EdgeProgressBar progress={getProgress()} isCompleted={isCompleted} />
        <FlippingClock timeLeft={timeLeft} isFullscreen={true} />
        <div className="text-xs mt-6 tracking-[0.25em] uppercase select-none" style={{ color: '#3a3835' }}>
          Leertaste zum Beenden
        </div>
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)}
          workTime={workTime} shortBreak={shortBreak} longBreak={longBreak} onSave={updateSettings} />
      </div>
    );
  }

  // --- Normal mode — large, full-viewport clock ---
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#0d0c0b' }}>
      <EdgeProgressBar progress={getProgress()} isCompleted={isCompleted} />

      <div className="flex flex-col items-center w-full px-4 py-8 gap-0">

        {/* Title + tagline */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: '#f5f0e8' }}>Tempo</h1>
          <p className="text-xs mt-1" style={{ color: '#6b6862', letterSpacing: '0.05em' }}>
            Fokussiere dich, arbeite produktiv
          </p>
        </div>

        {/* Mode segmented control */}
        {!isMobile && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex p-1 rounded-full gap-1" style={{ background: '#161513', border: '1px solid #26241f' }}>
              {MODES.map(({ key, label }) => {
                const active = mode === key;
                return (
                  <button key={key} onClick={() => switchMode(key)}
                    className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                    style={active ? { background: '#2a2825', color: '#f5f0e8' } : { background: 'transparent', color: '#6b6862' }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mode label */}
        <div className="text-[0.6rem] sm:text-[0.65rem] font-medium mb-5 sm:mb-7 select-none"
          style={{ color: '#6b6862', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
          {MODE_LABELS[mode]}
        </div>

        {/* The clock — fills the screen, no housing card */}
        <div className={isMobile ? 'cursor-pointer' : ''} onClick={isMobile ? toggleTimer : undefined}>
          <FlippingClock timeLeft={timeLeft} isFullscreen={false} />
        </div>

        {isMobile && (
          <div className="text-xs mt-4 select-none" style={{ color: '#3a3835' }}>
            {isRunning ? 'Tippen zum Pausieren' : 'Tippen zum Starten'}
          </div>
        )}

        {/* Controls */}
        {!isMobile && (
          <div className="flex justify-center items-center gap-3 mt-8">
            {isRunning
              ? <GhostBtn onClick={toggleTimer} className="px-8 py-3 rounded-full text-sm font-medium">Pause</GhostBtn>
              : <PrimaryBtn onClick={toggleTimer}>Start</PrimaryBtn>
            }
            <GhostBtn onClick={resetTimer} className="px-6 py-3 rounded-full text-sm font-medium">Reset</GhostBtn>
            <GhostBtn onClick={() => setShowSettings(true)} className="w-11 h-11 rounded-full flex items-center justify-center" title="Einstellungen">⚙</GhostBtn>
          </div>
        )}

        {/* Dot indicator */}
        <div className="flex flex-col items-center gap-1.5 mt-6">
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="rounded-full transition-all duration-300" style={{
                width: i < completedInCycle ? '0.45rem' : '0.4rem',
                height: i < completedInCycle ? '0.45rem' : '0.4rem',
                background: i < completedInCycle ? '#d97757' : 'transparent',
                border: `1px solid ${i < completedInCycle ? '#d97757' : '#3a3835'}`,
              }} />
            ))}
          </div>
          {pomodoroCount > 0 && (
            <div className="text-[0.65rem]" style={{ color: '#6b6862' }}>
              Pomodoros heute · {pomodoroCount}
            </div>
          )}
        </div>

        {/* Hint */}
        <div className="text-[0.6rem] mt-5" style={{ color: '#3a3835', letterSpacing: '0.05em' }}>
          Leertaste für minimalen Modus
        </div>
      </div>

      {/* Mobile dropdowns */}
      {isMobile && (
        <>
          <LeftModeDropdown mode={mode} onModeChange={switchMode} />
          <CornerDropdown onReset={resetTimer} onSettings={() => setShowSettings(true)} />
        </>
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)}
        workTime={workTime} shortBreak={shortBreak} longBreak={longBreak} onSave={updateSettings} />
    </div>
  );
}
