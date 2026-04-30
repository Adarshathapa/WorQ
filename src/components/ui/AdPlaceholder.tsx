import React from 'react';

export const AdPlaceholder: React.FC<{ className?: string, id?: number | string }> = ({ className = '', id }) => {
  return (
    <div className={`w-full bg-[#F3F4F6] dark:bg-slate-800/50 border border-dashed border-[#D1D5DB] dark:border-slate-700 flex items-center justify-center rounded-xl p-4 my-6 min-h-[100px] ${className}`}>
      <span className="text-[#9CA3AF] dark:text-gray-500 font-medium text-[14px] tracking-wide">
        {`{ Ads Place Here${id ? ` - ${id}` : ''} }`}
      </span>
    </div>
  );
};
