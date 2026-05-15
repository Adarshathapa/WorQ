import React from 'react';
import { TOOLS } from '../../constants';
import { ToolItem } from '../../types';
import { Icon } from './Icon';
import { AdBannerLeaderboard } from './AdBannerLeaderboard';

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
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 sm:mb-8 text-center sm:text-left px-2 sm:px-0">
        <h3 className="text-[24px] sm:text-[32px] text-[#111827] font-display font-black tracking-tight">Tools you might like</h3>
        <p className="text-[15px] sm:text-[18px] text-[#6B7280] font-medium mt-1.5">Continue your workflow with these related tools.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {relatedTools.slice(0,4).map((tool, index) => {
          if (index === 1) {
            return (
              <div key="ad" className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center justify-center bg-transparent border-none overflow-hidden row-span-1 min-h-[140px] md:min-h-0">
                <AdBannerLeaderboard />
              </div>
            );
          }
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool)}
              className="flex flex-col p-5 sm:p-6 bg-white rounded-[24px] sm:rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] active:scale-[0.98] hover:shadow-[0_12px_40px_rgba(255,138,61,0.08)] hover:-translate-y-1 hover:border-[#FF8A3D]/30 transition-all duration-300 ease-out text-left group"
            >
              <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-[16px] bg-[#FFF4ED] border border-[#FFE4D6] flex items-center justify-center text-[#FF8A3D] flex-shrink-0 mb-4 sm:mb-5 group-hover:scale-110 shadow-sm transition-transform duration-300">
                <Icon name={tool.iconName} size={24} />
              </div>
              <span className="text-[15px] sm:text-[18px] font-black text-[#111827] leading-tight font-display tracking-tight group-hover:text-[#FF8A3D] transition-colors">
                {tool.name}
              </span>
              <span className="text-[13px] sm:text-[14px] text-[#6B7280] mt-1.5 line-clamp-2 md:line-clamp-3 leading-relaxed font-medium">
                {tool.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
