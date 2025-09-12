'use client';

import { useState, useEffect } from 'react';

interface FlippingClockProps {
  timeLeft: number; // in seconds
}

export default function FlippingClock({ timeLeft }: FlippingClockProps) {
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
      }, 150);
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
    <div className="flex items-center justify-center space-x-1">
      {/* Minutes - First Digit */}
      <div className="relative">
        <div 
          className={`bg-gray-800 text-gray-100 w-16 h-20 rounded-md shadow-xl border border-gray-700 transition-all duration-200 transform ${
            isFlipping ? 'scale-105' : 'scale-100'
          }`}
          key={`min1-${flipKey}`}
        >
          <div className="flex items-center justify-center h-full text-5xl font-bold relative">
            {minutes[0]}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-600/30 to-transparent rounded-t-md"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-600/30 to-transparent rounded-b-md"></div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-900 rounded-full shadow-lg"></div>
      </div>
      
      {/* Minutes - Second Digit */}
      <div className="relative">
        <div 
          className={`bg-gray-800 text-gray-100 w-16 h-20 rounded-md shadow-xl border border-gray-700 transition-all duration-200 transform ${
            isFlipping ? 'scale-105' : 'scale-100'
          }`}
          key={`min2-${flipKey}`}
        >
          <div className="flex items-center justify-center h-full text-5xl font-bold relative">
            {minutes[1]}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-600/30 to-transparent rounded-t-md"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-600/30 to-transparent rounded-b-md"></div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-900 rounded-full shadow-lg"></div>
      </div>
      
      {/* Colon */}
      <div className="text-gray-400 text-3xl font-bold mx-3 flex flex-col items-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full mb-1"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
      
      {/* Seconds - First Digit */}
      <div className="relative">
        <div 
          className={`bg-gray-800 text-gray-100 w-16 h-20 rounded-md shadow-xl border border-gray-700 transition-all duration-200 transform ${
            isFlipping ? 'scale-105' : 'scale-100'
          }`}
          key={`sec1-${flipKey}`}
        >
          <div className="flex items-center justify-center h-full text-5xl font-bold relative">
            {seconds[0]}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-600/30 to-transparent rounded-t-md"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-600/30 to-transparent rounded-b-md"></div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-900 rounded-full shadow-lg"></div>
      </div>
      
      {/* Seconds - Second Digit */}
      <div className="relative">
        <div 
          className={`bg-gray-800 text-gray-100 w-16 h-20 rounded-md shadow-xl border border-gray-700 transition-all duration-200 transform ${
            isFlipping ? 'scale-105' : 'scale-100'
          }`}
          key={`sec2-${flipKey}`}
        >
          <div className="flex items-center justify-center h-full text-5xl font-bold relative">
            {seconds[1]}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-600/30 to-transparent rounded-t-md"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-600/30 to-transparent rounded-b-md"></div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-900 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
}
