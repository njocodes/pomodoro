'use client';

import { useState, useEffect, useRef } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
  theme: 'light' | 'dark';
  isFullscreen?: boolean;
}

export default function FlippingClock({ timeLeft, theme, isFullscreen = false }: FlippingClockProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  const [flippingDigits, setFlippingDigits] = useState<Set<string>>(new Set());
  const [oldDigits, setOldDigits] = useState<Map<string, string>>(new Map());
  const [newDigits, setNewDigits] = useState<Map<string, string>>(new Map());
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeLeft !== displayTime) {
      const oldTime = formatTime(displayTime);
      const newTime = formatTime(timeLeft);
      const [oldMinutes, oldSeconds] = oldTime.split(':');
      const [newMinutes, newSeconds] = newTime.split(':');

      const changedDigits = new Set<string>();
      const newOldDigits = new Map<string, string>();
      const newNewDigits = new Map<string, string>();

      const oldMinDigits = oldMinutes.split('');
      const newMinDigits = newMinutes.split('');
      for (let i = 0; i < Math.max(oldMinDigits.length, newMinDigits.length); i++) {
        const oldDigit = oldMinDigits[i] || '0';
        const newDigit = newMinDigits[i] || '0';
        if (oldDigit !== newDigit) {
          changedDigits.add(`min-${i}`);
          newOldDigits.set(`min-${i}`, oldDigit);
          newNewDigits.set(`min-${i}`, newDigit);
        }
      }

      const oldSecDigits = oldSeconds.padStart(2, '0').split('');
      const newSecDigits = newSeconds.padStart(2, '0').split('');
      for (let i = 0; i < 2; i++) {
        const oldDigit = oldSecDigits[i] || '0';
        const newDigit = newSecDigits[i] || '0';
        if (oldDigit !== newDigit) {
          changedDigits.add(`sec-${i}`);
          newOldDigits.set(`sec-${i}`, oldDigit);
          newNewDigits.set(`sec-${i}`, newDigit);
        }
      }

      setFlippingDigits(changedDigits);
      setOldDigits(newOldDigits);
      setNewDigits(newNewDigits);

      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }

      flipTimeoutRef.current = setTimeout(() => {
        setDisplayTime(timeLeft);
        setFlippingDigits(new Set());
        setOldDigits(new Map());
        setNewDigits(new Map());
      }, 385);
    }
  }, [timeLeft, displayTime]);

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString()}:${secs.toString().padStart(2, '0')}`;
  };

  const timeString = formatTime(displayTime);
  const [minutes, seconds] = timeString.split(':');
  const minuteDigits = minutes.split('');
  const secondDigits = seconds.padStart(2, '0').split('');

  const digitSizeStyle = isFullscreen
    ? { width: 'clamp(3.75rem, 9.5vw, 6.25rem)', height: 'clamp(5rem, 13vw, 8rem)' }
    : { width: 'clamp(2.85rem, 8vw, 4.5rem)', height: 'clamp(3.8rem, 10.5vw, 5.8rem)' };
  const digitFontSize = isFullscreen
    ? 'clamp(2.25rem, 5.2vw, 4rem)'
    : 'clamp(1.8rem, 4.6vw, 3.2rem)';
  const colonDotSize = isFullscreen
    ? 'clamp(0.45rem, 0.9vw, 0.7rem)'
    : 'clamp(0.35rem, 0.75vw, 0.6rem)';

  const cardBg = theme === 'light' ? '#ffffff' : '#1f2937';
  const textColor = theme === 'light' ? '#111827' : '#f3f4f6';
  const borderColor = theme === 'light' ? '#d1d5db' : '#374151';
  const centerLineColor = theme === 'light' ? '#d1d5db' : '#4b5563';

  const TopContent = ({ d }: { d: string }) => (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <div className="font-bold" style={{ fontSize: digitFontSize, lineHeight: 1, color: textColor, transform: 'translateY(50%)' }}>
        {d}
      </div>
    </div>
  );

  const BottomContent = ({ d }: { d: string }) => (
    <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
      <div className="font-bold" style={{ fontSize: digitFontSize, lineHeight: 1, color: textColor, transform: 'translateY(-50%)' }}>
        {d}
      </div>
    </div>
  );

  const FlipDigit = ({ digit, isFlipping, oldDigit, newDigit }: {
    digit: string;
    isFlipping: boolean;
    oldDigit?: string;
    newDigit?: string;
  }) => {
    const showFlip = isFlipping && oldDigit !== undefined && newDigit !== undefined;

    return (
      <div className="relative" style={{
        ...digitSizeStyle,
        perspective: '600px',
        borderRadius: '0.375rem',
        boxShadow: theme === 'light'
          ? '0 10px 25px -5px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.08)'
          : '0 10px 25px -5px rgba(0,0,0,0.5), 0 4px 8px -4px rgba(0,0,0,0.3)',
      }}>
        {showFlip ? (
          <>
            {/* Layer 1: full static old card (background) */}
            <div className="absolute inset-0 rounded-md" style={{ background: cardBg, zIndex: 0 }}>
              <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden">
                <TopContent d={oldDigit} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
                <BottomContent d={oldDigit} />
              </div>
            </div>

            {/* Layer 2: static new top half (revealed as flip-top rotates away) */}
            <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden" style={{ background: cardBg, zIndex: 1 }}>
              <TopContent d={newDigit} />
            </div>

            {/* Layer 3: flip-top — old top half rotates 0° → -90° (ease-in, falls forward) */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden"
              style={{
                background: cardBg,
                zIndex: 2,
                transformOrigin: 'center bottom',
                animation: 'flipTopDown 185ms cubic-bezier(0.55, 0, 1, 0.45) forwards',
              }}
            >
              <TopContent d={oldDigit} />
              <div
                className="absolute inset-0 bg-black"
                style={{ animation: 'foldShadowIn 185ms ease-in forwards', opacity: 0 }}
              />
            </div>

            {/* Layer 4: flip-bottom — new bottom half rotates 90° → 0° with delay (ease-out, falls into place) */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden"
              style={{
                background: cardBg,
                zIndex: 2,
                transformOrigin: 'center top',
                animation: 'flipBottomUp 185ms cubic-bezier(0, 0.55, 0.45, 1) 185ms both',
              }}
            >
              <BottomContent d={newDigit} />
              <div
                className="absolute inset-0 bg-black"
                style={{ animation: 'foldShadowOut 185ms ease-out 185ms both', opacity: 0.25 }}
              />
            </div>
          </>
        ) : (
          /* Static card */
          <div className="absolute inset-0 rounded-md" style={{ background: cardBg, zIndex: 0 }}>
            <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden">
              <TopContent d={digit} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
              <BottomContent d={digit} />
            </div>
          </div>
        )}

        {/* Border frame — always on top */}
        <div
          className="absolute inset-0 rounded-md pointer-events-none"
          style={{ border: `1px solid ${borderColor}`, zIndex: 5 }}
        />

        {/* Center divider line — always on top */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{ top: '50%', height: '1px', background: centerLineColor, zIndex: 5 }}
        />
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes flipTopDown {
          from { transform: rotateX(0deg); }
          to   { transform: rotateX(-90deg); }
        }
        @keyframes flipBottomUp {
          from { transform: rotateX(90deg); }
          to   { transform: rotateX(0deg); }
        }
        @keyframes foldShadowIn {
          from { opacity: 0; }
          to   { opacity: 0.25; }
        }
        @keyframes foldShadowOut {
          from { opacity: 0.25; }
          to   { opacity: 0; }
        }
      `}</style>
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
        {minuteDigits.map((digit, index) => (
          <FlipDigit
            key={`min-${index}`}
            digit={digit}
            isFlipping={flippingDigits.has(`min-${index}`)}
            oldDigit={oldDigits.get(`min-${index}`)}
            newDigit={newDigits.get(`min-${index}`)}
          />
        ))}

        {/* Colon */}
        <div className={`font-bold mx-2 sm:mx-3 md:mx-4 flex flex-col items-center ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <div className={`rounded-full mb-1 ${
            theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'
          }`} style={{ width: colonDotSize, height: colonDotSize }} />
          <div className={`rounded-full ${
            theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'
          }`} style={{ width: colonDotSize, height: colonDotSize }} />
        </div>

        {secondDigits.map((digit, index) => (
          <FlipDigit
            key={`sec-${index}`}
            digit={digit}
            isFlipping={flippingDigits.has(`sec-${index}`)}
            oldDigit={oldDigits.get(`sec-${index}`)}
            newDigit={newDigits.get(`sec-${index}`)}
          />
        ))}
      </div>
    </>
  );
}
