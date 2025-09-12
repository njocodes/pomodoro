'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  color: string;
  theme: 'light' | 'dark';
}

export default function ProgressBar({ progress, color, theme }: ProgressBarProps) {
  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-4 sm:mt-6 md:mt-8">
      <div className={`w-full rounded-full h-2 sm:h-3 shadow-inner ${
        theme === 'light' ? 'bg-gray-200' : 'bg-gray-700/50'
      }`}>
        <div 
          className={`h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out ${color} shadow-lg relative overflow-hidden`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse ${
            theme === 'light' ? 'via-gray-300/30' : 'via-white/20'
          }`}></div>
        </div>
      </div>
      <div className={`text-center mt-1 sm:mt-2 text-xs sm:text-sm font-semibold ${
        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
      }`}>
        {Math.round(progress)}% abgeschlossen
      </div>
    </div>
  );
}
