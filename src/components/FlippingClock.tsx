'use client';

import { useState, useEffect } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
  isRunning: boolean;
}

export default function FlippingClock({ timeLeft, isRunning }: FlippingClockProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    setDisplayTime(timeLeft);
    if (timeLeft !== displayTime) {
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 300);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeString = formatTime(displayTime);
  const [minutes, seconds] = timeString.split(':');

  return (
    <div className="flex items-center justify-center space-x-2 text-6xl font-mono font-bold">
      {/* Minutes */}
      <div className="relative">
        <div 
          className={`bg-gray-900 text-white px-4 py-6 rounded-lg shadow-lg border-2 border-gray-700 transition-all duration-300 ${
            isFlipping ? 'scale-105' : 'scale-100'
          }`}
        >
          {minutes}
        </div>
      </div>
      
      {/* Colon */}
      <div className="text-gray-400 animate-pulse">
        :
      </div>
      
      {/* Seconds */}
      <div className="relative">
        <div 
          className={`bg-gray-900 text-white px-4 py-6 rounded-lg shadow-lg border-2 border-gray-700 transition-all duration-300 ${
            isFlipping ? 'scale-105' : 'scale-100'
          }`}
        >
          {seconds}
        </div>
      </div>
    </div>
  );
}
