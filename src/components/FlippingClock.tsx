'use client';

import { useState, useEffect } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
  theme: 'light' | 'dark';
}

export default function FlippingClock({ timeLeft, theme }: FlippingClockProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  const [flippingDigits, setFlippingDigits] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (timeLeft !== displayTime) {
      const oldTime = formatTime(displayTime);
      const newTime = formatTime(timeLeft);
      const [oldMinutes, oldSeconds] = oldTime.split(':');
      const [newMinutes, newSeconds] = newTime.split(':');
      
      // Find which digits changed
      const changedDigits = new Set<string>();
      
      // Check minutes - compare without padding
      const oldMinDigits = oldMinutes.split('');
      const newMinDigits = newMinutes.split('');
      for (let i = 0; i < Math.max(oldMinDigits.length, newMinDigits.length); i++) {
        const oldDigit = oldMinDigits[i] || '0';
        const newDigit = newMinDigits[i] || '0';
        if (oldDigit !== newDigit) {
          changedDigits.add(`min-${i}`);
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
        }
      }
      
      setFlippingDigits(changedDigits);
      
      setTimeout(() => {
        setDisplayTime(timeLeft);
        setFlippingDigits(new Set());
      }, 300);
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

  const FlipDigit = ({ digit, keyPrefix, isFlipping }: { digit: string; keyPrefix: string; isFlipping: boolean }) => {
    return (
      <div className="relative w-16 h-20 overflow-hidden">
        {/* Bottom half - shows current digit */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-1/2 rounded-b-md shadow-xl border-t ${
            theme === 'light'
              ? 'bg-white text-gray-900 border-gray-300'
              : 'bg-gray-800 text-gray-100 border-gray-700'
          }`}
        >
          <div className="flex items-center justify-center h-full text-5xl font-bold relative">
            {digit}
            <div className={`absolute bottom-0 left-0 right-0 h-1/2 rounded-b-md ${
              theme === 'light' 
                ? 'bg-gradient-to-t from-gray-200/50 to-transparent' 
                : 'bg-gradient-to-t from-gray-600/30 to-transparent'
            }`}></div>
          </div>
        </div>
        
        {/* Top half - shows old digit and flips to show new digit */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1/2 rounded-t-md shadow-xl border-b ${
            theme === 'light'
              ? 'bg-white text-gray-900 border-gray-300'
              : 'bg-gray-800 text-gray-100 border-gray-700'
          }`}
          style={{
            transform: isFlipping ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            transformOrigin: 'bottom',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className="flex items-center justify-center h-full text-5xl font-bold relative">
            {digit}
            <div className={`absolute top-0 left-0 right-0 h-1/2 rounded-t-md ${
              theme === 'light' 
                ? 'bg-gradient-to-b from-gray-200/50 to-transparent' 
                : 'bg-gradient-to-b from-gray-600/30 to-transparent'
            }`}></div>
          </div>
        </div>
        
        {/* Base shadow */}
        <div className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full shadow-lg ${
          theme === 'light' ? 'bg-gray-300' : 'bg-gray-900'
        }`}></div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center space-x-1">
        {/* Minutes - Dynamic number of digits */}
        {minuteDigits.map((digit, index) => (
          <FlipDigit 
            key={`min-${index}`}
            digit={digit} 
            keyPrefix={`min${index}`}
            isFlipping={flippingDigits.has(`min-${index}`)}
          />
        ))}
        
        {/* Colon */}
        <div className={`text-3xl font-bold mx-3 flex flex-col items-center ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full mb-1 ${
            theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'
          }`}></div>
          <div className={`w-2 h-2 rounded-full ${
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
          />
        ))}
      </div>
  );
}
