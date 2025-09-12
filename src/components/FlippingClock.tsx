'use client';

import { useState, useEffect } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
}

export default function FlippingClock({ timeLeft }: FlippingClockProps) {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    setDisplayTime(timeLeft);
    if (timeLeft !== displayTime) {
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 300);
    }
  }, [timeLeft, displayTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timeString = formatTime(displayTime);
  const [minutes, seconds] = timeString.split(':');

  return (
    <div className="flex items-center justify-center space-x-4 text-7xl font-mono font-bold">
      {/* Minutes */}
      <div className="relative">
        <div 
          className={`bg-gradient-to-br from-gray-800 to-gray-900 text-white px-8 py-8 rounded-2xl shadow-2xl border-2 border-gray-600/50 transition-all duration-500 transform ${
            isFlipping ? 'scale-110 rotate-2' : 'scale-100 rotate-0'
          } backdrop-blur-sm`}
        >
          <div className="text-center">
            <div className="text-6xl font-black tracking-wider">{minutes}</div>
            <div className="text-xs text-gray-400 mt-2 font-semibold">MIN</div>
          </div>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur opacity-75 -z-10"></div>
      </div>
      
      {/* Colon */}
      <div className="text-gray-300 animate-pulse text-6xl font-black">
        :
      </div>
      
      {/* Seconds */}
      <div className="relative">
        <div 
          className={`bg-gradient-to-br from-gray-800 to-gray-900 text-white px-8 py-8 rounded-2xl shadow-2xl border-2 border-gray-600/50 transition-all duration-500 transform ${
            isFlipping ? 'scale-110 -rotate-2' : 'scale-100 rotate-0'
          } backdrop-blur-sm`}
        >
          <div className="text-center">
            <div className="text-6xl font-black tracking-wider">{seconds}</div>
            <div className="text-xs text-gray-400 mt-2 font-semibold">SEC</div>
          </div>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-75 -z-10"></div>
      </div>
    </div>
  );
}
