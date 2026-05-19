'use client';

import { useState, useEffect, useRef } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
  isFullscreen?: boolean;
}

export default function FlippingClock({ timeLeft, isFullscreen = false }: FlippingClockProps) {
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
    ? { width: 'clamp(5rem, 13vw, 8.5rem)', height: 'clamp(6.8rem, 17vw, 11.5rem)' }
    : { width: 'clamp(4rem, 11vw, 7rem)', height: 'clamp(5.4rem, 14.5vw, 9.5rem)' };
  const digitFontSize = isFullscreen
    ? 'clamp(3.2rem, 8vw, 6.5rem)'
    : 'clamp(2.5rem, 6.5vw, 5rem)';
  const colonDotSize = isFullscreen
    ? 'clamp(0.6rem, 1.2vw, 1rem)'
    : 'clamp(0.5rem, 1vw, 0.8rem)';

  const cardBg = '#1c1b19';
  const textColor = '#f5f0e8';
  const borderColor = '#2a2825';
  const centerLineColor = '#211f1d';

  const digitStyle: React.CSSProperties = {
    fontSize: digitFontSize,
    lineHeight: 1,
    color: textColor,
    fontFamily: 'var(--font-geist-mono)',
    fontVariantNumeric: 'tabular-nums',
  };

  const TopContent = ({ d }: { d: string }) => (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      <div className="font-bold" style={{ ...digitStyle, transform: 'translateY(50%)' }}>
        {d}
      </div>
    </div>
  );

  const BottomContent = ({ d }: { d: string }) => (
    <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
      <div className="font-bold" style={{ ...digitStyle, transform: 'translateY(-50%)' }}>
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
        boxShadow: '0 18px 40px -6px rgba(0,0,0,0.65), 0 6px 14px -4px rgba(0,0,0,0.45)',
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
      <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6">
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
        <div className="flex flex-col items-center gap-2 mx-3 sm:mx-4 md:mx-5">
          <div className="rounded-full" style={{ width: colonDotSize, height: colonDotSize, background: '#f5f0e8' }} />
          <div className="rounded-full" style={{ width: colonDotSize, height: colonDotSize, background: '#f5f0e8' }} />
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
