'use client';

interface EdgeProgressBarProps {
  progress: number; // 0-100
  theme: 'light' | 'dark';
}

export default function EdgeProgressBar({ progress, theme }: EdgeProgressBarProps) {
  const progressHeight = (progress / 100) * 50; // 50% of screen height

  return (
    <>
      {/* Left edge progress bar */}
      <div className="fixed left-0 top-0 w-1 h-1/2 z-10">
        <div 
          className={`w-full transition-all duration-1000 ease-out ${
            theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
          }`}
          style={{ height: `${100 - progressHeight}%` }}
        />
        <div 
          className={`w-full ${
            theme === 'light' ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ height: `${progressHeight}%` }}
        />
      </div>

      {/* Right edge progress bar */}
      <div className="fixed right-0 top-0 w-1 h-1/2 z-10">
        <div 
          className={`w-full transition-all duration-1000 ease-out ${
            theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
          }`}
          style={{ height: `${100 - progressHeight}%` }}
        />
        <div 
          className={`w-full ${
            theme === 'light' ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ height: `${progressHeight}%` }}
        />
      </div>
    </>
  );
}
