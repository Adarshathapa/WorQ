import React from 'react';
import { TOOLS } from '../../constants';
import { ToolItem } from '../../types';
import { Icon } from './Icon';

const RELATED_MAP: Record<string, string[]> = {
  'merge-pdf': ['split-pdf', 'compress-pdf', 'rotate-pdf', 'pdf-to-word'],
  'compress-pdf': ['merge-pdf', 'split-pdf', 'rotate-pdf', 'pdf-to-word'],
  'split-pdf': ['merge-pdf', 'compress-pdf', 'rotate-pdf', 'watermark-pdf'],
  'rotate-pdf': ['merge-pdf', 'split-pdf', 'compress-pdf', 'watermark-pdf'],
  'text-to-pdf': ['pdf-to-word', 'word-to-pdf', 'merge-pdf', 'compress-pdf'],
  'word-to-pdf': ['pdf-to-word', 'text-to-pdf', 'merge-pdf', 'compress-pdf'],
  'pdf-to-word': ['word-to-pdf', 'text-to-pdf', 'compress-pdf', 'split-pdf'],
  'scan-to-pdf': ['merge-pdf', 'ocr-pdf', 'compress-pdf', 'rotate-pdf'],
  'remove-background': ['compress-image', 'resize-image', 'crop-rotate-image', 'signature-gen'],
  'compress-image': ['resize-image', 'crop-rotate-image', 'remove-background', 'signature-gen'],
  'resize-image': ['compress-image', 'crop-rotate-image', 'remove-background', 'signature-gen'],
  'crop-rotate-image': ['resize-image', 'compress-image', 'remove-background', 'signature-gen'],
  'signature-gen': ['resize-image', 'compress-image', 'scan-to-pdf', 'merge-pdf'],
  'pdf-converter': ['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word'],
  'ocr-pdf': ['pdf-to-word', 'scan-to-pdf', 'text-to-pdf', 'merge-pdf'],
  'watermark-pdf': ['merge-pdf', 'compress-pdf', 'rotate-pdf', 'split-pdf'],
  'odt-to-pdf': ['pdf-to-word', 'word-to-pdf', 'rtf-to-pdf', 'text-to-pdf'],
  'jpg-to-png': ['compress-image', 'resize-image', 'crop-rotate-image', 'remove-background'],
  'rtf-to-pdf': ['pdf-to-word', 'word-to-pdf', 'odt-to-pdf', 'text-to-pdf'],
  'pdf-to-text': ['text-to-pdf', 'pdf-to-word', 'word-to-pdf', 'ocr-pdf'],
};

interface RelatedToolsProps {
  currentToolId: string;
  onToolSelect: (tool: ToolItem) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentToolId, onToolSelect }) => {
  const relatedIds = RELATED_MAP[currentToolId] || [];
  
  let relatedTools = relatedIds
    .map(id => TOOLS.find(t => t.id === id))
    .filter(Boolean) as ToolItem[];

  if (relatedTools.length === 0) {
    const currentTool = TOOLS.find(t => t.id === currentToolId);
    if (currentTool) {
       relatedTools = TOOLS.filter(t => t.category === currentTool.category && t.id !== currentToolId).slice(0, 4);
    }
  }

  if (relatedTools.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800 animate-in fade-in duration-300">
      <div className="mb-5 px-1">
        <h3 className="text-[18px] md:text-[20px] text-[#111827] dark:text-gray-100 font-display font-semibold tracking-tight">Other Tools</h3>
        <p className="text-[13px] md:text-[14px] text-[#6B7280] dark:text-gray-400 mt-0.5">Explore additional tools you might like</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {relatedTools.slice(0,4).map(tool => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool)}
            className="flex flex-col p-4 bg-white dark:bg-slate-800/80 rounded-[16px] border border-[#E5E7EB] dark:border-slate-700 shadow-sm active:scale-[0.98] hover:shadow-md hover:-translate-y-1 hover:border-brand-pink/30 dark:hover:border-brand-pink/50 transition-all duration-300 ease-out text-left group"
          >
            <div className="w-[44px] h-[44px] rounded-[12px] bg-brand-light dark:bg-brand-pink/10 flex items-center justify-center text-brand-pink flex-shrink-0 mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Icon name={tool.iconName} size={22} />
            </div>
            <span className="text-[14px] md:text-[15px] font-semibold text-[#111827] dark:text-gray-100 leading-tight">
              {tool.name}
            </span>
            <span className="text-[12px] md:text-[13px] text-[#6B7280] dark:text-gray-400 mt-1 line-clamp-2 md:line-clamp-3 leading-relaxed hidden md:block">
              {tool.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
