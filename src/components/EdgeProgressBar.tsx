'use client';

interface EdgeProgressBarProps {
  progress: number; // 0-100
  theme: 'light' | 'dark';
}

export default function EdgeProgressBar({ progress, theme }: EdgeProgressBarProps) {
  // Calculate progress for each section of the perimeter
  const totalProgress = progress;
  
  // Top section: center to edges (0-25%)
  const topProgress = Math.min(100, Math.max(0, (totalProgress / 25) * 100));
  
  // Right section: top to bottom (25-50%)
  const rightProgress = Math.min(100, Math.max(0, ((totalProgress - 25) / 25) * 100));
  
  // Bottom section: edges to center (50-75%)
  const bottomProgress = Math.min(100, Math.max(0, ((totalProgress - 50) / 25) * 100));
  
  // Left section: bottom to top (75-100%)
  const leftProgress = Math.min(100, Math.max(0, ((totalProgress - 75) / 25) * 100));

  return (
    <>
      {/* Top section - center to edges */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-1 h-8 z-10">
        <div 
          className={`w-full transition-all duration-1000 ease-out ${
            theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
          }`}
          style={{ height: `${100 - topProgress}%` }}
        />
        <div 
          className={`w-full ${
            theme === 'light' ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ height: `${topProgress}%` }}
        />
      </div>

      {/* Right section - top to bottom */}
      <div className="fixed right-0 top-8 w-1 h-[calc(100vh-16rem)] z-10">
        <div 
          className={`w-full transition-all duration-1000 ease-out ${
            theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
          }`}
          style={{ height: `${100 - rightProgress}%` }}
        />
        <div 
          className={`w-full ${
            theme === 'light' ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ height: `${rightProgress}%` }}
        />
      </div>

      {/* Bottom section - edges to center */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-8 z-10">
        <div 
          className={`w-full transition-all duration-1000 ease-out ${
            theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
          }`}
          style={{ height: `${100 - bottomProgress}%` }}
        />
        <div 
          className={`w-full ${
            theme === 'light' ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ height: `${bottomProgress}%` }}
        />
      </div>

      {/* Left section - bottom to top */}
      <div className="fixed left-0 top-8 w-1 h-[calc(100vh-16rem)] z-10">
        <div 
          className={`w-full transition-all duration-1000 ease-out ${
            theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'
          }`}
          style={{ height: `${100 - leftProgress}%` }}
        />
        <div 
          className={`w-full ${
            theme === 'light' ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ height: `${leftProgress}%` }}
        />
      </div>
    </>
  );
}
