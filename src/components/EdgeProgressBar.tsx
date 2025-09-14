'use client';

interface EdgeProgressBarProps {
  progress: number; // 0-100
  theme: 'light' | 'dark';
  isCompleted?: boolean; // New prop to trigger expansion effect
}

export default function EdgeProgressBar({ progress, theme, isCompleted = false }: EdgeProgressBarProps) {
  const progressColor = theme === 'light' ? '#d1d5db' : '#6b7280'; // Light mode: light gray for filled, Dark mode: lighter gray for filled
  const backgroundColor = theme === 'light' ? '#111827' : '#000000'; // Light mode: dark background for unfilled, Dark mode: black background for unfilled

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={progressColor} />
            <stop offset="100%" stopColor={progressColor} />
          </linearGradient>
        </defs>
        
        {/* Background path - full perimeter */}
        <path
          d="M 50 0 L 100 0 L 100 100 L 0 100 L 0 0 L 50 0"
          stroke={backgroundColor}
          strokeWidth="1"
          fill="none"
        />
        
        {/* Progress path - right side (from center to right, then down, then left) */}
        <path
          d="M 50 0 L 100 0 L 100 100 L 0 100 L 0 0 L 50 0"
          stroke={progressColor}
          strokeWidth={isCompleted ? "5" : "1"}
          fill="none"
          strokeDasharray="200"
          strokeDashoffset={200 - (progress * 2)}
          style={{
            transition: isCompleted 
              ? 'stroke-width 0.5s ease-out, stroke-dashoffset 1s ease-out'
              : 'stroke-dashoffset 1s ease-out'
          }}
        />
        
        {/* Progress path - left side (from center to left, then down, then right) */}
        <path
          d="M 50 0 L 0 0 L 0 100 L 100 100 L 100 0 L 50 0"
          stroke={progressColor}
          strokeWidth={isCompleted ? "5" : "1"}
          fill="none"
          strokeDasharray="200"
          strokeDashoffset={200 - (progress * 2)}
          style={{
            transition: isCompleted 
              ? 'stroke-width 0.5s ease-out, stroke-dashoffset 1s ease-out'
              : 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>
    </div>
  );
}