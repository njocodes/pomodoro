'use client';

interface EdgeProgressBarProps {
  progress: number; // 0-100
  theme: 'light' | 'dark';
}

export default function EdgeProgressBar({ progress, theme }: EdgeProgressBarProps) {
  const progressColor = theme === 'light' ? '#111827' : '#ffffff';
  const backgroundColor = theme === 'light' ? '#d1d5db' : '#4b5563';

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
          strokeWidth="0.5"
          fill="none"
        />
        
        {/* Progress path - animated based on progress */}
        <path
          d="M 50 0 L 100 0 L 100 100 L 0 100 L 0 0 L 50 0"
          stroke={progressColor}
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="400"
          strokeDashoffset={400 - (progress * 4)}
          style={{
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>
    </div>
  );
}