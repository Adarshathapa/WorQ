import React, { useEffect, useState } from 'react';

interface ProcessingProgressBarProps {
  isProcessing: boolean;
  text?: string;
  durationMs?: number;
}

export const ProcessingProgressBar: React.FC<ProcessingProgressBarProps> = ({ 
  isProcessing, 
  text = 'Processing file...', 
  durationMs = 2000 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Go up to 95% based on duration, then stop until processing finishes
      const currentProgress = Math.min((elapsed / durationMs) * 100, 95);
      setProgress(currentProgress);
    }, 50);

    return () => clearInterval(interval);
  }, [isProcessing, durationMs]);

  if (!isProcessing) return null;

  return (
    <div className="flex flex-col gap-3 w-full animate-in fade-in duration-300 py-2">
      <div className="flex justify-between items-end px-1">
        <span className="text-[13px] font-bold text-brand-pink dark:text-brand-pink tracking-tight">{text}</span>
        <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400 font-mono">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-brand-pink rounded-full transition-all duration-75 ease-linear relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-white/30 w-full rotate-[30deg] scale-y-150 -translate-x-[150%] animate-[shimmer_1.5s_infinite] origin-center"></div>
        </div>
      </div>
    </div>
  );
};
