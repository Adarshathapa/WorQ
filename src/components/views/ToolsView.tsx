import React, { useState, useEffect } from 'react';
import { TOOLS } from '../../constants';
import { ToolCard } from '../ui/ToolCard';
import { ToolItem } from '../../types';
import { SEO } from '../ui/SEO';

type CategoryFilter = 'all' | 'ai_tools' | 'pdf' | 'image' | 'conversion' | 'scan_files';

interface ToolsViewProps {
  onToolClick: (tool: ToolItem) => void;
  defaultCategory?: string | null;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onToolClick, defaultCategory }) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>((defaultCategory as CategoryFilter) || 'all');

  useEffect(() => {
    if (defaultCategory) {
      setActiveFilter(defaultCategory as CategoryFilter);
    } else {
      setActiveFilter('all');
    }
  }, [defaultCategory]);

  const handleFilterClick = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    // Update URL without reloading page
    let path = '/tools';
    if (filter === 'pdf') path = '/pdf-tools';
    if (filter === 'image') path = '/image-tools';
    if (filter === 'conversion') path = '/conversion-tools';
    if (filter === 'scan_files') path = '/scanning-tools';
    if (filter === 'ai_tools') path = '/ai-tools';
    window.history.pushState({}, '', path);
  };

  const filteredTools = TOOLS.filter(
    tool => activeFilter === 'all' || tool.category === activeFilter
  );

  const getSeoDetails = () => {
    switch (activeFilter) {
      case 'ai_tools': return { title: 'AI Tools', desc: 'Cutting-edge AI tools to boost your productivity.'};
      case 'pdf': return { title: 'Free PDF Tools', desc: 'A vast collection of free PDF tools to merge, compress, edit and convert PDFs.'};
      case 'image': return { title: 'Free Image Tools', desc: 'Powerful online tools to compress, resize, edit and convert your images.'};
      case 'conversion': return { title: 'Free Conversion Tools', desc: 'Convert your PDFs, Images and other documents from one format to another online for free.'};
      case 'scan_files': return { title: 'Free Document Scanning Tools', desc: 'Scan and digitize your documents instantly using our free scanning tools.'};
      default: return { title: 'All Free Tools', desc: 'Explore all our free PDF, Image, and Document Conversion tools.' };
    }
  };
  const seoDetails = getSeoDetails();

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 md:py-6 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <SEO title={seoDetails.title} description={seoDetails.desc} />
      
      <div className="px-1 mt-0 text-center flex flex-col items-center">
        <span className="bg-orange-50 text-[#FF8A3D] font-bold text-[11px] sm:text-[12px] px-3 py-1 rounded-full tracking-wider uppercase mb-3 inline-flex items-center">
          Workspace
        </span>
        <h1 className="text-[28px] sm:text-[32px] md:text-[38px] font-black text-[#111827] font-display tracking-tight leading-none mb-2">
          {activeFilter === 'all' && 'All Tools'}
          {activeFilter === 'ai_tools' && 'AI Intelligence'}
          {activeFilter === 'pdf' && 'PDF Utilities'}
          {activeFilter === 'image' && 'Image Tools'}
          {activeFilter === 'conversion' && 'Conversions'}
          {activeFilter === 'scan_files' && 'Scanning'}
        </h1>
        <p className="text-[#6B7280] font-medium text-[14px] sm:text-[15px] md:text-[16px] max-w-[400px]">
          Select a tool to start securely processing your files.
        </p>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1 justify-start md:justify-center w-full snap-x">
        {(['all', 'ai_tools', 'pdf', 'image', 'conversion', 'scan_files'] as CategoryFilter[]).map((filter) => {
          const labelMap: Record<CategoryFilter, string> = {
            all: 'All Tools',
            ai_tools: 'AI Tools',
            pdf: 'PDF Utilities',
            image: 'Image Editor',
            conversion: 'Converters',
            scan_files: 'Scanners'
          };
          const count = filter === 'all' ? TOOLS.length : TOOLS.filter(t => t.category === filter).length;
          
          return (
            <CategoryPill 
              key={filter}
              label={labelMap[filter]} 
              count={count}
              active={activeFilter === filter} 
              onClick={() => handleFilterClick(filter)} 
            />
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-1">
        {filteredTools.map(tool => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            onClick={() => onToolClick(tool)} 
          />
        ))}
      </div>
      
    </div>
  );
};

const CategoryPill: React.FC<{ label: string, count: number, active: boolean, onClick: () => void }> = ({ label, count, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 whitespace-nowrap snap-center shrink-0 ${
      active 
        ? 'bg-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.15)] ring-2 ring-transparent' 
        : 'bg-white text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm'
    }`}
  >
    <span>{label}</span>
    <span className={`px-1.5 py-0.5 rounded-[6px] text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
      {count}
    </span>
  </button>
);

