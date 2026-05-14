import React from 'react';
import { RatingPrompt } from './RatingPrompt';
import { MdArrowDownward } from 'react-icons/md';
import { motion } from 'framer-motion';

interface ProcessingResultProps {
  onDownload: () => void;
  onReset: () => void;
  resultRef: React.RefObject<HTMLDivElement>;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const ProcessingResult: React.FC<ProcessingResultProps> = ({ 
  onDownload, 
  onReset,
  resultRef,
  title = "Downloaded Successfully!",
  description = "Your processed file has been automatically saved to your device.",
  children
}) => {
  return (
    <div ref={resultRef} className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-500 text-center bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF6B2C]/5 rounded-tr-full pointer-events-none" />
      
      <div className="w-[80px] h-[80px] rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mb-6 relative z-10">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <motion.path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
      </div>
      
      <h3 className="text-[20px] sm:text-[24px] font-black text-[#1A1A1A] mb-2 font-display relative z-10">{title}</h3>
      <p className="text-[14px] sm:text-[15px] text-gray-500 mb-8 font-medium max-w-md relative z-10">{description}</p>
      
      {children && (
        <div className="w-full max-w-md relative z-10 mb-6">
          {children}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative z-10">
        <button
          onClick={onDownload}
          className="flex-1 h-[48px] bg-[#1A1A1A] text-white rounded-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#333333] hover:shadow-lg active:scale-95 transition-all shadow-md group"
        >
          <MdArrowDownward size={18} className="group-hover:translate-y-0.5 transition-transform" /> Download Again
        </button>
        <button 
          onClick={onReset}
          className="flex-1 h-[48px] bg-white border border-gray-200 text-gray-700 rounded-[14px] font-bold hover:bg-gray-50 active:scale-95 transition-all text-[14px]"
        >
          Start New Task
        </button>
      </div>
      
      <div className="w-full mt-8 max-w-md relative z-10"><RatingPrompt /></div>
    </div>
  );
};
