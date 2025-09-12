'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  color: string;
}

export default function ProgressBar({ progress, color }: ProgressBarProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
