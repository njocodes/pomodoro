'use client';

interface EdgeProgressBarProps {
  progress: number; // 0-100
  isCompleted?: boolean;
}

export default function EdgeProgressBar({ progress, isCompleted = false }: EdgeProgressBarProps) {
  const halfLength = 200;
  const strokeDashoffset = halfLength - (progress * halfLength / 100);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Background path */}
        <path
          d="M 50 0 L 100 0 L 100 100 L 0 100 L 0 0 L 50 0"
          stroke="#211f1d"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Progress path — right half */}
        <path
          d="M 50 0 L 100 0 L 100 100 L 0 100 L 0 0 L 50 0"
          stroke="#d97757"
          strokeWidth={isCompleted ? "2" : "1"}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={halfLength}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: isCompleted
              ? 'stroke-width 320ms ease-out, stroke-dashoffset 720ms ease-out'
              : 'stroke-dashoffset 720ms ease-out'
          }}
        />

        {/* Progress path — left half */}
        <path
          d="M 50 0 L 0 0 L 0 100 L 100 100 L 100 0 L 50 0"
          stroke="#d97757"
          strokeWidth={isCompleted ? "2" : "1"}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={halfLength}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: isCompleted
              ? 'stroke-width 320ms ease-out, stroke-dashoffset 720ms ease-out'
              : 'stroke-dashoffset 720ms ease-out'
          }}
        />
      </svg>
    </div>
  );
}
