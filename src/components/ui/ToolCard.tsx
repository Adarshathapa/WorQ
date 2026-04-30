import React from 'react';
import { Icon } from './Icon';
import { ToolItem } from '../../types';

interface ToolCardProps {
  tool: ToolItem;
  onClick: () => void;
  size?: 'normal' | 'large';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-white dark:bg-slate-800 p-4 shrink-0 rounded-[16px] border border-[#E5E7EB] dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-left flex items-start gap-4 transition-all duration-300 ease-out hover:border-brand-pink/20 hover:shadow-md md:hover:-translate-y-1 active:scale-[0.98] group w-full"
    >
      <div className="flex-shrink-0">
        <Icon name={tool.iconName} showContainer className="group-hover:shadow-md transition-shadow" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start w-full">
          <h3 className="font-bold text-[#111827] dark:text-gray-100 leading-tight font-display text-[14px] md:text-[15px] truncate group-hover:text-brand-pink mb-1">{tool.name}</h3>
          {tool.status === 'soon' && (
            <span className="bg-gray-50 dark:bg-slate-900 text-[#9CA3AF] flex-shrink-0 ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase border border-[#E5E7EB] dark:border-slate-800">Soon</span>
          )}
        </div>
        <p className="text-[#6B7280] dark:text-gray-500 leading-snug font-medium line-clamp-2 text-[12px] md:text-[13px]">{tool.description}</p>
      </div>
    </button>
  );
};
