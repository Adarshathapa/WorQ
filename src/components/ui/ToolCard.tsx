import React from 'react';
import { Icon } from './Icon';
import { ToolItem } from '../../types';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex items-center text-left p-4 sm:p-5 w-full bg-[#FF8A3D] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden gap-3.5 sm:gap-4`}
    >
      {/* Background Hover Glow & Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Icon */}
      <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center transition-all duration-300 relative z-10 group-hover:shadow-sm`}>
        <Icon name={tool.iconName} className={`text-white w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] group-hover:scale-110 transition-transform duration-300`} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10 justify-center">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-white text-[15px] sm:text-[16px] tracking-tight transition-colors duration-300 truncate">
            {tool.name}
          </h3>
          {tool.status === 'soon' && (
             <span className="bg-white/20 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-[0.05em] shrink-0 border border-white/30">
               Soon
             </span>
          )}
        </div>
        <p className="text-white/80 text-[12px] sm:text-[13px] leading-snug font-medium transition-colors duration-300 truncate">
          {tool.description}
        </p>
      </div>

      {/* Modern Arrow */}
      <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 border border-transparent transition-all duration-300 relative z-10 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 self-center">
        <ArrowRight className="text-white transition-colors duration-300" size={14} />
      </div>
    </button>
  );
};


