'use client';

import { useState, useEffect } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
  theme: 'light' | 'dark';
  isFullscreen?: boolean;
}

export default function FlippingClock({ timeLeft, theme, isFullscreen = false }: FlippingClockProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  const [flippingDigits, setFlippingDigits] = useState<Set<string>>(new Set());
  const [oldDigits, setOldDigits] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (timeLeft !== displayTime) {
      const oldTime = formatTime(displayTime);
      const newTime = formatTime(timeLeft);
      const [oldMinutes, oldSeconds] = oldTime.split(':');
      const [newMinutes, newSeconds] = newTime.split(':');
      
      // Find which digits changed and store old digits
      const changedDigits = new Set<string>();
      const newOldDigits = new Map<string, string>();
      
      // Check minutes - compare without padding
      const oldMinDigits = oldMinutes.split('');
      const newMinDigits = newMinutes.split('');
      for (let i = 0; i < Math.max(oldMinDigits.length, newMinDigits.length); i++) {
        const oldDigit = oldMinDigits[i] || '0';
        const newDigit = newMinDigits[i] || '0';
        if (oldDigit !== newDigit) {
          changedDigits.add(`min-${i}`);
          newOldDigits.set(`min-${i}`, oldDigit);
        }
      }
      
      // Check seconds - always 2 digits
      const oldSecDigits = oldSeconds.padStart(2, '0').split('');
      const newSecDigits = newSeconds.padStart(2, '0').split('');
      for (let i = 0; i < 2; i++) {
        const oldDigit = oldSecDigits[i] || '0';
        const newDigit = newSecDigits[i] || '0';
        if (oldDigit !== newDigit) {
          changedDigits.add(`sec-${i}`);
          newOldDigits.set(`sec-${i}`, oldDigit);
        }
      }
      
      setFlippingDigits(changedDigits);
      setOldDigits(newOldDigits);
      
      setTimeout(() => {
        setDisplayTime(timeLeft);
        setFlippingDigits(new Set());
        setOldDigits(new Map());
      }, 700);
    }
  }, [timeLeft, displayTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Show minutes as natural number (no padding)
    const minsStr = mins.toString();
    return `${minsStr}:${secs.toString().padStart(2, '0')}`;
  };

  const timeString = formatTime(displayTime);
  const [minutes, seconds] = timeString.split(':');
  
  // Split minutes and seconds into individual digits
  // Don't pad minutes - show only needed digits
  const minuteDigits = minutes.split('');
  const secondDigits = seconds.padStart(2, '0').split('');

  const FlipDigit = ({ digit, keyPrefix, isFlipping, oldDigit }: { digit: string; keyPrefix: string; isFlipping: boolean; oldDigit?: string }) => {
    return (
      <div className={`relative overflow-hidden ${
        isFullscreen 
          ? 'w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-36'
          : 'w-16 h-20 sm:w-18 sm:h-24 md:w-20 md:h-28'
      }`}>
        {/* Static display - shows current digit split in half */}
        <div 
          className={`absolute inset-0 rounded-md shadow-xl ${
            theme === 'light'
              ? 'bg-white text-gray-900 border border-gray-300'
              : 'bg-gray-800 text-gray-100 border border-gray-700'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Top half of digit */}
          <div className="absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center overflow-hidden">
            <div className={`font-bold transform translate-y-1/2 ${
              isFullscreen 
                ? 'text-4xl sm:text-5xl md:text-6xl'
                : 'text-3xl sm:text-4xl md:text-5xl'
            }`}>
              {digit}
            </div>
          </div>
          
          {/* Bottom half of digit */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-start justify-center overflow-hidden">
            <div className={`font-bold transform -translate-y-1/2 ${
              isFullscreen 
                ? 'text-4xl sm:text-5xl md:text-6xl'
                : 'text-3xl sm:text-4xl md:text-5xl'
            }`}>
              {digit}
            </div>
          </div>
          
          {/* Center line */}
          <div className={`absolute top-1/2 left-0 right-0 h-px ${
            theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'
          }`}></div>
        </div>
        
        {/* Flipping animation layer */}
        {isFlipping && oldDigit && (
          <div 
            className={`absolute top-0 left-0 h-1/2 rounded-t-md border-b ${
              theme === 'light'
                ? 'bg-white text-gray-900 border-gray-300'
                : 'bg-gray-800 text-gray-100 border-gray-700'
            }`}
            style={{
              transformOrigin: 'bottom',
              transformStyle: 'preserve-3d',
              animation: 'flipDown 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
              boxShadow: theme === 'light' 
                ? '0 4px 8px rgba(0, 0, 0, 0.2), 8px 0 16px rgba(0, 0, 0, 0.1)' 
                : '0 4px 8px rgba(255, 255, 255, 0.2), 8px 0 16px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-end justify-center h-full overflow-hidden">
              <div className={`font-bold transform translate-y-1/2 ${
                isFullscreen 
                  ? 'text-4xl sm:text-5xl md:text-6xl'
                  : 'text-3xl sm:text-4xl md:text-5xl'
              }`}>
                {oldDigit}
              </div>
            </div>
          </div>
        )}
        
        {/* Base shadow */}
        <div className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full shadow-lg ${
          theme === 'light' ? 'bg-gray-300' : 'bg-gray-900'
        }`}></div>
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes flipDown {
          0% {
            transform: rotateX(0deg);
            width: 100%;
          }
          50% {
            transform: rotateX(-90deg);
            width: 120%;
          }
          100% {
            transform: rotateX(-180deg);
            width: 100%;
          }
        }
      `}</style>
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4" style={{ perspective: '1000px' }}>
        {/* Minutes - Dynamic number of digits */}
        {minuteDigits.map((digit, index) => (
          <FlipDigit 
            key={`min-${index}`}
            digit={digit} 
            keyPrefix={`min${index}`}
            isFlipping={flippingDigits.has(`min-${index}`)}
            oldDigit={oldDigits.get(`min-${index}`)}
          />
        ))}
        
        {/* Colon */}
        <div className={`text-3xl sm:text-4xl md:text-5xl font-bold mx-3 sm:mx-4 md:mx-5 flex flex-col items-center ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full mb-1 ${
            theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'
          }`}></div>
          <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full ${
            theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'
          }`}></div>
        </div>
        
        {/* Seconds - Dynamic number of digits */}
        {secondDigits.map((digit, index) => (
          <FlipDigit 
            key={`sec-${index}`}
            digit={digit} 
            keyPrefix={`sec${index}`}
            isFlipping={flippingDigits.has(`sec-${index}`)}
            oldDigit={oldDigits.get(`sec-${index}`)}
          />
        ))}
      </div>
    </>
  );
}
