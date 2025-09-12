'use client';

import { useState, useEffect } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
  theme: 'light' | 'dark';
}

export default function FlippingClock({ timeLeft, theme }: FlippingClockProps) {
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
      <div className="relative w-12 h-16 sm:w-14 sm:h-18 md:w-16 md:h-20 overflow-hidden">
        {/* Static display - shows current digit split in half */}
        <div 
          className={`absolute inset-0 rounded-md shadow-xl ${
            theme === 'light'
              ? 'bg-white text-gray-900 border border-gray-300'
              : 'bg-gray-800 text-gray-100 border border-gray-700'
          }`}
        >
          {/* Top half of digit */}
          <div className="absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center overflow-hidden">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold transform translate-y-1/2">
              {digit}
            </div>
          </div>
          
          {/* Bottom half of digit */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-start justify-center overflow-hidden">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold transform -translate-y-1/2">
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
            className={`absolute top-0 left-0 right-0 h-1/2 rounded-t-md shadow-xl border-b ${
              theme === 'light'
                ? 'bg-white text-gray-900 border-gray-300'
                : 'bg-gray-800 text-gray-100 border-gray-700'
            }`}
            style={{
              transform: 'rotateX(-180deg)',
              transformOrigin: 'bottom',
              animation: 'flipDown 0.7s ease-in-out forwards'
            }}
          >
            <div className="flex items-end justify-center h-full overflow-hidden">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold transform translate-y-1/2">
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
          }
          100% {
            transform: rotateX(-180deg);
          }
        }
      `}</style>
      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
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
        <div className={`text-2xl sm:text-3xl font-bold mx-2 sm:mx-3 flex flex-col items-center ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mb-1 ${
            theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'
          }`}></div>
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
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
