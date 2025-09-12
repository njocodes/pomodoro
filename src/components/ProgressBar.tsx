'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  color: string;
}

export default function ProgressBar({ progress, color }: ProgressBarProps) {
  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <div className="w-full bg-gray-700/50 rounded-full h-3 shadow-inner">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${color} shadow-lg relative overflow-hidden`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>
      <div className="text-center mt-2 text-sm text-gray-400 font-semibold">
        {Math.round(progress)}% abgeschlossen
      </div>
    </div>
  );
}
