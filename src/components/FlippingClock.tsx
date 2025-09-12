'use client';

import { useState, useEffect } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
  theme: 'light' | 'dark';
}

export default function FlippingClock({ timeLeft, theme }: FlippingClockProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    if (timeLeft !== displayTime) {
      setIsFlipping(true);
      setFlipKey(prev => prev + 1);
      setTimeout(() => {
        setDisplayTime(timeLeft);
        setIsFlipping(false);
      }, 300);
    }
  }, [timeLeft, displayTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(3, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeString = formatTime(displayTime);
  const [minutes, seconds] = timeString.split(':');

  const FlipDigit = ({ digit, keyPrefix }: { digit: string; keyPrefix: string }) => {
    return (
      <div className="relative w-16 h-20">
        {/* Current digit */}
        <div 
          className={`absolute inset-0 rounded-md shadow-xl border transition-all duration-300 ${
            theme === 'light'
              ? 'bg-white text-gray-900 border-gray-300'
              : 'bg-gray-800 text-gray-100 border-gray-700'
          }`}
        >
          <div className="flex items-center justify-center h-full text-5xl font-bold relative">
            {digit}
            <div className={`absolute top-0 left-0 right-0 h-1/2 rounded-t-md ${
              theme === 'light' 
                ? 'bg-gradient-to-b from-gray-200/50 to-transparent' 
                : 'bg-gradient-to-b from-gray-600/30 to-transparent'
            }`}></div>
            <div className={`absolute bottom-0 left-0 right-0 h-1/2 rounded-b-md ${
              theme === 'light' 
                ? 'bg-gradient-to-t from-gray-200/50 to-transparent' 
                : 'bg-gradient-to-t from-gray-600/30 to-transparent'
            }`}></div>
          </div>
        </div>
        
        {/* Flipping animation overlay */}
        {isFlipping && (
          <div 
            className={`absolute inset-0 rounded-md shadow-xl border transition-all duration-300 ${
              theme === 'light'
                ? 'bg-white text-gray-900 border-gray-300'
                : 'bg-gray-800 text-gray-100 border-gray-700'
            }`}
            style={{
              transform: 'rotateX(-90deg)',
              transformOrigin: 'top',
              animation: 'flipDown 0.3s ease-in-out forwards'
            }}
          >
            <div className="flex items-center justify-center h-full text-5xl font-bold relative">
              {digit}
              <div className={`absolute top-0 left-0 right-0 h-1/2 rounded-t-md ${
                theme === 'light' 
                  ? 'bg-gradient-to-b from-gray-200/50 to-transparent' 
                  : 'bg-gradient-to-b from-gray-600/30 to-transparent'
              }`}></div>
              <div className={`absolute bottom-0 left-0 right-0 h-1/2 rounded-b-md ${
                theme === 'light' 
                  ? 'bg-gradient-to-t from-gray-200/50 to-transparent' 
                  : 'bg-gradient-to-t from-gray-600/30 to-transparent'
              }`}></div>
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
          50% {
            transform: rotateX(-90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
      `}</style>
      <div className="flex items-center justify-center space-x-1">
        {/* Minutes - First Digit */}
        <FlipDigit digit={minutes[0]} keyPrefix={`min1-${flipKey}`} />
        
        {/* Minutes - Second Digit */}
        <FlipDigit digit={minutes[1]} keyPrefix={`min2-${flipKey}`} />
        
        {/* Minutes - Third Digit */}
        <FlipDigit digit={minutes[2]} keyPrefix={`min3-${flipKey}`} />
        
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
        
        {/* Seconds - First Digit */}
        <FlipDigit digit={seconds[0]} keyPrefix={`sec1-${flipKey}`} />
        
        {/* Seconds - Second Digit */}
        <FlipDigit digit={seconds[1]} keyPrefix={`sec2-${flipKey}`} />
      </div>
    </>
  );
}
